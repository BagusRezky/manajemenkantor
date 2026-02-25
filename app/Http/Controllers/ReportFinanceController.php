<?php

namespace App\Http\Controllers;

use App\Exports\FaktruReportExport;
use App\Exports\FakturReportExport;
use Illuminate\Http\Request;
use App\Exports\PaymentReportExport;
use App\Exports\MutationReportExport;
use App\Exports\SalesReportExport;
use App\Exports\ProfitLossReportExport;
use App\Models\MasterCoa;
use Maatwebsite\Excel\Facades\Excel;
use Inertia\Inertia;

class ReportFinanceController extends Controller
{
    public function index()
    {
        return Inertia::render('report/reportFinances', [
            'accounts' => MasterCoa::orderBy('kode_akuntansi')->get()
        ]);
    }
    private function validateDate(Request $request)
    {
        return $request->validate([
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
        ]);
    }

    public function exportPayment(Request $request)
    {
        $this->validateDate($request);
        $fileName = 'REPORT_PEMBAYARAN_' . $request->start_date . '_to_' . $request->end_date . '.xlsx';

        return Excel::download(
            new PaymentReportExport($request->start_date, $request->end_date),
            $fileName
        );
    }

    public function exportMutation(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
            'id_accounts' => 'required|array'
        ]);

        $fileName = 'REPORT_MUTASI_' . $request->start_date . '_to_' . $request->end_date . '.xlsx';

        return Excel::download(
            new MutationReportExport($request->start_date, $request->end_date, $request->id_accounts),
            $fileName
        );
    }

    public function exportSales(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
            'kode'       => 'nullable|string',
        ]);

        $fileName = 'REPORT_PENJUALAN_' . $request->start_date . '_to_' . $request->end_date;
        if ($request->kode) {
            $fileName .= '_KODE_' . $request->kode;
        }
        $fileName .= '.xlsx';

        return Excel::download(
            new SalesReportExport($request->start_date, $request->end_date, $request->kode),
            $fileName
        );
    }

    public function exportProfitLoss(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
        ]);

        $fileName = 'REPORT_LABA_RUGI_' . $request->start_date . '_to_' . $request->end_date . '.xlsx';

        return Excel::download(
            new ProfitLossReportExport($request->start_date, $request->end_date),
            $fileName
        );
    }

    public function exportFaktur(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
        ]);

        $fileName = 'LAPORAN_FAKTUR_' . $request->start_date . '_to_' . $request->end_date . '.xlsx';

        return Excel::download(
            new FakturReportExport($request->start_date, $request->end_date),
            $fileName
        );
    }
}
