<?php

namespace App\Http\Controllers;

use App\Models\KartuInstruksiKerja;
use App\Models\SalesOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;


class KartuInstruksiKerjaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $kartuInstruksiKerja = KartuInstruksiKerja::with(['salesOrder.finishGoodItem', 'salesOrder.customerAddress'])->get();

        return Inertia::render('kartuInstruksiKerja/kartuInstruksiKerja', [
            'kartuInstruksiKerja' => $kartuInstruksiKerja
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $salesOrders = SalesOrder::with('finishGoodItem')
            ->whereDoesntHave('kartuInstruksiKerja')
            ->get();

        return Inertia::render('kartuInstruksiKerja/create', [
            'salesOrders' => $salesOrders
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_sales_order' => 'required|exists:sales_orders,id',
            'no_kartu_instruksi_kerja' => 'required|string|unique:kartu_instruksi_kerjas',
            'production_plan' => 'required|string',
            'tgl_estimasi_selesai' => 'required|date',
            'spesifikasi_kertas' => 'nullable|string',
            'up_satu' => 'nullable|integer',
            'up_dua' => 'nullable|integer',
            'up_tiga' => 'nullable|integer',
            'ukuran_potong' => 'nullable|string',
            'ukuran_cetak' => 'nullable|string',
        ]);

        $validated['no_kartu_instruksi_kerja'] = strtoupper($validated['no_kartu_instruksi_kerja']);

        KartuInstruksiKerja::create($validated);

        return redirect()->route('kartuInstruksiKerja.index')
            ->with('success', 'Kartu Instruksi Kerja berhasil dibuat!');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $kartuInstruksiKerja = KartuInstruksiKerja::with(['salesOrder.finishGoodItem', 'salesOrder.customerAddress'])
            ->findOrFail($id);

        return Inertia::render('kartuInstruksiKerja/show', [
            'kartuInstruksiKerja' => $kartuInstruksiKerja
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $kartuInstruksiKerja = KartuInstruksiKerja::with(['salesOrder.finishGoodItem'])
            ->findOrFail($id);

        $salesOrders = SalesOrder::with('finishGoodItem')
            ->where('id', $kartuInstruksiKerja->id_sales_order)
            ->orWhereDoesntHave('kartuInstruksiKerja')
            ->get();

        return Inertia::render('kartuInstruksiKerja/edit', [
            'kartuInstruksiKerja' => $kartuInstruksiKerja,
            'salesOrders' => $salesOrders
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $kartuInstruksiKerja = KartuInstruksiKerja::findOrFail($id);

        $validated = $request->validate([
            'id_sales_order' => 'required|exists:sales_orders,id',
            'no_kartu_instruksi_kerja' => 'required|string|unique:kartu_instruksi_kerja,no_kartu_instruksi_kerjas,'.$id,
            'production_plan' => 'required|string',
            'tgl_estimasi_selesai' => 'required|date',
            'spesifikasi_kertas' => 'nullable|string',
            'up_satu' => 'nullable|integer',
            'up_dua' => 'nullable|integer',
            'up_tiga' => 'nullable|integer',
            'ukuran_potong' => 'nullable|string',
            'ukuran_cetak' => 'nullable|string',
        ]);

        $validated['no_kartu_instruksi_kerja'] = strtoupper($validated['no_kartu_instruksi_kerja']);

        $kartuInstruksiKerja->update($validated);

        return redirect()->route('kartuInstruksiKerja.index')
            ->with('success', 'Kartu Instruksi Kerja berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $kartuInstruksiKerja = KartuInstruksiKerja::findOrFail($id);
        $kartuInstruksiKerja->delete();

        return redirect()->route('kartuInstruksiKerja.index')
            ->with('success', 'Kartu Instruksi Kerja berhasil dihapus!');
    }

    /**
     * Get FinishGoodItem data based on selected SalesOrder
     */
    public function getSalesOrderData($id)
    {
        $salesOrder = SalesOrder::with('finishGoodItem')->find($id);

        if (!$salesOrder) {
            return response()->json(['error' => 'Sales Order tidak ditemukan'], 404);
        }

        return response()->json([
            'finish_good_item' => $salesOrder->finishGoodItem
        ]);
    }
}
