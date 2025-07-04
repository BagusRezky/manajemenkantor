<?php

namespace App\Http\Controllers;

use App\Models\Mesin;
use Illuminate\Http\Request;

class MesinController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $mesins = Mesin::all();
        return inertia('mesin/mesins', [
            'mesins' => $mesins,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_mesin' => 'required|string|max:255',
            'jenis_mesin' => 'required|string|max:255',
            'kapasitas' => 'required|numeric',
            'proses' => 'required|string|max:255',
            'status' => 'required|string|max:50',
        ]);

        Mesin::create($validated);
        return redirect()->back()->with('success', 'Mesin added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Mesin $mesin)
    {
        return inertia('mesin/show', [
            'mesin' => $mesin,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Mesin $mesin)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $mesin = Mesin::findOrFail($id);

        $validated = $request->validate([
            'nama_mesin' => 'required|string|max:255',
            'jenis_mesin' => 'required|string|max:255',
            'kapasitas' => 'required|numeric',
            'proses' => 'required|string|max:255',
            'status' => 'required|string|max:50',
        ]);

        $mesin->update($validated);
        return redirect()->back()->with('success', 'Mesin updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $mesin = Mesin::findOrFail($id);
        $mesin->delete();

        return redirect()->back()->with('success', 'Mesin deleted successfully!');
    }
}
