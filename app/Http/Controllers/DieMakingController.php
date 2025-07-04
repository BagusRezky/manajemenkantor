<?php

namespace App\Http\Controllers;

use App\Models\DieMaking;
use App\Models\KartuInstruksiKerja;
use App\Models\Mesin;
use App\Models\Operator;
use Illuminate\Http\Request;

class DieMakingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $dieMakings = DieMaking::with(['mesin', 'operator', 'kartuInstruksiKerja'])->get();
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
        $mesins = Mesin::all();
        $operators = Operator::all();
        return inertia('dieMaking/create', [
            'kartuInstruksiKerjas' => $kartuInstruksiKerjas,
            'mesins' => $mesins,
            'operators' => $operators
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_kartu_instruksi_kerja' => 'required|exists:kartu_instruksi_kerjas,id',
            'id_mesin' => 'required|exists:mesins,id',
            'id_operator' => 'required|exists:operators,id',
            'tanggal_entri' => 'required|date',
            'proses_diemaking' => 'required|in:Hot Print,Uv Spot, Uv Holo, Embos',
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
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DieMaking $dieMaking)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DieMaking $dieMaking)
    {
        //
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
