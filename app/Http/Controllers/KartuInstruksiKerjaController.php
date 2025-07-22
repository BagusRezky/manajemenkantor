<?php

namespace App\Http\Controllers;

use App\Models\KartuInstruksiKerja;
use App\Models\SalesOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;


class KartuInstruksiKerjaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $kartuInstruksiKerja = KartuInstruksiKerja::with(['salesOrder.finishGoodItem', 'salesOrder.customerAddress', 'kartuInstruksiKerjaBoms', 'kartuInstruksiKerjaBoms.billOfMaterials', 'packagings',
        'suratJalans'])->get();

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
            ->with('success', 'Surat Perintah Kerja berhasil dibuat!');
    }

    /**
     * Method untuk menghitung total kebutuhan
     * Method ini tidak dipanggil langsung, hanya untuk referensi perhitungan di backend
     */

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $kartuInstruksiKerja = KartuInstruksiKerja::with([
            'salesOrder.customerAddress',
            'salesOrder.finishGoodItem',
            'kartuInstruksiKerjaBoms.billOfMaterials.masterItem.unit',
            'kartuInstruksiKerjaBoms.billOfMaterials.departemen',
            'printings.mesin',
            'printings.operator',
            'dieMakings.mesinDiemaking',
            'dieMakings.operatorDiemaking',
            'finishings.mesinFinishing',
            'finishings.operatorFinishing',
            'packagings',
            'suratJalans'
        ])->findOrFail($id);

        return Inertia::render('kartuInstruksiKerja/show', [
            'kartuInstruksiKerja' => $kartuInstruksiKerja
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $kartuInstruksiKerja = KartuInstruksiKerja::with([
            'salesOrder.finishGoodItem.billOfMaterials.masterItem.unit',
            'salesOrder.finishGoodItem.billOfMaterials.departemen',
            'salesOrder.customerAddress',
            'kartuInstruksiKerjaBoms.billOfMaterials.masterItem.unit',
            'kartuInstruksiKerjaBoms.billOfMaterials.departemen'
        ])->findOrFail($id);

        $salesOrders = SalesOrder::with([
            'finishGoodItem.billOfMaterials.masterItem.unit',
            'finishGoodItem.billOfMaterials.departemen',
            'customerAddress'
        ])
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

        // Debug untuk melihat data yang diterima
        Log::info('Update Request data:', $request->all());

        $validated = $request->validate([
            'id_sales_order' => 'required|exists:sales_orders,id',
            'no_kartu_instruksi_kerja' => 'required|string|unique:kartu_instruksi_kerjas,no_kartu_instruksi_kerja,' . $id,
            'production_plan' => 'required|string',
            'tgl_estimasi_selesai' => 'required|date',
            'bill_of_materials' => 'nullable|array',
            'bill_of_materials.*.id' => 'required_with:bill_of_materials|exists:bill_of_materials,id',
            'bill_of_materials.*.waste' => 'required_with:bill_of_materials',
            'bill_of_materials.*.total_kebutuhan' => 'required_with:bill_of_materials|numeric',
            'bill_of_materials.*.jumlah_sheet_cetak' => 'nullable|integer',
            'bill_of_materials.*.jumlah_total_sheet_cetak' => 'nullable|integer',
            'bill_of_materials.*.jumlah_produksi' => 'nullable|integer',
        ]);

        $validated['no_kartu_instruksi_kerja'] = strtoupper($validated['no_kartu_instruksi_kerja']);

        // Update KIK basic data
        $kartuInstruksiKerja->update([
            'id_sales_order' => $validated['id_sales_order'],
            'no_kartu_instruksi_kerja' => $validated['no_kartu_instruksi_kerja'],
            'production_plan' => $validated['production_plan'],
            'tgl_estimasi_selesai' => $validated['tgl_estimasi_selesai'],
        ]);

        // Update BOM data jika ada
        if (isset($validated['bill_of_materials']) && is_array($validated['bill_of_materials'])) {
            // Hapus data BOM lama
            $kartuInstruksiKerja->kartuInstruksiKerjaBoms()->delete();

            // Simpan data BOM baru
            foreach ($validated['bill_of_materials'] as $bomItem) {
                $kartuInstruksiKerja->kartuInstruksiKerjaBoms()->create([
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
            ->with('success', 'Surat Perintah Kerja berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $kartuInstruksiKerja = KartuInstruksiKerja::findOrFail($id);
        $kartuInstruksiKerja->delete();

        return redirect()->route('kartuInstruksiKerja.index')
            ->with('success', 'Surat Perintah Kerja berhasil dihapus!');
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

    public function generatePdf($id)
    {
        try {
            $kartuInstruksiKerja = KartuInstruksiKerja::with([
                'salesOrder' => function ($query) {
                    $query->with([
                        'customerAddress',
                        'finishGoodItem' => function ($subQuery) {
                            $subQuery->with([
                                'unit',
                                'customerAddress',
                                'typeItem',
                                'billOfMaterials' => function ($bomQuery) {
                                    $bomQuery->with([
                                        'masterItem.unit',
                                        'departemen'
                                    ]);
                                }
                            ]);
                        }
                    ]);
                },
                'kartuInstruksiKerjaBoms' => function ($query) {
                    $query->with([
                        'billOfMaterials' => function ($bomQuery) {
                            $bomQuery->with([
                                'departemen',
                                'masterItem.unit'
                            ]);
                        }
                    ]);
                }
            ])->findOrFail($id);

            // Add debug logging
            Log::info('KIK Data:', [
                'id' => $kartuInstruksiKerja->id,
                'boms_count' => $kartuInstruksiKerja->kartuInstruksiKerjaBoms->count(),
                'boms_data' => $kartuInstruksiKerja->kartuInstruksiKerjaBoms->toArray()
            ]);

            return response()->json($kartuInstruksiKerja);
        } catch (\Exception $e) {
            Log::error('Generate PDF Error:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Data tidak ditemukan',
                'error' => $e->getMessage()
            ], 404);
        }
    }
}
