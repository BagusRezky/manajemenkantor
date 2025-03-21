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
        return inertia::render('suppliers', [
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
        $request->validate([
            'kode_suplier' => 'required',
            'nama_suplier' => 'required',
            'jenis_suplier' => 'required',
            'keterangan' => 'required',
        ]);

        Supplier::create($request->all());
        return redirect()->route('supplier.index');
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
        $request->validate([
            'kode_suplier' => 'required',
            'nama_suplier' => 'required',
            'jenis_suplier' => 'required',
            'keterangan' => 'required',
        ]);

        $supplier = Supplier::findOrFail($id);
        $supplier->update($request->all());
        return redirect()->route('supplier.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $supplier = Supplier::findOrFail($id);
        $supplier->delete();
        return redirect()->route('supplier.index');
    }
}
