<?php

namespace App\Http\Controllers;

use App\Models\MesinDiemaking;
use Illuminate\Http\Request;

class MesinDiemakingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $mesinDiemakings = MesinDiemaking::all();
        return inertia('mesinDiemaking/mesinDiemakings', [
            'mesinDiemakings' => $mesinDiemakings,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_mesin_diemaking' => 'required|string|max:255',
            'jenis_mesin_diemaking' => 'required|string|max:255',
            'kapasitas_diemaking' => 'required|numeric',
            'proses_diemaking' => 'required|string|max:255',
            'status_diemaking' => 'required|string|max:50',
        ]);

        MesinDiemaking::create($validated);
        return redirect()->back()->with('success', 'Mesin Die Making added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(MesinDiemaking $mesinDiemaking)
    {
        return inertia('mesinDiemaking/show', [
            'mesinDiemaking' => $mesinDiemaking,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MesinDiemaking $mesinDiemaking)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $mesinDiemaking = MesinDiemaking::findOrFail($id);
        $validated = $request->validate([
            'nama_mesin_diemaking' => 'required|string|max:255',
            'jenis_mesin_diemaking' => 'required|string|max:255',
            'kapasitas_diemaking' => 'required|numeric',
            'proses_diemaking' => 'required|string|max:255',
            'status_diemaking' => 'required|string|max:50',
        ]);

        $mesinDiemaking->update($validated);
        return redirect()->route('mesinDiemakings.index')->with('success', 'Mesin Die Making updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $mesinDiemaking = MesinDiemaking::findOrFail($id);
        $mesinDiemaking->delete();
        return redirect()->route('mesinDiemakings.index')->with('success', 'Mesin Die Making deleted successfully!');
    }
}
