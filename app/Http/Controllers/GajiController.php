<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Karyawan;
use App\Models\Absen;
use App\Models\Lembur;
use App\Models\BonusKaryawan;
use App\Models\Cuti;
use App\Models\HariLibur;
use Carbon\Carbon;
use App\Jobs\SendSlipGajiJob;

class GajiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $bulan = $request->input('bulan', date('m'));
        $tahun = $request->input('tahun', date('Y'));

        // pakai Carbon untuk start & end of month yang benar
        $startDate = Carbon::createFromDate($tahun, $bulan, 1)->startOfDay()->toDateTimeString(); // YYYY-MM-DD 00:00:00
        $endDate = Carbon::createFromDate($tahun, $bulan, 1)->endOfMonth()->endOfDay()->toDateTimeString(); // YYYY-MM-DD 23:59:59

        // Ambil karyawan + fields tunjangan/gaji
        $karyawans = Karyawan::select(
            'id',
            'nama',
            'gaji_pokok',
            'tunjangan_kompetensi',
            'tunjangan_jabatan',
            'tunjangan_intensif'
        )->get();

        // Ambil absensi/lembur/bonus/cuti di rentang waktu yang benar
        $absens = Absen::select('nama', 'tanggal_scan', 'io')
            ->whereBetween('tanggal_scan', [$startDate, $endDate])
            ->get();

        $lemburs = Lembur::with('karyawan')
            ->whereBetween('tanggal_lembur', [$startDate, $endDate])
            ->get();

        $bonusList = BonusKaryawan::whereBetween('tanggal_bonus', [$startDate, $endDate])->get();

        $cutis = Cuti::with('karyawan')
            ->whereBetween('tanggal_cuti', [$startDate, $endDate])
            ->get();

        // total hari libur untuk jatah cuti tahunan
        $totalHariLibur = HariLibur::count();
        $jatahCutiTahunan = max(12 - $totalHariLibur, 0);

        $rekap = $karyawans->map(function ($karyawan) use (
            $absens,
            $lemburs,
            $bonusList,
            $cutis,
            $jatahCutiTahunan
        ) {
            // --- HADIR : hitung unique date dimana io == 1 ---
            $absenKaryawan = $absens->where('nama', $karyawan->nama);
            $hadir = $absenKaryawan
                ->where('io', 1)
                ->map(function ($it) {
                    return date('Y-m-d', strtotime($it->tanggal_scan));
                })
                ->unique()
                ->count();

            // --- LEMBUR : total detik kemudian format HH:MM:SS ---
            $lemburKaryawan = $lemburs->where('karyawan.id', $karyawan->id);
            $totalDetikLembur = $lemburKaryawan->reduce(function ($carry, $lembur) {
                $awal = strtotime($lembur->jam_awal_lembur);
                $selesai = strtotime($lembur->jam_selesai_lembur);
                $durasi = max(0, $selesai - $awal); // amanin negatif
                return $carry + $durasi;
            }, 0);

            $jam = floor($totalDetikLembur / 3600);
            $menit = floor(($totalDetikLembur % 3600) / 60);
            $detik = $totalDetikLembur % 60;
            $totalLemburFormat = sprintf('%02d:%02d:%02d', $jam, $menit, $detik);

            // --- BONUS ---
            $bonus = $bonusList->where('id_karyawan', $karyawan->id)->sum('nilai_bonus');

            // --- CUTI ---
            $cutiKaryawan = $cutis->where('karyawan.id', $karyawan->id);
            $totalCutiSemua = $cutiKaryawan->count();
            $cutiTahunanDigunakan = $cutiKaryawan->where('jenis_cuti', 'Cuti Tahunan')->count();

            // --- GAJI & TUNJANGAN ---
            $gajiPokok = $karyawan->gaji_pokok ?? 0;
            $tunjanganKompetensi = $karyawan->tunjangan_kompetensi ?? 0;
            $tunjanganJabatan = $karyawan->tunjangan_jabatan ?? 0;
            $tunjanganIntensif = $karyawan->tunjangan_intensif ?? 0;
            $totalTunjangan = $tunjanganKompetensi + $tunjanganJabatan + $tunjanganIntensif;
            $totalGajiAkhir = $gajiPokok + $totalTunjangan + $bonus;

            return [
                'nama' => $karyawan->nama,
                'hadir' => $hadir,
                'total_lembur' => $totalLemburFormat,
                'total_cuti_semua' => $totalCutiSemua,
                'cuti_tahunan_digunakan' => $cutiTahunanDigunakan,
                'gaji_pokok' => $gajiPokok,
                'tunjangan_kompetensi' => $tunjanganKompetensi,
                'tunjangan_jabatan' => $tunjanganJabatan,
                'tunjangan_intensif' => $tunjanganIntensif,
                'total_tunjangan' => $totalTunjangan,
                'bonus' => $bonus,
                'total_gaji' => $totalGajiAkhir,
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
