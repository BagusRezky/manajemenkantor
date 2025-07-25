<?php

namespace App\Http\Controllers;

use App\Models\MasterItem;
use App\Models\PenerimaanBarangItem;
use App\Models\ReturEksternalItem;
use App\Models\InternalMaterialRequestItem;
use App\Models\ImrDiemakingItem;
use App\Models\ImrFinishingItem;
use Inertia\Inertia;

class MaterialStockController extends Controller
{
    /**
     * Display a listing of the material stock.
     */
    public function index()
    {
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
                // Calculate stock metrics
                $onhandStock = $this->calculateOnhandStock($item->id);
                $outstandingStock = $this->calculateOutstandingStock($item->id);
                $allocationStock = $this->calculateAllocationStock($item->id);
                $availableStock = $onhandStock - $outstandingStock - $allocationStock;

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
                    'available_stock' => $availableStock,
                    'status' => $this->getStockStatus($onhandStock, $item->min_stock ?? 0),
                ];
            });

        return Inertia::render('materialStock/materialStocks', [
            'materialStocks' => $materialStocks
        ]);
    }

    /**
     * Calculate onhand stock (total received - total returned)
     */
    private function calculateOnhandStock($masterItemId): float
    {
        // Total penerimaan dari LPB
        $totalReceived = PenerimaanBarangItem::whereHas('purchaseOrderItem', function ($query) use ($masterItemId) {
            $query->where('id_master_item', $masterItemId);
        })->sum('qty_penerimaan');

        // Total retur eksternal
        $totalReturned = ReturEksternalItem::whereHas('penerimaanBarangItem.purchaseOrderItem', function ($query) use ($masterItemId) {
            $query->where('id_master_item', $masterItemId);
        })->sum('qty_retur');

        return $totalReceived - $totalReturned;
    }

    /**
     * Calculate outstanding stock (pending requests - belum disetujui)
     */
    private function calculateOutstandingStock($masterItemId): float
    {
        // Outstanding dari InternalMaterialRequestItem
        $imrOutstanding = InternalMaterialRequestItem::whereHas('kartuInstruksiKerjaBom.billOfMaterials', function ($query) use ($masterItemId) {
            $query->where('id_master_item', $masterItemId);
        })
            ->whereHas('internalMaterialRequest', function ($query) {
                $query->whereIn('status', ['pending', 'submitted', 'waiting_approval']);
            })
            ->sum('qty_request');

        // Outstanding dari ImrDiemakingItem
        $imrDiemakingOutstanding = ImrDiemakingItem::whereHas('kartuInstruksiKerjaBom.billOfMaterials', function ($query) use ($masterItemId) {
            $query->where('id_master_item', $masterItemId);
        })
            ->whereHas('internalMaterialRequest', function ($query) {
                $query->whereIn('status', ['pending', 'submitted', 'waiting_approval']);
            })
            ->sum('qty_request');

        // Outstanding dari ImrFinishingItem
        $imrFinishingOutstanding = ImrFinishingItem::whereHas('kartuInstruksiKerjaBom.billOfMaterials', function ($query) use ($masterItemId) {
            $query->where('id_master_item', $masterItemId);
        })
            ->whereHas('internalMaterialRequest', function ($query) {
                $query->whereIn('status', ['pending', 'submitted', 'waiting_approval']);
            })
            ->sum('qty_request');

        return $imrOutstanding + $imrDiemakingOutstanding + $imrFinishingOutstanding;
    }

    /**
     * Calculate allocation stock (approved requests - sudah dialokasikan)
     */
    private function calculateAllocationStock($masterItemId): float
    {
        // Allocation dari InternalMaterialRequestItem
        $imrAllocation = InternalMaterialRequestItem::whereHas('kartuInstruksiKerjaBom.billOfMaterials', function ($query) use ($masterItemId) {
            $query->where('id_master_item', $masterItemId);
        })
            ->whereHas('internalMaterialRequest', function ($query) {
                $query->where('status', 'approved');
            })
            ->sum('qty_approved');

        // Allocation dari ImrDiemakingItem
        $imrDiemakingAllocation = ImrDiemakingItem::whereHas('kartuInstruksiKerjaBom.billOfMaterials', function ($query) use ($masterItemId) {
            $query->where('id_master_item', $masterItemId);
        })
            ->whereHas('internalMaterialRequest', function ($query) {
                $query->where('status', 'approved');
            })
            ->sum('qty_approved');

        // Allocation dari ImrFinishingItem
        $imrFinishingAllocation = ImrFinishingItem::whereHas('kartuInstruksiKerjaBom.billOfMaterials', function ($query) use ($masterItemId) {
            $query->where('id_master_item', $masterItemId);
        })
            ->whereHas('internalMaterialRequest', function ($query) {
                $query->where('status', 'approved');
            })
            ->sum('qty_approved');

        return $imrAllocation + $imrDiemakingAllocation + $imrFinishingAllocation;
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
     * Get detailed stock transactions for a specific material
     */
    private function getStockTransactions($masterItemId): array
    {
        // Penerimaan barang (IN)
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

        // Retur barang (OUT)
        $returned = ReturEksternalItem::with([
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
                    'type' => 'returned',
                    'qty' => -$item->qty_retur, // negative untuk OUT
                    'date' => $item->created_at,
                    'reference' => $item->returEksternal->no_retur ?? '-',
                    'reference_date' => $item->returEksternal->tgl_retur_barang ?? null,
                ];
            });

        // Material requests dari InternalMaterialRequestItem (PENDING/APPROVED)
        $requestedImr = InternalMaterialRequestItem::with([
            'internalMaterialRequest:id,no_imr,tgl_request,status',
            'kartuInstruksiKerjaBom.kartuInstruksiKerja:id,no_kartu_instruksi_kerja'
        ])
            ->whereHas('kartuInstruksiKerjaBom.billOfMaterials', function ($query) use ($masterItemId) {
                $query->where('id_master_item', $masterItemId);
            })
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'type' => 'requested_imr',
                    'qty' => $item->qty_request,
                    'qty_approved' => $item->qty_approved ?? 0,
                    'date' => $item->created_at,
                    'reference' => $item->internalMaterialRequest->no_imr ?? '-',
                    'reference_date' => $item->internalMaterialRequest->tgl_request ?? null,
                    'status' => $item->internalMaterialRequest->status ?? 'pending',
                    'spk_no' => $item->kartuInstruksiKerjaBom->kartuInstruksiKerja->no_kartu_instruksi_kerja ?? '-',
                ];
            });

        // Material requests dari ImrDiemakingItem (PENDING/APPROVED)
        $requestedDiemaking = ImrDiemakingItem::with([
            'internalMaterialRequest:id,no_imr_diemaking,tgl_request,status',
            'kartuInstruksiKerjaBom.kartuInstruksiKerja:id,no_kartu_instruksi_kerja'
        ])
            ->whereHas('kartuInstruksiKerjaBom.billOfMaterials', function ($query) use ($masterItemId) {
                $query->where('id_master_item', $masterItemId);
            })
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'type' => 'requested_diemaking',
                    'qty' => $item->qty_request,
                    'qty_approved' => $item->qty_approved ?? 0,
                    'date' => $item->created_at,
                    'reference' => $item->internalMaterialRequest->no_imr_diemaking ?? '-',
                    'reference_date' => $item->internalMaterialRequest->tgl_request ?? null,
                    'status' => $item->internalMaterialRequest->status ?? 'pending',
                    'spk_no' => $item->kartuInstruksiKerjaBom->kartuInstruksiKerja->no_kartu_instruksi_kerja ?? '-',
                ];
            });

        // Material requests dari ImrFinishingItem (PENDING/APPROVED)
        $requestedFinishing = ImrFinishingItem::with([
            'internalMaterialRequest:id,no_imr_finishing,tgl_request,status',
            'kartuInstruksiKerjaBom.kartuInstruksiKerja:id,no_kartu_instruksi_kerja'
        ])
            ->whereHas('kartuInstruksiKerjaBom.billOfMaterials', function ($query) use ($masterItemId) {
                $query->where('id_master_item', $masterItemId);
            })
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'type' => 'requested_finishing',
                    'qty' => $item->qty_request,
                    'qty_approved' => $item->qty_approved ?? 0,
                    'date' => $item->created_at,
                    'reference' => $item->internalMaterialRequest->no_imr_finishing ?? '-',
                    'reference_date' => $item->internalMaterialRequest->tgl_request ?? null,
                    'status' => $item->internalMaterialRequest->status ?? 'pending',
                    'spk_no' => $item->kartuInstruksiKerjaBom->kartuInstruksiKerja->no_kartu_instruksi_kerja ?? '-',
                ];
            });

        // Gabungkan semua material requests
        $allRequested = collect()
            ->merge($requestedImr)
            ->merge($requestedDiemaking)
            ->merge($requestedFinishing);

        // Gabungkan semua transaksi dan urutkan berdasarkan tanggal
        $allTransactions = collect()
            ->merge($received)
            ->merge($returned)
            ->merge($allRequested)
            ->sortByDesc('date')
            ->values()
            ->all();

        return [
            'received' => $received->toArray(),
            'returned' => $returned->toArray(),
            'requested_imr' => $requestedImr->toArray(),
            'requested_diemaking' => $requestedDiemaking->toArray(),
            'requested_finishing' => $requestedFinishing->toArray(),
            'all' => $allTransactions,
        ];
    }

    /**
     * API endpoint untuk mendapatkan stock summary
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
     * Get detailed stock breakdown by request type
     */
    public function getStockBreakdown($masterItemId)
    {
        try {
            $breakdown = [
                'onhand_stock' => $this->calculateOnhandStock($masterItemId),
                'outstanding_stock' => [
                    'imr' => $this->calculateImrOutstandingStock($masterItemId),
                    'diemaking' => $this->calculateDiemakingOutstandingStock($masterItemId),
                    'finishing' => $this->calculateFinishingOutstandingStock($masterItemId),
                    'total' => $this->calculateOutstandingStock($masterItemId),
                ],
                'allocation_stock' => [
                    'imr' => $this->calculateImrAllocationStock($masterItemId),
                    'diemaking' => $this->calculateDiemakingAllocationStock($masterItemId),
                    'finishing' => $this->calculateFinishingAllocationStock($masterItemId),
                    'total' => $this->calculateAllocationStock($masterItemId),
                ],
            ];

            $breakdown['available_stock'] = $breakdown['onhand_stock'] -
                $breakdown['outstanding_stock']['total'] -
                $breakdown['allocation_stock']['total'];

            return response()->json($breakdown);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to get stock breakdown: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Helper methods untuk breakdown yang lebih detail
     */
    private function calculateImrOutstandingStock($masterItemId): float
    {
        return InternalMaterialRequestItem::whereHas('kartuInstruksiKerjaBom.billOfMaterials', function ($query) use ($masterItemId) {
            $query->where('id_master_item', $masterItemId);
        })
            ->whereHas('internalMaterialRequest', function ($query) {
                $query->whereIn('status', ['pending', 'submitted', 'waiting_approval']);
            })
            ->sum('qty_request');
    }

    private function calculateDiemakingOutstandingStock($masterItemId): float
    {
        return ImrDiemakingItem::whereHas('kartuInstruksiKerjaBom.billOfMaterials', function ($query) use ($masterItemId) {
            $query->where('id_master_item', $masterItemId);
        })
            ->whereHas('internalMaterialRequest', function ($query) {
                $query->whereIn('status', ['pending', 'submitted', 'waiting_approval']);
            })
            ->sum('qty_request');
    }

    private function calculateFinishingOutstandingStock($masterItemId): float
    {
        return ImrFinishingItem::whereHas('kartuInstruksiKerjaBom.billOfMaterials', function ($query) use ($masterItemId) {
            $query->where('id_master_item', $masterItemId);
        })
            ->whereHas('internalMaterialRequest', function ($query) {
                $query->whereIn('status', ['pending', 'submitted', 'waiting_approval']);
            })
            ->sum('qty_request');
    }

    private function calculateImrAllocationStock($masterItemId): float
    {
        return InternalMaterialRequestItem::whereHas('kartuInstruksiKerjaBom.billOfMaterials', function ($query) use ($masterItemId) {
            $query->where('id_master_item', $masterItemId);
        })
            ->whereHas('internalMaterialRequest', function ($query) {
                $query->where('status', 'approved');
            })
            ->sum('qty_approved');
    }

    private function calculateDiemakingAllocationStock($masterItemId): float
    {
        return ImrDiemakingItem::whereHas('kartuInstruksiKerjaBom.billOfMaterials', function ($query) use ($masterItemId) {
            $query->where('id_master_item', $masterItemId);
        })
            ->whereHas('internalMaterialRequest', function ($query) {
                $query->where('status', 'approved');
            })
            ->sum('qty_approved');
    }

    private function calculateFinishingAllocationStock($masterItemId): float
    {
        return ImrFinishingItem::whereHas('kartuInstruksiKerjaBom.billOfMaterials', function ($query) use ($masterItemId) {
            $query->where('id_master_item', $masterItemId);
        })
            ->whereHas('internalMaterialRequest', function ($query) {
                $query->where('status', 'approved');
            })
            ->sum('qty_approved');
    }
}
