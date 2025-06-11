<?php

namespace App\Http\Controllers;

use App\Models\ReturEksternal;
use Illuminate\Http\Request;
use App\Models\PenerimaanBarang;
use App\Models\ReturEksternalItem;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReturEksternalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $returEksternal = ReturEksternal::with([
            'penerimaanBarang.purchaseOrder.supplier',
            'items.penerimaanBarangItem.purchaseOrderItem.masterItem',
            'items.penerimaanBarangItem.purchaseOrderItem.satuan'
        ])
        ->orderBy('created_at', 'desc')
        ->get();

        return Inertia::render('returEksternal/returEksternals', [
            'returEksternal' => $returEksternal
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $penerimaanBarangs = PenerimaanBarang::with([
            'purchaseOrder.supplier',
            'items.purchaseOrderItem.masterItem',
            'items.purchaseOrderItem.satuan'
        ])->get();

        return Inertia::render('returEksternal/create', [
            'penerimaanBarangs' => $penerimaanBarangs
        ]);
    }

    /**
     * Get penerimaan barang details for dropdown selection
     */
    public function getPenerimaanBarangDetails($id)
    {
        try {
            $penerimaanBarang = PenerimaanBarang::with([
                'purchaseOrder.supplier',
                'items.purchaseOrderItem.masterItem',
                'items.purchaseOrderItem.satuan'
            ])->findOrFail($id);

            return response()->json($penerimaanBarang);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch data: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_penerimaan_barang' => 'required|exists:penerimaan_barangs,id',
            'tgl_retur_barang' => 'required|date',
            'nama_retur' => 'required|string|max:255',
            'catatan_retur' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.id_penerimaan_barang_item' => 'required|exists:penerimaan_barang_items,id',
            'items.*.qty_retur' => 'required|numeric|min:0.01',
            'items.*.catatan_retur_item' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            // ✅ TAMBAH: Generate nomor retur otomatis
            $noRetur = ReturEksternal::generateNoRetur();

            // Create Retur Eksternal record
            $returEksternal = ReturEksternal::create([
                'id_penerimaan_barang' => $request->id_penerimaan_barang,
                'no_retur' => $noRetur, // ✅ Auto-generated
                'tgl_retur_barang' => $request->tgl_retur_barang,
                'nama_retur' => $request->nama_retur,
                'catatan_retur' => $request->catatan_retur,
            ]);

            // Create Retur Eksternal Items
            foreach ($request->items as $item) {
                if (isset($item['qty_retur']) && $item['qty_retur'] > 0) {
                    ReturEksternalItem::create([
                        'id_retur_eksternal' => $returEksternal->id,
                        'id_penerimaan_barang_item' => $item['id_penerimaan_barang_item'],
                        'qty_retur' => $item['qty_retur'],
                        'catatan_retur_item' => $item['catatan_retur_item'] ?? null,
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('returEksternals.index')
                ->with('success', 'Retur eksternal berhasil disimpan dengan nomor: ' . $noRetur);
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
        $returEksternal = ReturEksternal::with([
            'penerimaanBarang.purchaseOrder.supplier',
            'items.penerimaanBarangItem.purchaseOrderItem.masterItem',
            'items.penerimaanBarangItem.purchaseOrderItem.satuan'
        ])->findOrFail($id);

        return Inertia::render('returEksternal/show', [
            'returEksternal' => $returEksternal
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        // Load retur eksternal dengan semua relasi
        $returEksternal = ReturEksternal::with([
            'penerimaanBarang.purchaseOrder.supplier',
            'penerimaanBarang.items.purchaseOrderItem.masterItem',
            'penerimaanBarang.items.purchaseOrderItem.satuan',
            'items.penerimaanBarangItem.purchaseOrderItem.masterItem',
            'items.penerimaanBarangItem.purchaseOrderItem.satuan'
        ])->findOrFail($id);

        // Load semua penerimaan barang untuk dropdown
        $penerimaanBarangs = PenerimaanBarang::with([
            'purchaseOrder.supplier',
            'items.purchaseOrderItem.masterItem',
            'items.purchaseOrderItem.satuan'
        ])->get();

        return Inertia::render('returEksternal/edit', [
            'returEksternal' => $returEksternal,
            'penerimaanBarangs' => $penerimaanBarangs
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'id_penerimaan_barang' => 'required|exists:penerimaan_barangs,id',
            'tgl_retur_barang' => 'required|date',
            'nama_retur' => 'required|string|max:255',
            'catatan_retur' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.id_penerimaan_barang_item' => 'required|exists:penerimaan_barang_items,id',
            'items.*.qty_retur' => 'required|numeric|min:0',
            'items.*.catatan_retur_item' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $returEksternal = ReturEksternal::findOrFail($id);

            // Update Retur Eksternal record (tanpa mengubah no_retur)
            $returEksternal->update([
                'id_penerimaan_barang' => $request->id_penerimaan_barang,
                'tgl_retur_barang' => $request->tgl_retur_barang,
                'nama_retur' => $request->nama_retur,
                'catatan_retur' => $request->catatan_retur,
            ]);

            // Delete existing items
            $returEksternal->items()->delete();

            // Create new items
            foreach ($request->items as $item) {
                if (isset($item['qty_retur']) && $item['qty_retur'] > 0) {
                    ReturEksternalItem::create([
                        'id_retur_eksternal' => $returEksternal->id,
                        'id_penerimaan_barang_item' => $item['id_penerimaan_barang_item'],
                        'qty_retur' => $item['qty_retur'],
                        'catatan_retur_item' => $item['catatan_retur_item'] ?? null,
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('returEksternals.index')
                ->with('success', 'Retur eksternal berhasil diupdate.');
        } catch (\Exception $e) {
            DB::rollback();

            return redirect()->back()
                ->withInput()
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

            $returEksternal = ReturEksternal::findOrFail($id);

            // Delete all related items first
            $returEksternal->items()->delete();

            // Then delete the main record
            $returEksternal->delete();

            DB::commit();

            return redirect()->route('returEksternals.index')
                ->with('success', 'Retur eksternal berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollback();

            return redirect()->back()
                ->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    /**
     * Generate PDF for retur eksternal
     */
    public function generatePdf($id)
    {
        try {
            $returEksternal = ReturEksternal::with([
                'penerimaanBarang.purchaseOrder.supplier',
                'items.penerimaanBarangItem.purchaseOrderItem.masterItem',
                'items.penerimaanBarangItem.purchaseOrderItem.satuan'
            ])->findOrFail($id);

            return response()->json($returEksternal);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to generate PDF: ' . $e->getMessage()], 500);
        }
    }
}
