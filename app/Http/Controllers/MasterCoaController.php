<?php

namespace App\Http\Controllers;

use App\Models\Karyawan;
use App\Models\MasterCoa;
use App\Models\MasterCoaClass;
use App\Imports\MasterCoaImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MasterCoaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('masterCoa/masterCoas', [
            'masterCoas' => MasterCoa::with(['karyawan', 'masterCoaClass'])->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('masterCoa/create', [
            'karyawans' => Karyawan::all(),
            'coaClasses' => MasterCoaClass::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_karyawan' => 'required|exists:karyawans,id',
            'id_master_coa_class' => 'required|exists:master_coa_classes,id',
            'periode' => 'required|integer',
            'gudang' => 'required|string|max:255',
            'kode_akuntansi' => 'required|string|max:255|unique:master_coas,kode_akuntansi',
            'nama_akun' => 'required|string|max:255',
            'saldo_debit' => 'required|numeric|min:0',
            'saldo_kredit' => 'required|numeric|min:0',
            'nominal_default' => 'required|numeric|min:0',
            'keterangan' => 'nullable|string',
            'status' => 'required|boolean',
        ]);

        MasterCoa::create($validated);
        return redirect()->route('masterCoas.index')->with('success', 'Master COA berhasil dibuat');
    }

    public function edit(MasterCoa $masterCoa)
    {
        return Inertia::render('masterCoa/edit', [
            'item' => $masterCoa,
            'karyawans' => Karyawan::all(),
            'coaClasses' => MasterCoaClass::all(),
        ]);
    }

    public function update(Request $request, MasterCoa $masterCoa)
    {
        $validated = $request->validate([
            'id_karyawan' => 'required|exists:karyawans,id',
            'id_master_coa_class' => 'required|exists:master_coa_classes,id',
            'periode' => 'required|integer',
            'gudang' => 'required|string|max:255',
            'kode_akuntansi' => 'required|string|max:255|unique:master_coas,kode_akuntansi,' . $masterCoa->id,
            'nama_akun' => 'required|string|max:255',
            'saldo_debit' => 'required|numeric|min:0',
            'saldo_kredit' => 'required|numeric|min:0',
            'nominal_default' => 'required|numeric|min:0',
            'keterangan' => 'nullable|string',
            'status' => 'required|boolean',
        ]);

        $masterCoa->update($validated);
        return redirect()->route('masterCoas.index')->with('success', 'Master COA diperbarui');
    }

    public function show(MasterCoa $masterCoa)
    {
        return Inertia::render('masterCoa/show', [
            'item' => $masterCoa->load(['karyawan', 'masterCoaClass']),
        ]);
    }

    public function destroy(MasterCoa $masterCoa)
    {
        $masterCoa->delete();
        return back()->with('success', 'Master COA dihapus');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv'
        ]);

        Excel::import(new MasterCoaImport, $request->file('file'));

        return redirect()->route('masterCoas.index')->with('success', 'Data Master COA berhasil diimport dari Excel.');
    }
}
