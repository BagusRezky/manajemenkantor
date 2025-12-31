<?php

namespace App\Http\Controllers;

use App\Models\MasterItem;
use App\Models\PenerimaanBarangItem;
use App\Models\ReturEksternalItem;
use App\Models\ReturInternalItem;
use App\Models\InternalMaterialRequestItem;
use App\Models\ImrDiemakingItem;
use App\Models\ImrFinishingItem;
use App\Models\KartuInstruksiKerjaBom;
use Inertia\Inertia;

class MaterialStockController extends Controller
{
    /**
     * Display a listing of the material stock.
     */
    public function index()
    {
        // Ambil data master item
        $materialStocks = MasterItem::with([
            'typeItem',
            'unit',
            'categoryItem'
        ])
            ->select([
                'id',
                'kode_master_item',
                'nama_master_item',
                'id_type_item',
                'satuan_satu_id',
                'min_stock',
                'min_order'
            ])
            ->get()
            ->map(function ($item) {
                // 1. Calculate Onhand (Logic: Terima - IMR Approved + Retur Internal - Retur External)
                $onhandStock = $this->calculateOnhandStock($item->id);

                // 2. Calculate Outstanding (Logic: Kebutuhan BOM - IMR Approved)
                $outstandingStock = $this->calculateOutstandingStock($item->id);

                // 3. Calculate Allocation (Logic: Onhand - Outstanding)
                // Sesuai request Anda: Allocation adalah sisa stok setelah dikurangi kebutuhan outstanding
                $allocationStock = $onhandStock - $outstandingStock;

                return [
                    'id' => $item->id,
                    'kode_master_item' => $item->kode_master_item,
                    'nama_master_item' => $item->nama_master_item,
                    'nama_type_barang' => $item->typeItem->nama_type_item ?? '-',
                    'satuan' => $item->unit->nama_satuan ?? '-',
                    'min_stock' => $item->min_stock ?? 0,
                    'min_order' => $item->min_order ?? 0,
                    'onhand_stock' => $onhandStock,
                    'outstanding_stock' => $outstandingStock,
                    'allocation_stock' => $allocationStock,
                    // available_stock saya samakan dengan allocation jika frontend butuh field ini
                    'available_stock' => $allocationStock,
                    'status' => $this->getStockStatus($onhandStock, $item->min_stock ?? 0),
                ];
            });

        return Inertia::render('materialStock/materialStocks', [
            'materialStocks' => $materialStocks
        ]);
    }

    /**
     * LOGIC: Onhand = Total Penerimaan - Total IMR Approved + Retur Internal - Retur External
     */
    private function calculateOnhandStock($masterItemId): float
    {
        // 1. (+) Total Penerimaan dari Supplier (LPB)
        $totalReceived = PenerimaanBarangItem::whereHas('purchaseOrderItem', function ($query) use ($masterItemId) {
            $query->where('id_master_item', $masterItemId);
        })->sum('qty_penerimaan');

        // 2. (+) Total Retur Internal (Masuk kembali ke Gudang dari Produksi)
        // Cek dari 3 jenis item retur (Regular, Diemaking, Finishing) yang mengarah ke MasterItem ini
        $returInternalRegular = ReturInternalItem::whereHas('imrItem.kartuInstruksiKerjaBom.billOfMaterials', function ($q) use ($masterItemId) {
            $q->where('id_master_item', $masterItemId);
        })->sum('qty_approved_retur');

        $returInternalDiemaking = ReturInternalItem::whereHas('imrDiemakingItem.kartuInstruksiKerjaBom.billOfMaterials', function ($q) use ($masterItemId) {
            $q->where('id_master_item', $masterItemId);
        })->sum('qty_approved_retur');

        $returInternalFinishing = ReturInternalItem::whereHas('imrFinishingItem.kartuInstruksiKerjaBom.billOfMaterials', function ($q) use ($masterItemId) {
            $q->where('id_master_item', $masterItemId);
        })->sum('qty_approved_retur');

        $totalReturInternal = $returInternalRegular + $returInternalDiemaking + $returInternalFinishing;

        // 3. (-) Total Retur Eksternal (Keluar ke Supplier)
        $totalReturExternal = ReturEksternalItem::whereHas('penerimaanBarangItem.purchaseOrderItem', function ($query) use ($masterItemId) {
            $query->where('id_master_item', $masterItemId);
        })->sum('qty_retur');

        // 4. (-) Total IMR Approved (Keluar ke Produksi)
        $imrApproved = InternalMaterialRequestItem::whereHas('kartuInstruksiKerjaBom.billOfMaterials', function ($query) use ($masterItemId) {
            $query->where('id_master_item', $masterItemId);
        })->sum('qty_approved');

        $imrDiemakingApproved = ImrDiemakingItem::whereHas('kartuInstruksiKerjaBom.billOfMaterials', function ($query) use ($masterItemId) {
            $query->where('id_master_item', $masterItemId);
        })->sum('qty_approved');

        $imrFinishingApproved = ImrFinishingItem::whereHas('kartuInstruksiKerjaBom.billOfMaterials', function ($query) use ($masterItemId) {
            $query->where('id_master_item', $masterItemId);
        })->sum('qty_approved');

        $totalImrApproved = $imrApproved + $imrDiemakingApproved + $imrFinishingApproved;

        // Formula Akhir
        return ($totalReceived + $totalReturInternal) - ($totalReturExternal + $totalImrApproved);
    }

