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

    // Report bulanan
    public function report(Request $request)
    {
        $request->validate([
            'bulan' => 'nullable|integer|min:1|max:12',
            'tahun' => 'nullable|integer|min:2000',
        ]);

        $bulan = $request->bulan;
        $tahun = $request->tahun;

        // Query left join ke karyawans supaya semua NIP muncul
        $query = DB::table('karyawans')
            ->leftJoin('absens', function ($join) use ($bulan, $tahun) {
                $join->on('karyawans.nip', '=', 'absens.nip')
                    ->whereYear('absens.tanggal', $tahun)
                    ->whereMonth('absens.tanggal', $bulan);
            })
            ->select(
                'karyawans.nip',
                'karyawans.nama',
                DB::raw('absens.tanggal'),
                DB::raw('count(absens.id) as total_scan')
            )
            ->groupBy('karyawans.nip', 'karyawans.nama', 'absens.tanggal');

        if ($request->has('nip') && $request->nip) {
            $query->where('karyawans.nip', $request->nip);
        }

        $rekapPerHari = $query->get();

        $rekap = [];

        foreach ($rekapPerHari as $row) {
            $nilai = 0;

            if ($row->total_scan >= 2) {
                $nilai = 1;
            } elseif ($row->total_scan == 1) {
                $nilai = 0.5;
            }

            if (!isset($rekap[$row->nip])) {
                $rekap[$row->nip] = [
                    'nip' => $row->nip,
                    'nama' => $row->nama,
                    'total_hadir' => 0,
                    'total_hari' => 0,
                ];
            }

            $rekap[$row->nip]['total_hadir'] += $nilai;
            $rekap[$row->nip]['total_hari']++;
        }

        // Tambahkan NIP yang tidak ada sama sekali di bulan itu
        $allNIPs = DB::table('karyawans')->pluck('nip');
        foreach ($allNIPs as $nip) {
            if (!isset($rekap[$nip])) {
                $karyawan = DB::table('karyawans')->where('nip', $nip)->first();
                $rekap[$nip] = [
                    'nip' => $nip,
                    'nama' => $karyawan->nama,
                    'total_hadir' => 0,
                    'total_hari' => 0,
                ];
            }
        }

        return Inertia::render('absen/reports', [
            'rekap' => array_values($rekap),
            'filters' => $request->only(['bulan', 'tahun', 'nip']),
        ]);
    }
}
