<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SalesOrder;
use App\Models\Invoice;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $year = $request->input('year', date('Y'));

        // 1. Hitung Total Nilai Order (Sales Order)
        $totalOrderValue = SalesOrder::sum(DB::raw('jumlah_pesanan * harga_pcs_bp'));

        // 2. Hitung Total Kirim (Total Invoice) - DISESUAIKAN
        $totalKirimValue = Invoice::join('surat_jalans', 'invoices.id_surat_jalan', '=', 'surat_jalans.id')
            ->join('kartu_instruksi_kerjas', 'surat_jalans.id_kartu_instruksi_kerja', '=', 'kartu_instruksi_kerjas.id')
            ->join('sales_orders', 'kartu_instruksi_kerjas.id_sales_order', '=', 'sales_orders.id')
            ->selectRaw('
            SUM(
                (
                    (sales_orders.harga_pcs_bp * surat_jalans.qty_pengiriman) - COALESCE(invoices.discount, 0)
                ) * (1 + (COALESCE(invoices.ppn, 0) / 100)) + COALESCE(invoices.ongkos_kirim, 0)
            ) as grand_total
        ')
            ->value('grand_total') ?? 0;

        // 3. Data Grafik per Bulan (Sales Order)
        $monthlyData = SalesOrder::select(
            DB::raw('MONTH(created_at) as month'),
            DB::raw('SUM(jumlah_pesanan * harga_pcs_bp) as total')
        )
            ->whereYear('created_at', $year)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $chartData = collect(range(1, 12))->map(function ($month) use ($monthlyData) {
            $data = $monthlyData->firstWhere('month', $month);
            return [
                'month' => date('F', mktime(0, 0, 0, $month, 1)),
                'total' => $data ? (float)$data->total : 0,
            ];
        });

        return Inertia::render('dashboard', [
            'totalOrderValue' => (float)$totalOrderValue,
            'totalKirimValue' => (float)$totalKirimValue,
            'chartData' => $chartData,
            'selectedYear' => (int)$year,
        ]);
    }
}
