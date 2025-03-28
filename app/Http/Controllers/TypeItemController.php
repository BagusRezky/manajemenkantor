<?php

namespace App\Http\Controllers;

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
        $typeItems = TypeItem::all();
        return inertia::render('typeItem/typeItems', [
            'typeItems' => $typeItems,
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
            'kode_type_item' => 'required',
            'nama_type_item' => 'required',
        ]);

        TypeItem::create($validated);
        return redirect()->back()->with('success', 'Type Item added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return TypeItem::findOrFail($id);
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
            'kode_type_item' => 'required',
            'nama_type_item' => 'required',
        ]);
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
