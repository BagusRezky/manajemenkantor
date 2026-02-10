<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Exports\PaymentReportExport;
use Maatwebsite\Excel\Facades\Excel;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        
        return Inertia::render('report/reports');
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

    // public function exportMutation(Request $request)
    // {
    //     $this->validateDate($request);
    //     $fileName = 'REPORT_MUTASI_' . $request->start_date . '_to_' . $request->end_date . '.xlsx';

    //     return Excel::download(
    //         new MutationReportExport($request->start_date, $request->end_date),
    //         $fileName
    //     );
    // }

    // public function exportSales(Request $request)
    // {
    //     $this->validateDate($request);
    //     $fileName = 'REPORT_PENJUALAN_' . $request->start_date . '_to_' . $request->end_date . '.xlsx';

    //     return Excel::download(
    //         new SalesReportExport($request->start_date, $request->end_date),
    //         $fileName
    //     );
    // }

    // public function exportProfitLoss(Request $request)
    // {
    //     $this->validateDate($request);
    //     $fileName = 'REPORT_LABA_RUGI_' . $request->start_date . '_to_' . $request->end_date . '.xlsx';

    //     return Excel::download(
    //         new ProfitLossReportExport($request->start_date, $request->end_date),
    //         $fileName
    //     );
    // }
}
