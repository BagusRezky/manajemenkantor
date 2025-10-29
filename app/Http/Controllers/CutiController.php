<?php

namespace App\Http\Controllers;

use App\Models\Cuti;
use App\Models\Karyawan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CutiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $cutis = Cuti::with('karyawan')->get();
        return Inertia::render('cuti/cutis', [
            'cutis' => $cutis,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $karyawans = Karyawan::all();
        return Inertia::render('cuti/create', [
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
            'tanggal_cuti' => 'required|date',
            'jenis_cuti' => 'required|string',
            'lampiran' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'keterangan' => 'nullable|string',
        ]);
        if ($request->hasFile('lampiran')) {
            $validated['lampiran'] = $request->file('lampiran')->store('lampiran_cuti', 'public');
        }
        Cuti::create($validated);
        return redirect()->route('cutis.index')->with('success', 'Cuti added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $cuti = Cuti::with('karyawan')->findOrFail($id);
        return Inertia::render('cuti/show', [
            'cuti' => $cuti,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Cuti $cuti)
    {
        $karyawans = Karyawan::all();
        return Inertia::render('cuti/edit', [
            'cuti' => $cuti,
            'karyawans' => $karyawans,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $cuti = Cuti::findOrFail($id);
        $validated = $request->validate([
            'id_karyawan' => 'required|exists:karyawans,id',
            'tanggal_cuti' => 'required|date',
            'jenis_cuti' => 'required|string',
            'lampiran' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'keterangan' => 'nullable|string',
        ]);
        if ($request->hasFile('lampiran')) {
            $validated['lampiran'] = $request->file('lampiran')->store('lampiran_cuti', 'public');
        }
        $cuti->update($validated);
        return redirect()->route('cutis.index')->with('success', 'Cuti updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $cuti = Cuti::findOrFail($id);
        $cuti->delete();
        return redirect()->route('cutis.index')->with('success', 'Cuti deleted successfully!');
    }
}
