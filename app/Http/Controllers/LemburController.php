<?php

namespace App\Http\Controllers;

use App\Models\Lembur;
use App\Models\Karyawan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LemburController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $lemburs = Lembur::with('karyawan')->get();
        return Inertia('lembur/lemburs', [
            'lemburs' => $lemburs,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $karyawans = Karyawan::all();
        return inertia('lembur/create', [
            'karyawans' => $karyawans,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $validated = $request->validate([
            'kode_gudang' => 'required',
            'id_karyawan' => 'required|exists:karyawans,id',
            'tanggal_lembur' => 'required|date',
            'jam_awal_lembur' => 'required',
            'jam_selesai_lembur' => 'required',
            'keterangan' => 'nullable|string',
        ]);

        Lembur::create($validated);
        return redirect()->route('lemburs.index')->with('success', 'Lembur added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Lembur::with('karyawan')->findOrFail($id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Lembur $lembur)
    {
        $karyawans = Karyawan::all();
        return Inertia('lembur/edit', [
            'lembur' => $lembur,
            'karyawans' => $karyawans,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $lembur = Lembur::findOrFail($id);

        $validated = $request->validate([
            'kode_gudang' => 'required',
            'id_karyawan' => 'required|exists:karyawans,id',
            'tanggal_lembur' => 'required|date',
            'jam_awal_lembur' => 'required',
            'jam_selesai_lembur' => 'required',
            'keterangan' => 'nullable|string',
        ]);

        $lembur->update($validated);
        return redirect()->route('lemburs.index')->with('success', 'Lembur updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $lembur = Lembur::findOrFail($id);
        $lembur->delete();
        return redirect()->back()->with('success', 'Lembur deleted successfully!');
    }
}
