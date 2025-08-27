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
            'tgl_invoice' => 'required|date',
            'tgl_jatuh_tempo' => 'required|date|after_or_equal:tgl_invoice',
            'discount' => 'required|integer|min:0',
            'ppn' => 'required|numeric|min:0|max:100',
            'ongkos_kirim' => 'nullable|integer|min:0',
            'uang_muka' => 'nullable|integer|min:0',
        ]);

        // Set default values untuk field nullable
        $validated['ongkos_kirim'] = $validated['ongkos_kirim'] ?? 0;
        $validated['uang_muka'] = $validated['uang_muka'] ?? 0;

        // Generate the no_invoice
        $currentMonth = date('m');
        $currentYear = date('y');

        // Get the latest invoice number for the current year
        $latestInvoice = Invoice::where('no_invoice', 'like', '%/INV/' . $currentYear)
            ->orderBy('created_at', 'desc')
            ->first();

        $sequentialNumber = 1;

        if ($latestInvoice) {
            // Extract the sequential number from the latest invoice
            $parts = explode('/', $latestInvoice->no_invoice);
            if (isset($parts[0])) {
                $sequentialNumber = (int) $parts[0] + 1;
            }
        }

        // Format the sequential number with leading zeros
        $formattedNumber = str_pad($sequentialNumber, 6, '0', STR_PAD_LEFT);

        // Create the final no_invoice
        $validated['no_invoice'] = $formattedNumber . '/INV/' . $currentMonth . $currentYear;

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
        // Load semua relasi yang diperlukan untuk halaman show
        $invoice->load([
            'suratJalan.kartuInstruksiKerja.salesOrder.customerAddress',
            'suratJalan.kartuInstruksiKerja.salesOrder.finishGoodItem'
        ]);

        return Inertia::render('invoice/show', [
            'invoice' => $invoice
        ]);
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
