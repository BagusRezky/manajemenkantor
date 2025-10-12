<?php

namespace App\Http\Controllers;

use App\Models\Izin;
use App\Models\Karyawan;
use Illuminate\Http\Request;

class IzinController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $izins = Izin::with('karyawan')->get();
        return inertia('izin/izins', [
            'izins' => $izins,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $karyawans = Karyawan::all();
        return inertia('izin/create', [
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
            'tanggal_izin' => 'required|date',
            'jenis_izin' => 'required|string',
            'jam_awal_izin' => 'required',
            'jam_selesai_izin' => 'required',
            'keterangan' => 'nullable|string',
        ]);

        Izin::create($validated);
        return redirect()->route('izins.index')->with('success', 'Izin added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Izin::with('karyawan')->findOrFail($id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Izin $izin)
    {
        $karyawans = Karyawan::all();
        return inertia('izin/edit', [
            'izin' => $izin,
            'karyawans' => $karyawans,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $izin = Izin::findOrFail($id);

        $validated = $request->validate([
            'id_karyawan' => 'required|exists:karyawans,id',
            'tanggal_izin' => 'required|date',
            'jenis_izin' => 'required|string',
            'jam_awal_izin' => 'required',
            'jam_selesai_izin' => 'required',
            'keterangan' => 'nullable|string',
        ]);

        $izin->update($validated);
        return redirect()->route('izins.index')->with('success', 'Izin updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $izin = Izin::findOrFail($id);
        $izin->delete();
        return redirect()->route('izins.index')->with('success', 'Izin deleted successfully!');
    }
}
