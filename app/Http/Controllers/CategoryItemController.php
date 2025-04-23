<?php

namespace App\Http\Controllers;

use App\Models\CategoryItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categoryItems = CategoryItem::all();
        return Inertia::render('categoryItem/categoryItems', [
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
            'kode_category_item' => 'required|unique:category_items',
            'nama_category_item' => 'required',
        ]);

        $validated['kode_category_item'] = strtoupper($validated['kode_category_item']);
        $validated['nama_category_item'] = strtoupper($validated['nama_category_item']);

        CategoryItem::create($validated);
        return redirect()->back()->with('success', 'Category Item added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return CategoryItem::findOrFail($id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CategoryItem $categoryItem)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $categoryItem = CategoryItem::findOrFail($id);
        $validated = $request->validate([
            'kode_category_item' => 'required|unique:category_items,kode_category_item,' . $id,
            'nama_category_item' => 'required',
        ]);

        $validated['kode_category_item'] = strtoupper($validated['kode_category_item']);
        $validated['nama_category_item'] = strtoupper($validated['nama_category_item']);

        $categoryItem->update($validated);
        return redirect()->back()->with('success', 'Category Item updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $categoryItem = CategoryItem::findOrFail($id);
        $categoryItem->delete();
        return redirect()->back()->with('success', 'Category Item deleted successfully!');
    }
}
