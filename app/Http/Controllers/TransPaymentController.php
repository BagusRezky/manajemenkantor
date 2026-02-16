<?php

namespace App\Http\Controllers;

use App\Models\TransPayment;
use App\Models\PoBilling;
use App\Models\Karyawan;
use App\Models\MetodeBayar;
use App\Models\MasterCoa;
use App\Imports\TransPaymentImport;
use App\Imports\TransPaymentDetailImport;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;
use Illuminate\Http\Request;

class TransPaymentController extends Controller
{
    /**
     * Menampilkan daftar pembayaran.
     */
    public function index()
    {
        return Inertia::render('transPayment/transPayments', [
            'payments' => TransPayment::with(['poBilling', 'karyawan'])->orderBy('tanggal_header', 'desc')->get(),
        ]);
    }

    /**
     * Form tambah pembayaran.
     */
    public function create()
    {
        return Inertia::render('transPayment/create', [
            'billings' => PoBilling::all(), // Hanya billing aktif
            'karyawans' => Karyawan::all(),
            'metodeBayars' => MetodeBayar::all(),
            'coas' => MasterCoa::all(),
        ]);
    }

    /**
     * Menyimpan data pembayaran (Header & Detail).
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_po_billing'   => 'required|exists:po_billings,id',
            'id_karyawan'     => 'nullable|exists:karyawans,id',

            'tanggal_header'  => 'required|date',
            'gudang'          => 'required|string',
            'periode'         => 'required|string',
            'details'         => 'required|array|min:1',
            'details.*.id_metode_bayar'   => 'nullable|exists:metode_bayars,id',
            'details.*.id_account_debit'  => 'nullable|exists:master_coas,id',
            'details.*.id_account_kredit' => 'nullable|exists:master_coas,id',
            'details.*.nominal'           => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($request) {


            // 1. Simpan Header
            $payment = TransPayment::create(array_merge(
                $request->only([
                    'id_po_billing', 'id_karyawan', 'tanggal_header', 'gudang', 'periode'
                ]),
                ['no_pembayaran' => $this->generateNoPembayaran()]
            ));

            // 2. Simpan Details
            foreach ($request->details as $detail) {
                $payment->details()->create($detail);
            }
        });

        return redirect()->route('transPayments.index')->with('success', 'Pembayaran berhasil disimpan');
    }

    private function generateNoPembayaran()
    {
        $now = Carbon::now();
        $tahunBulan = $now->format('y') . $now->format('m'); // Hasil: 2602
        $prefix = "PAY/" . $tahunBulan . "/00-";

        // Cari nomor urut terakhir di tahun berjalan
        // Kita ambil angka setelah karakter terakhir '-'
        $lastRecord = TransPayment::whereYear('tanggal_header', $now->year)
            ->selectRaw("MAX(CAST(SUBSTRING_INDEX(no_pembayaran, '-', -1) AS UNSIGNED)) as max_no")
            ->value('max_no');

        $nextNumber = $lastRecord ? $lastRecord + 1 : 1;

        // Format: PAY/2602/00-0004
        // %04d memastikan 4 digit (0001)
        return $prefix . sprintf("%04d", $nextNumber);
    }

    /**
     * Detail pembayaran.
     */
    public function show(TransPayment $transPayment)
    {
        return Inertia::render('transPayment/show', [
            'item' => $transPayment->load([
                'details.metodeBayar',
                'details.accountDebit',
                'details.accountKredit',
                'poBilling',
                'karyawan'
            ])
        ]);
    }

    /**
     * Form edit pembayaran.
     */
    public function edit(TransPayment $transPayment)
    {
        return Inertia::render('transPayment/edit', [
            'item' => $transPayment->load('details'),
            'billings' => PoBilling::all(),
            'karyawans' => Karyawan::all(),
            'metodeBayars' => MetodeBayar::all(),
            'coas' => MasterCoa::all(),
        ]);
    }

    /**
     * Update data pembayaran.
     */
    public function update(Request $request, TransPayment $transPayment)
    {
        $request->validate([
            'no_pembayaran' => 'required|string|unique:trans_payments,no_pembayaran,' . $transPayment->id,
            'details'       => 'required|array|min:1',
        ]);

        DB::transaction(function () use ($request, $transPayment) {
            // Update Header
            $transPayment->update($request->only([
                'id_po_billing', 'id_karyawan', 'no_pembayaran',
                'tanggal_header', 'gudang', 'periode'
            ]));

            // Update Details (Hapus lama, simpan baru)
            $transPayment->details()->delete();
            foreach ($request->details as $detail) {
                $transPayment->details()->create($detail);
            }
        });

        return redirect()->route('transPayments.index')->with('success', 'Pembayaran berhasil diperbarui');
    }

    /**
     * Hapus pembayaran.
     */
    public function destroy(TransPayment $transPayment)
    {
        $transPayment->delete(); // Karena onDelete('cascade'), detail otomatis terhapus
        return back()->with('success', 'Pembayaran berhasil dihapus');
    }

    public function import(Request $request)
    {
        // dd($request->all());
        $request->validate([
            'file_header' => 'required',
            'file_detail' => 'required',
        ]);


        Excel::import(new TransPaymentImport, $request->file('file_header'));
        Excel::import(new TransPaymentDetailImport, $request->file('file_detail'));
        // });

        return back()->with('success', 'Selesai!');
    }
}
