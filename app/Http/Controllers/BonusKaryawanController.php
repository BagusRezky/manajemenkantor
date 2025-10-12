<?php

namespace App\Http\Controllers;

use App\Models\BonusKaryawan;
use App\Models\Karyawan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BonusKaryawanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bonusKaryawans = BonusKaryawan::with('karyawan')->get();
        return Inertia::render('bonusKaryawan/bonusKaryawans', [
            'bonusKaryawans' => $bonusKaryawans,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $bonusKaryawans = BonusKaryawan::all();
        return Inertia::render('bonusKaryawan/create', [
            'bonusKaryawans' => $bonusKaryawans,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode_gudang' => 'required|string',
            'id_karyawan' => 'required|exists:karyawans,id',
            'tanggal_bonus' => 'required|date',
            'nilai_bonus' => 'required|integer',
            'keterangan' => 'nullable|string',
        ]);
        BonusKaryawan::create($validated);
        return redirect()->route('bonusKaryawans.index')->with('success', 'Bonus Karyawan added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(BonusKaryawan $bonusKaryawan)
    {
        return Inertia::render('bonusKaryawan/show', [
            'bonusKaryawan' => $bonusKaryawan,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BonusKaryawan $bonusKaryawan)
    {
        $karyawans = Karyawan::all();
        return Inertia::render('bonusKaryawan/edit', [
            'bonusKaryawan' => $bonusKaryawan,
            'karyawans' => $karyawans,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $bonusKaryawan = BonusKaryawan::findOrFail($id);
        $validated = $request->validate([
            'kode_gudang' => 'required|string',
            'id_karyawan' => 'required|exists:karyawans,id',
            'tanggal_bonus' => 'required|date',
            'nilai_bonus' => 'required|integer',
            'keterangan' => 'nullable|string',
        ]);
        $bonusKaryawan->update($validated);
        return redirect()->route('bonusKaryawans.index')->with('success', 'Bonus Karyawan updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $bonusKaryawan = BonusKaryawan::findOrFail($id);
        $bonusKaryawan->delete();
        return redirect()->route('bonusKaryawans.index')->with('success', 'Bonus Karyawan deleted successfully!');
    }
}
