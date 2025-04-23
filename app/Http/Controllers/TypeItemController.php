<?php

namespace App\Http\Controllers;

use App\Models\CategoryItem;
use App\Models\TypeItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TypeItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $typeItems = TypeItem::with('categoryItem')->get();
        $categoryItems = CategoryItem::all();
        return inertia::render('typeItem/typeItems', [
            'typeItems' => $typeItems,
            'categoryItems' => $categoryItems,
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
            'id_category_item' => 'required|exists:category_items,id',
            'kode_type_item' => 'required|unique:type_items',
            'nama_type_item' => 'required',
        ]);

        $validated['kode_type_item'] = strtoupper($validated['kode_type_item']);
        $validated['nama_type_item'] = strtoupper($validated['nama_type_item']);

        TypeItem::create($validated);
        return redirect()->back()->with('success', 'Type Item added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return TypeItem::with('categoryItem')->findOrFail($id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TypeItem $typeItem)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $typeItem = TypeItem::findOrFail($id);
        $validated = $request->validate([
            'id_category_item' => 'required|exists:category_items,id',
            'kode_type_item' => 'required|unique:type_items,kode_type_item,' . $id,
            'nama_type_item' => 'required',
        ]);

        $validated['kode_type_item'] = strtoupper($validated['kode_type_item']);
        $validated['nama_type_item'] = strtoupper($validated['nama_type_item']);

        $typeItem->update($validated);
        return redirect()->back()->with('success', 'Type Item updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $typeItem = TypeItem::findOrFail($id);
        $typeItem->delete();
        return redirect()->back()->with('success', 'Type Item deleted successfully!');
    }
}
