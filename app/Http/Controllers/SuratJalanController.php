<?php

namespace App\Http\Controllers;

use App\Models\SuratJalan;
use App\Models\KartuInstruksiKerja;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Http\Request;

class SuratJalanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $suratJalans = SuratJalan::with([

            'kartuInstruksiKerja.salesOrder.customerAddress',
            'kartuInstruksiKerja.salesOrder.finishGoodItem'
        ])->orderBy('created_at', 'desc')->get();

        return Inertia::render('suratJalan/suratJalans', [
            'suratJalans' => $suratJalans
        ]);
    }

    public function create()
    {
        // Ambil KIK yang belum memiliki surat jalan
        $kartuInstruksiKerjas = KartuInstruksiKerja::with([
            'salesOrder.customerAddress', // camelCase version
            'sales_order.customer_address', // snake_case version
            'salesOrder.finishGoodItem',
            'sales_order.finish_good_item',
            'packagings',
            'blokirs',
            'suratJalans'
        ])

            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('suratJalan/create', [
            'kartuInstruksiKerjas' => $kartuInstruksiKerjas
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_kartu_instruksi_kerja' => 'required|exists:kartu_instruksi_kerjas,id',
            'tgl_surat_jalan' => 'required|date',
            'transportasi' => 'required|string|max:255',
            'no_polisi' => 'required|string|max:255',
            'driver' => 'required|string|max:255',
            'pengirim' => 'required|string|max:255',
            'keterangan' => 'nullable|string',
            'alamat_tujuan' => 'required|string',
            'qty_pengiriman' => 'required|integer|min:0',
        ]);

        // Generate the no_surat_jalan
        $currentMonth = str_pad(date('m'), 2, '0', STR_PAD_LEFT);
        $currentYear = date('y');

        // Pattern untuk tahun ini: format ######/SJ/MMYY
        $yearPattern = '/SJ/' . $currentMonth . $currentYear;

        DB::transaction(function () use ($validated, $yearPattern) {
            // Get the latest sequential number for this month and year
            $latestSuratJalan = SuratJalan::where('no_surat_jalan', 'like', '%' . $yearPattern)
                ->orderByRaw('CAST(SUBSTRING_INDEX(no_surat_jalan, "/", 1) AS UNSIGNED) DESC')
                ->lockForUpdate()
                ->first();

            $sequentialNumber = 1;

            if ($latestSuratJalan) {
                // Extract the sequential number from the latest surat jalan
                $parts = explode('/', $latestSuratJalan->no_surat_jalan);
                if (isset($parts[0]) && is_numeric($parts[0])) {
                    $sequentialNumber = (int) $parts[0] + 1;
                }
            }

            // Format the sequential number with leading zeros (6 digits)
            $formattedNumber = str_pad($sequentialNumber, 6, '0', STR_PAD_LEFT);

            // Create the final no_surat_jalan
            $validated['no_surat_jalan'] = $formattedNumber . $yearPattern;

            SuratJalan::create($validated);
        });

        return redirect()->route('suratJalans.index')
            ->with('success', 'Surat Jalan berhasil dibuat');
    }

    public function show(SuratJalan $suratJalan)
    {
        $suratJalan->load([
            'kartuInstruksiKerja.salesOrder.customerAddress',
            'kartuInstruksiKerja.salesOrder.finishGoodItem',
            'kartuInstruksiKerja.kartuInstruksiKerjaBoms.billOfMaterials.masterItem.unit'
        ]);

        return Inertia::render('suratJalan/show', [
            'suratJalan' => $suratJalan
        ]);
    }

    public function edit(SuratJalan $suratJalan)
    {
        $suratJalan->load([
            'kartuInstruksiKerja.salesOrder.customerAddress'
        ]);

        $kartuInstruksiKerjas = KartuInstruksiKerja::with([
            'salesOrder.customerAddress',
            'salesOrder.finishGoodItem'
        ])
            ->where(function ($query) use ($suratJalan) {
                $query->whereDoesntHave('suratJalans')
                    ->orWhere('id', $suratJalan->id_kartu_instruksi_kerja);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('suratJalan/edit', [
            'suratJalan' => $suratJalan,
            'kartuInstruksiKerjas' => $kartuInstruksiKerjas
        ]);
    }

    public function update(Request $request, SuratJalan $suratJalan)
    {
        $validated = $request->validate([
            'id_kartu_instruksi_kerja' => 'required|exists:kartu_instruksi_kerjas,id',
            'no_surat_jalan' => 'required|string|max:255|unique:surat_jalans,no_surat_jalan,' . $suratJalan->id,
            'tgl_surat_jalan' => 'required|date',
            'transportasi' => 'required|string|max:255',
            'no_polisi' => 'required|string|max:255',
            'driver' => 'required|string|max:255',
            'pengirim' => 'required|string|max:255',
            'keterangan' => 'nullable|string',
            'alamat_tujuan' => 'required|string',
            'qty_pengiriman' => 'required|integer|min:0', // New field for quantity
        ]);

        DB::transaction(function () use ($suratJalan, $validated) {
            $suratJalan->update($validated);
        });

        return redirect()->route('suratJalans.index')
            ->with('success', 'Surat Jalan berhasil diperbarui');
    }

    public function destroy(SuratJalan $suratJalan)
    {
        DB::transaction(function () use ($suratJalan) {
            $suratJalan->delete();
        });

        return redirect()->route('suratJalans.index')
            ->with('success', 'Surat Jalan berhasil dihapus');
    }

    // API endpoint untuk mendapatkan customer address berdasarkan KIK
    public function getCustomerAddress(KartuInstruksiKerja $kartuInstruksiKerja)
    {
        $kartuInstruksiKerja->load('salesOrder.customerAddress');

        return response()->json([
            'customer_address' => $kartuInstruksiKerja->salesOrder?->customerAddress
        ]);
    }

    // PDF generation
    public function generatePdf(SuratJalan $suratJalan)
    {
        $suratJalan->load([
            'kartuInstruksiKerja.salesOrder.customerAddress',
            'kartuInstruksiKerja.salesOrder.finishGoodItem',
            'kartuInstruksiKerja.kartuInstruksiKerjaBoms.billOfMaterials.masterItem.unit'
        ]);

        return response()->json($suratJalan);
    }
}
