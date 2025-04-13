<?php

namespace App\Http\Controllers;

use App\Models\customerAddress;
use App\Models\FinishGoodItem;
use App\Models\SalesOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalesOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $salesOrders = SalesOrder::with(['customerAddress', 'finishGoodItem'])->get();
        return Inertia::render('salesOrder/salesOrders', [
            'salesOrders' => $salesOrders,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $customerAddresses = customerAddress::select('id', 'nama_customer')->get();
        $finishGoodItems = FinishGoodItem::select('id', 'nama_barang')->get();

        return Inertia::render('salesOrder/create', [
            'customerAddresses' => $customerAddresses,
            'finishGoodItems' => $finishGoodItems,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_customer_address' => 'required|exists:customer_addresses,id',
            'id_finish_good_item' => 'required|exists:finish_good_items,id',
            'no_bon_pesanan' => 'required|string',
            'no_po_customer' => 'required|string',
            'jumlah_pesanan' => 'required|string',
            'harga_pcs_bp' => 'required|string',
            'harga_pcs_kirim' => 'required|string',
            'mata_uang' => 'required|string',
            'syarat_pembayaran' => 'required|string',
            'eta_marketing' => 'required|string',
            'klaim_kertas' => 'required|string',
            'dipesan_via' => 'required|string',
            'tipe_pesanan' => 'required|string',
            'toleransi_pengiriman' => 'nullable|string',
            'catatan_colour_range' => 'nullable|string',
            'catatan' => 'nullable|string',
        ]);

        $validated['no_bon_pesanan'] = strtoupper($validated['no_bon_pesanan']);

        SalesOrder::create($validated);
        return redirect()->route('salesOrders.index')->with('success', 'Sales Order created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(SalesOrder $salesOrder)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $salesOrder = SalesOrder::findOrFail($id);
        $customerAddresses = customerAddress::select('id', 'nama_customer')->get();
        $finishGoodItems = FinishGoodItem::select('id', 'nama_barang')->get();

        return Inertia::render('salesOrder/edit', [
            'salesOrder' => $salesOrder,
            'customerAddresses' => $customerAddresses,
            'finishGoodItems' => $finishGoodItems,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $salesOrder = SalesOrder::findOrFail($id);

        $validated = $request->validate([
            'id_customer_address' => 'required|exists:customer_addresses,id',
            'id_finish_good_item' => 'required|exists:finish_good_items,id',
            'no_bon_pesanan' => 'required|string',
            'no_po_customer' => 'required|string',
            'jumlah_pesanan' => 'required|string',
            'harga_pcs_bp' => 'required|string',
            'harga_pcs_kirim' => 'required|string',
            'mata_uang' => 'required|string',
            'syarat_pembayaran' => 'required|string',
            'eta_marketing' => 'required|string',
            'klaim_kertas' => 'required|string',
            'dipesan_via' => 'required|string',
            'tipe_pesanan' => 'required|string',
            'toleransi_pengiriman' => 'nullable|string',
            'catatan_colour_range' => 'nullable|string',
            'catatan' => 'nullable|string',
        ]);

        $salesOrder->update($validated);
        return redirect()->route('salesOrders.index')->with('success', 'Sales Order updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $salesOrder = SalesOrder::findOrFail($id);
        $salesOrder->delete();

        return redirect()->route('salesOrders.index')->with('success', 'Sales Order deleted successfully!');
    }
}
