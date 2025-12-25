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
use App\Models\PotonganTunjangan;
use App\Models\Izin;

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

        $startDate = Carbon::createFromDate($tahun, $bulan, 1)->startOfDay()->toDateTimeString();
        $endDate = Carbon::createFromDate($tahun, $bulan, 1)->endOfMonth()->endOfDay()->toDateTimeString();

        $karyawans = Karyawan::all();

        $absens = Absen::whereBetween('tanggal_scan', [$startDate, $endDate])->get();
        $lemburs = Lembur::with('karyawan')->whereBetween('tanggal_lembur', [$startDate, $endDate])->get();
        $bonusList = BonusKaryawan::whereBetween('tanggal_bonus', [$startDate, $endDate])->get();
        $cutis = Cuti::with('karyawan')->whereBetween('tanggal_cuti', [$startDate, $endDate])->get();
        $izins = Izin::whereBetween('tanggal_izin', [$startDate, $endDate])->get();
        $potonganList = PotonganTunjangan::whereBetween('periode_payroll', [$startDate, $endDate])->get();

        $rekap = $karyawans->map(function ($karyawan) use (
            $absens,
            $lemburs,
            $bonusList,
            $cutis,
            $izins,
            $potonganList
        ) {
            // --- 1. LOGIKA KEHADIRAN FISIK (Masuk & Keluar) ---
            $absenKaryawan = $absens->where('nama', $karyawan->nama);
            $tanggalHadirFisik = $absenKaryawan->groupBy(function($item) {
                return date('Y-m-d', strtotime($item->tanggal_scan));
            })->filter(function($group) {
                return $group->where('io', 1)->isNotEmpty() && $group->where('io', 2)->isNotEmpty();
            })->keys()->toArray();

            // --- 2. LOGIKA IZIN & ALPHA ---
            $izinKaryawan = $izins->where('id_karyawan', $karyawan->id);

            // Izin (Selain Alpha) -> Dihitung Hadir
            $dataIzin = $izinKaryawan->where('jenis_izin', '!=', 'Alpha');
            $totalIzin = $dataIzin->count();
            $tanggalIzinHadir = $dataIzin->map(fn($i) => date('Y-m-d', strtotime($i->tanggal_izin)))->toArray();

            // Alpha -> Tidak Dihitung Hadir
            $totalAlpha = $izinKaryawan->where('jenis_izin', 'Alpha')->count();

            // --- 3. LOGIKA CUTI ---
            $cutiKaryawan = $cutis->where('karyawan.id', $karyawan->id);
            $tanggalCutiHadir = $cutiKaryawan->map(fn($c) => date('Y-m-d', strtotime($c->tanggal_cuti)))->toArray();

            // --- 4. TOTAL HADIR (Fisik + Izin + Cuti) ---
            $totalHariHadir = count(array_unique(array_merge($tanggalHadirFisik, $tanggalIzinHadir, $tanggalCutiHadir)));

            // --- 5. PERHITUNGAN GAJI POKOK (Gaji/25 * Hadir) ---
            $gajiPokokMaster = $karyawan->gaji_pokok ?? 0;
            $gajiPokokBerjalan = ($gajiPokokMaster / 25) * $totalHariHadir;

            // --- 6. LEMBUR ---
            $lemburKaryawan = $lemburs->where('karyawan.id', $karyawan->id);
            $totalDetikLembur = $lemburKaryawan->reduce(function ($carry, $lembur) {
                return $carry + max(0, strtotime($lembur->jam_selesai_lembur) - strtotime($lembur->jam_awal_lembur));
            }, 0);
            $totalLemburFormat = sprintf('%02d:%02d:%02d', floor($totalDetikLembur/3600), floor(($totalDetikLembur%3600)/60), $totalDetikLembur%60);

            // --- 7. POTONGAN & TUNJANGAN ---
            $potongan = $potonganList->where('id_karyawan', $karyawan->id)->first();
            $potKompetensi = $potongan->potongan_tunjangan_kompetensi ?? 0;
            $potJabatan = $potongan->potongan_tunjangan_jabatan ?? 0;
            $potIntensif = $potongan->potongan_intensif ?? 0;

            $netKompetensi = ($karyawan->tunjangan_kompetensi ?? 0) - $potKompetensi;
            $netJabatan = ($karyawan->tunjangan_jabatan ?? 0) - $potJabatan;
            $netIntensif = ($karyawan->tunjangan_intensif ?? 0) - $potIntensif;

            $bonus = $bonusList->where('id_karyawan', $karyawan->id)->sum('nilai_bonus');
            $totalTunjanganNet = $netKompetensi + $netJabatan + $netIntensif;

            $totalGajiAkhir = $gajiPokokBerjalan + $totalTunjanganNet + $bonus;

            return [
                'nama' => $karyawan->nama,
                'hadir' => $totalHariHadir,
                'total_izin' => $totalIzin,
                'total_alpha' => $totalAlpha,
                'total_lembur' => $totalLemburFormat,
                'total_cuti_semua' => $cutiKaryawan->count(),
                'cuti_tahunan_digunakan' => $cutiKaryawan->where('jenis_cuti', 'Cuti Tahunan')->count(),
                'gaji_pokok' => $gajiPokokBerjalan,
                'tunjangan_kompetensi' => $karyawan->tunjangan_kompetensi ?? 0,
                'potongan_kompetensi' => $potKompetensi,
                'tunjangan_jabatan' => $karyawan->tunjangan_jabatan ?? 0,
                'potongan_jabatan' => $potJabatan,
                'tunjangan_intensif' => $karyawan->tunjangan_intensif ?? 0,
                'potongan_intensif' => $potIntensif,
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
