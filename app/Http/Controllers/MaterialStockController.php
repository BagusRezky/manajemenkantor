<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MasterItem;
use App\Models\PenerimaanBarangItem;
use App\Models\ReturEksternalItem;
use App\Models\InternalMaterialRequestItem;
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
            $allocationStock = $this->calculateAllocationStock($onhandStock, $outstandingStock);

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
                'available_stock' => $onhandStock - $allocationStock,
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
     * Calculate outstanding stock (approved but not yet received)
     */
    private function calculateOutstandingStock($masterItemId): float
{
    // Stock yang sudah di-approve di IMR
    return InternalMaterialRequestItem::whereHas('kartuInstruksiKerjaBom.billOfMaterials', function ($query) use ($masterItemId) {
        $query->where('id_master_item', $masterItemId);
    })
    ->whereHas('internalMaterialRequest', function ($query) {
        $query->where('status', 'approved');
    })
    ->sum('qty_approved');
}

    /**
     * Calculate allocation stock (reserved for production)
     */
    private function calculateAllocationStock($onhandStock, $outstandingStock): float
{
    // Allocation = Onhand - Outstanding
    return $onhandStock - $outstandingStock;
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
     * Generate PDF for material stock report
     */
    public function generatePdf()
    {
        try {
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
                $onhandStock = $this->calculateOnhandStock($item->id);
                $outstandingStock = $this->calculateOutstandingStock($item->id);
                $allocationStock = $this->calculateAllocationStock($onhandStock, $outstandingStock);

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
                    'available_stock' => $onhandStock - $allocationStock,
                    'status' => $this->getStockStatus($onhandStock, $item->min_stock ?? 0),
                ];
            });

            return response()->json([
                'materialStocks' => $materialStocks,
                'generated_at' => now()->toISOString(),
                'total_items' => $materialStocks->count(),
                'low_stock_items' => $materialStocks->where('status', 'low_stock')->count(),
                'out_of_stock_items' => $materialStocks->where('status', 'out_of_stock')->count(),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to generate PDF: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get stock details for specific item
     */
    // public function getStockDetails($id)
    // {
    //     try {
    //         $item = MasterItem::with(['typeItem', 'unit'])->findOrFail($id);

    //         // Get detailed transactions
    //         $receivedTransactions = PenerimaanBarangItem::with([
    //             'penerimaanBarang',
    //             'purchaseOrderItem'
    //         ])
    //         ->whereHas('purchaseOrderItem', function ($query) use ($id) {
    //             $query->where('id_master_item', $id);
    //         })
    //         ->orderBy('created_at', 'desc')
    //         ->get();

    //         $returnedTransactions = ReturEksternalItem::with([
    //             'returEksternal',
    //             'penerimaanBarangItem'
    //         ])
    //         ->whereHas('penerimaanBarangItem.purchaseOrderItem', function ($query) use ($id) {
    //             $query->where('id_master_item', $id);
    //         })
    //         ->orderBy('created_at', 'desc')
    //         ->get();

    //         $requestTransactions = InternalMaterialRequestItem::with([
    //             'internalMaterialRequest',
    //             'kartuInstruksiKerjaBom'
    //         ])
    //         ->whereHas('kartuInstruksiKerjaBom.billOfMaterials', function ($query) use ($id) {
    //             $query->where('id_master_item', $id);
    //         })
    //         ->orderBy('created_at', 'desc')
    //         ->get();

    //         return response()->json([
    //             'item' => $item,
    //             'onhand_stock' => $this->calculateOnhandStock($id),
    //             'outstanding_stock' => $this->calculateOutstandingStock($id),
    //             'allocation_stock' => $this->calculateAllocationStock($id),
    //             'transactions' => [
    //                 'received' => $receivedTransactions,
    //                 'returned' => $returnedTransactions,
    //                 'requested' => $requestTransactions,
    //             ]
    //         ]);
    //     } catch (\Exception $e) {
    //         return response()->json(['error' => 'Failed to get stock details: ' . $e->getMessage()], 500);
    //     }
    // }
}
