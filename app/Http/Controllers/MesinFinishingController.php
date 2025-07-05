<?php

namespace App\Http\Controllers;

use App\Models\MesinFinishing;
use Illuminate\Http\Request;

class MesinFinishingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $mesinFinishings = MesinFinishing::all();
        return inertia('mesinFinishing/mesinFinishings', [
            'mesinFinishings' => $mesinFinishings,
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
            'nama_mesin_finishing' => 'required|string|max:255',
            'jenis_mesin_finishing' => 'required|string|max:255',
            'kapasitas_finishing' => 'required|numeric',
            'proses_finishing' => 'required|string|max:255',
            'status_finishing' => 'required|string|max:50',
        ]);

        MesinFinishing::create($validated);
        return redirect()->back()->with('success', 'Mesin Finishing added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(MesinFinishing $mesinFinishing)
    {
        return inertia('mesinFinishing/show', [
            'mesinFinishing' => $mesinFinishing,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MesinFinishing $mesinFinishing)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $mesinFinishing = MesinFinishing::findOrFail($id);
        $validated = $request->validate([
            'nama_mesin_finishing' => 'required|string|max:255',
            'jenis_mesin_finishing' => 'required|string|max:255',
            'kapasitas_finishing' => 'required|numeric',
            'proses_finishing' => 'required|string|max:255',
            'status_finishing' => 'required|string|max:50',
        ]);

        $mesinFinishing->update($validated);
        return redirect()->back()->with('success', 'Mesin Finishing updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $mesinFinishing = MesinFinishing::findOrFail($id);
        $mesinFinishing->delete();
        return redirect()->back()->with('success', 'Mesin Finishing deleted successfully!');
    }
}
