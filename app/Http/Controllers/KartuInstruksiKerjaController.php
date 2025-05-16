<?php

namespace App\Http\Controllers;

use App\Models\KartuInstruksiKerja;
use App\Models\SalesOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\BillOfMaterial;
use Illuminate\Http\JsonResponse;
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
        $salesOrders = SalesOrder::with(
            'finishGoodItem',
            'customerAddress',
            'finishGoodItem.billOfMaterials.masterItem',
            'finishGoodItem.billOfMaterials.departemen',
            'finishGoodItem.billOfMaterials.masterItem.unit'
        )
            ->whereDoesntHave('kartuInstruksiKerja')
            ->get();

        $currentYear = date('Y');
        $latestKikId = KartuInstruksiKerja::whereYear('created_at', $currentYear)
            ->count() + 1;

        return Inertia::render('kartuInstruksiKerja/create', [
            'salesOrders' => $salesOrders,
            'latestKikId' => $latestKikId
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    // Debug untuk melihat data yang diterima
    Log::info('Request data:', $request->all());

    $validated = $request->validate([
        'id_sales_order' => 'required|exists:sales_orders,id',
        'no_kartu_instruksi_kerja' => 'required|string|unique:kartu_instruksi_kerjas',
        'production_plan' => 'required|string',
        'tgl_estimasi_selesai' => 'required|date',
        'bill_of_materials' => 'required|array',
        'bill_of_materials.*.id' => 'required|exists:bill_of_materials,id',
        'bill_of_materials.*.waste' => 'required',
        'bill_of_materials.*.total_kebutuhan' => 'required|numeric',
        'bill_of_materials.*.jumlah_sheet_cetak' => 'nullable|integer',
        'bill_of_materials.*.jumlah_total_sheet_cetak' => 'nullable|integer',
        'bill_of_materials.*.jumlah_produksi' => 'nullable|integer',
    ]);

    $validated['no_kartu_instruksi_kerja'] = strtoupper($validated['no_kartu_instruksi_kerja']);

    // Buat KIK
    $kik = KartuInstruksiKerja::create([
        'id_sales_order' => $validated['id_sales_order'],
        'no_kartu_instruksi_kerja' => $validated['no_kartu_instruksi_kerja'],
        'production_plan' => $validated['production_plan'],
        'tgl_estimasi_selesai' => $validated['tgl_estimasi_selesai'],
        'tgl_cetak' => now(),
        'status' => 'draft',
    ]);

    // Debug untuk memastikan $validated['bill_of_materials'] ada dan berisi data
    Log::info('Bill of Materials data:', $validated['bill_of_materials'] ?? []);

    // Simpan data BOM
    if (isset($validated['bill_of_materials']) && is_array($validated['bill_of_materials'])) {
        foreach ($validated['bill_of_materials'] as $bomItem) {
            $kik->kartuInstruksiKerjaBoms()->create([
                'id_bom' => $bomItem['id'],
                'waste' => $bomItem['waste'],
                'total_kebutuhan' => $bomItem['total_kebutuhan'],
                'jumlah_sheet_cetak' => $bomItem['jumlah_sheet_cetak'] ?? null,
                'jumlah_total_sheet_cetak' => $bomItem['jumlah_total_sheet_cetak'] ?? null,
                'jumlah_produksi' => $bomItem['jumlah_produksi'] ?? null,
            ]);
        }
    }

    return redirect()->route('kartuInstruksiKerja.index')
        ->with('success', 'Kartu Instruksi Kerja berhasil dibuat!');
}

      /**
     * Method untuk menghitung total kebutuhan
     * Method ini tidak dipanggil langsung, hanya untuk referensi perhitungan di backend
     */
    private function hitungTotalKebutuhan($salesOrder, $bom)
    {
        $jumlahPesanan = (int)$salesOrder->jumlah_pesanan;
        $toleransi = (float)$salesOrder->toleransi_pengiriman / 100;
        $qty = (float)$bom->qty;

        // Cek apakah master item ini adalah SHEET
        $isSheet = $bom->masterItem->unit->nama_satuan == 'SHEET'; // Sesuaikan dengan nama satuan SHEET Anda

        if ($isSheet) {
            $finishGoodItem = $salesOrder->finishGoodItem;
            $totalUp = (int)($finishGoodItem->up_satu + $finishGoodItem->up_dua + $finishGoodItem->up_tiga);
            $ukuranPotong = (float)$finishGoodItem->ukuran_potong;
            $ukuranCetak = (float)$finishGoodItem->ukuran_cetak;

            // Formula untuk SHEET
            if ($totalUp > 0 && $ukuranPotong > 0 && $ukuranCetak > 0) {
                $kebutuhanDasar = $jumlahPesanan / $totalUp / ($ukuranPotong * $ukuranCetak);
                // Tambahkan waste
                $waste = (float)$bom->waste;
                $totalKebutuhan = $kebutuhanDasar + $waste;
            } else {
                $totalKebutuhan = 0;
            }
        } else {
            // Formula umum untuk non-SHEET
            $totalKebutuhan = $jumlahPesanan * $qty * (1 + $toleransi);
        }

        return round($totalKebutuhan);
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
            'no_kartu_instruksi_kerja' => 'required|string|unique:kartu_instruksi_kerja,no_kartu_instruksi_kerjas,' . $id,
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

    public function generatePDF($id): JsonResponse
    {
        try {
            $kartuInstruksiKerja = KartuInstruksiKerja::with([
                'salesOrder.finishGoodItem.unit',
                'salesOrder.customerAddress',
                'kartuInstruksiKerjaBoms.billOfMaterial.departemen',
                'kartuInstruksiKerjaBoms.billOfMaterial.masterItem.unit'
            ])->findOrFail($id);

            return response()->json($kartuInstruksiKerja);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Data not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }
}
