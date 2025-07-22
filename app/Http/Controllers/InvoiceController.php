<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\SuratJalan;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $invoices = Invoice::with('suratJalan.kartuInstruksiKerja.salesOrder.customerAddress')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('invoice/invoices', [
            'invoices' => $invoices
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Ambil surat jalan yang belum memiliki invoice
        $suratJalans = SuratJalan::with([
            'kartuInstruksiKerja.salesOrder.customerAddress',
            'kartuInstruksiKerja.salesOrder.finishGoodItem'
        ])
            ->whereDoesntHave('invoice')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('invoice/create', [
            'suratJalans' => $suratJalans
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_surat_jalan' => 'required|exists:surat_jalans,id|unique:invoices,id_surat_jalan',
            'no_invoice' => 'required|string|max:255|unique:invoices,no_invoice',
            'tgl_invoice' => 'required|date',
            'tgl_jatuh_tempo' => 'required|date|after_or_equal:tgl_invoice',
            'harga' => 'required|integer|min:0',
            'ppn' => 'required|numeric|min:0|max:100',
            'ongkos_kirim' => 'nullable|integer|min:0',
            'uang_muka' => 'nullable|integer|min:0',
        ]);
        // Set default values untuk field nullable
        $validated['ongkos_kirim'] = $validated['ongkos_kirim'] ?? 0;
        $validated['uang_muka'] = $validated['uang_muka'] ?? 0;

        DB::transaction(function () use ($validated) {
            Invoice::create($validated);
        });

        return redirect()->route('invoices.index')
            ->with('success', 'Invoice berhasil dibuat');
    }

    /**
     * Display the specified resource.
     */
    public function show(Invoice $invoice)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Invoice $invoice)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Invoice $invoice)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invoice $invoice)
    {
        DB::transaction(function () use ($invoice) {
            $invoice->delete();
        });

        return redirect()->route('invoices.index')
            ->with('success', 'Invoice berhasil dihapus');
    }

    /**
     * Generate PDF invoice
     */
    public function generatePdf(Invoice $invoice)
    {
        $invoice->load([
            'suratJalan.kartuInstruksiKerja.salesOrder.customerAddress',
            'suratJalan.kartuInstruksiKerja.salesOrder.finishGoodItem'
        ]);

        return response()->json($invoice);
    }
}
