<?php

namespace App\Http\Controllers;

use App\Models\Finishing;
use Illuminate\Http\Request;
use App\Models\KartuInstruksiKerja;
use App\Models\MesinFinishing;
use App\Models\OperatorFinishing;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class FinishingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $finishings = Finishing::with([
            'kartuInstruksiKerja',
            'mesinFinishing',
            'operatorFinishing'
        ])->orderBy('created_at', 'desc')->get();

        return Inertia::render('finishing/finishings', [
            'finishings' => $finishings
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $kartuInstruksiKerjas = KartuInstruksiKerja::all();
        $mesinFinishings = MesinFinishing::all();
        $operatorFinishings = OperatorFinishing::all();

        return Inertia::render('finishing/create', [
            'kartuInstruksiKerjas' => $kartuInstruksiKerjas,
            'mesinFinishings' => $mesinFinishings,
            'operatorFinishings' => $operatorFinishings
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Debug: Lihat data yang diterima
        Log::info('Finishing Request data:', $request->all());

        $validated = $request->validate([
            'id_kartu_instruksi_kerja' => 'required|exists:kartu_instruksi_kerjas,id',
            'id_mesin_finishing' => 'required|exists:mesin_finishings,id',
            'id_operator_finishing' => 'required|exists:operator_finishings,id',
            'tanggal_entri' => 'required|date',
            'proses_finishing' => 'required|in:Protol,Sorter',
            'tahap_finishing' => 'required|in:Reguler,Semi Waste,Blokir,Retur',
            'hasil_baik_finishing' => 'required|numeric|min:0',
            'hasil_rusak_finishing' => 'required|numeric|min:0',
            'semi_waste_finishing' => 'required|numeric|min:0',
            'keterangan_finishing' => 'required|in:Reguler,Subcount',
        ]);

        // Debug: Lihat data setelah validasi
        Log::info('Finishing Validated data:', $validated);

        // Convert string numbers to integers
        $validated['hasil_baik_finishing'] = (int) $validated['hasil_baik_finishing'];
        $validated['hasil_rusak_finishing'] = (int) $validated['hasil_rusak_finishing'];
        $validated['semi_waste_finishing'] = (int) $validated['semi_waste_finishing'];

        // Generate kode_finishing
        $validated['kode_finishing'] = 'FIN-' . date('Ymd') ;

        // Debug: Lihat data final sebelum create
        Log::info('Finishing Final data before create:', $validated);

        $finishing = Finishing::create($validated);

        // Debug: Lihat data setelah create
        Log::info('Created finishing:', $finishing->toArray());

        return redirect()->route('finishings.index')
            ->with('success', 'Data finishing berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(Finishing $finishing)
    {
        $finishing->load([
            'kartuInstruksiKerja',
            'mesinFinishing',
            'operatorFinishing'
        ]);

        return Inertia::render('finishing/show', [
            'finishing' => $finishing
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Finishing $finishing)
    {
        $kartuInstruksiKerjas = KartuInstruksiKerja::all();
        $mesinFinishings = MesinFinishing::all();
        $operatorFinishings = OperatorFinishing::all();

        return Inertia::render('finishing/edit', [
            'finishing' => $finishing,
            'kartuInstruksiKerjas' => $kartuInstruksiKerjas,
            'mesinFinishings' => $mesinFinishings,
            'operatorFinishings' => $operatorFinishings
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Finishing $finishing)
    {
        $validated = $request->validate([
            'id_kartu_instruksi_kerja' => 'required|exists:kartu_instruksi_kerjas,id',
            'id_mesin_finishing' => 'required|exists:mesin_finishings,id',
            'id_operator_finishing' => 'required|exists:operator_finishings,id',
            'tanggal_entri' => 'required|date',
            'proses_finishing' => 'required|in:Protol,Sorter',
            'tahap_finishing' => 'required|in:Reguler,Semi Waste,Blokir,Retur',
            'hasil_baik_finishing' => 'required|numeric|min:0',
            'hasil_rusak_finishing' => 'required|numeric|min:0',
            'semi_waste_finishing' => 'required|numeric|min:0',
            'keterangan_finishing' => 'required|in:Reguler,Subcount',
        ]);

        // Convert string numbers to integers
        $validated['hasil_baik_finishing'] = (int) $validated['hasil_baik_finishing'];
        $validated['hasil_rusak_finishing'] = (int) $validated['hasil_rusak_finishing'];
        $validated['semi_waste_finishing'] = (int) $validated['semi_waste_finishing'];

        $finishing->update($validated);

        return redirect()->route('finishings.index')
            ->with('success', 'Data finishing berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Finishing $finishing)
    {
        $finishing->delete();

        return redirect()->route('finishings.index')
            ->with('success', 'Data finishing berhasil dihapus');
    }

    /**
     * Get finishing data for PDF generation
     */
    public function pdf(Finishing $finishing)
    {
        $finishing->load([
            'kartuInstruksiKerja',
            'mesinFinishing',
            'operatorFinishing'
        ]);

        return response()->json($finishing);
    }
}
