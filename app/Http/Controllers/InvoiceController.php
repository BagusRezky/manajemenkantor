<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\SuratJalan;
use App\Imports\LegacyInvoiceImport;
use App\Imports\LegacyInvoiceDetailImport;
use Maatwebsite\Excel\Facades\Excel;
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
            ->orderBy('tgl_invoice', 'desc')
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
            ->orderBy('tgl_invoice', 'desc')
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

        // Set default values
        $validated['ongkos_kirim'] = $validated['ongkos_kirim'] ?? 0;
        $validated['uang_muka'] = $validated['uang_muka'] ?? 0;

        // Generate the no_invoice
        $currentMonth = str_pad(date('m'), 2, '0', STR_PAD_LEFT);
        $currentYear = date('y');

        // Pattern: /INV/MMYY (Sesuaikan dengan format Surat Jalan kamu)
        $pattern = '/INV/' . $currentMonth . $currentYear;

        DB::transaction(function () use ($validated, $pattern) {
            // Ambil nomor terakhir berdasarkan pattern bulan & tahun ini
            // Kita gunakan CAST agar sorting numeric-nya benar
            $latestInvoice = Invoice::where('no_invoice', 'like', '%' . $pattern)
                ->orderByRaw('CAST(SUBSTRING_INDEX(no_invoice, "/", 1) AS UNSIGNED) DESC')
                ->lockForUpdate()
                ->first();

            $sequentialNumber = 1;

            if ($latestInvoice) {
                // Pecah string berdasarkan "/" dan ambil bagian pertama
                $parts = explode('/', $latestInvoice->no_invoice);
                if (isset($parts[0]) && is_numeric($parts[0])) {
                    $sequentialNumber = (int) $parts[0] + 1;
                }
            }

            // Format 6 digit (000001)
            $formattedNumber = str_pad($sequentialNumber, 6, '0', STR_PAD_LEFT);

            // Satukan: ######/INV/MMYY
            $validated['no_invoice'] = $formattedNumber . $pattern;

            Invoice::create($validated);
        });

        return redirect()->route('invoices.index')
            ->with('success', 'Invoice berhasil dibuat ');
    }

    /**
     * Display the specified resource.
     */
    public function show(Invoice $invoice)
    {
        // Load semua relasi sistem baru DAN relasi details untuk data legacy
        $invoice->load([
            'suratJalan.kartuInstruksiKerja.salesOrder.customerAddress',
            'suratJalan.kartuInstruksiKerja.salesOrder.finishGoodItem',
            'details' // <--- WAJIB TAMBAH INI agar rincian legacy muncul
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
        // Load relasi agar detail Surat Jalan muncul di form edit
        $invoice->load([
            'suratJalan.kartuInstruksiKerja.salesOrder.customerAddress',
            'suratJalan.kartuInstruksiKerja.salesOrder.finishGoodItem'
        ]);

        // Ambil Surat Jalan yang belum ada invoice-nya, ATAU yang sedang digunakan invoice ini
        $suratJalans = SuratJalan::with([
            'kartuInstruksiKerja.salesOrder.customerAddress',
            'kartuInstruksiKerja.salesOrder.finishGoodItem'
        ])
            ->whereDoesntHave('invoice')
            ->orWhere('id', $invoice->id_surat_jalan)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('invoice/edit', [
            'invoice' => $invoice,
            'suratJalans' => $suratJalans
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Invoice $invoice)
    {
        $validated = $request->validate([

            'id_surat_jalan' => 'required|exists:surat_jalans,id|unique:invoices,id_surat_jalan,' . $invoice->id,
            'no_invoice' => 'required|string|max:255|unique:invoices,no_invoice,' . $invoice->id,
            'tgl_invoice' => 'required|date',
            'tgl_jatuh_tempo' => 'required|date|after_or_equal:tgl_invoice',
            'discount' => 'required|integer|min:0',
            'ppn' => 'required|numeric|min:0|max:100',
            'ongkos_kirim' => 'nullable|integer|min:0',
            'uang_muka' => 'nullable|integer|min:0',
        ]);

        $invoice->update($validated);

        return redirect()->route('invoices.index')->with('success', 'Invoice berhasil diperbarui');
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
        // Samakan dengan show agar saat preview PDF data legacy juga terbaca
        $invoice->load([
            'suratJalan.kartuInstruksiKerja.salesOrder.customerAddress',
            'suratJalan.kartuInstruksiKerja.salesOrder.finishGoodItem',
            'details' // <--- Tambah ini juga bro
        ]);

        return response()->json($invoice);
    }

    public function importLegacy(Request $request)
    {
        $request->validate([
            'file_header' => 'required|mimes:csv,txt,xlsx',
            'file_detail' => 'required|mimes:csv,txt,xlsx',
        ]);

        // Import Header dulu agar ID tersedia
        Excel::import(new LegacyInvoiceImport, $request->file('file_header'));

        // Baru Import Detail
        Excel::import(new LegacyInvoiceDetailImport, $request->file('file_detail'));

        return back()->with('success', 'Data Legacy Berhasil Diimport!');
    }
}
