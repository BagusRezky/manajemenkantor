<?php

namespace App\Http\Controllers;

use App\Exports\DieMakingWasteExport;
use App\Exports\FinishingWasteExport;
use App\Exports\PrintingWasteExport;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ReportSpkExport;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportProductionController extends Controller
{
    public function index()
    {
        return Inertia::render('report/reportProductions', []);
    }
    public function exportWastePrinting(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
        ]);

        $fileName = 'REPORT_WASTE_PRINTING_' . $request->start_date . '_to_' . $request->end_date . '.xlsx';

        return Excel::download(
            new PrintingWasteExport($request->start_date, $request->end_date),
            $fileName
        );
    }

    public function exportWasteDieMaking(Request $request)
    {
        // Validasi input tanggal
        $request->validate([
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
        ]);

        // Buat nama file berdasarkan rentang tanggal
        $fileName = 'REPORT_WASTE_DIEMAKING_' . $request->start_date . '_to_' . $request->end_date . '.xlsx';

        // Download file Excel menggunakan export class yang sesuai
        return Excel::download(
            new DieMakingWasteExport($request->start_date, $request->end_date),
            $fileName
        );
    }

    public function exportWasteFinishing(Request $request)
    {
        // Validasi input tanggal
        $request->validate([
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
        ]);

        // Buat nama file berdasarkan rentang tanggal
        $fileName = 'REPORT_WASTE_FINISHING_' . $request->start_date . '_to_' . $request->end_date . '.xlsx';

        // Download file Excel menggunakan export class yang sesuai
        return Excel::download(
            new FinishingWasteExport($request->start_date, $request->end_date),
            $fileName
        );
    }

    public function exportReportSpk(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
        ]);

        $fileName = 'REPORT_SPK_' . $request->start_date . '_to_' . $request->end_date . '.xlsx';

        return Excel::download(
            new ReportSpkExport($request->start_date, $request->end_date),
            $fileName
        );
    }
}
