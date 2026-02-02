<?php

namespace App\Http\Controllers;

use App\Imports\TransKasBankImport;
use App\Models\TransKasBank;
use App\Models\Karyawan;
use App\Models\MasterCoa;
use App\Models\customerAddress;
use Maatwebsite\Excel\Facades\Excel;
use Inertia\Inertia;
use Illuminate\Http\Request;

class TransKasBankController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('transKasBank/transKasBanks', [
            'transKasBanks' => TransKasBank::with(['karyawan', 'accountBank', 'accountBankLain', 'customerAddress'])->get(),
        ]);
    }

    public function createMasuk()
    {
        return Inertia::render('transKasBank/createMasuk', [
            'karyawans' => Karyawan::all(),
            'accountBank' => MasterCoa::all(),
            'accountBankLain' => MasterCoa::all(),
            'customerAddresses' => customerAddress::all(),
            'type' => 21 // Bank Masuk
        ]);
    }

    public function createKeluar()
    {
        return Inertia::render('transKasBank/createKeluar', [
            'karyawans' => Karyawan::all(),
            'accountBank' => MasterCoa::all(),
            'accountBankLain' => MasterCoa::all(),
            'customerAddresses' => customerAddress::all(),
            'type' => 22
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_karyawan'         => 'nullable|exists:karyawans,id',
            'id_account_bank'     => 'nullable|exists:master_coas,id',
            'id_account_bank_lain' => 'nullable|exists:master_coas,id',
            'id_customer_address' => 'nullable|exists:customer_addresses,id',
            'transaksi'           => 'required|in:21,22',
            'no_bukti'            => 'required|string|max:255',
            'gudang'              => 'required|string',
            'periode'             => 'required|integer',
            'tanggal_transaksi'   => 'nullable|date',
            'nominal'             => 'required|numeric|min:0',
            'keterangan'          => 'nullable|string',
            'mesin'               => 'nullable|string',
            'kode'                => 'nullable|integer',
            'bank'                => 'nullable|string',
            'bank_an'             => 'nullable|string',
            'no_rekening'         => 'nullable|string',
            'status'              => 'required|boolean',
        ]);

        TransKasBank::create($validated);
        return redirect()->route('trans-kas-banks.index')->with('success', 'Transaksi Bank berhasil disimpan');
    }

    public function show(TransKasBank $transKasBank)
    {
        return Inertia::render('transKasBank/show', [
            'item' => $transKasBank->load(['karyawan', 'accountBank', 'accountBankLain', 'customerAddress']),
        ]);
    }

    public function edit(TransKasBank $transKasBank)
    {
        // 21 = Masuk, 22 = Keluar
        $component = $transKasBank->transaksi == 21 ? 'transKasBank/editMasuk' : 'transKasBank/editKeluar';

        return Inertia::render($component, [
            'item'      => $transKasBank,
            'karyawans' => Karyawan::all(),
            'accountBank' => MasterCoa::all(),
            'accountBankLain' => MasterCoa::all(),
            'customerAddresses' => customerAddress::all(),
        ]);
    }

    public function update(Request $request, TransKasBank $transKasBank)
    {
        $validated = $request->validate([
            'id_karyawan'         => 'nullable|exists:karyawans,id',
            'id_account_bank'     => 'nullable|exists:master_coas,id',
            'id_account_bank_lain' => 'nullable|exists:master_coas,id',
            'id_customer_address' => 'nullable|exists:customer_addresses,id',
            'transaksi'           => 'required|in:21,22',
            'no_bukti'            => 'required|string|max:255',
            'gudang'              => 'required|string',
            'periode'             => 'required|integer',
            'tanggal_transaksi'   => 'nullable|date',
            'nominal'             => 'required|numeric|min:0',
            'keterangan'          => 'nullable|string',
            'mesin'               => 'nullable|string',
            'kode'                => 'nullable|integer',
            'bank'                => 'nullable|string',
            'bank_an'             => 'nullable|string',
            'no_rekening'         => 'nullable|string',
            'status'              => 'required|boolean',
        ]);

        $transKasBank->update($validated);
        return redirect()->route('trans-kas-banks.index')->with('success', 'Transaksi Bank diperbarui');
    }

    public function destroy(TransKasBank $transKasBank)
    {
        $transKasBank->delete();
        return back()->with('success', 'Transaksi Bank dihapus');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv'
        ]);

        Excel::import(new TransKasBankImport, $request->file('file'));

        return redirect()->route('trans-kas-banks.index')->with('success', 'Data Transaksi Bank berhasil diimport dari Excel.');
    }
}
