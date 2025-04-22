<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PurchaseRequest;
use App\Models\PurchaseRequestItem;
use App\Models\Departemen;
use App\Models\MasterItem;
use App\Models\customerAddress;
use App\Models\KartuInstruksiKerja;
use App\Models\ItemReference;
use Inertia\Inertia;

class PurchaseRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
     public function index()
    {
        $purchaseRequests = PurchaseRequest::with(['departemen', 'purchaseRequestItems.masterItem.typeItem', 'purchaseRequestItems.masterItem.unit'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('purchaseRequest/purchaseRequest', [
            'purchaseRequests' => $purchaseRequests
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $departments = Departemen::all();
        $masterItems = MasterItem::with(['typeItem', 'unit'])->get();
        $customerAddresses = customerAddress::all();
        $kartuInstruksiKerjas = KartuInstruksiKerja::all();

        return Inertia::render('purchaseRequest/create', [
            'departments' => $departments,
            'masterItems' => $masterItems,
            'customerAddresses' => $customerAddresses,
            'kartuInstruksiKerjas' => $kartuInstruksiKerjas
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_department' => 'required|exists:departemens,id',
            'tgl_pr' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.id_master_item' => 'required|exists:master_items,id',
            'items.*.qty' => 'required|numeric|min:0.01',
            'items.*.eta' => 'required|date',
            'items.*.references' => 'sometimes|array',
        ]);

        // Generate PR number (you can customize this based on your requirements)
        $lastPR = PurchaseRequest::orderBy('id', 'desc')->first();
        $prNumber = 'PR-' . date('Ymd') . '-' . (($lastPR ? $lastPR->id : 0) + 1);

        // Create Purchase Request
        $purchaseRequest = PurchaseRequest::create([
            'no_pr' => $prNumber,
            'id_department' => $request->id_department,
            'tgl_pr' => $request->tgl_pr,
        ]);

        // Create Purchase Request Items
        foreach ($request->items as $item) {
            $prItem = PurchaseRequestItem::create([
                'id_purchase_request' => $purchaseRequest->id,
                'id_master_item' => $item['id_master_item'],
                'qty' => $item['qty'],
                'eta' => $item['eta'],
                'catatan' => $item['catatan'] ?? null,
            ]);

            // Create Item References if any
            if (!empty($item['references'])) {
                foreach ($item['references'] as $reference) {
                    $referenceData = [
                        'id_purchase_request_item' => $prItem->id,
                        'type' => $reference['type'],
                        'qty' => $reference['qty'],
                    ];

                    if ($reference['type'] === 'department') {
                        $referenceData['id_department'] = $reference['id_department'];
                    } else {
                        $referenceData['id_customer_address'] = $reference['id_customer_address'];
                        $referenceData['id_kartu_instruksi_kerja'] = $reference['id_kartu_instruksi_kerja'];
                    }

                    ItemReference::create($referenceData);
                }
            }
        }

        return redirect()->route('purchaseRequest.index')
            ->with('success', 'Purchase Request berhasil dibuat!');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $purchaseRequest = PurchaseRequest::with([
            'departemen',
            'purchaseRequestItems.masterItem.typeItem',
            'purchaseRequestItems.masterItem.unit',
            'purchaseRequestItems.itemReferences.departemen',
            'purchaseRequestItems.itemReferences.customerAddress',
            'purchaseRequestItems.itemReferences.kartuInstruksiKerja',
        ])->findOrFail($id);

        return Inertia::render('purchaseRequest/show', [
            'purchaseRequest' => $purchaseRequest
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $purchaseRequest = PurchaseRequest::with([
            'purchaseRequestItems.masterItem.typeItem',
            'purchaseRequestItems.masterItem.unit',
            'purchaseRequestItems.itemReferences.departemen',
            'purchaseRequestItems.itemReferences.customerAddress',
            'purchaseRequestItems.itemReferences.kartuInstruksiKerja',
        ])->findOrFail($id);

        $departments = Departemen::all();
        $masterItems = MasterItem::with(['typeItem', 'unit'])->get();
        $customerAddresses = customerAddress::all();
        $kartuInstruksiKerjas = KartuInstruksiKerja::all();

        return Inertia::render('PurchaseRequest/Edit', [
            'purchaseRequest' => $purchaseRequest,
            'departments' => $departments,
            'masterItems' => $masterItems,
            'customerAddresses' => $customerAddresses,
            'kartuInstruksiKerjas' => $kartuInstruksiKerjas
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'id_department' => 'required|exists:departemens,id',
            'tgl_pr' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.id_master_item' => 'required|exists:master_items,id',
            'items.*.qty' => 'required|numeric|min:0.01',
            'items.*.eta' => 'required|date',
            'items.*.references' => 'sometimes|array',
        ]);

        $purchaseRequest = PurchaseRequest::findOrFail($id);

        // Update Purchase Request
        $purchaseRequest->update([
            'id_department' => $request->id_department,
            'tgl_pr' => $request->tgl_pr,
        ]);

        // Delete existing items and references
        foreach ($purchaseRequest->purchaseRequestItems as $item) {
            $item->itemReferences()->delete();
        }
        $purchaseRequest->purchaseRequestItems()->delete();

        // Create new Purchase Request Items
        foreach ($request->items as $item) {
            $prItem = PurchaseRequestItem::create([
                'id_purchase_request' => $purchaseRequest->id,
                'id_master_item' => $item['id_master_item'],
                'qty' => $item['qty'],
                'eta' => $item['eta'],
                'catatan' => $item['catatan'] ?? null,
            ]);

            // Create Item References if any
            if (!empty($item['references'])) {
                foreach ($item['references'] as $reference) {
                    $referenceData = [
                        'id_purchase_request_item' => $prItem->id,
                        'type' => $reference['type'],
                        'qty' => $reference['qty'],
                    ];

                    if ($reference['type'] === 'department') {
                        $referenceData['id_department'] = $reference['id_department'];
                    } else {
                        $referenceData['id_customer_address'] = $reference['id_customer_address'];
                        $referenceData['id_kartu_instruksi_kerja'] = $reference['id_kartu_instruksi_kerja'];
                    }

                    ItemReference::create($referenceData);
                }
            }
        }

        return redirect()->route('purchaseRequest.index')
            ->with('success', 'Purchase Request berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $purchaseRequest = PurchaseRequest::findOrFail($id);

        // Delete related references and items
        foreach ($purchaseRequest->purchaseRequestItems as $item) {
            $item->itemReferences()->delete();
        }
        $purchaseRequest->purchaseRequestItems()->delete();

        // Delete the purchase request
        $purchaseRequest->delete();

        return redirect()->route('purchaseRequest.index')
            ->with('success', 'Purchase Request berhasil dihapus!');
    }
}
