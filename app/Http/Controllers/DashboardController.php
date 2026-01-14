<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SalesOrder;
use App\Models\Invoice;
use App\Models\PurchaseOrderItem;
use App\Models\PenerimaanBarangItem;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $year = $request->input('year', date('Y'));

        // --- SALES DATA ---
        $totalOrderValue = SalesOrder::whereYear('eta_marketing', $year)
            ->sum(DB::raw('jumlah_pesanan * harga_pcs_bp'));

        // Total Kirim (Invoice) berdasarkan ETA Marketing di Sales Order
        $totalKirimValue = Invoice::join('surat_jalans', 'invoices.id_surat_jalan', '=', 'surat_jalans.id')
            ->join('kartu_instruksi_kerjas', 'surat_jalans.id_kartu_instruksi_kerja', '=', 'kartu_instruksi_kerjas.id')
            ->join('sales_orders', 'kartu_instruksi_kerjas.id_sales_order', '=', 'sales_orders.id')
            ->whereYear('sales_orders.eta_marketing', $year)
            ->selectRaw('SUM(((sales_orders.harga_pcs_bp * surat_jalans.qty_pengiriman) - COALESCE(invoices.discount, 0)) * (1 + (COALESCE(invoices.ppn, 0) / 100)) + COALESCE(invoices.ongkos_kirim, 0)) as grand_total')
            ->value('grand_total') ?? 0;

        // --- PURCHASE DATA (Stat Cards) ---
        // Total Qty PO berdasarkan tahun PO
        $totalPOQty = PurchaseOrderItem::whereHas('purchaseOrder', function($q) use ($year) {
            $q->whereYear('tanggal_po', $year);
        })->sum('jumlah');

        // Total Qty LPB berdasarkan tahun PO (bukan tahun terima)
        $totalLPBValue = PenerimaanBarangItem::join('purchase_order_items', 'penerimaan_barang_items.id_purchase_order_item', '=', 'purchase_order_items.id')
            ->join('purchase_orders', 'purchase_order_items.id_purchase_order', '=', 'purchase_orders.id')
            ->whereYear('purchase_orders.tanggal_po', $year)
            ->sum(DB::raw('penerimaan_barang_items.qty_penerimaan * purchase_order_items.harga_satuan'));

        // --- GRAFIK DATA ---
        // Penjualan (Sales)
        // 3. Data Grafik Penjualan (Sales)
        $monthlySales = SalesOrder::select(
            DB::raw('MONTH(eta_marketing) as month'),
            DB::raw('SUM(jumlah_pesanan * harga_pcs_bp) as total')
        )
            ->whereYear('eta_marketing', $year)
            ->groupBy('month')
            ->get();

        // 4. Data Grafik Penerimaan (LPB) - Berdasarkan Tahun & Bulan PO
        $monthlyLPB = PenerimaanBarangItem::join('purchase_order_items', 'penerimaan_barang_items.id_purchase_order_item', '=', 'purchase_order_items.id')
            ->join('purchase_orders', 'purchase_order_items.id_purchase_order', '=', 'purchase_orders.id')
            ->select(
                DB::raw('MONTH(purchase_orders.tanggal_po) as month'),
                DB::raw('SUM(penerimaan_barang_items.qty_penerimaan * purchase_order_items.harga_satuan) as total_value')
            )
            ->whereYear('purchase_orders.tanggal_po', $year)
            ->groupBy('month')->get();

        // Gabungkan data untuk dikirim ke frontend
        $chartData = collect(range(1, 12))->map(function ($month) use ($monthlySales, $monthlyLPB) {
            $sales = $monthlySales->firstWhere('month', $month);
            $lpb = $monthlyLPB->firstWhere('month', $month);

            return [
                'month' => date('F', mktime(0, 0, 0, $month, 1)),
                'salesTotal' => $sales ? (float)$sales->total : 0,
                'lpbTotal'   => $lpb ? (float)$lpb->total_value : 0,
            ];
        });

        return Inertia::render('dashboard', [
            'totalOrderValue' => (float)$totalOrderValue,
            'totalKirimValue' => (float)$totalKirimValue,
            'totalPOQty'      => (float)$totalPOQty,
            'totalLPBQty'     => (float)$totalLPBValue,
            'chartData'       => $chartData,
            'selectedYear'    => (int)$year,
        ]);
    }
}
