<?php

namespace App\Http\Controllers;

use App\Models\Blokir;
use Illuminate\Http\Request;
use App\Models\KartuInstruksiKerja;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BlokirController extends Controller
{
     /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $blokirs = Blokir::with([
            'kartuInstruksiKerja.salesOrder.customerAddress',
            'kartuInstruksiKerja.salesOrder.finishGoodItem'
        ])->orderBy('created_at', 'desc')->get();

        return Inertia::render('blokir/blokirs', [
            'blokirs' => $blokirs
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Ambil KIK yang masih aktif
        $kartuInstruksiKerjas = KartuInstruksiKerja::with([
            'salesOrder.customerAddress',
            'salesOrder.finishGoodItem'
        ])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('blokir/create', [
            'kartuInstruksiKerjas' => $kartuInstruksiKerjas
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_kartu_instruksi_kerja' => 'required|exists:kartu_instruksi_kerjas,id',
            'no_blokir' => 'required|string|max:255|unique:blokirs,no_blokir',
            'tgl_blokir' => 'required|date',
            'operator' => 'required|string|max:255',
            'qty_blokir' => 'required|integer|min:1',
            'keterangan_blokir' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated) {
            Blokir::create($validated);
        });

        return redirect()->route('blokirs.index')
            ->with('success', 'Blokir berhasil dibuat');
    }

    /**
     * Display the specified resource.
     */
    public function show(Blokir $blokir)
    {
        $blokir->load([
            'kartuInstruksiKerja.salesOrder.customerAddress',
            'kartuInstruksiKerja.salesOrder.finishGoodItem',
            'kartuInstruksiKerja.kartuInstruksiKerjaBoms.billOfMaterials.masterItem.unit'
        ]);

        return Inertia::render('blokir/show', [
            'blokir' => $blokir
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Blokir $blokir)
    {
        $blokir->load([
            'kartuInstruksiKerja.salesOrder.customerAddress',
            'kartuInstruksiKerja.salesOrder.finishGoodItem'
        ]);

        $kartuInstruksiKerjas = KartuInstruksiKerja::with([
            'salesOrder.customerAddress',
            'salesOrder.finishGoodItem'
        ])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('blokir/edit', [
            'blokir' => $blokir,
            'kartuInstruksiKerjas' => $kartuInstruksiKerjas
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Blokir $blokir)
    {
        $validated = $request->validate([
            'id_kartu_instruksi_kerja' => 'required|exists:kartu_instruksi_kerjas,id',
            'no_blokir' => 'required|string|max:255|unique:blokirs,no_blokir,' . $blokir->id,
            'tgl_blokir' => 'required|date',
            'operator' => 'required|string|max:255',
            'qty_blokir' => 'required|integer|min:1',
            'keterangan_blokir' => 'nullable|string',
        ]);

        DB::transaction(function () use ($blokir, $validated) {
            $blokir->update($validated);
        });

        return redirect()->route('blokirs.index')
            ->with('success', 'Blokir berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Blokir $blokir)
    {
        DB::transaction(function () use ($blokir) {
            $blokir->delete();
        });

        return redirect()->route('blokirs.index')
            ->with('success', 'Blokir berhasil dihapus');
    }

    /**
     * PDF generation
     */
    public function generatePdf(Blokir $blokir)
    {
        $blokir->load([
            'kartuInstruksiKerja.salesOrder.customerAddress',
            'kartuInstruksiKerja.salesOrder.finishGoodItem',
            'kartuInstruksiKerja.kartuInstruksiKerjaBoms.billOfMaterials.masterItem.unit'
        ]);

        return response()->json($blokir);
    }
}
