<?php

namespace App\Http\Controllers;

use App\Models\Packaging;
use App\Models\KartuInstruksiKerja;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PackagingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $packagings = Packaging::with('kartuInstruksiKerja')->get();

        return Inertia::render('packaging/packagings', [
            'packagings' => $packagings
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $kartuInstruksiKerjas = KartuInstruksiKerja::all();

        return Inertia::render('packaging/create', [
            'kartuInstruksiKerjas' => $kartuInstruksiKerjas
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_kartu_instruksi_kerja' => 'required|exists:kartu_instruksi_kerjas,id',
            'satuan_transfer' => 'required|in:Box,Pallete,Pack',
            'jenis_transfer' => 'required|in:Barang Hasil Baik,Label Kuning,Blokir',
            'tgl_transfer' => 'required|date',
            'jumlah_satuan_penuh' => 'required|integer|min:0',
            'qty_persatuan_penuh' => 'required|integer|min:0',
            'jumlah_satuan_sisa' => 'required|integer|min:0',
            'qty_persatuan_sisa' => 'required|integer|min:0',
        ]);

        // Generate kode packaging
        $validated['kode_packaging'] = 'PKG-' . date('Ymd');

        Packaging::create($validated);

        return redirect()->route('packagings.index')
            ->with('success', 'Packaging berhasil dibuat');
    }

    /**
     * Display the specified resource.
     */
    public function show(Packaging $packaging)
    {
        $packaging->load('kartuInstruksiKerja');

        return Inertia::render('packaging/show', [
            'packaging' => $packaging
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Packaging $packaging)
    {
        $kartuInstruksiKerjas = KartuInstruksiKerja::all();

        return Inertia::render('packaging/edit', [
            'packaging' => $packaging,
            'kartuInstruksiKerjas' => $kartuInstruksiKerjas
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Packaging $packaging)
    {
        $validated = $request->validate([
            'id_kartu_instruksi_kerja' => 'required|exists:kartu_instruksi_kerjas,id',
            'satuan_transfer' => 'required|in:Box,Pallete,Pack',
            'jenis_transfer' => 'required|in:Barang Hasil Baik, Label Kuning, Blokir',
            'tgl_transfer' => 'required|date',
            'jumlah_satuan_penuh' => 'required|integer|min:0',
            'qty_persatuan_penuh' => 'required|integer|min:0',
            'jumlah_satuan_sisa' => 'required|integer|min:0',
            'qty_persatuan_sisa' => 'required|integer|min:0',
        ]);

        $packaging->update($validated);

        return redirect()->route('packagings.index')
            ->with('success', 'Packaging berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Packaging $packaging)
    {
        $packaging->delete();

        return redirect()->route('packagings.index')
            ->with('success', 'Packaging berhasil dihapus');
    }

    /**
     * Get packaging data for PDF generation
     */
    public function generatePdf(Packaging $packaging)
    {
        $packaging->load('kartuInstruksiKerja');

        return response()->json($packaging);
    }

    public function getLabelStartNumber($kikId, $packagingId)
{
    // Sekarang packagingId pasti ada
    $previousPackagings = Packaging::where('id_kartu_instruksi_kerja', $kikId)
        ->where('id', '<', $packagingId)
        ->orderBy('id', 'asc')
        ->get();

    Log::info('KIK ID: ' . $kikId);
    Log::info('Current packaging ID: ' . $packagingId);
    Log::info('Previous packagings (ID < current): ' . $previousPackagings->pluck('id'));

    $startNumber = 1;

    foreach ($previousPackagings as $packaging) {
        $totalLabels = $packaging->jumlah_satuan_penuh + $packaging->jumlah_satuan_sisa;
        Log::info("Packaging ID {$packaging->id}: {$totalLabels} labels");
        $startNumber += $totalLabels;
    }

    Log::info('Final start number: ' . $startNumber);

    return response()->json(['startNumber' => $startNumber]);
}
}
