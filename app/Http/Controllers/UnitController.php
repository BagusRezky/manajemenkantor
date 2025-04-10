<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $units = Unit::all();
        return inertia::render('unit/units', [
            'units' => $units,
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
            'kode_satuan' => 'required',
            'nama_satuan' => 'required',
        ]);

        $validated['kode_satuan'] = strtoupper($validated['kode_satuan']);
        $validated['nama_satuan'] = strtoupper($validated['nama_satuan']);

        Unit::create($validated);
        return redirect()->back()->with('success', 'Unit added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Unit::findOrFail($id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Unit $unit)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $unit = Unit::findOrFail($id);
        $validated = $request->validate([
            'kode_satuan' => 'required',
            'nama_satuan' => 'required',
        ]);

        $validated['kode_satuan'] = strtoupper($validated['kode_satuan']);
        $validated['nama_satuan'] = strtoupper($validated['nama_satuan']);

        $unit->update($validated);

        return redirect()->back()->with('success', 'Unit updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $unit = Unit::findOrFail($id);
        $unit->delete();
        return redirect()->back()->with('success', 'Unit deleted successfully!');
    }
}
