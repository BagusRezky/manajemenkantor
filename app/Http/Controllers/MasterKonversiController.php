<?php

namespace App\Http\Controllers;

use App\Models\MasterKonversi;
use App\Models\TypeItem;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MasterKonversiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $masterKonversis = MasterKonversi::with(['typeItem', 'satuanSatu', 'satuanDua'])->get();
        $typeItems = TypeItem::all();
        $units = Unit::all();
        return inertia::render('masterKonversi/masterKonversis', [
            'masterKonversis' => $masterKonversis,
            'konversiList' => $masterKonversis,
            'typeItems' => $typeItems,
            'units' => $units
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
            'id_type_item' => 'required|exists:type_items,id',
            'satuan_satu_id' => 'required|exists:units,id',
            'satuan_dua_id' => 'required|exists:units,id',
            'jumlah_satuan_konversi' => 'required',
        ]);

        MasterKonversi::create($validated);
        return redirect()->back()->with('success', 'Master Konversi added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return MasterKonversi::with(['typeItem', 'satuanSatu', 'satuanDua'])->findOrFail($id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MasterKonversi $masterKonversi)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $id = MasterKonversi::findOrFail($id);
        $validated = $request->validate([
            'id_type_item' => 'required|exists:type_items,id',
            'satuan_satu_id' => 'required|exists:units,id',
            'satuan_dua_id' => 'required|exists:units,id',
            'jumlah_satuan_konversi' => 'required',
        ]);

        $id->update($validated);
        return redirect()->back()->with('success', 'Master Konversi updated successfully!');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $masterKonversi = MasterKonversi::findOrFail($id);
        $masterKonversi->delete();
        return redirect()->back()->with('success', 'Master Konversi deleted successfully!');
    }
}
