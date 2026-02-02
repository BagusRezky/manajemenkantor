<?php

namespace App\Http\Controllers;

use App\Models\MetodeBayar;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MetodeBayarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $metodeBayars = MetodeBayar::all();
        return Inertia::render('metodeBayar/metodeBayars', [
            'metodeBayars' => $metodeBayars,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('metodeBayar/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode_bayar' => 'required|string|max:255',
            'metode_bayar' => 'required|string|max:255',
        ]);

        MetodeBayar::create($validated);
        return redirect()->route('metodeBayars.index')->with('success', 'Data berhasil dibuat');
    }

    /**
     * Display the specified resource.
     */
    public function show(MetodeBayar $metodeBayar)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MetodeBayar $metodeBayar)
    {
        return Inertia::render('metodeBayar/edit', [
            'item' => $metodeBayar,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MetodeBayar $metodeBayar)
    {
        $validated = $request->validate([
            'kode_bayar' => 'required|string|max:255|unique:metode_bayars,kode_bayar,' . $metodeBayar->id,
            'metode_bayar' => 'required|string|max:255',
        ]);

        $metodeBayar->update($validated);
        return redirect()->route('metodeBayars.index')->with('success', 'Data diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MetodeBayar $metodeBayar)
    {
        $metodeBayar->delete();
        return redirect()->route('metodeBayars.index')->with('success', 'Data dihapus');
    }
}
