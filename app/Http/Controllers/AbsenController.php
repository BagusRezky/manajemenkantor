<?php

namespace App\Http\Controllers;

use App\Models\Absen;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\AbsenImport;
use App\Models\Cuti;
use App\Models\Izin;
use App\Models\Lembur;
use App\Models\Karyawan;
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

    public function rekap(Request $request)
{
    $startDate = $request->input('start_date');
    $endDate   = $request->input('end_date');

    // Ambil semua karyawan
    $karyawans = Karyawan::select('id', 'nama', 'pin')->get();

    // Ambil semua absensi (optional: filter rentang tanggal)
    $absens = Absen::select('nama', 'pin', 'tanggal_scan', 'jam', 'io')
        ->when($startDate && $endDate, function ($query) use ($startDate, $endDate) {
            $query->whereBetween('tanggal_scan', [
                $startDate . ' 00:00:00',
                $endDate . ' 23:59:59'
            ]);
        })
        ->get();

    // Ambil semua lembur, izin, dan cuti
    $lemburs = Lembur::with('karyawan')->get();
    $izins   = Izin::with('karyawan')->get();
    $cutis   = Cuti::with('karyawan')->get();

    // === Rekap per Karyawan ===
    $rekapAbsens = $karyawans->map(function ($karyawan) use ($absens, $lemburs, $izins, $cutis) {

        // Ambil absensi berdasarkan nama/pin karyawan
        $absenKaryawan = $absens->where('nama', $karyawan->nama);

        // Hitung jumlah kedatangan & pulang
        $kedatanganKali = $absenKaryawan->where('io', 1)->count();
        $pulangKali     = $absenKaryawan->where('io', 2)->count();

        // Hitung jumlah hari hadir unik (berdasarkan tanggal)
        $hadir = $absenKaryawan
            ->where('io', 1)
            ->groupBy(function ($item) {
                return date('Y-m-d', strtotime($item->tanggal_scan));
            })
            ->count();

        // Ambil data lembur, izin, dan cuti milik karyawan ini
        $lemburKaryawan = $lemburs->where('karyawan.nama', $karyawan->nama);
        $izinKaryawan   = $izins->where('karyawan.nama', $karyawan->nama);
        $cutiKaryawan   = $cutis->where('karyawan.nama', $karyawan->nama);

        // Total jam lembur
        $totalJamLembur = $lemburKaryawan->reduce(function ($carry, $lembur) {
            $awal = strtotime($lembur->jam_awal_lembur);
            $selesai = strtotime($lembur->jam_selesai_lembur);
            $durasi = ($selesai - $awal) / 3600;
            return $carry + $durasi;
        }, 0);

        // Ambil tanggal contoh (untuk bulan/tahun, optional)
        $tanggalContoh = $absenKaryawan->first()?->tanggal_scan;
        $bulan = $tanggalContoh ? date('n', strtotime($tanggalContoh)) : null;
        $tahun = $tanggalContoh ? date('Y', strtotime($tanggalContoh)) : null;

        return [
            'nama'             => $karyawan->nama,
            'hadir'            => $hadir,
            'kedatangan_kali'  => $kedatanganKali,
            'pulang_kali'      => $pulangKali,
            'lembur_kali'      => $lemburKaryawan->count(),
            'total_jam_lembur' => round($totalJamLembur, 2),
            'izin_kali'        => $izinKaryawan->count(),
            'cuti_kali'        => $cutiKaryawan->count(),
            'bulan'            => $bulan,
            'tahun'            => $tahun,
        ];
    });

    return Inertia::render('absen/rekap', [
        'rekap' => $rekapAbsens,
        'filters' => [
            'start_date' => $startDate,
            'end_date'   => $endDate,
        ],
    ]);
}


}
