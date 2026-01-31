<?php

namespace App\Http\Controllers;

use App\Models\MasterCoaClass;
use App\Models\Karyawan;
use Inertia\Inertia;
use Illuminate\Http\Request;

class MasterCoaClassController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $masterCoaClasses = MasterCoaClass::with('karyawan')->get();
        return Inertia::render('masterCoaClass/masterCoaClasses', [
            'masterCoaClasses' => $masterCoaClasses,
        ]);
    }

    public function create()
    {
        return Inertia::render('masterCoaClass/create', [
            'karyawans' => Karyawan::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_karyawan' => 'required|exists:karyawans,id',
            'code' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'status' => 'required|boolean',
        ]);

        MasterCoaClass::create($validated);
        return redirect()->route('masterCoaClasses.index')->with('success', 'Data berhasil dibuat');
    }

    public function edit(MasterCoaClass $masterCoaClass)
    {
        return Inertia::render('masterCoaClass/edit', [
            'item' => $masterCoaClass,
            'karyawans' => Karyawan::all()
        ]);
    }

    public function update(Request $request, MasterCoaClass $masterCoaClass)
    {
        $validated = $request->validate([
            'id_karyawan' => 'required|exists:karyawans,id',
            'code' => 'required|string|unique:master_coa_classes,code,' . $masterCoaClass->id,
            'name' => 'required|string|max:255',
            'status' => 'required|boolean',
        ]);

        $masterCoaClass->update($validated);
        return redirect()->route('masterCoaClasses.index')->with('success', 'Data diperbarui');
    }

    public function destroy(MasterCoaClass $masterCoaClass)
    {
        $masterCoaClass->delete();
        return redirect()->route('masterCoaClasses.index')->with('success', 'Data dihapus');
    }
}
