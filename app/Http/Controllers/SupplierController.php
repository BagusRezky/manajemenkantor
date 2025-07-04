<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $suppliers = Supplier::all();
        return Inertia::render('supplier/suppliers', [
            'suppliers' => $suppliers,
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
            'kode_suplier' => 'required|unique:suppliers',
            'nama_suplier' => 'required',
            'jenis_suplier' => 'required',
            'keterangan' => 'required',
            'alamat_lengkap' => 'required',
        ]);


        $validated['kode_suplier'] = strtoupper($validated['kode_suplier']);
        $validated['nama_suplier'] = strtoupper($validated['nama_suplier']);

        Supplier::create($validated);
        return redirect()->back()->with('success', 'Supplier added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Supplier::findOrFail($id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Supplier $supplier)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $supplier = Supplier::findOrFail($id);
        $validated = $request->validate([
            'kode_suplier' => 'required|unique:suppliers,kode_suplier,' . $id,
            'nama_suplier' => 'required',
            'jenis_suplier' => 'required',
            'keterangan' => 'required',
            'alamat_lengkap' => 'required',
        ]);

        $validated['kode_suplier'] = strtoupper($validated['kode_suplier']);
        $validated['nama_suplier'] = strtoupper($validated['nama_suplier']);

        $supplier->update($validated);

        return redirect()->back()->with('success', 'Supplier updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $supplier = Supplier::findOrFail($id);
        $supplier->delete();
        return redirect()->back()->with('success', 'Supplier deleted successfully!');
    }
}
