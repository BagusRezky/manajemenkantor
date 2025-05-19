<?php

namespace App\Http\Controllers;

use App\Models\FinishGoodItem;
use App\Models\Unit;
use App\Models\CustomerAddress;
use App\Models\Departemen;
use App\Models\TypeItem;
use App\Models\MasterItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
        $typeItems = TypeItem::select('id', 'nama_type_item', 'kode_type_item', 'id_category_item')
        ->with('categoryItem')
        ->whereHas('categoryItem', function($query) {
            $query->whereRaw('LOWER(nama_category_item) = ?', ['finish goods']);
        })
        ->get();
        $customerAddresses = CustomerAddress::select('id', 'nama_customer')->get();
        $masterItems = MasterItem::select('id', 'kode_master_item', 'nama_master_item', 'satuan_satu_id', 'id_category_item')->with(['unit', 'categoryItem'])->get();
        $departements = Departemen::select('id', 'nama_departemen')->get();

        return Inertia::render('finishGoodItem/create', [
            'units' => $units,
            'typeItems' => $typeItems,
            'customerAddresses' => $customerAddresses,
            'masterItems' => $masterItems,
            'departements' => $departements,
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
            'berat_bersih' => 'required|numeric',
            'bill_of_materials' => 'required|array|min:1',
            'bill_of_materials.*.id_master_item' => 'required|exists:master_items,id',
            'bill_of_materials.*.id_departemen' => 'required|exists:departemens,id',
            'bill_of_materials.*.waste' => 'required|string',
            'bill_of_materials.*.qty' => 'required|string',
            'bill_of_materials.*.keterangan' => 'nullable|string',
        ]);

        $finishGoodItem = FinishGoodItem::create($request->except('bill_of_materials'));

        if ($request->has('bill_of_materials') && is_array($request->bill_of_materials)) {


            foreach ($request->bill_of_materials as $bomItem) {

                if (isset($bomItem['id'])) {
                    unset($bomItem['id']);
                }


                $finishGoodItem->billOfMaterials()->create([
                    'id_master_item' => $bomItem['id_master_item'],
                    'id_departemen' => $bomItem['id_departemen'],
                    'waste' => $bomItem['waste'],
                    'qty' => $bomItem['qty'],
                    'keterangan' => $bomItem['keterangan'] ?? null,
                ]);
            }
        }
        return redirect()->route('finishGoodItems.index')->with('success', 'Finish Good Item created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function detail($id)
    {
        $finishGoodItem = FinishGoodItem::with([
            'unit',
            'customerAddress',
            'typeItem',
            'billOfMaterials.masterItem',
            'billOfMaterials.departemen'
        ])->findOrFail($id);

        return Inertia::render('finishGoodItem/detail', [
            'finishGoodItem' => $finishGoodItem,
        ]);
    }

    public function edit($id)
    {
        // Eager load the BOM and related models with complete data needed for the form
        $finishGoodItem = FinishGoodItem::with([
            'unit',
            'customerAddress',
            'typeItem',
            'billOfMaterials.masterItem.unit', // Include unit for each master item
            'billOfMaterials.departemen'
        ])->findOrFail($id);

        // Transform the billOfMaterials to the format expected by the frontend
        $transformedBom = $finishGoodItem->billOfMaterials->map(function($item) {
            return [
                'id' => $item->id,
                'id_master_item' => (string)$item->id_master_item,
                'id_departemen' => (string)$item->id_departemen,
                'waste' => $item->waste,
                'qty' => $item->qty,
                'keterangan' => $item->keterangan,
                'master_item' => $item->masterItem, // Include related master item
                'departemen' => $item->departemen   // Include related departemen
            ];
        });

        // Set the transformed BOM data
        $finishGoodItem->bill_of_materials = $transformedBom;

        // Get all required data for the edit form
        $units = Unit::select('id', 'nama_satuan')->get();
        $typeItems = TypeItem::select('id', 'nama_type_item')->get();
        $customerAddresses = CustomerAddress::select('id', 'nama_customer')->get();
        $masterItems = MasterItem::select('id', 'kode_master_item', 'nama_master_item', 'satuan_satu_id', 'id_category_item')
            ->with(['unit', 'categoryItem'])
            ->get();
        $departements = Departemen::select('id', 'nama_departemen')->get();

        return Inertia::render('finishGoodItem/edit', [
            'finishGoodItem' => $finishGoodItem,
            'units' => $units,
            'typeItems' => $typeItems,
            'customerAddresses' => $customerAddresses,
            'masterItems' => $masterItems,
            'departements' => $departements,
        ]);
    }

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
            'berat_bersih' => 'required|numeric',
            'bill_of_materials' => 'nullable|array',
            'bill_of_materials.*.id_master_item' => 'required|exists:master_items,id',
            'bill_of_materials.*.id_departemen' => 'required|exists:departemens,id',
            'bill_of_materials.*.waste' => 'required|string',
            'bill_of_materials.*.qty' => 'required|string',
            'bill_of_materials.*.keterangan' => 'nullable|string',
        ]);

        // Update the FinishGoodItem
        $finishGoodItem->update($request->except('bill_of_materials'));

        // Handle bill of materials
        if ($request->has('bill_of_materials') && is_array($request->bill_of_materials)) {
            // Delete existing bill of materials
            $finishGoodItem->billOfMaterials()->delete();

            // Create new bill of materials
            foreach ($request->bill_of_materials as $bomItem) {
                // Skip temporary IDs that start with 'temp-'
                if (isset($bomItem['id']) && strpos($bomItem['id'], 'temp-') === 0) {
                    unset($bomItem['id']);
                }

                // Remove any related models before creating
                if (isset($bomItem['master_item'])) {
                    unset($bomItem['master_item']);
                }

                if (isset($bomItem['departemen'])) {
                    unset($bomItem['departemen']);
                }

                $finishGoodItem->billOfMaterials()->create([
                    'id_master_item' => $bomItem['id_master_item'],
                    'id_departemen' => $bomItem['id_departemen'],
                    'waste' => $bomItem['waste'],
                    'qty' => $bomItem['qty'],
                    'keterangan' => $bomItem['keterangan'] ?? null,
                ]);
            }
        } else {
            // If no bill_of_materials provided, delete all existing ones
            $finishGoodItem->billOfMaterials()->delete();
        }

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
