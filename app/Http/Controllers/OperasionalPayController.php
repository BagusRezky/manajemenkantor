<?php

namespace App\Http\Controllers;

use App\Models\OperasionalPay;
use App\Models\Karyawan;
use App\Models\MasterCoa;
use App\Imports\OperasionalPayImport;
use Maatwebsite\Excel\Facades\Excel;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Http\Request;

class OperasionalPayController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('operasionalPay/operasionalPays', [
            'operasionalPays' => OperasionalPay::with(['karyawan', 'accountKas', 'accountBeban'])->orderBy('no_bukti', 'desc')->get(),
        ]);
    }

    /**
     * Form tambah data.
     */
    public function create()
    {
        return Inertia::render('operasionalPay/create', [
            'karyawans' => Karyawan::all(),
            'accountKas' => MasterCoa::all(),
            'accountBeban' => MasterCoa::all(),
        ]);
    }

    /**
     * Menyimpan data.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_karyawan'       => 'nullable|exists:karyawans,id',
            'id_account_kas'    => 'nullable|exists:master_coas,id',
            'id_account_beban'  => 'nullable|exists:master_coas,id',

            'gudang'            => 'required|string|max:255',
            'periode'           => 'required|integer',
            'tanggal_transaksi' => 'nullable|date',
            'nominal'           => 'required|numeric|min:0',
            'keterangan'        => 'nullable|string',
            'mesin'             => 'nullable|string',
            'kode'              => 'nullable|integer',
            'nopol'             => 'nullable|string',
            'odometer'          => 'nullable|string',
            'jenis'             => 'nullable|string',
            'status'            => 'required|boolean',
        ]);

        $validated['no_bukti'] = $this->generateNoBuktiBOPK(
            $validated['tanggal_transaksi']
        );

        OperasionalPay::create($validated);

        return redirect()->route('operasionalPays.index')->with('success', 'Data Operasional berhasil disimpan');
    }

    private function generateNoBuktiBOPK(string $tanggalTransaksi): string
    {
        $date = Carbon::parse($tanggalTransaksi);


        $prefix = 'BOPK';

        $year  = $date->year;
        $month = $date->month;

        $yymm = $date->format('ym');

        $kode = '00';

        $last = OperasionalPay::whereYear('tanggal_transaksi', $year)
            ->whereMonth('tanggal_transaksi', $month)
            ->orderBy('no_bukti', 'desc')
            ->first();

        if ($last) {
            preg_match('/(\d{4})$/', $last->no_bukti, $matches);
            $lastNumber = isset($matches[1]) ? (int) $matches[1] : 0;
            $urut = $lastNumber + 1;
        } else {
            // 🔁 reset karena bulan / tahun berbeda
            $urut = 1;
        }

        $urutFormatted = str_pad($urut, 4, '0', STR_PAD_LEFT);

        return "{$prefix}/{$yymm}/{$kode}-{$urutFormatted}";
    }

    /**
     * Menampilkan detail data.
     */
    public function show(OperasionalPay $operasionalPay)
    {
        return Inertia::render('operasionalPay/show', [
            'item' => $operasionalPay->load(['karyawan', 'accountKas', 'accountBeban']),
        ]);
    }

    /**
     * Form edit data.
     */
    public function edit(OperasionalPay $operasionalPay)
    {
        return Inertia::render('operasionalPay/edit', [
            'item'         => $operasionalPay,
            'karyawans'    => Karyawan::all(),
            'accountKas'   => MasterCoa::all(),
            'accountBeban' => MasterCoa::all(),
        ]);
    }

    /**
     * Update data.
     */
    public function update(Request $request, OperasionalPay $operasionalPay)
    {
        $validated = $request->validate([
            'id_karyawan'       => 'nullable|exists:karyawans,id',
            'id_account_kas'    => 'nullable|exists:master_coas,id',
            'id_account_beban'  => 'nullable|exists:master_coas,id',
            'no_bukti'          => 'required|string|max:255',
            'gudang'            => 'required|string|max:255',
            'periode'           => 'required|integer',
            'tanggal_transaksi' => 'nullable|date',
            'nominal'           => 'required|numeric|min:0',
            'keterangan'        => 'nullable|string',
            'mesin'             => 'nullable|string',
            'kode'              => 'nullable|integer',
            'nopol'             => 'nullable|string',
            'odometer'          => 'nullable|string',
            'jenis'             => 'nullable|string',
            'status'            => 'required|boolean',
        ]);

        $operasionalPay->update($validated);

        return redirect()->route('operasionalPays.index')->with('success', 'Data Operasional diperbarui');
    }

    /**
     * Menghapus data.
     */
    public function destroy(OperasionalPay $operasionalPay)
    {
        $operasionalPay->delete();
        return back()->with('success', 'Data Operasional berhasil dihapus');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv'
        ]);

        Excel::import(new OperasionalPayImport, $request->file('file'));

        return redirect()->route('operasionalPays.index')->with('success', 'Data Operasional berhasil diimport dari Excel.');
    }
}
