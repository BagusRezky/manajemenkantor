<?php

namespace App\Http\Controllers;

use App\Models\HariLibur;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HariLiburController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $hariLiburs = HariLibur::all();
        return Inertia::render('hariLibur/hariLiburs', [
            'hariLiburs' => $hariLiburs,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $hariLiburs = HariLibur::all();
        return Inertia::render('hariLibur/create', [
            'hariLiburs' => $hariLiburs,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal_libur' => 'required|date',
            'keterangan' => 'nullable|string',
        ]);
        HariLibur::create($validated);
        return redirect()->route('hariLiburs.index')->with('success', 'Hari Libur added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return HariLibur::findOrFail($id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $hariLibur = HariLibur::findOrFail($id);
        return Inertia::render('hariLibur/edit', [
            'hariLibur' => $hariLibur,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $hariLibur = HariLibur::findOrFail($id);
        $validated = $request->validate([
            'tanggal_libur' => 'required|date',
            'keterangan' => 'nullable|string',
        ]);
        $hariLibur->update($validated);
        return redirect()->route('hariLiburs.index')->with('success', 'Hari Libur updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $hariLiburs = HariLibur::findOrFail($id);
        $hariLiburs->delete();
        return redirect()->route('hariLiburs.index')->with('success', 'Hari Libur deleted successfully!');
    }
}