    /**
     * LOGIC: Outstanding = Total Kebutuhan BOM - Total IMR Approved
     */
    private function calculateOutstandingStock($masterItemId): float
    {
        // Ambil semua KIK BOM yang menggunakan master item ini
        // Kita gunakan withSum untuk efisiensi query mengambil total approved per KIK BOM
        $kikBoms = KartuInstruksiKerjaBom::whereHas('billOfMaterials', function ($query) use ($masterItemId) {
            $query->where('id_master_item', $masterItemId);
        })
        ->withSum('internalMaterialRequestItems', 'qty_approved')
        ->withSum('imrDiemakingItems', 'qty_approved')
        ->withSum('imrFinishingItems', 'qty_approved')
        ->get();

        $totalKebutuhanBOM = $kikBoms->sum('total_kebutuhan');

        $totalSudahDipenuhi = $kikBoms->sum(function($bom) {
            return $bom->internal_material_request_items_sum_qty_approved +
                   $bom->imr_diemaking_items_sum_qty_approved +
                   $bom->imr_finishing_items_sum_qty_approved;
        });

        // Outstanding adalah sisa yang belum diberikan
        // Jika hasil negatif (artinya approved > kebutuhan), kita anggap 0 outstandingnya
        return max(0, $totalKebutuhanBOM - $totalSudahDipenuhi);
    }

    /**
     * Get stock status based on min_stock
     */
    private function getStockStatus($currentStock, $minStock): string
    {
        if ($currentStock <= 0) {
            return 'out_of_stock';
        } elseif ($currentStock <= $minStock) {
            return 'low_stock';
        } else {
            return 'normal';
        }
    }

    /**
     * API endpoint untuk mendapatkan stock summary (Dashboard/Chart)
     */
    public function getStockSummary()
    {
        try {
            $totalItems = MasterItem::count();

            $stockSummary = MasterItem::select(['id', 'min_stock'])
                ->get()
                ->map(function ($item) {
                    $onhandStock = $this->calculateOnhandStock($item->id);
                    return [
                        'onhand_stock' => $onhandStock,
                        'status' => $this->getStockStatus($onhandStock, $item->min_stock ?? 0),
                    ];
                });

            $summary = [
                'total_items' => $totalItems,
                'normal_stock' => $stockSummary->where('status', 'normal')->count(),
                'low_stock' => $stockSummary->where('status', 'low_stock')->count(),
                'out_of_stock' => $stockSummary->where('status', 'out_of_stock')->count(),
                'total_onhand_value' => $stockSummary->sum('onhand_stock'),
            ];

            return response()->json($summary);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to get stock summary: ' . $e->getMessage()], 500);
        }
    }

