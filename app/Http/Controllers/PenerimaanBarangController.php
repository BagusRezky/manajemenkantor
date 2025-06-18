<?php

namespace App\Http\Controllers;

use App\Models\PenerimaanBarang;
use App\Models\PurchaseOrder;
use App\Models\PenerimaanBarangItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PenerimaanBarangController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Perbaiki eager loading
        $penerimaanBarang = PenerimaanBarang::with([
                'purchaseOrder.supplier',
                'items.purchaseOrderItem.masterItem',
                'items.purchaseOrderItem.satuan'
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('penerimaanBarang/penerimaanBarangs', [
            'penerimaanBarang' => $penerimaanBarang
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
{
    // Ubah dari purchaseOrderItems menjadi items
    $purchaseOrders = PurchaseOrder::with([
        'items.masterItem',     // ← Ubah dari purchaseOrderItems ke items
        'items.satuan',         // ← Ubah dari purchaseOrderItems ke items
        'supplier'
    ])->get();

    $previousReceipts = PenerimaanBarangItem::select(
            'id_purchase_order_item',
            DB::raw('SUM(qty_penerimaan) as total_qty_penerimaan')
        )
        ->groupBy('id_purchase_order_item')
        ->get();

    return Inertia::render('penerimaanBarang/create', [
        'purchaseOrders' => $purchaseOrders,
        'previousReceipts' => $previousReceipts
    ]);
}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_purchase_order' => 'required|exists:purchase_orders,id',
            'no_surat_jalan' => 'required|string|max:255',
            'tgl_terima_barang' => 'required|date',
            'nopol_kendaraan' => 'required|string|max:255',
            'nama_pengirim' => 'required|string|max:255',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:purchase_order_items,id', // Pastikan ini benar
            'items.*.qty_penerimaan' => 'required|numeric|min:0.01',
        ]);

        try {
            DB::beginTransaction();

            // Generate LPB number
            $latestLpb = PenerimaanBarang::latest()->first();
            $latestId = $latestLpb ? intval(substr($latestLpb->no_laporan_barang, 4, 5)) : 0;
            $nextId = str_pad($latestId + 1, 5, '0', STR_PAD_LEFT);
            $currentYearMonth = date('ym');
            $noLaporanBarang = "LPB-{$nextId}.{$currentYearMonth}";

            // Create Penerimaan Barang record
            $penerimaanBarang = PenerimaanBarang::create([
                'id_purchase_order' => $request->id_purchase_order,
                'no_laporan_barang' => $noLaporanBarang,
                'no_surat_jalan' => $request->no_surat_jalan,
                'tgl_terima_barang' => $request->tgl_terima_barang,
                'nopol_kendaraan' => $request->nopol_kendaraan,
                'nama_pengirim' => $request->nama_pengirim,
                'catatan_pengirim' => $request->catatan_pengirim,
            ]);

            // Create Penerimaan Barang Items
            foreach ($request->items as $item) {
                PenerimaanBarangItem::create([
                    'id_penerimaan_barang' => $penerimaanBarang->id,
                    'id_purchase_order_item' => $item['id'], // Ubah ini dari id_purchase_order_item menjadi id
                    'qty_penerimaan' => $item['qty_penerimaan'],
                    'catatan_item' => $item['catatan_item'] ?? null,
                    'tgl_expired' => $item['tgl_expired'] ?? null,
                    'no_delivery_order' => $item['no_delivery_order'] ?? null,
                ]);
            }

            DB::commit();

            return redirect()->route('penerimaanBarangs.index')
                ->with('success', 'Penerimaan barang berhasil disimpan.');
        } catch (\Exception $e) {
            DB::rollback();

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
        // Load penerimaan barang dengan semua relasi yang dibutuhkan
        $penerimaanBarang = PenerimaanBarang::with([
            'purchaseOrder.supplier',
            'items.purchaseOrderItem.masterItem',
            'items.purchaseOrderItem.satuan'
        ])->findOrFail($id);

        // Render halaman detail dengan data yang sudah di-load
        return Inertia::render('penerimaanBarang/show', [
            'penerimaanBarang' => $penerimaanBarang
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        // Editing functionality is not implemented as per requirements
        abort(404);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Update functionality is not implemented as per requirements
        abort(404);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            DB::beginTransaction();

            $penerimaanBarang = PenerimaanBarang::findOrFail($id);

            // Delete all related items first
            $penerimaanBarang->items()->delete();

            // Then delete the main record
            $penerimaanBarang->delete();

            DB::commit();

            return redirect()->route('penerimaanBarangs.index')
                ->with('success', 'Penerimaan barang berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollback();

            return redirect()->back()
                ->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function generatePdf($id): JsonResponse
    {
        try {
            $penerimaanBarang = PenerimaanBarang::with([
                'purchaseOrder.supplier',
                'items.purchaseOrderItem.masterItem',
                'items.purchaseOrderItem.satuan'
            ])->findOrFail($id);
            return response()->json($penerimaanBarang);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to generate PDF: ' . $e->getMessage()], 500);
        }

    }

}
