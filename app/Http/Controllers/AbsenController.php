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


    // Index
    public function index()
    {
        // Ambil semua data absensi terbaru
        $absens = Absen::orderBy('tanggal_scan', 'desc')->get();

        return Inertia::render('absen/absens', [
            'absens' => $absens
        ]);
    }

    public function create()
    {
        $karyawans = Karyawan::select('id', 'nama', 'pin', 'nip', 'jabatan', 'departemen', 'kantor')->get();
        return Inertia::render('absen/create', [
            'karyawans' => $karyawans
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'karyawan_id' => 'required|exists:karyawans,id',
            'tanggal_scan' => 'required|date',
            'io' => 'required|in:1,2',
            'verifikasi' => 'required|integer',
            'workcode' => 'required|integer',
            'sn' => 'required|string',
            'mesin' => 'required|string',
        ]);

        // Ambil data karyawan berdasarkan id
        $karyawan = Karyawan::findOrFail($validated['karyawan_id']);

        // Gabungkan data otomatis dari karyawan ke absen
        Absen::create([
            'tanggal_scan' => $validated['tanggal_scan'],
            'tanggal' => date('Y-m-d', strtotime($validated['tanggal_scan'])),
            'jam' =>  date('H:i:s', strtotime($validated['tanggal_scan'])),
            'io' => $validated['io'],
            'pin' => $karyawan->pin,
            'nip' => $karyawan->nip,
            'nama' => $karyawan->nama,
            'jabatan' => $karyawan->jabatan,
            'departemen' => $karyawan->departemen,
            'kantor' => $karyawan->kantor,
        ]);

        return redirect()->route('absens.index')->with('success', 'Data absen berhasil ditambahkan!');
    }

    public function edit($id)
    {
        $absen = Absen::findOrFail($id);
        $karyawans = Karyawan::select('id', 'nama', 'pin', 'nip', 'jabatan', 'departemen', 'kantor')->get();

        return Inertia::render('absen/edit', [
            'absen' => $absen,
            'karyawans' => $karyawans
        ]);
    }

    public function update(Request $request, $id)
    {
        $absen = Absen::findOrFail($id);

        $validated = $request->validate([
            'karyawan_id' => 'nullable|exists:karyawans,id',
            'tanggal_scan' => 'required|date_format:Y-m-d H:i:s',
            'io' => 'required|in:1,2',
            'verifikasi' => 'required|integer',
            'workcode' => 'required|integer',
            'sn' => 'required|string',
            'mesin' => 'required|string',
        ]);

        // Siapkan data update dasar
        $dataUpdate = [
            'tanggal_scan' => $validated['tanggal_scan'],
            'tanggal' => date('Y-m-d', strtotime($validated['tanggal_scan'])),
            'jam' => date('H:i:s', strtotime($validated['tanggal_scan'])),
            'io' => $validated['io'],
            'verifikasi' => $validated['verifikasi'],
            'workcode' => $validated['workcode'],
            'sn' => $validated['sn'],
            'mesin' => $validated['mesin'],
        ];

        // Kalau user pilih karyawan dari dropdown baru, update juga info karyawan
        if (!empty($validated['karyawan_id'])) {
            $karyawan = Karyawan::findOrFail($validated['karyawan_id']);
            $dataUpdate = array_merge($dataUpdate, [
                'pin' => $karyawan->pin,
                'nip' => $karyawan->nip,
                'nama' => $karyawan->nama,
                'jabatan' => $karyawan->jabatan,
                'departemen' => $karyawan->departemen,
                'kantor' => $karyawan->kantor,
            ]);
        }

        $absen->update($dataUpdate);

        return redirect()->route('absens.index')->with('success', 'Data absen berhasil diperbarui!');
    }

    public function rekap(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate   = $request->input('end_date');

        // Ambil semua karyawan
        $karyawans = Karyawan::select('id', 'nama', 'pin', 'status_lembur', 'departemen')->get();

        // Ambil semua absensi
        $absens = Absen::select('nama', 'pin', 'tanggal_scan', 'jam', 'io', 'departemen')
            ->when($startDate && $endDate, function ($query) use ($startDate, $endDate) {
                $query->whereBetween('tanggal_scan', [
                    $startDate . ' 00:00:00',
                    $endDate . ' 23:59:59'
                ]);
            })
            ->get();

        // Ambil semua lembur, izin, cuti
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

            // Hitung jumlah hari hadir unik
            $hadir = $absenKaryawan
                ->where('io', 1)
                ->groupBy(fn($item) => date('Y-m-d', strtotime($item->tanggal_scan)))
                ->count();

            // Data lembur manual
            $lemburKaryawan = $lemburs->where('karyawan.nama', $karyawan->nama);

            // Hitung total jam lembur manual
            $totalDetikLemburManual = $lemburKaryawan->reduce(function ($carry, $lembur) {
                $awal = strtotime($lembur->jam_awal_lembur);
                $selesai = strtotime($lembur->jam_selesai_lembur);
                return $carry + max(0, $selesai - $awal);
            }, 0);

            // --- Lembur otomatis (untuk produksi & status lembur) ---
            $totalDetikLemburAuto = 0;
            $lemburKaliAuto = 0;

            if (
                strtolower($karyawan->departemen ?? '') === 'produksi' &&
                strtolower($karyawan->status_lembur ?? '') === 'lembur'
            ) {
                $absenPulang = $absenKaryawan->where('io', 2);

                foreach ($absenPulang as $absen) {
                    $jamPulang = strtotime($absen->jam);
                    $batasLembur = strtotime('17:00:00');

                    if ($jamPulang > $batasLembur) {
                        $lemburKaliAuto++;
                        $totalDetikLemburAuto += ($jamPulang - $batasLembur);
                    }
                }
            }

            // Total lembur gabungan (manual + auto)
            $totalDetikLembur = $totalDetikLemburManual + $totalDetikLemburAuto;
            $lemburKali = $lemburKaryawan->count() + $lemburKaliAuto;

            // Ubah ke format HH:MM:SS
            $jam   = floor($totalDetikLembur / 3600);
            $menit = floor(($totalDetikLembur % 3600) / 60);
            $detik = $totalDetikLembur % 60;
            $totalFormat = sprintf('%02d:%02d:%02d', $jam, $menit, $detik);

            // Ambil contoh tanggal
            $tanggalContoh = $absenKaryawan->first()?->tanggal_scan;
            $bulan = $tanggalContoh ? date('n', strtotime($tanggalContoh)) : null;
            $tahun = $tanggalContoh ? date('Y', strtotime($tanggalContoh)) : null;

            return [
                'nama'             => $karyawan->nama,
                'hadir'            => $hadir,
                'kedatangan_kali'  => $kedatanganKali,
                'pulang_kali'      => $pulangKali,
                'lembur_kali'      => $lemburKali,
                'total_jam_lembur' => $totalFormat,
                'izin_kali'        => $izins->where('karyawan.nama', $karyawan->nama)->count(),
                'cuti_kali'        => $cutis->where('karyawan.nama', $karyawan->nama)->count(),
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


    public function deleteByPeriod(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $start = $request->start_date . ' 00:00:00';
        $end = $request->end_date . ' 23:59:59';

        // Hapus semua absen dalam periode
        $deleted = Absen::whereBetween('tanggal_scan', [$start, $end])->delete();

        return redirect()->route('absens.index')->with('success', "{$deleted} data absensi berhasil dihapus dari {$request->start_date} sampai {$request->end_date}!");
    }

    // Import Excel
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv',
        ]);

        Excel::import(new AbsenImport, $request->file('file'));

        return redirect()->route('absens.index')->with('success', 'Data absen berhasil diimport!');
    }
}
