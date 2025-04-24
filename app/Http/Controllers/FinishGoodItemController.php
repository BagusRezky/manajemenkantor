<?php

namespace App\Http\Controllers;

use App\Models\FinishGoodItem;
use App\Models\Unit;
use App\Models\CustomerAddress;
use App\Models\TypeItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FinishGoodItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $finishGoodItems = FinishGoodItem::with(['unit', 'customerAddress', 'typeItem'])->get();
        return Inertia::render('finishGoodItem/finishGoodItems', [
            'finishGoodItems' => $finishGoodItems,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $units = Unit::select('id', 'nama_satuan')->get();
        $typeItems = TypeItem::select('id', 'nama_type_item', 'kode_type_item')->get();
        $customerAddresses = CustomerAddress::select('id', 'nama_customer')->get();

        return Inertia::render('finishGoodItem/create', [
            'units' => $units,
            'typeItems' => $typeItems,
            'customerAddresses' => $customerAddresses,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_customer_address' => 'required|exists:customer_addresses,id',
            'id_type_item' => 'required|exists:type_items,id',
            'satuan_satu_id' => 'required|exists:units,id',
            'kode_material_produk' => 'required|string',
            'kode_barcode' => 'required|string',
            'pc_number' => 'required|string',
            'nama_barang' => 'required|string',
            'deskripsi' => 'required|string',
            'spesifikasi_kertas' => 'required|string',
            'up_satu' => 'required|string',
            'up_dua' => 'required|string',
            'up_tiga' => 'required|string',
            'ukuran_potong' => 'required|string',
            'ukuran_cetak' => 'required|string',
            'panjang' => 'required|numeric',
            'lebar' => 'required|numeric',
            'tinggi' => 'required|numeric',
            'berat_kotor' => 'required|numeric',
            'berat_bersih' => 'required|numeric'
        ]);

        FinishGoodItem::create($request->all());

        return redirect()->route('finishGoodItems.index')->with('success', 'Finish Good Item created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(FinishGoodItem $finishGoodItem)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $finishGoodItem = FinishGoodItem::findOrFail($id);
        $units = Unit::select('id', 'nama_satuan')->get();
        $typeItems = TypeItem::select('id', 'nama_type_item')->get();
        $customerAddresses = CustomerAddress::select('id', 'nama_customer')->get();

        return Inertia::render('finishGoodItem/edit', [
            'finishGoodItem' => $finishGoodItem,
            'units' => $units,
            'typeItems' => $typeItems,
            'customerAddresses' => $customerAddresses,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $finishGoodItem = FinishGoodItem::findOrFail($id);

        $request->validate([
            'id_customer_address' => 'required|exists:customer_addresses,id',
            'id_type_item' => 'required|exists:type_items,id',
            'satuan_satu_id' => 'required|exists:units,id',
            'kode_material_produk' => 'required|string',
            'kode_barcode' => 'required|string',
            'pc_number' => 'required|string',
            'nama_barang' => 'required|string',
            'deskripsi' => 'required|string',
            'spesifikasi_kertas' => 'required|string',
            'up_satu' => 'required|string',
            'up_dua' => 'required|string',
            'up_tiga' => 'required|string',
            'ukuran_potong' => 'required|string',
            'ukuran_cetak' => 'required|string',
            'panjang' => 'required|numeric',
            'lebar' => 'required|numeric',
            'tinggi' => 'required|numeric',
            'berat_kotor' => 'required|numeric',
            'berat_bersih' => 'required|numeric'
        ]);

        $finishGoodItem->update($request->all());

        return redirect()->route('finishGoodItems.index')->with('success', 'Finish Good Item updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $finishGoodItem = FinishGoodItem::findOrFail($id);
        $finishGoodItem->delete();

        return redirect()->route('finishGoodItems.index')->with('success', 'Finish Good Item deleted successfully.');
    }

    public function cutOff()
    {
        $cutOff = FinishGoodItem::onlyTrashed()->with(['unit', 'customerAddress', 'typeItem'])->get();

        return Inertia::render('finishGoodItem/cut-off', [
            'cutOff' => $cutOff,
        ]);
    }

    public function restore($id)
    {
        $finishGoodItem = FinishGoodItem::withTrashed()->findOrFail($id);
        $finishGoodItem->restore();

        return redirect()->route('finishGoodItems.cutOff')->with('success', 'Finish Good Item restored successfully.');
    }

    public function forceDelete($id)
    {
        $finishGoodItem = FinishGoodItem::withTrashed()->findOrFail($id);
        $finishGoodItem->forceDelete();

        return redirect()->route('finishGoodItems.cutOff')->with('success', 'Finish Good Item permanently deleted.');
    }
}
