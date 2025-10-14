<?php

namespace App\Http\Controllers;

use App\Models\Karyawan;
use App\Models\PotonganTunjangan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PotonganTunjanganController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $potonganTunjangans = PotonganTunjangan::with('karyawan')->get();
        return Inertia::render('potonganTunjangan/potonganTunjangans', [
            'potonganTunjangans' => $potonganTunjangans,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $karyawans = Karyawan::select('id', 'nama_karyawan')->get();
        return Inertia::render('potonganTunjangan/create', [
            'karyawans' => $karyawans,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_karyawan' => 'required|exists:karyawans,id',
            'periode_payroll' => 'required|date',
            'potongan_tunjangan_jabatan' => 'required|integer',
            'potongan_tunjangan_kompetensi' => 'required|integer',
            'potongan_intensif' => 'required|integer',
            'keterangan' => 'nullable|string',
        ]);

        PotonganTunjangan::create($validated);
        return redirect()->route('potonganTunjangans.index')->with('success', 'Potongan Tunjangan added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $potonganTunjangan = PotonganTunjangan::with('karyawan')->findOrFail($id);
        return Inertia::render('potonganTunjangan/show', [
            'potonganTunjangan' => $potonganTunjangan,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PotonganTunjangan $potonganTunjangan)
    {
        $karyawans = Karyawan::select('id', 'nama_karyawan')->get();
        return Inertia::render('potonganTunjangan/edit', [
            'potonganTunjangan' => $potonganTunjangan,
            'karyawans' => $karyawans,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'id_karyawan' => 'required|exists:karyawans,id',
            'periode_payroll' => 'required|date',
            'potongan_tunjangan_jabatan' => 'required|integer',
            'potongan_tunjangan_kompetensi' => 'required|integer',
            'potongan_intensif' => 'required|integer',
            'keterangan' => 'nullable|string',
        ]);

        $potonganTunjangan = PotonganTunjangan::findOrFail($id);
        $potonganTunjangan->update($validated);
        return redirect()->route('potonganTunjangans.index')->with('success', 'Potongan Tunjangan updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $potonganTunjangan = PotonganTunjangan::findOrFail($id);
        $potonganTunjangan->delete();
        return redirect()->route('potonganTunjangans.index')->with('success', 'Potongan Tunjangan deleted successfully!');
    }
}
