<?php

namespace App\Http\Controllers;

use App\Models\PurchaseOrder;
use Illuminate\Http\Request;
use App\Models\PurchaseRequest;
use App\Models\Supplier;
use App\Models\PurchaseOrderItem;
use App\Models\MasterKonversi;
use App\Models\MasterItem;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class PurchaseOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $purchaseOrders = PurchaseOrder::with(['supplier', 'purchaseRequest'])
            ->orderBy('id', 'desc')
            ->get();

        return Inertia::render('purchaseOrder/purchaseOrders', [
            'purchaseOrders' => $purchaseOrders
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $purchaseRequests = PurchaseRequest::where('status', PurchaseRequest::STATUS_OTORISASI)
            ->with('departemen')
            ->get();

        $suppliers = Supplier::all();
        $currencies = ['IDR', 'USD', 'EUR'];

        return Inertia::render('purchaseOrder/create', [
            'purchaseRequests' => $purchaseRequests,
            'suppliers' => $suppliers,
            'currencies' => $currencies

        ]);
    }


    public function getPurchaseRequestItems($id)
    {
        try {
            $purchaseRequest = PurchaseRequest::with([
                'purchaseRequestItems',
                'purchaseRequestItems.masterItem',
                'purchaseRequestItems.masterItem.unit',
            ])->findOrFail($id);

            return response()->json([
                'purchaseRequest' => $purchaseRequest
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getUnitConversions($itemId, $unitId)
    {

        // Get the item to find its type
        $item = MasterItem::findOrFail($itemId);

        // Get conversions where the source unit matches the PR unit
        $conversions = MasterKonversi::where('id_type_item', $item->id_type_item)
            ->where('satuan_satu_id', $unitId)
            ->with(['satuanSatu', 'satuanDua'])
            ->get();

        return response()->json([
            'conversions' => $conversions
        ]);
        dd($conversions->toArray());
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $validated = $request->validate([
            'id_purchase_request' => 'required|exists:purchase_requests,id',
            'tanggal_po' => 'required|date',
            'id_supplier' => 'required|exists:suppliers,id',
            'eta' => 'required|date',
            'mata_uang' => 'required|string',
            'ppn' => 'required|numeric',
            'ongkir' => 'required|integer|min:0',
            'dp' => 'required|integer|min:0',
            'items' => 'required|array|min:1',
            'items.*.id_purchase_request_item' => 'required|exists:purchase_request_items,id',
            'items.*.id_master_item' => 'required|exists:master_items,id',
            'items.*.qty_po' => 'required|numeric|min:0.01',
            'items.*.id_satuan_po' => 'required|exists:units,id',
            'items.*.diskon_satuan' => 'nullable|numeric|min:0',
            'items.*.harga_satuan' => 'required|numeric|min:0',
            'items.*.diskon_satuan' => 'required|numeric|min:0',
            'items.*.jumlah' => 'required|numeric|min:0',
            'items.*.remark_item_po' => 'nullable|string|',
        ]);

        // Generate PO number
        $lastPO = PurchaseOrder::orderBy('id', 'desc')->first();
        $poNumber = 'PO-UGRMS' . date('Ymd') . '-' . (($lastPO ? $lastPO->id : 0) + 1);

        // Create Purchase Order
        $purchaseOrder = PurchaseOrder::create([
            'id_purchase_request' => $validated['id_purchase_request'],
            'no_po' => $poNumber,
            'tanggal_po' => $validated['tanggal_po'],
            'id_supplier' => $validated['id_supplier'],
            'eta' => $validated['eta'],
            'mata_uang' => $validated['mata_uang'],
            'ppn' => $validated['ppn'],
            'ongkir' => $validated['ongkir'],
            'dp' => $validated['dp'],
        ]);

        // Create Purchase Order Items
        foreach ($validated['items'] as $item) {
            PurchaseOrderItem::create([
                'id_purchase_order' => $purchaseOrder->id,
                'id_purchase_request_item' => $item['id_purchase_request_item'],
                'id_master_item' => $item['id_master_item'],
                'qty_po' => $item['qty_po'],
                'id_satuan_po' => $item['id_satuan_po'],
                'harga_satuan' => $item['harga_satuan'],
                'diskon_satuan' => $item['diskon_satuan'],
                'jumlah' => $item['jumlah'],
                'remark_item_po' => $item['remark_item_po'] ?? null,
            ]);
        }

        return redirect()->route('purchaseOrders.index')
            ->with('success', 'Purchase Order berhasil dibuat!');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $purchaseOrder = PurchaseOrder::with([
            'supplier',
            'purchaseRequest',
            'items.masterItem',
            'items.satuan'
        ])->findOrFail($id);

        return Inertia::render('purchaseOrder/show', [
            'purchaseOrder' => $purchaseOrder
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $purchaseOrder = PurchaseOrder::with([
            'supplier',
            'purchaseRequest',
            'items.masterItem',
            'items.satuan',
            'items.purchaseRequestItem',
            'items.purchaseRequestItem.masterItem',
            'items.purchaseRequestItem.masterItem.unit'
        ])->findOrFail($id);

        $purchaseRequests = PurchaseRequest::with('departemen')->get();
        $suppliers = Supplier::all();
        $currencies = ['IDR', 'USD', 'EUR'];

        return Inertia::render('purchaseOrder/edit', [
            'purchaseOrder' => $purchaseOrder,
            'purchaseRequests' => $purchaseRequests,
            'suppliers' => $suppliers,
            'currencies' => $currencies
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'no_po' => 'required|string|unique:purchase_orders,no_po,' . $id,
            'id_purchase_request' => 'required|exists:purchase_requests,id',
            'tanggal_po' => 'required|date',
            'id_supplier' => 'required|exists:suppliers,id',
            'eta' => 'required|date',
            'mata_uang' => 'required|string',
            'ppn' => 'required|numeric',
            'ongkir' => 'required|integer|min:0',
            'dp' => 'required|integer|min:0',
            'items' => 'required|array|min:1',
            'items.*.id_purchase_request_item' => 'required|exists:purchase_request_items,id',
            'items.*.id_master_item' => 'required|exists:master_items,id',
            'items.*.qty_po' => 'required|numeric|min:0.01',
            'items.*.id_satuan_po' => 'required|exists:units,id',
            'items.*.diskon_satuan' => 'nullable|numeric|min:0',
            'items.*.harga_satuan' => 'required|numeric|min:0',
            'items.*.diskon_satuan' => 'required|numeric|min:0',
            'items.*.jumlah' => 'required|numeric|min:0',
            'items.*.remark_item_po' => 'nullable|string|',
        ]);

        // Get the purchase order
        $purchaseOrder = PurchaseOrder::findOrFail($id);

        // Update Purchase Order
        $purchaseOrder->update([
            'no_po' => $validated['no_po'],
            'id_purchase_request' => $validated['id_purchase_request'],
            'tanggal_po' => $validated['tanggal_po'],
            'id_supplier' => $validated['id_supplier'],
            'eta' => $validated['eta'],
            'mata_uang' => $validated['mata_uang'],
            'ppn' => $validated['ppn'],
            'ongkir' => $validated['ongkir'],
            'dp' => $validated['dp'],
        ]);

        // Delete existing items to replace with updated ones
        $purchaseOrder->items()->delete();

        // Create Purchase Order Items
        foreach ($validated['items'] as $item) {
            PurchaseOrderItem::create([
                'id_purchase_order' => $purchaseOrder->id,
                'id_purchase_request_item' => $item['id_purchase_request_item'],
                'id_master_item' => $item['id_master_item'],
                'qty_po' => $item['qty_po'],
                'id_satuan_po' => $item['id_satuan_po'],
                'harga_satuan' => $item['harga_satuan'],
                'diskon_satuan' => $item['diskon_satuan'],
                'jumlah' => $item['jumlah'],
                'remark_item_po' => $item['remark_item_po'] ?? null,
            ]);
        }

        return redirect()->route('purchaseOrders.index')
            ->with('success', 'Purchase Order berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $purchaseOrder = PurchaseOrder::findOrFail($id);

        // Delete related items
        // Hapus item terkait
        foreach ($purchaseOrder->items()->get() as $item) {
            $item->delete();
        }

        // Hapus PO
        $purchaseOrder->delete();

        return redirect()->route('purchaseOrders.index')
            ->with('success', 'Purchase Order berhasil dihapus!');
    }

    public function generatePdf($id)
    {
        $purchaseOrder = PurchaseOrder::with([
            'supplier',
            'purchaseRequest',
            'items.masterItem',
            'items.satuan'
        ])->findOrFail($id);

        // Generate PDF logic here
        // ...

        return response()->json($purchaseOrder);
    }
}
