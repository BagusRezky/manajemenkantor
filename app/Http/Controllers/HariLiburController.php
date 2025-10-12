<?php

namespace App\Http\Controllers;

use App\Models\HariLibur;
use Illuminate\Http\Request;

class HariLiburController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $hariLiburs = HariLibur::all();
        return inertia('harilibur/hariliburs', [
            'hariLiburs' => $hariLiburs,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $hariLiburs = HariLibur::all();
        return inertia('harilibur/create', [
            'hariLiburs' => $hariLiburs,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'tanggal_libur' => 'required|date',
            'keterangan' => 'nullable|string',
        ]);
        HariLibur::create($request->validated());
        return redirect()->route('hariliburs.index')->with('success', 'Hari Libur added successfully!');
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
        $hariLiburs = HariLibur::findOrFail($id);
        return inertia('harilibur/edit', [
            'hariLiburs' => $hariLiburs,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $hariLiburs = HariLibur::findOrFail($id);
        $request->validate([
            'tanggal_libur' => 'required|date',
            'keterangan' => 'nullable|string',
        ]);
        $hariLiburs->update($request->validated());
        return redirect()->route('hariliburs.index')->with('success', 'Hari Libur updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $hariLiburs = HariLibur::findOrFail($id);
        $hariLiburs->delete();
        return redirect()->route('hariliburs.index')->with('success', 'Hari Libur deleted successfully!');
    }
}
