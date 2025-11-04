<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Karyawan;
use App\Models\Absen;
use App\Models\Lembur;
use App\Models\BonusKaryawan;

class GajiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
   public function index(Request $request)
    {
        $bulan = $request->input('bulan', date('m'));
        $tahun = $request->input('tahun', date('Y'));

        $startDate = date("$tahun-$bulan-01");
        $endDate = date("$tahun-$bulan-28");

        $karyawans = Karyawan::all();
        $rekap = $karyawans->map(function ($karyawan) use ($startDate, $endDate) {

            // ===== Ambil data Absensi =====
            $hadir = Absen::where('nama', $karyawan->nama)
                ->whereBetween('tanggal_scan', [$startDate, $endDate])
                ->where('io', 1)
                ->count();

            // ===== Ambil data Lembur =====
            $totalJamLembur = Lembur::where('id_karyawan', $karyawan->id)
                ->whereBetween('tanggal_lembur', [$startDate, $endDate])
                ->get()
                ->reduce(function ($carry, $item) {
                    $awal = strtotime($item->jam_awal_lembur);
                    $selesai = strtotime($item->jam_selesai_lembur);
                    return $carry + (($selesai - $awal) / 3600);
                }, 0);

            // ===== Ambil Bonus =====
            $bonus = BonusKaryawan::where('id_karyawan', $karyawan->id)
                ->whereBetween('tanggal_bonus', [$startDate, $endDate])
                ->sum('nilai_bonus');

            // ===== Hitung Total Gaji =====
            $gajiPokok = $karyawan->gaji_pokok ?? 0;
            $tunjangan =
                ($karyawan->tunjangan_kompetensi ?? 0) +
                ($karyawan->tunjangan_jabatan ?? 0) +
                ($karyawan->tunjangan_intensif ?? 0);

            $totalAkhir = $gajiPokok + $tunjangan + $bonus;

            return [
                'nama' => $karyawan->nama,
                'hadir' => $hadir,
                'total_lembur_jam' => $totalJamLembur,
                'gaji_pokok' => $gajiPokok,
                'tunjangan' => $tunjangan,
                'bonus' => $bonus,
                'total_akhir' => $totalAkhir,
            ];
        });

        return Inertia::render('gaji/gajis', [
            'rekap' => $rekap,
            'bulan' => $bulan,
            'tahun' => $tahun,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
