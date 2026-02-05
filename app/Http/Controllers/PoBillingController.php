<?php

namespace App\Http\Controllers;

use App\Models\PoBilling;
use App\Models\Karyawan;
use App\Models\PurchaseOrder;
use App\Models\PenerimaanBarang;
use App\Imports\PoBillingImport;
use App\Imports\PoBillingDetailImport;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;

class PoBillingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('poBilling/poBillings', [
            'billings' => PoBilling::with(['karyawan', 'purchaseOrder', 'penerimaanBarang'])->orderBy('created_at', 'desc')->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('poBilling/create', [
            'karyawans' => Karyawan::all(),
            'purchaseOrders' => PurchaseOrder::all(),
            'lpbList' => PenerimaanBarang::with(['purchaseOrder', 'items.purchaseOrderItem.masterItem'])->get(),
        ]);
    }

    public function store(Request $request)
    {

        $validated = $request->validate([
            'no_bukti_tagihan' => 'required|unique:po_billings,no_bukti_tagihan',
            'id_penerimaan_barang' => 'nullable|exists:penerimaan_barangs,id',
            'id_karyawan' => 'nullable|exists:karyawans,id',
            'id_purchase_order' => 'nullable|exists:purchase_orders,id',
            'invoice_vendor' => 'nullable|string',
            'gudang' => 'required|string',
            'periode' => 'required|integer',
            'tanggal_transaksi' => 'required|date',
            'jatuh_tempo' => 'nullable|date',
            'invoice_vendor' => 'nullable|string',
            'keterangan' => 'nullable|string',
            'ongkir' => 'numeric',
            'total_nilai_barang' => 'numeric',
            'ppn' => 'numeric',
            'dp' => 'numeric',
            'total_akhir' => 'numeric',
            'items' => 'required|array|min:1',
        ]);

        DB::transaction(function () use ($validated) {
            $billing = PoBilling::create($validated);
            foreach ($validated['items'] as $item) {
                $billing->details()->create($item);
            }
        });

        return redirect()->route('poBillings.index')->with('success', 'Tagihan berhasil dibuat');
    }

    public function show(PoBilling $poBilling)
    {
        return Inertia::render('poBilling/show', [
            'billing' => $poBilling->load(['details', 'karyawan', 'purchaseOrder', 'penerimaanBarang'])
        ]);
    }

    public function edit(PoBilling $poBilling)
    {
        return Inertia::render('poBilling/edit', [
            'poBilling' => $poBilling->load('details'),
            'karyawans' => Karyawan::all(),
            'lpbList' => PenerimaanBarang::with(['PurchaseOrder', 'items.purchaseOrderItem.masterItem'])->get(),
        ]);
    }

    public function update(Request $request, PoBilling $poBilling)
    {
        $validated = $request->validate([
            'no_bukti_tagihan' => 'required|unique:po_billings,no_bukti_tagihan,' . $poBilling->id,
            'id_penerimaan_barang' => 'nullable|exists:penerimaan_barangs,id',
            'id_karyawan' => 'nullable|exists:karyawans,id',
            'id_purchase_order' => 'nullable|exists:purchase_orders,id',
            'invoice_vendor' => 'nullable|string',
            'gudang' => 'required|string',
            'periode' => 'required|integer',
            'tanggal_transaksi' => 'required|date',
            'jatuh_tempo' => 'nullable|date',
            'keterangan' => 'nullable|string',
            'ongkir' => 'numeric',
            'total_nilai_barang' => 'numeric',
            'ppn' => 'numeric',
            'dp' => 'numeric',
            'total_akhir' => 'numeric',
            'items' => 'required|array|min:1',

        ]);

        DB::transaction(function () use ($validated, $poBilling) {

            $poBilling->update($validated);

            $poBilling->details()->delete();

            foreach ($validated['items'] as $item) {
                $poBilling->details()->create($item);
            }
        });

        return redirect()->route('poBillings.index')->with('success', 'Tagihan berhasil diperbarui');
    }

    public function destroy(PoBilling $poBilling)
    {
        $poBilling->delete();
        return back()->with('success', 'Tagihan berhasil dihapus');
    }

    /**
     * Logic Import Ganda (Header & Detail)
     */
    public function import(Request $request)
    {
        // dd($request->all());
        $request->validate([
            'file_header' => 'required',
            'file_detail' => 'required',
        ]);

        
        Excel::import(new PoBillingImport, $request->file('file_header'));
        Excel::import(new PoBillingDetailImport, $request->file('file_detail'));
        // });

        return back()->with('success', 'Selesai!');
    }
}
