<?php

namespace App\Http\Controllers;

use App\Models\TypeOffice;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TypeOfficeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $typeOffices = TypeOffice::all();
        return inertia::render('typeOffice/typeOffices', [
            'typeOffices' => $typeOffices,
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
            'kode_type_office' => 'required',
            'nama_type_office' => 'required',
        ]);

        TypeOffice::create($validated);
        return redirect()->back()->with('success', 'Type Office added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return TypeOffice::findOrFail($id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TypeOffice $typeOffice)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $typeOffice = TypeOffice::findOrFail($id);
        $validated = $request->validate([
            'kode_type_office' => 'required',
            'nama_type_office' => 'required',
        ]);

        $typeOffice->update($validated);
        return redirect()->back()->with('success', 'Type Office updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $typeOffice = TypeOffice::findOrFail($id);
        $typeOffice->delete();
        return redirect()->back()->with('success', 'Type Office deleted successfully!');
    }
}
