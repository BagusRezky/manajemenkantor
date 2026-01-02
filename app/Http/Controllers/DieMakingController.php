<?php

namespace App\Http\Controllers;

use App\Models\DieMaking;
use App\Models\KartuInstruksiKerja;
use App\Models\MesinDiemaking;
use App\Models\OperatorDiemaking;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DieMakingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $dieMakings = DieMaking::with(['mesinDiemaking', 'operatorDiemaking', 'kartuInstruksiKerja'])->get();
        return inertia('dieMaking/dieMakings', [
            'dieMakings' => $dieMakings,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $kartuInstruksiKerjas = KartuInstruksiKerja::all();
        $mesinDiemakings = MesinDiemaking::all();
        $operatorDiemakings = OperatorDiemaking::all();
        return inertia('dieMaking/create', [
            'kartuInstruksiKerjas' => $kartuInstruksiKerjas,
            'mesinDiemakings' => $mesinDiemakings,
            'operatorDiemakings' => $operatorDiemakings
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_kartu_instruksi_kerja' => 'required|exists:kartu_instruksi_kerjas,id',
            'id_mesin_diemaking' => 'required|exists:mesin_diemakings,id',
            'id_operator_diemaking' => 'required|exists:operator_diemakings,id',
            'tanggal_entri' => 'required|date',
            'proses_diemaking' => 'required|in:Hot Print,Uv Spot,Uv Holo,Embos,Cutting,Uv Varnish',
            'tahap_diemaking' => 'required|in:Proses Die Making 1,Proses Die Making 2',
            'hasil_baik_diemaking' => 'required|numeric|min:0',
            'hasil_rusak_diemaking' => 'required|numeric|min:0',
            'semi_waste_diemaking' => 'required|numeric|min:0',
            'keterangan_diemaking' => 'required|in:Reguler,Subcount',
        ]);

        $validated['hasil_baik_diemaking'] = (int) $validated['hasil_baik_diemaking'];
        $validated['hasil_rusak_diemaking'] = (int) $validated['hasil_rusak_diemaking'];
        $validated['semi_waste_diemaking'] = (int) $validated['semi_waste_diemaking'];

        $validated['kode_diemaking'] = strtoupper('DM-' . date('Ymd'));

        DieMaking::create($validated);

        return redirect()->route('dieMakings.index')->with('success', 'Data Die Making berhasil disimpan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(DieMaking $dieMaking)
    {
        $dieMaking->load(['mesinDiemaking', 'operatorDiemaking', 'kartuInstruksiKerja']);

        return Inertia::render('dieMaking/show', [
            'dieMaking' => $dieMaking,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DieMaking $dieMaking)
    {
        return Inertia::render('dieMaking/edit', [
            'dieMaking' => $dieMaking,
            'kartuInstruksiKerjas' => KartuInstruksiKerja::all(),
            'mesinDiemakings' => MesinDiemaking::all(),
            'operatorDiemakings' => OperatorDiemaking::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DieMaking $dieMaking)
    {
        $validated = $request->validate([
            'id_kartu_instruksi_kerja' => 'required|exists:kartu_instruksi_kerjas,id',
            'id_mesin_diemaking' => 'required|exists:mesin_diemakings,id',
            'id_operator_diemaking' => 'required|exists:operator_diemakings,id',
            'tanggal_entri' => 'required|date',
            'proses_diemaking' => 'required|in:Hot Print,Uv Spot,Uv Holo,Embos,Cutting,Uv Varnish',
            'tahap_diemaking' => 'required|in:Proses Die Making 1,Proses Die Making 2',
            'hasil_baik_diemaking' => 'required|numeric|min:0',
            'hasil_rusak_diemaking' => 'required|numeric|min:0',
            'semi_waste_diemaking' => 'required|numeric|min:0',
            'keterangan_diemaking' => 'required|in:Reguler,Subcount',
        ]);

        // Casting ke integer
        $validated['hasil_baik_diemaking'] = (int) $validated['hasil_baik_diemaking'];
        $validated['hasil_rusak_diemaking'] = (int) $validated['hasil_rusak_diemaking'];
        $validated['semi_waste_diemaking'] = (int) $validated['semi_waste_diemaking'];

        $dieMaking->update($validated);

        return redirect()->route('dieMakings.index')->with('success', 'Data Die Making berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DieMaking $dieMaking)
    {
        $dieMaking->delete();
        return redirect()->route('dieMakings.index')->with('success', 'Data Die Making berhasil dihapus.');
    }
}
