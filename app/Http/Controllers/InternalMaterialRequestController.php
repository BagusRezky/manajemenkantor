<?php

namespace App\Http\Controllers;

use App\Models\InternalMaterialRequest;
use Illuminate\Http\Request;
use App\Models\InternalMaterialRequestItem;
use App\Models\KartuInstruksiKerja;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class InternalMaterialRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $internalMaterialRequests = InternalMaterialRequest::with([
            'kartuInstruksiKerja.salesOrder',
            'items.kartuInstruksiKerjaBom.billOfMaterials.masterItem',
        ])
        ->orderBy('created_at', 'desc')
        ->get();

        return Inertia::render('internalMaterialRequest/internalMaterialRequests', [
            'internalMaterialRequests' => $internalMaterialRequests
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $kartuInstruksiKerjas = KartuInstruksiKerja::with([
            'salesOrder',
            'kartuInstruksiKerjaBoms.billOfMaterials.masterItem'
        ])->get();

        // Generate nomor IMR untuk preview
        $nextNoImr = InternalMaterialRequest::generateNoImr();

        return Inertia::render('internalMaterialRequest/create', [
            'kartuInstruksiKerjas' => $kartuInstruksiKerjas,
            'nextNoImr' => $nextNoImr
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    // Log semua data yang masuk
    Log::info('=== IMR Store Start ===');
    Log::info('Request data:', $request->all());

    $request->validate([
        'id_kartu_instruksi_kerja' => 'required|exists:kartu_instruksi_kerjas,id',
        'tgl_request' => 'required|date',
        'items' => 'required|array|min:1',
        'items.*.id_kartu_instruksi_kerja_bom' => 'required|exists:kartu_instruksi_kerja_boms,id',
        'items.*.qty_request' => 'required|numeric|min:0.01',
    ]);

    Log::info('Validation passed');

    try {
        DB::beginTransaction();
        Log::info('Transaction started');

        // Generate nomor IMR otomatis
        Log::info('Generating IMR number...');
        $noImr = InternalMaterialRequest::generateNoImr();
        Log::info('Generated IMR number:', ['no_imr' => $noImr]);

        // Create Internal Material Request record
        Log::info('Creating IMR record...');
        $imrData = [
            'id_kartu_instruksi_kerja' => $request->id_kartu_instruksi_kerja,
            'no_imr' => $noImr,
            'tgl_request' => $request->tgl_request,
            'status' => 'pending',
        ];
        Log::info('IMR data to create:', $imrData);

        $imr = InternalMaterialRequest::create($imrData);
        Log::info('IMR created successfully:', ['id' => $imr->id]);

        // Create Internal Material Request Items
        Log::info('Creating IMR items...');
        foreach ($request->items as $index => $item) {
            if (isset($item['qty_request']) && $item['qty_request'] > 0) {
                Log::info("Creating item {$index}:", $item);

                $itemData = [
                    'id_imr' => $imr->id,
                    'id_kartu_instruksi_kerja_bom' => $item['id_kartu_instruksi_kerja_bom'],
                    'qty_request' => $item['qty_request'],
                    'qty_approved' => 0,
                ];
                Log::info("Item data to create:", $itemData);

                $createdItem = InternalMaterialRequestItem::create($itemData);
                Log::info("Item created successfully:", ['id' => $createdItem->id]);
            }
        }

        DB::commit();
        Log::info('Transaction committed successfully');
        Log::info('=== IMR Store Success ===');

        return redirect()->route('internalMaterialRequests.index')
            ->with('success', 'Internal Material Request berhasil disimpan dengan nomor: ' . $noImr);

    } catch (\Exception $e) {
        DB::rollback();
        Log::error('=== IMR Store Error ===');
        Log::error('Error message:', ['message' => $e->getMessage()]);
        Log::error('Error trace:', ['trace' => $e->getTraceAsString()]);
        Log::error('Error file:', ['file' => $e->getFile(), 'line' => $e->getLine()]);

        return redirect()->back()
            ->withInput()
            ->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
    }
}

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $imr = InternalMaterialRequest::with([
            'kartuInstruksiKerja.salesOrder',
            'items.kartuInstruksiKerjaBom.billOfMaterials.masterItem',
        ])->findOrFail($id);

        return Inertia::render('internalMaterialRequest/show', [
            'internalMaterialRequest' => $imr
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $imr = InternalMaterialRequest::with([
            'kartuInstruksiKerja.salesOrder',
            'kartuInstruksiKerja.kartuInstruksiKerjaBoms.billOfMaterials.masterItem',
            'items.kartuInstruksiKerjaBom.billOfMaterials.masterItem',
        ])->findOrFail($id);

        $kartuInstruksiKerjas = KartuInstruksiKerja::with([
            'salesOrder',
            'kartuInstruksiKerjaBoms.billOfMaterials.masterItem'
        ])->get();

        return Inertia::render('internalMaterialRequest/edit', [
            'internalMaterialRequest' => $imr,
            'kartuInstruksiKerjas' => $kartuInstruksiKerjas
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'id_kartu_instruksi_kerja' => 'required|exists:kartu_instruksi_kerjas,id',
            'tgl_request' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.id_kartu_instruksi_kerja_bom' => 'required|exists:kartu_instruksi_kerja_boms,id',
            'items.*.qty_request' => 'required|numeric|min:0',
        ]);

        try {
            DB::beginTransaction();

            $imr = InternalMaterialRequest::findOrFail($id);

            // Update IMR record (tanpa mengubah no_imr dan status)
            $imr->update([
                'id_kartu_instruksi_kerja' => $request->id_kartu_instruksi_kerja,
                'tgl_request' => $request->tgl_request,
            ]);

            // Delete existing items
            $imr->items()->delete();

            // Create new items
            foreach ($request->items as $item) {
                if (isset($item['qty_request']) && $item['qty_request'] > 0) {
                    InternalMaterialRequestItem::create([
                        'id_imr' => $imr->id, // ✅ Update field name
                        'id_kartu_instruksi_kerja_bom' => $item['id_kartu_instruksi_kerja_bom'],
                        'qty_request' => $item['qty_request'],
                        'qty_approved' => 0, // Reset approval saat update
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('internalMaterialRequests.index')
                ->with('success', 'Internal Material Request berhasil diupdate.');
        } catch (\Exception $e) {
            DB::rollback();

            return redirect()->back()
                ->withInput()
                ->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    /**
     * Show the approval form for the specified resource.
     */
    public function showApproval(string $id)
    {
        $imr = InternalMaterialRequest::with([
            'kartuInstruksiKerja.salesOrder',
            'items.kartuInstruksiKerjaBom.billOfMaterials.masterItem',
        ])->findOrFail($id);

        // Only allow approval for pending requests
        if ($imr->status !== 'pending') {
            return redirect()->route('internalMaterialRequests.index')
                ->with('error', 'IMR ini sudah tidak bisa diapprove.');
        }

        return Inertia::render('internalMaterialRequest/approve', [
            'internalMaterialRequest' => $imr
        ]);
    }

    /**
     * Approve items in the IMR
     */
    public function approve(Request $request, string $id)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:internal_material_request_items,id',
            'items.*.qty_approved' => 'required|numeric|min:0',
        ]);

        try {
            DB::beginTransaction();

            $imr = InternalMaterialRequest::findOrFail($id);

            // Update approved quantities
            foreach ($request->items as $itemData) {
                $item = InternalMaterialRequestItem::findOrFail($itemData['id']);
                $item->update([
                    'qty_approved' => $itemData['qty_approved']
                ]);
            }

            // Update IMR status to approved
            $imr->update(['status' => 'approved']);

            DB::commit();

            return redirect()->route('internalMaterialRequests.index')
                ->with('success', 'Internal Material Request berhasil diapprove.');
        } catch (\Exception $e) {
            DB::rollback();

            return redirect()->back()
                ->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            DB::beginTransaction();

            $imr = InternalMaterialRequest::findOrFail($id);

            // Delete all related items first
            $imr->items()->delete();

            // Then delete the main record
            $imr->delete();

            DB::commit();

            return redirect()->route('internalMaterialRequests.index')
                ->with('success', 'Internal Material Request berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollback();

            return redirect()->back()
                ->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    /**
     * Generate PDF for IMR
     */
    public function generatePdf($id)
    {
        try {
            $imr = InternalMaterialRequest::with([
                'kartuInstruksiKerja.salesOrder',
                'items.kartuInstruksiKerjaBom.billOfMaterials.masterItem',
            ])->findOrFail($id);

            return response()->json($imr);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to generate PDF: ' . $e->getMessage()], 500);
        }
    }
}
