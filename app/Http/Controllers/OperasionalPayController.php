<?php

namespace App\Http\Controllers;

use App\Models\OperasionalPay;
use App\Models\Karyawan;
use App\Models\MasterCoa;
use App\Imports\OperasionalPayImport;
use Maatwebsite\Excel\Facades\Excel;
use Inertia\Inertia;
use Illuminate\Http\Request;

class OperasionalPayController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('operasionalPay/operasionalPays', [
            'operasionalPays' => OperasionalPay::with(['karyawan', 'accountKas', 'accountBeban'])->get(),
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

        OperasionalPay::create($validated);

        return redirect()->route('operasionalPays.index')->with('success', 'Data Operasional berhasil disimpan');
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
