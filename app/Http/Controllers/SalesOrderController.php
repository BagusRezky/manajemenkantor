<?php

namespace App\Http\Controllers;

use App\Models\customerAddress;
use App\Models\FinishGoodItem;
use App\Models\SalesOrder;
use App\Models\MasterItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalesOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $salesOrders = SalesOrder::with(['customerAddress', 'finishGoodItem', 'finishGoodItem.billOfMaterials', 'masterItem'])->get();
        return Inertia::render('salesOrder/salesOrders', [
            'salesOrders' => $salesOrders,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $lastOrder = SalesOrder::orderBy('id', 'desc')->first();
        $lastId = $lastOrder ? $lastOrder->id : 0;


        $customerAddresses = customerAddress::select('id', 'nama_customer')->get();
        // Gabungkan data dari kedua tabel dengan prefix untuk membedakan
        $finishGoodItems = FinishGoodItem::select('id', 'nama_barang')->get()
            ->map(function ($item) {
                return [
                    'id' => 'finish_good_' . $item->id, // Prefix untuk membedakan
                    'original_id' => $item->id,
                    'label' => $item->nama_barang . ' (Finish Good)',
                    'type' => 'finish_good'
                ];
            });

        $masterItems = MasterItem::select('id', 'nama_master_item')->get()
            ->map(function ($item) {
                return [
                    'id' => 'master_item_' . $item->id, // Prefix untuk membedakan
                    'original_id' => $item->id,
                    'label' => $item->nama_master_item . ' (Master Item)',
                    'type' => 'master_item'
                ];
            });

        // Gabungkan kedua collection
        $combinedItems = $finishGoodItems->concat($masterItems);

        return Inertia::render('salesOrder/create', [
            'customerAddresses' => $customerAddresses,
            'combinedItems' => $combinedItems,
            'lastId' => $lastId
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_customer_address' => 'required|exists:customer_addresses,id',
            'id_finish_good_item' => 'nullable|exists:finish_good_items,id',
            'id_master_item' => 'nullable|exists:master_items,id',
            'no_bon_pesanan' => 'required|string',
            'no_po_customer' => 'required|string',
            'jumlah_pesanan' => 'required|numeric',
            'harga_pcs_bp' => 'required|numeric',
            'harga_pcs_kirim' => 'required|numeric',
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

        // Custom validation: pastikan salah satu terisi
        if (empty($validated['id_finish_good_item']) && empty($validated['id_master_item'])) {
            return back()->withErrors(['id_finish_good_item' => 'Pilih salah satu: Finish Good Item atau Master Item']);
        }

        // Jika keduanya terisi, return error
        if (!empty($validated['id_finish_good_item']) && !empty($validated['id_master_item'])) {
            return back()->withErrors(['id_finish_good_item' => 'Pilih hanya satu: Finish Good Item atau Master Item']);
        }

        // Auto-generate no_bon_pesanan
        $lastId = SalesOrder::max('id') + 1;
        $validated['no_bon_pesanan'] = SalesOrder::generateSalesOrderNumber($lastId);
        $salesOrder = SalesOrder::create($validated);



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
            'id_finish_good_item' => 'nullable|exists:finish_good_items,id',
            'id_master_item' => 'nullable|exists:master_items,id',
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

        // Custom validation: pastikan salah satu terisi
        if (empty($validated['id_finish_good_item']) && empty($validated['id_master_item'])) {
            return back()->withErrors(['id_finish_good_item' => 'Pilih salah satu: Finish Good Item atau Master Item']);
        }

        // Jika keduanya terisi, return error
        if (!empty($validated['id_finish_good_item']) && !empty($validated['id_master_item'])) {
            return back()->withErrors(['id_finish_good_item' => 'Pilih hanya satu: Finish Good Item atau Master Item']);
        }

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

    public function generatePdf($id)
    {
        $salesOrder = SalesOrder::with([
            'customerAddress',
            'finishGoodItem.billOfMaterials.masterItem.unit',
            'finishGoodItem.billOfMaterials.departemen',
            'finishGoodItem.unit',
            'finishGoodItem.customerAddress',
            'finishGoodItem.typeItem'
        ])->findOrFail($id);

        return response()->json($salesOrder);
    }
}
