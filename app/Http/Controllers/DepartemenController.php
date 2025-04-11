<?php

namespace App\Http\Controllers;

use App\Models\Departemen;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartemenController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $departemens = Departemen::all();
        return Inertia::render('departemen/departemens', [
            'departemens' => $departemens,
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
            'kode_departemen' => 'required',
            'nama_departemen' => 'required',
        ]);

        $validated['kode_departemen'] = strtoupper($validated['kode_departemen']);
        $validated['nama_departemen'] = strtoupper($validated['nama_departemen']);

        Departemen::create($validated);
        return redirect()->back()->with('success', 'Departemen added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Departemen::findOrFail($id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Departemen $departemen)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $departemen = Departemen::findOrFail($id);

        $validated = $request->validate([
            'kode_departemen' => 'required|string|unique:departemens,kode_departemen,' . $id,
            'nama_departemen' => 'required|string',
        ]);

        $validated['kode_departemen'] = strtoupper($validated['kode_departemen']);
        $validated['nama_departemen'] = strtoupper($validated['nama_departemen']);

        $departemen->update($validated);
        return redirect()->back()->with('success', 'Departemen updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $departemen = Departemen::findOrFail($id);
        $departemen->delete();
        return redirect()->back()->with('success', 'Departemen deleted successfully!');
    }
}
