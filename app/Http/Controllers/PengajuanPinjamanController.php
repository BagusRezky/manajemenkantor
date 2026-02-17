<?php

namespace App\Http\Controllers;

use App\Models\PengajuanPinjaman;
use App\Models\Karyawan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PengajuanPinjamanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pengajuanPinjamans = PengajuanPinjaman::with('karyawan')->get();
        return Inertia::render('pengajuanPinjaman/pengajuanPinjamans', [
            'pengajuanPinjamans' => $pengajuanPinjamans,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $karyawans = Karyawan::select('id', 'nama')->get();
        return Inertia::render('pengajuanPinjaman/create', [
            'karyawans' => $karyawans,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_karyawan' => 'required|exists:karyawans,id',
            'kode_gudang' => 'required|string',
            'tanggal_pengajuan' => 'required|date',
            'nilai_pinjaman' => 'required|integer',
            'jangka_waktu_pinjaman' => 'required|integer',
            'cicilan_per_bulan' => 'required|integer',
            'keperluan_pinjaman' => 'nullable|string',
        ]);

        // === AUTO GENERATE NOMOR BUKTI ===
        $latest = PengajuanPinjaman::latest('id')->first();
        $nextNumber = $latest ? str_pad($latest->id + 1, 3, '0', STR_PAD_LEFT) : '001';

        $month = date('m');
        $year  = date('Y');

        $nomorBukti = "{$nextNumber}/HRD-RMS/BON/{$month}/{$year}";

        $validated['nomor_bukti_pengajuan'] = $nomorBukti;

        PengajuanPinjaman::create($validated);

        return redirect()->route('pengajuanPinjamans.index')->with('success', 'Pengajuan Pinjaman added successfully!');
    }
    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $pengajuanPinjaman = PengajuanPinjaman::with('karyawan')->findOrFail($id);
        return Inertia::render('pengajuanPinjaman/show', [
            'pengajuanPinjaman' => $pengajuanPinjaman,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PengajuanPinjaman $pengajuanPinjaman)
    {
        $karyawans = Karyawan::select('id', 'nama')->get();
        return Inertia::render('pengajuanPinjaman/edit', [
            'pengajuanPinjaman' => $pengajuanPinjaman,
            'karyawans' => $karyawans,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PengajuanPinjaman $pengajuanPinjaman)
    {
        $validated = $request->validate([
            'id_karyawan' => 'required|exists:karyawans,id',
            'kode_gudang' => 'required|string',
            'tanggal_pengajuan' => 'required|date',
            'nilai_pinjaman' => 'required|integer',
            'jangka_waktu_pinjaman' => 'required|integer',
            'cicilan_per_bulan' => 'required|integer',
            'keperluan_pinjaman' => 'nullable|string',
        ]);

        $pengajuanPinjaman->update($validated);
        return redirect()->route('pengajuanPinjamans.index')->with('success', 'Pengajuan Pinjaman updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PengajuanPinjaman $pengajuanPinjaman)
    {
        $pengajuanPinjaman->delete();
        return redirect()->route('pengajuanPinjamans.index')->with('success', 'Pengajuan Pinjaman deleted successfully!');
    }

    public function generatePdf(PengajuanPinjaman $pengajuanPinjaman)
    {
        $pengajuanPinjaman->load('karyawan');

        return response()->json($pengajuanPinjaman);
    }
}
