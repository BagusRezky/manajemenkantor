<?php

namespace App\Http\Controllers;

use App\Models\SubcountOut;
use App\Models\SubcountOutItem;
use App\Models\Supplier;
use App\Models\KartuInstruksiKerja;
use App\Models\Unit;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Http\Request;

class SubcountOutController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $subcountOuts = SubcountOut::with([
            'supplier',
            'subcountOutItems.kartuInstruksiKerja.salesOrder.finishGoodItem',
            'subcountOutItems.unit'
        ])->orderBy('created_at', 'desc')->get();

        return Inertia::render('subcountOut/subcountOuts', [
            'subcountOuts' => $subcountOuts
        ]);
    }

    public function create()
    {
        // Ambil data yang diperlukan untuk form
        $suppliers = Supplier::orderBy('nama_suplier', 'asc')->get();
        $kartuInstruksiKerjas = KartuInstruksiKerja::with([
            'salesOrder.finishGoodItem'
        ])->orderBy('created_at', 'desc')->get();
        $units = Unit::orderBy('nama_satuan', 'asc')->get();

        return Inertia::render('subcountOut/create', [
            'suppliers' => $suppliers,
            'kartuInstruksiKerjas' => $kartuInstruksiKerjas,
            'units' => $units
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'no_subcount_out' => 'required|string|max:255|unique:subcount_outs,no_subcount_out',
            'tgl_subcount_out' => 'required|date',
            'id_supplier' => 'required|exists:suppliers,id',
            'admin_produksi' => 'required|string|max:255',
            'supervisor' => 'required|string|max:255',
            'admin_mainstore' => 'required|string|max:255',
            'keterangan' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.id_kartu_instruksi_kerja' => 'required|exists:kartu_instruksi_kerjas,id',
            'items.*.id_unit' => 'required|exists:units,id',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.keterangan' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated) {
            // Create SubcountOut
            $subcountOut = SubcountOut::create([
                'no_subcount_out' => $validated['no_subcount_out'],
                'tgl_subcount_out' => $validated['tgl_subcount_out'],
                'id_supplier' => $validated['id_supplier'],
                'admin_produksi' => $validated['admin_produksi'],
                'supervisor' => $validated['supervisor'],
                'admin_mainstore' => $validated['admin_mainstore'],
                'keterangan' => $validated['keterangan'],
            ]);

            // Create SubcountOutItems
            foreach ($validated['items'] as $item) {
                SubcountOutItem::create([
                    'id_subcount_out' => $subcountOut->id,
                    'id_kartu_instruksi_kerja' => $item['id_kartu_instruksi_kerja'],
                    'id_unit' => $item['id_unit'],
                    'qty' => $item['qty'],
                    'keterangan' => $item['keterangan'],
                ]);
            }
        });

        return redirect()->route('subcountOuts.index')
            ->with('success', 'Subcount Out berhasil dibuat');
    }

    public function show(SubcountOut $subcountOut)
    {
        $subcountOut->load([
            'supplier',
            'subcountOutItems.kartuInstruksiKerja.salesOrder.finishGoodItem',
            'subcountOutItems.unit'
        ]);

        return Inertia::render('subcountOut/show', [
            'subcountOut' => $subcountOut
        ]);
    }

    public function edit(SubcountOut $subcountOut)
    {
        $subcountOut->load([
            'supplier',
            'subcountOutItems.kartuInstruksiKerja',
            'subcountOutItems.unit'
        ]);

        $suppliers = Supplier::orderBy('nama_suplier', 'asc')->get();
        $kartuInstruksiKerjas = KartuInstruksiKerja::with([
            'salesOrder.finishGoodItem'
        ])->orderBy('created_at', 'desc')->get();
        $units = Unit::orderBy('nama_satuan', 'asc')->get();

        return Inertia::render('subcountOut/edit', [
            'subcountOut' => $subcountOut,
            'suppliers' => $suppliers,
            'kartuInstruksiKerjas' => $kartuInstruksiKerjas,
            'units' => $units
        ]);
    }

    public function update(Request $request, SubcountOut $subcountOut)
    {
        $validated = $request->validate([
            'no_subcount_out' => 'required|string|max:255|unique:subcount_outs,no_subcount_out,' . $subcountOut->id,
            'tgl_subcount_out' => 'required|date',
            'id_supplier' => 'required|exists:suppliers,id',
            'admin_produksi' => 'required|string|max:255',
            'supervisor' => 'required|string|max:255',
            'admin_mainstore' => 'required|string|max:255',
            'keterangan' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.id_kartu_instruksi_kerja' => 'required|exists:kartu_instruksi_kerjas,id',
            'items.*.id_unit' => 'required|exists:units,id',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.keterangan' => 'nullable|string',
        ]);

        DB::transaction(function () use ($subcountOut, $validated) {
            // Update SubcountOut
            $subcountOut->update([
                'no_subcount_out' => $validated['no_subcount_out'],
                'tgl_subcount_out' => $validated['tgl_subcount_out'],
                'id_supplier' => $validated['id_supplier'],
                'admin_produksi' => $validated['admin_produksi'],
                'supervisor' => $validated['supervisor'],
                'admin_mainstore' => $validated['admin_mainstore'],
                'keterangan' => $validated['keterangan'],
            ]);

            // Delete existing items
            $subcountOut->subcountOutItems()->delete();

            // Create new items
            foreach ($validated['items'] as $item) {
                SubcountOutItem::create([
                    'id_subcount_out' => $subcountOut->id,
                    'id_kartu_instruksi_kerja' => $item['id_kartu_instruksi_kerja'],
                    'id_unit' => $item['id_unit'],
                    'qty' => $item['qty'],
                    'keterangan' => $item['keterangan'],
                ]);
            }
        });

        return redirect()->route('subcountOuts.index')
            ->with('success', 'Subcount Out berhasil diperbarui');
    }

    public function destroy(SubcountOut $subcountOut)
    {
        DB::transaction(function () use ($subcountOut) {
            $subcountOut->delete();
        });

        return redirect()->route('subcountOuts.index')
            ->with('success', 'Subcount Out berhasil dihapus');
    }

    // PDF generation
    public function generatePdf(SubcountOut $subcountOut)
    {
        $subcountOut->load([
            'supplier',
            'subcountOutItems.kartuInstruksiKerja.salesOrder.finishGoodItem',
            'subcountOutItems.unit'
        ]);

        return response()->json($subcountOut);
    }
}
