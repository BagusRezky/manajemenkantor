<?php

namespace App\Http\Controllers;

use App\Models\PaymentEntryGood;
use App\Models\PenerimaanBarang;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentEntryGoodController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $paymentEntryGoods = PaymentEntryGood::with('penerimaanBarang')->get();
        return Inertia::render('paymentEntryGood/paymentEntryGoods', [
            'paymentEntryGoods' => $paymentEntryGoods
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $penerimaanBarangs = PenerimaanBarang::with([
            'items',
            'purchaseOrder',
            'purchaseOrder.items'
        ])
        ->orderBy('created_at', 'desc')
        ->get();

        return Inertia::render('paymentEntryGood/create', [
            'penerimaanBarangs' => $penerimaanBarangs
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_penerimaan_barang' => 'required|exists:penerimaan_barangs,id',
            'no_tagihan' => 'required|string|max:255',
            'tanggal_transaksi' => 'required|date',
            'tanggal_jatuh_tempo' => 'required|date|after_or_equal:tanggal_transaksi',
            'harga_per_qty' => 'required|integer|min:0',
            'diskon' => 'required|integer|min:0',
            'ppn' => 'required|numeric|min:0|max:100',
            'keterangan' => 'nullable|string',
        ]);

        PaymentEntryGood::create($validated);
        return redirect()->route('paymentEntryGoods.index')->with('success', 'Payment Entry Good created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $paymentEntryGood = PaymentEntryGood::with([
            'penerimaanBarang',
            'penerimaanBarang.purchaseOrder',
            'penerimaanBarang.items',
            'penerimaanBarang.items.purchaseOrderItem',
            'penerimaanBarang.items.purchaseOrderItem.masterItem',
        ]
        )->findOrFail($id);

        return Inertia::render('paymentEntryGood/show', [
            'paymentEntryGood' => $paymentEntryGood
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PaymentEntryGood $paymentEntryGood)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PaymentEntryGood $paymentEntryGood)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PaymentEntryGood $paymentEntryGood)
    {
        $paymentEntryGood->delete();
        return redirect()->route('paymentEntryGoods.index')->with('success', 'Payment Entry Good deleted successfully.');
    }

    public function pdf($id)
    {
        $paymentEntryGood = PaymentEntryGood::with('penerimaanBarang.purchaseOrder')->findOrFail($id);
        return response()->json($paymentEntryGood);
    }
}
