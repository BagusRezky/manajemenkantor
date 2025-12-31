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
        $karyawans = Karyawan::select('id', 'nama', 'pin', 'status_lembur')->get();

        // Query dasar dengan filter tanggal
        $queryAbsens = Absen::select('nama', 'pin', 'tanggal_scan', 'io');
        $queryLemburs = Lembur::with('karyawan');
        $queryIzins   = Izin::with('karyawan');
        $queryCutis   = Cuti::with('karyawan');

        if ($startDate && $endDate) {
            $start = $startDate . ' 00:00:00';
            $end   = $endDate . ' 23:59:59';

            $queryAbsens->whereBetween('tanggal_scan', [$start, $end]);
            $queryLemburs->whereBetween('tanggal_lembur', [$start, $end]);
            $queryIzins->whereBetween('tanggal_izin', [$start, $end]);
            $queryCutis->whereBetween('tanggal_cuti', [$start, $end]);
        }

        $absens = $queryAbsens->get();
        $lemburs = $queryLemburs->get();
        $izins   = $queryIzins->get();
        $cutis   = $queryCutis->get();

        $rekapAbsens = $karyawans->map(function ($karyawan) use ($absens, $lemburs, $izins, $cutis) {

            // --- 1. LOGIKA KEHADIRAN FISIK (io 1 & 2) ---
            $absenKaryawan = $absens->where('nama', $karyawan->nama);
            $tanggalHadirFisik = $absenKaryawan->groupBy(function ($item) {
                return date('Y-m-d', strtotime($item->tanggal_scan));
            })->filter(function ($group) {
                return $group->where('io', 1)->isNotEmpty() && $group->where('io', 2)->isNotEmpty();
            })->keys()->toArray();

            // --- 2. LOGIKA IZIN & ALPHA ---
            $izinKaryawan = $izins->where('id_karyawan', $karyawan->id);
            $dataIzinNonAlpha = $izinKaryawan->where('jenis_izin', '!=', 'Alpha');

            $totalIzin = $dataIzinNonAlpha->count();
            $totalAlpha = $izinKaryawan->where('jenis_izin', 'Alpha')->count();

            $tanggalIzinHadir = $dataIzinNonAlpha->map(fn($i) => date('Y-m-d', strtotime($i->tanggal_izin)))->toArray();

            // --- 3. LOGIKA CUTI ---
            $cutiKaryawan = $cutis->where('karyawan.id', $karyawan->id);
            $totalCuti = $cutiKaryawan->count();
            $tanggalCutiHadir = $cutiKaryawan->map(fn($c) => date('Y-m-d', strtotime($c->tanggal_cuti)))->toArray();

            // --- 4. TOTAL HADIR (Sinkron dengan Fitur Gaji) ---
            $totalHariHadir = count(array_unique(array_merge($tanggalHadirFisik, $tanggalIzinHadir, $tanggalCutiHadir)));

            // --- LEMBUR ---
            $lemburKaryawan = $lemburs->where('karyawan.id', $karyawan->id);
            $totalDetikLembur = $lemburKaryawan->reduce(function ($carry, $lembur) {
                return $carry + max(0, strtotime($lembur->jam_selesai_lembur) - strtotime($lembur->jam_awal_lembur));
            }, 0);

            $totalFormat = sprintf('%02d:%02d:%02d', floor($totalDetikLembur / 3600), floor(($totalDetikLembur % 3600) / 60), $totalDetikLembur % 60);

            return [
                'nama'             => $karyawan->nama,
                'hadir'            => $totalHariHadir,
                'kedatangan_kali'  => $absenKaryawan->where('io', 1)->count(),
                'pulang_kali'      => $absenKaryawan->where('io', 2)->count(),
                'lembur_kali'      => $lemburKaryawan->count(),
                'total_jam_lembur' => $totalFormat,
                'izin_kali'        => $totalIzin,
                'cuti_kali'        => $totalCuti,
                'alpha_kali'       => $totalAlpha, // Tambahan Alpha
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
