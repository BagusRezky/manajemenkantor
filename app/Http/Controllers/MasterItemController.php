<?php

namespace App\Http\Controllers;

use App\Imports\MasterItemImport;
use App\Models\MasterItem;
use App\Models\CategoryItem;
use App\Models\Unit;
use App\Models\TypeItem;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class MasterItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $masterItems = MasterItem::with(['unit', 'categoryItem', 'typeItem'])->get();
        return Inertia::render('masterItem/masterItems', [
            'masterItems' => $masterItems,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $units = Unit::select('id', 'nama_satuan')->get();
        $categoryItems = CategoryItem::select('id', 'nama_category_item')->get();

        return Inertia::render('masterItem/create', [
            'units' => $units,
            'categoryItems' => $categoryItems,
        ]);
    }

    public function getTypeItems(Request $request)
    {
        $categoryId = $request->input('categoryId');
        $typeItems = TypeItem::where('id_category_item', $categoryId)
            ->select('id', 'nama_type_item')
            ->get();

        return response()->json($typeItems);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'kode_master_item' => 'required|string|unique:master_items',
            'satuan_satu_id' => 'required|exists:units,id',
            'id_category_item' => 'required|exists:category_items,id',
            'id_type_item' => 'required|exists:type_items,id',
            'qty' => 'nullable|numeric',
            'panjang' => 'nullable|numeric',
            'lebar' => 'nullable|numeric',
            'tinggi' => 'nullable|numeric',
            'berat' => 'nullable|numeric',
            'nama_master_item' => 'required|string',
            'min_stock' => 'required',
            'min_order' => 'required',
            'tipe_penjualan' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // Get category name to check if it's production or finish good item
        $category = CategoryItem::find($request->id_category_item);
        $categoryName = strtolower($category->nama_category_item);

        // If the category is not production or finish good item, set the dimension fields to null
        if (!in_array($categoryName, ['material production'])) {
            $request->merge([
                'tipe_penjualan' => null,
                'qty' => null,
                'panjang' => null,
                'lebar' => null,
                'tinggi' => null,
                'berat' => null,
            ]);
        }

        MasterItem::create($request->all());

        return redirect()->route('master-items.index')
            ->with('success', 'Master Item created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(MasterItem $masterItem)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $masterItem = MasterItem::findOrFail($id);
        $units = Unit::select('id', 'nama_satuan')->get();
        $categoryItems = CategoryItem::select('id', 'nama_category_item')->get();
        $typeItems = TypeItem::where('id_category_item', $masterItem->id_category_item)
            ->select('id', 'nama_type_item')
            ->get();

        return Inertia::render('masterItem/edit', [
            'masterItem' => $masterItem,
            'units' => $units,
            'categoryItems' => $categoryItems,
            'typeItems' => $typeItems,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $masterItem = MasterItem::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'kode_master_item' => 'required|string|unique:master_items,kode_master_item,' . $id,
            'satuan_satu_id' => 'required|exists:units,id',
            'id_category_item' => 'required|exists:category_items,id',
            'id_type_item' => 'required|exists:type_items,id',
            'qty' => 'nullable|numeric',
            'panjang' => 'nullable|numeric',
            'lebar' => 'nullable|numeric',
            'tinggi' => 'nullable|numeric',
            'berat' => 'nullable|numeric',
            'nama_master_item' => 'required|string',
            'min_stock' => 'required',
            'min_order' => 'required',
            'tipe_penjualan' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // Get category name to check if it's production or finish good item
        $category = CategoryItem::find($request->id_category_item);
        $categoryName = strtolower($category->nama_category_item);

        // If the category is not production or finish good item, set the dimension fields to null
        if (!in_array($categoryName, ['material production'])) {
            $request->merge([
                'tipe_penjualan' => null,
                'qty' => null,
                'panjang' => null,
                'lebar' => null,
                'tinggi' => null,
                'berat' => null,
            ]);
        }

        $masterItem->update($request->all());

        return redirect()->route('master-items.index')
            ->with('success', 'Master Item updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $masterItem = MasterItem::findOrFail($id);
        $masterItem->delete();

        return redirect()->route('master-items.index')
            ->with('success', 'Master Item deleted successfully');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv'
        ]);

        // Panggil class MasterItemImport
        Excel::import(new MasterItemImport, $request->file('file'));

        // Asumsi route index untuk Master Item adalah 'master-items.index'
        return redirect()->route('master-items.index')
            ->with('success', 'Master Item created successfully');
    }
}
