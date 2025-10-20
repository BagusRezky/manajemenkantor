<?php

namespace App\Http\Controllers;

use App\Models\Absen;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\AbsenImport;
use Illuminate\Support\Facades\DB;

class AbsenController extends Controller
{
    // Import Excel
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv',
        ]);

        Excel::import(new AbsenImport, $request->file('file'));

        return redirect()->route('absens.index')->with('success', 'Data absen berhasil diimport!');
    }

    // Index
    public function index()
    {
        // Ambil semua data absensi terbaru
        $absens = Absen::orderBy('tanggal_scan', 'desc')->get();

        return Inertia::render('absen/absens', [
            'absens' => $absens
        ]);
    }

    
}