    /**
     * API Endpoint: Get detailed stock breakdown by request type
     */
    public function getStockBreakdown($masterItemId)
    {
        try {
            $onhand = $this->calculateOnhandStock($masterItemId);
            $outstanding = $this->calculateOutstandingStock($masterItemId);
            $allocation = $onhand - $outstanding;

            // Untuk detail outstanding per tipe, kita hitung manual proporsinya
            // (Ini estimasi karena outstanding logic baru berbasis BOM global)
            $breakdown = [
                'onhand_stock' => $onhand,
                'outstanding_stock' => [
                    'total' => $outstanding,
                    // Note: Detail per tipe (IMR/Die/Finish) agak bias di logic baru karena basisnya BOM,
                    // tapi kita set totalnya valid.
                ],
                'allocation_stock' => [
                    'total' => $allocation,
                ],
                'available_stock' => $allocation
            ];

            return response()->json($breakdown);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to get stock breakdown: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get detailed stock transactions for a specific material (History)
     * Updated to include Retur Internal
     */
    private function getStockTransactions($masterItemId): array
    {
        // 1. Penerimaan barang (IN)
        $received = PenerimaanBarangItem::with([
            'penerimaanBarang:id,no_laporan_barang,tgl_terima_barang'
        ])
            ->whereHas('purchaseOrderItem', function ($query) use ($masterItemId) {
                $query->where('id_master_item', $masterItemId);
            })
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'type' => 'received',
                    'qty' => $item->qty_penerimaan,
                    'date' => $item->created_at,
                    'reference' => $item->penerimaanBarang->no_laporan_barang ?? '-',
                    'reference_date' => $item->penerimaanBarang->tgl_terima_barang ?? null,
                ];
            });

        // 2. Retur Internal (IN) - NEW
        $returInternal = ReturInternalItem::with(['returInternal'])
            ->where(function($q) use ($masterItemId) {
                $q->whereHas('imrItem.kartuInstruksiKerjaBom.billOfMaterials', fn($qi) => $qi->where('id_master_item', $masterItemId))
                  ->orWhereHas('imrDiemakingItem.kartuInstruksiKerjaBom.billOfMaterials', fn($qd) => $qd->where('id_master_item', $masterItemId))
                  ->orWhereHas('imrFinishingItem.kartuInstruksiKerjaBom.billOfMaterials', fn($qf) => $qf->where('id_master_item', $masterItemId));
            })
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'type' => 'retur_internal',
                    'qty' => $item->qty_approved_retur,
                    'date' => $item->created_at,
                    'reference' => $item->returInternal->no_retur_internal ?? '-',
                    'reference_date' => $item->returInternal->tgl_retur_internal ?? null,
                ];
            });

        // 3. Retur Eksternal (OUT)
        $returnedExternal = ReturEksternalItem::with([
            'returEksternal:id,no_retur,tgl_retur_barang'
        ])
            ->whereHas('penerimaanBarangItem.purchaseOrderItem', function ($query) use ($masterItemId) {
                $query->where('id_master_item', $masterItemId);
            })
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'type' => 'returned_external',
                    'qty' => -$item->qty_retur, // negative for OUT
                    'date' => $item->created_at,
                    'reference' => $item->returEksternal->no_retur ?? '-',
                    'reference_date' => $item->returEksternal->tgl_retur_barang ?? null,
                ];
            });

        // 4. Usage / IMR Approved (OUT)
        // Kita ambil yang statusnya approved saja karena logic onhand sekarang based on approved
        $usageImr = InternalMaterialRequestItem::with(['internalMaterialRequest'])
            ->whereHas('kartuInstruksiKerjaBom.billOfMaterials', fn($q) => $q->where('id_master_item', $masterItemId))
            ->where('qty_approved', '>', 0)
            ->get()
            ->map(function($item) {
                return [
                    'id' => $item->id,
                    'type' => 'usage_production',
                    'qty' => -$item->qty_approved, // negative for OUT
                    'date' => $item->updated_at, // usually approval time
                    'reference' => $item->internalMaterialRequest->no_imr ?? '-',
                ];
            });

        // Gabungkan semua
        $allTransactions = collect()
            ->merge($received)
            ->merge($returInternal)
            ->merge($returnedExternal)
            ->merge($usageImr)
            ->sortByDesc('date')
            ->values()
            ->all();

        return [
            'all' => $allTransactions
        ];
    }
}
