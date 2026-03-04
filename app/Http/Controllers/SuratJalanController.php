<?php

namespace App\Http\Controllers;

use App\Models\SuratJalan;
use App\Models\KartuInstruksiKerja;
use App\Models\SalesOrder;
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
            'kartuInstruksiKerja.salesOrder.finishGoodItem',
            'salesOrder.customerAddress',
        ])->orderBy('created_at', 'desc')->get();

        return Inertia::render('suratJalan/suratJalans', [
            'suratJalans' => $suratJalans
        ]);
    }

    public function create()
    {
        // Ambil Sales Order beserta semua relasi untuk hitung stok
        $salesOrders = SalesOrder::with([
            'customerAddress',
            'finishGoodItem',
            'masterItem.unit', // Penting untuk SO barang baku
            'kartuInstruksiKerja.packagings',
            'kartuInstruksiKerja.suratJalans',
            'kartuInstruksiKerja.blokirs',
        ])->orderBy('created_at', 'desc')->get();

        $allKartuInstruksiKerjas = KartuInstruksiKerja::with(['packagings', 'suratJalans', 'blokirs'])
            ->orderBy('created_at', 'desc')
            ->get();
        $materialStockController = new MaterialStockController();

        $salesOrders->map(function ($so) use ($materialStockController) {
            if ($so->id_master_item) {

                $so->material_onhand = $materialStockController->calculateOnhandStock($so->id_master_item);
            } else {
                $so->material_onhand = 0;
            }
            return $so;
        });

        return Inertia::render('suratJalan/create', [
            'salesOrders' => $salesOrders,
            'allKartuInstruksiKerjas' => $allKartuInstruksiKerjas
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_sales_order' => 'required|exists:sales_orders,id',
            'id_kartu_instruksi_kerja' => 'nullable|exists:kartu_instruksi_kerjas,id',
            'tgl_surat_jalan' => 'required|date',
            'transportasi' => 'required|string|max:255',
            'no_polisi' => 'required|string|max:255',
            'driver' => 'required|string|max:255',
            'pengirim' => 'required|string|max:255',
            'keterangan' => 'nullable|string',
            'alamat_tujuan' => 'required|string',
            'qty_pengiriman' => 'required|integer|min:1',
        ]);

        // Generate the no_surat_jalan
        $currentMonth = str_pad(date('m'), 2, '0', STR_PAD_LEFT);
        $currentYear = date('y');
        $yearPattern = '/SJ/' . $currentMonth . $currentYear;

        DB::transaction(function () use ($validated, $yearPattern) {
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
            'kartuInstruksiKerja.kartuInstruksiKerjaBoms.billOfMaterials.masterItem.unit',
            'salesOrder.customerAddress',
            'salesOrder.masterItem.unit',
        ]);

        $kartuInstruksiKerjas = KartuInstruksiKerja::with([
            'salesOrder.customerAddress', // camelCase version
            'sales_order.customer_address', // snake_case version
            'salesOrder.finishGoodItem',
            'sales_order.finish_good_item',
            'packagings',
            'blokirs',
            'suratJalans'
        ]);

        return Inertia::render('suratJalan/show', [
            'suratJalan' => $suratJalan,
            'kartuInstruksiKerjas' => $kartuInstruksiKerjas
        ]);
    }

    public function edit(SuratJalan $suratJalan)
    {
        // 1. Data SO + Material Stock
        $materialStockController = new MaterialStockController();
        $salesOrders = SalesOrder::with(['customerAddress', 'masterItem.unit'])
            ->get()
            ->map(function ($so) use ($materialStockController) {
                $so->material_onhand = $so->id_master_item ? $materialStockController->calculateOnhandStock($so->id_master_item) : 0;
                return $so;
            });

        $allKartuInstruksiKerjas = KartuInstruksiKerja::with(['packagings', 'suratJalans', 'blokirs', 'salesOrder.customerAddress'])
            ->get();

        return Inertia::render('suratJalan/edit', [
            'suratJalan' => $suratJalan,
            'salesOrders' => $salesOrders,
            'allKartuInstruksiKerjas' => $allKartuInstruksiKerjas
        ]);
    }

    public function update(Request $request, SuratJalan $suratJalan)
    {
        $validated = $request->validate([
            'id_sales_order' => 'required|exists:sales_orders,id',
            'id_kartu_instruksi_kerja' => 'nullable|exists:kartu_instruksi_kerjas,id',
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
            'kartuInstruksiKerja.packagings',
            'kartuInstruksiKerja.kartuInstruksiKerjaBoms.billOfMaterials.masterItem.unit',
            'salesOrder.customerAddress',
            'salesOrder.finishGoodItem',
            'salesOrder.masterItem',
            'salesOrder.masterItem.unit',
        ]);

        return response()->json($suratJalan);
    }
}
