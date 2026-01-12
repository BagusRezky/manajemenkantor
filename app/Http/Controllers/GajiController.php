<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Karyawan;
use App\Models\Absen;
use App\Models\Lembur;
use App\Models\BonusKaryawan;
use App\Models\Cuti;
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
            $tanggalHadirFisik = $absenKaryawan->groupBy(function ($item) {
                return date('Y-m-d', strtotime($item->tanggal_scan));
            })->filter(function ($group) {
                return $group->where('io', 1)->isNotEmpty() && $group->where('io', 2)->isNotEmpty();
            })->keys()->toArray();

            // --- 2. LOGIKA IZIN & ALPHA ---
            $izinKaryawan = $izins->where('id_karyawan', $karyawan->id);
            $dataIzin = $izinKaryawan->where('jenis_izin', '!=', 'Alpha');
            $totalIzin = $dataIzin->count();
            $tanggalIzinHadir = $dataIzin->map(fn($i) => date('Y-m-d', strtotime($i->tanggal_izin)))->toArray();
            $totalAlpha = $izinKaryawan->where('jenis_izin', 'Alpha')->count();

            // --- 3. LOGIKA CUTI ---
            $cutiKaryawan = $cutis->where('karyawan.id', $karyawan->id);
            $tanggalCutiHadir = $cutiKaryawan->map(fn($c) => date('Y-m-d', strtotime($c->tanggal_cuti)))->toArray();

            // --- 4. TOTAL HADIR (Fisik + Izin + Cuti) ---
            $totalHariHadir = count(array_unique(array_merge($tanggalHadirFisik, $tanggalIzinHadir, $tanggalCutiHadir)));

            // --- 5. POTONGAN & TUNJANGAN ---
            $potongan = $potonganList->where('id_karyawan', $karyawan->id)->first();
            $potKompetensi = $potongan->potongan_tunjangan_kompetensi ?? 0;
            $potJabatan = $potongan->potongan_tunjangan_jabatan ?? 0;
            $potIntensif = $potongan->potongan_intensif ?? 0;

            $netKompetensi = ($karyawan->tunjangan_kompetensi ?? 0) - $potKompetensi;
            $netJabatan = ($karyawan->tunjangan_jabatan ?? 0) - $potJabatan;
            $netIntensif = ($karyawan->tunjangan_intensif ?? 0) - $potIntensif;

            $totalTunjanganNet = $netKompetensi + $netJabatan + $netIntensif;

            // --- 6. PERHITUNGAN TOTAL GAJI (Rumus Baru) ---
            // (Gaji Pokok + Total Tunjangan Bersih) / 25 * Hadir + Bonus
            $gajiPokokMaster = $karyawan->gaji_pokok ?? 0;
            $komponenTetap = $gajiPokokMaster + $totalTunjanganNet;

            $gajiHarian = $komponenTetap / 25;
            $bonus = $bonusList->where('id_karyawan', $karyawan->id)->sum('nilai_bonus');

            $totalGajiAkhir = ($gajiHarian * $totalHariHadir) + $bonus;

            // --- LEMBUR ---
            $lemburKaryawan = $lemburs->where('karyawan.id', $karyawan->id);
            $totalDetikLembur = $lemburKaryawan->reduce(function ($carry, $lembur) {
                return $carry + max(0, strtotime($lembur->jam_selesai_lembur) - strtotime($lembur->jam_awal_lembur));
            }, 0);
            $totalLemburFormat = sprintf('%02d:%02d:%02d', floor($totalDetikLembur / 3600), floor(($totalDetikLembur % 3600) / 60), $totalDetikLembur % 60);

            return [
                'nama' => $karyawan->nama,
                'hadir' => $totalHariHadir,
                'total_izin' => $totalIzin,
                'total_alpha' => $totalAlpha,
                'total_lembur' => $totalLemburFormat,
                'total_cuti_semua' => $cutiKaryawan->count(),
                'cuti_tahunan_digunakan' => $cutiKaryawan->where('jenis_cuti', 'Cuti Tahunan')->count(),
                'gaji_pokok' => $gajiPokokMaster, // Tetap statis sesuai master
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

    public function sendSlip(Request $request)
    {
        // Validasi range tanggal
        $startDate = Carbon::parse($request->start_date)->startOfDay();
        $endDate   = Carbon::parse($request->end_date)->endOfDay();
        $id_karyawan = $request->input('id_karyawan'); // null jika kirim semua

        if (!$startDate || !$endDate) {
            return back()->with('error', 'Range tanggal wajib diisi.');
        }

        $bulanText = Carbon::parse($startDate)->translatedFormat('F');
        $tahunText = Carbon::parse($startDate)->format('Y');

        // Query dasar: Karyawan yang punya email
        $query = Karyawan::with('user')->whereNotNull('user_id');

        // Jika id_karyawan ada, berarti kirim individu
        if ($id_karyawan) {
            $query->where('id', $id_karyawan);
        }

        $karyawans = $query->get();

        // Data pendukung untuk perhitungan (diambil sekaligus agar tidak query di dalam loop)
        $absens = Absen::whereBetween('tanggal_scan', [$startDate, $endDate])->get();
        $lemburs = Lembur::whereBetween('tanggal_lembur', [$startDate, $endDate])->get();
        $bonusList = BonusKaryawan::whereBetween('tanggal_bonus', [$startDate, $endDate])->get();
        $cutis = Cuti::with('karyawan')->whereBetween('tanggal_cuti', [$startDate, $endDate])->get();
        $izins = Izin::whereBetween('tanggal_izin', [$startDate, $endDate])->get();
        $potonganList = PotonganTunjangan::whereBetween('periode_payroll', [$startDate, $endDate])->get();

        foreach ($karyawans as $karyawan) {
            if (!$karyawan->user || !$karyawan->user->email) continue;

            $absenKaryawan = $absens->where('nama', $karyawan->nama);
            $tanggalHadirFisik = $absenKaryawan->groupBy(fn($item) => date('Y-m-d', strtotime($item->tanggal_scan)))
                ->filter(fn($group) => $group->where('io', 1)->isNotEmpty() && $group->where('io', 2)->isNotEmpty())
                ->keys()->toArray();

            // --- 2. LOGIKA IZIN & ALPHA ---
            $izinKaryawan = $izins->where('id_karyawan', $karyawan->id);
            $dataIzin = $izinKaryawan->where('jenis_izin', '!=', 'Alpha');
            $totalIzin = $dataIzin->count();
            $tanggalIzinHadir = $dataIzin->map(fn($i) => date('Y-m-d', strtotime($i->tanggal_izin)))->toArray();
            $totalAlpha = $izinKaryawan->where('jenis_izin', 'Alpha')->count();

            // --- 3. LOGIKA CUTI ---
            
            $cutiKaryawan = $cutis->where('karyawan.id', $karyawan->id);
            $tanggalCutiHadir = $cutiKaryawan->map(fn($c) => date('Y-m-d', strtotime($c->tanggal_cuti)))->toArray();

            // --- 4. TOTAL HADIR (SAMA DENGAN INDEX) ---
            // Menggabungkan Fisik + Izin + Cuti lalu di-unique
            $totalHariHadir = count(array_unique(array_merge($tanggalHadirFisik, $tanggalIzinHadir, $tanggalCutiHadir)));

            // --- 5. POTONGAN & TUNJANGAN ---
            $potongan = $potonganList->where('id_karyawan', $karyawan->id)->first();
            $dataGaji = [
                'hadir' => $totalHariHadir,
                'total_izin' => $totalIzin,
                'total_alpha' => $totalAlpha,
                'total_cuti' => $cutiKaryawan->count(),
                'gaji_pokok' => $karyawan->gaji_pokok ?? 0,
                'tunj_kompetensi' => $karyawan->tunjangan_kompetensi ?? 0,
                'tunj_jabatan' => $karyawan->tunjangan_jabatan ?? 0,
                'tunj_intensif' => $karyawan->tunjangan_intensif ?? 0,
                'pot_kompetensi' => $potongan->potongan_tunjangan_kompetensi ?? 0,
                'pot_jabatan' => $potongan->potongan_tunjangan_jabatan ?? 0,
                'pot_intensif' => $potongan->potongan_intensif ?? 0,
                'bonus' => $bonusList->where('id_karyawan', $karyawan->id)->sum('nilai_bonus'),
            ];

            // --- 6. PERHITUNGAN TOTAL GAJI (SAMA DENGAN INDEX) ---
            $komponenTetap = $dataGaji['gaji_pokok'] +
                ($dataGaji['tunj_kompetensi'] - $dataGaji['pot_kompetensi']) +
                ($dataGaji['tunj_jabatan'] - $dataGaji['pot_jabatan']) +
                ($dataGaji['tunj_intensif'] - $dataGaji['pot_intensif']);

            $gajiHarian = $komponenTetap / 25;
            $dataGaji['total_gaji'] = ($gajiHarian * $totalHariHadir) + $dataGaji['bonus'];

            dispatch(new SendSlipGajiJob($karyawan, $bulanText, $tahunText, $dataGaji));
        }

        return back()->with('success', 'Proses pengiriman slip gaji telah dijadwalkan.');
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
