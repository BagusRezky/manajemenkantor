<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Exports\PoPbExport;
use Maatwebsite\Excel\Facades\Excel;
use Inertia\Inertia;

class ReportPoPbController extends Controller
{
    public function index(){
        return Inertia::render('report/reportPoPbs', [

        ]);
    }

    public function exportPoPb(Request $request)
    {
        // Validasi input tanggal
        $request->validate([
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
        ]);

        // Buat nama file berdasarkan rentang tanggal
        $fileName = 'REPORT_PO_PB_' . $request->start_date . '_to_' . $request->end_date . '.xlsx';

        // Download file Excel menggunakan export class yang sesuai
        return Excel::download(
            new PoPbExport($request->start_date, $request->end_date),
            $fileName
        );
    }

}
