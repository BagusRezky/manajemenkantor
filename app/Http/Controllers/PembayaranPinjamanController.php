<?php

namespace App\Http\Controllers;

use App\Models\Karyawan;
use App\Models\PembayaranPinjaman;
use App\Models\PengajuanPinjaman;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PembayaranPinjamanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pembayaranPinjamans = PembayaranPinjaman::with(['pengajuanPinjaman', 'pengajuanPinjaman.karyawan'])->orderBy('tanggal_pembayaran', 'desc')->get();
        return Inertia::render('pembayaranPinjaman/pembayaranPinjamans', [
            'pembayaranPinjamans' => $pembayaranPinjamans,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $pengajuanPinjamans = PengajuanPinjaman::with('karyawan')->get();
        return Inertia::render('pembayaranPinjaman/create', [
            'pengajuanPinjamans' => $pengajuanPinjamans,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_pengajuan_pinjaman' => 'required|exists:pengajuan_pinjamans,id',
            'tahap_cicilan' => 'required|string|max:255',
            'tanggal_pembayaran' => 'required|date',
            'nominal_pembayaran' => 'required|integer|min:0',
            'keterangan' => 'nullable|string',
        ]);

        PembayaranPinjaman::create($validated);
        return redirect()->route('pembayaranPinjamans.index')->with('success', 'Pembayaran Pinjaman added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(PembayaranPinjaman $pembayaranPinjaman)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PembayaranPinjaman $pembayaranPinjaman)
    {
        $pengajuanPinjamans = PengajuanPinjaman::with('karyawan')->get();
        return Inertia::render('pembayaranPinjaman/edit', [
            'pembayaranPinjaman' => $pembayaranPinjaman,
            'pengajuanPinjamans' => $pengajuanPinjamans,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PembayaranPinjaman $pembayaranPinjaman)
    {
        $validated = $request->validate([
            'id_pengajuan_pinjaman' => 'required|exists:pengajuan_pinjamans,id',
            'tahap_cicilan' => 'required|string|max:255',
            'tanggal_pembayaran' => 'required|date',
            'nominal_pembayaran' => 'required|integer|min:0',
            'keterangan' => 'nullable|string',
        ]);

        $pembayaranPinjaman->update($validated);
        return redirect()->route('pembayaranPinjamans.index')->with('success', 'Pembayaran Pinjaman updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PembayaranPinjaman $pembayaranPinjaman)
    {
        $pembayaranPinjaman->delete();
        return redirect()->route('pembayaranPinjamans.index')->with('success', 'Pembayaran Pinjaman deleted successfully!');
    }

    public function rekap()
    {
        $rekap = Karyawan::with(['pengajuanPinjaman.pembayaranPinjaman'])
            ->get()
            ->map(function ($karyawan) {
                // hitung total pinjaman
                $totalPinjaman = $karyawan->pengajuanPinjaman->sum('nilai_pinjaman');

                // hitung total bayar (dari semua pengajuan)
                $totalBayar = $karyawan->pengajuanPinjaman->flatMap(function ($pengajuan) {
                    return $pengajuan->pembayaranPinjaman;
                })->sum('nominal_pembayaran');

                $sisa = $totalPinjaman - $totalBayar;

                return [
                    'id' => $karyawan->id,
                    'nama_karyawan' => $karyawan->nama,
                    'total_pinjaman' => $totalPinjaman,
                    'total_bayar' => $totalBayar,
                    'sisa' => $sisa,
                    'status' => $sisa <= 0 ? 'Lunas' : 'Belum Lunas',
                ];
            });

        return Inertia::render('pembayaranPinjaman/rekap', [
            'pembayaranPinjamans' => $rekap,
        ]);
    }

    public function generatePdf(PembayaranPinjaman $pembayaranPinjaman)
    {
        $pembayaranPinjaman->load(['pengajuanPinjaman', 'pengajuanPinjaman.karyawan']);

        return response()->json($pembayaranPinjaman);
    }
}
