<?php

namespace App\Http\Controllers;

use App\Models\Printing;
use App\Models\Mesin;
use App\Models\Operator;
use App\Models\KartuInstruksiKerja;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PrintingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $printings = Printing::with(['mesin', 'operator', 'kartuInstruksiKerja'])->get();
        return inertia('printing/printings', [
            'printings' => $printings,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $kartuInstruksiKerjas = KartuInstruksiKerja::with(['salesOrder.finishGoodItem'])->get();
        $mesins = Mesin::all();
        $operators = Operator::all();
        return Inertia::render('printing/create', [
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
        // Debug: Lihat data yang diterima
        Log::info('Request data:', $request->all());

        $validated = $request->validate([
            'id_kartu_instruksi_kerja' => 'required|exists:kartu_instruksi_kerjas,id',
            'id_mesin' => 'required|exists:mesins,id',
            'id_operator' => 'required|exists:operators,id',
            'tanggal_entri' => 'required|date',
            'proses_printing' => 'required|in:Potong,Printing',
            'tahap_printing' => 'required|in:Potong,Proses Cetak',
            'hasil_baik_printing' => 'required|numeric|min:0',
            'hasil_rusak_printing' => 'required|numeric|min:0',
            'semi_waste_printing' => 'required|numeric|min:0',
            'keterangan_printing' => 'required|in:Reguler,Subcount',
        ]);

        // Debug: Lihat data setelah validasi
        Log::info('Validated data:', $validated);

        // Convert string numbers to integers
        $validated['hasil_baik_printing'] = (int) $validated['hasil_baik_printing'];
        $validated['hasil_rusak_printing'] = (int) $validated['hasil_rusak_printing'];
        $validated['semi_waste_printing'] = (int) $validated['semi_waste_printing'];

        // Generate kode_printing - HAPUS dari validation karena auto-generated
        $validated['kode_printing'] = 'Print-' . date('Ymd');

        // Debug: Lihat data final sebelum create
        Log::info('Final data before create:', $validated);

        $printing = Printing::create($validated);

        // Debug: Lihat data setelah create
        Log::info('Created printing:', $printing->toArray());

        return redirect()->route('printings.index')
            ->with('success', 'Printing record added successfully!');
    }


    /**
     * Display the specified resource.
     */
    public function show(Printing $printing)
    {
        $printing->load(['mesin', 'operator', 'kartuInstruksiKerja']);
        return inertia('printing/show', [
            'printing' => $printing,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Printing $printing)
    {
        $kartuInstruksiKerjas = KartuInstruksiKerja::all();
        $mesins = Mesin::all();
        $operators = Operator::all();

        return inertia::render('printing/edit', [
            'printing' => $printing,
            'kartuInstruksiKerjas' => $kartuInstruksiKerjas,
            'mesins' => $mesins,
            'operators' => $operators
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Printing $printing)
    {

        $validated = $request->validate([
            'id_kartu_instruksi_kerja' => 'required|exists:kartu_instruksi_kerjas,id',
            'id_mesin' => 'required|exists:mesins,id',
            'id_operator' => 'required|exists:operators,id',
            'tanggal_entri' => 'required|date',
            'proses_printing' => 'required|string|max:255',
            'tahap_printing' => 'required|string|max:255',
            'hasil_baik_printing' => 'required|integer|min:0',
            'hasil_rusak_printing' => 'required|integer|min:0',
            'semi_waste_printing' => 'required|integer|min:0',
            'keterangan_printing' => 'nullable|string',
        ]);

        $printing->update($validated);

        return redirect()->route('printings.index')
            ->with('success', 'Data printing berhasil diperbarui');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Printing $printing)
    {
        $printing->delete();
        return redirect()->route('printings.index')
            ->with('success', 'Data printing berhasil dihapus');
    }

    public function pdf(Printing $printing)
    {
        $printing->load([
            'kartuInstruksiKerja',
            'mesin',
            'operator'
        ]);

        return response()->json($printing);
    }
}
