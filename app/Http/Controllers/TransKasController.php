<?php

namespace App\Http\Controllers;

use App\Imports\TransKasImport;
use App\Models\TransKas;
use App\Models\Karyawan;
use App\Models\MasterCoa;
use App\Models\customerAddress;
use Maatwebsite\Excel\Facades\Excel;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Http\Request;

class TransKasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('transKas/transKas', [
            'transKas' => TransKas::with(['karyawan', 'accountKas', 'accountKasLain', 'customerAddress'])->orderBy('tanggal_transaksi', 'desc')->get(),
        ]);
    }

    /**
     * Create Transaksi Kas MASUK (transaksi = 1)
     */
    public function createMasuk()
    {
        return Inertia::render('transKas/createMasuk', [
            'karyawans' => Karyawan::all(),
            'accountKas' => MasterCoa::all(),
            'accountLawan' => MasterCoa::all(),
            'customerAddresses' => customerAddress::all(),
            'type' => 1
        ]);
    }

    /**
     * Create Transaksi Kas KELUAR (transaksi = 2)
     */
    public function createKeluar()
    {
        return Inertia::render('transKas/createKeluar', [
            'karyawans' => Karyawan::all(),
            'accountKas' => MasterCoa::all(),
            'accountLawan' => MasterCoa::all(),
            'customerAddresses' => customerAddress::all(),
            'type' => 2
        ]);
    }

    /**
     * Menyimpan data transaksi.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_karyawan'         => 'required|exists:karyawans,id',
            'id_account_kas'      => 'required|exists:master_coas,id',
            'id_account_kas_lain' => 'required|exists:master_coas,id',
            'id_customer_address' => 'nullable|exists:customer_addresses,id',
            'transaksi'           => 'required|in:1,2',
            // 'no_bukti'            => 'required|string|max:255',
            'gudang'              => 'required|string|max:255',
            'periode'             => 'required|integer',
            'nominal'             => 'required|numeric|min:0',
            'tanggal_transaksi'   => 'required|date',
            'keterangan'          => 'nullable|string',
            'mesin'               => 'nullable|string',
            'kode'                => 'nullable|integer',
            'status'              => 'required|boolean',
        ]);

        $validated['no_bukti'] = $this->generateNoBukti(
            $validated['transaksi'],
            $validated['tanggal_transaksi']
        );

        TransKas::create($validated);

        return redirect()->route('trans-kas.index')->with('success', 'Transaksi Kas berhasil disimpan');
    }

    private function generateNoBukti(int $transaksi, string $tanggalTransaksi): string
    {
        $date = Carbon::parse($tanggalTransaksi);

        // Prefix transaksi
        $prefix = $transaksi === 1 ? 'BKM' : 'BKK';


        $year  = $date->year;
        $month = $date->month;

        $yymm = $date->format('ym');


        $kode = '00';


        $last = TransKas::where('transaksi', $transaksi)
            ->whereYear('tanggal_transaksi', $year)
            ->whereMonth('tanggal_transaksi', $month)
            ->orderBy('no_bukti', 'desc')
            ->first();

        if ($last) {
            preg_match('/(\d{4})$/', $last->no_bukti, $matches);
            $lastNumber = isset($matches[1]) ? (int) $matches[1] : 0;
            $urut = $lastNumber + 1;
        } else {

            $urut = 1;
        }

        $urutFormatted = str_pad($urut, 4, '0', STR_PAD_LEFT);

        return "{$prefix}/{$yymm}/{$kode}-{$urutFormatted}";
    }

    /**
     * Edit Transaksi (Otomatis mendeteksi tipe untuk render page yang sesuai)
     */
    public function edit(TransKas $transKas)
    {
        // Jika transaksi == 1 render page editMasuk, jika 2 render editKeluar
        $component = $transKas->transaksi == 1 ? 'transKas/editMasuk' : 'transKas/editKeluar';

        return Inertia::render($component, [
            'item'              => $transKas,
            'karyawans'         => Karyawan::all(),
            'accountKas'        => MasterCoa::all(),
            'accountLawan'      => MasterCoa::all(),
            'customerAddresses' => customerAddress::all(),
        ]);
    }

    /**
     * Update data transaksi.
     */
    public function update(Request $request, TransKas $transKas)
    {
        $validated = $request->validate([
            'id_karyawan'         => 'nullable|exists:karyawans,id',
            'id_account_kas'      => 'required|exists:master_coas,id',
            'id_account_kas_lain' => 'required|exists:master_coas,id',
            'id_customer_address' => 'nullable|exists:customer_addresses,id',
            'transaksi'           => 'required|in:1,2',
            'no_bukti'            => 'required|string|max:255',
            'gudang'              => 'required|string|max:255',
            'periode'             => 'required|integer',
            'nominal'             => 'required|numeric|min:0',
            'tanggal_transaksi'   => 'required|date',
            'keterangan'          => 'nullable|string',
            'mesin'               => 'nullable|string',
            'kode'                => 'nullable|integer',
            'status'              => 'required|boolean',
        ]);

        $transKas->update($validated);

        return redirect()->route('trans-kas.index')->with('success', 'Transaksi Kas berhasil diperbarui');
    }

    /**
     * Menampilkan detail transaksi.
     */
    public function show(TransKas $transKas)
    {
        return Inertia::render('transKas/show', [
            'item' => $transKas->load(['karyawan', 'accountKas', 'accountKasLain', 'customerAddress']),
        ]);
    }

    /**
     * Menghapus transaksi.
     */
    public function destroy(TransKas $transKas)
    {
        $transKas->delete();
        return back()->with('success', 'Transaksi Kas berhasil dihapus');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv'
        ]);

        Excel::import(new TransKasImport, $request->file('file'));

        return redirect()->route('trans-kas.index')->with('success', 'Data Transaksi Kas berhasil diimport dari Excel.');
    }
}
