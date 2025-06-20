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
use Barryvdh\DomPDF\Facade\Pdf;
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

    public function authorize($id)
    {
        $purchaseRequest = PurchaseRequest::findOrFail($id);

        // Only allow authorization if current status is Deotorisasi
        if ($purchaseRequest->status !== PurchaseRequest::STATUS_DEOTORISASI) {
            return redirect()->back()->with('error', 'Purchase Request sudah diotorisasi!');
        }

        // Update the status
        $purchaseRequest->update([
            'status' => PurchaseRequest::STATUS_OTORISASI
        ]);

        return redirect()->back()->with('success', 'Purchase Request berhasil diotorisasi!');
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

    public function detail($id)
    {
        $purchaseRequest = PurchaseRequest::with([
            'departemen',
            'purchaseRequestItems.masterItem.typeItem',
            'purchaseRequestItems.masterItem.unit',
            'purchaseRequestItems.itemReferences.departemen',
            'purchaseRequestItems.itemReferences.customerAddress',
            'purchaseRequestItems.itemReferences.kartuInstruksiKerja',
        ])->findOrFail($id);

        return Inertia::render('purchaseRequest/detail', [
            'purchaseRequest' => $purchaseRequest
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $purchaseRequest = PurchaseRequest::with([
            'departemen',
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

        return Inertia::render('purchaseRequest/edit', [
            'purchaseRequest' => $purchaseRequest,
            'departments' => $departments,
            'masterItems' => $masterItems,
            'customerAddresses' => $customerAddresses,
            'kartuInstruksiKerjas' => $kartuInstruksiKerjas
        ]);
    }

    // Update method:
    // The update method in the controller looks good, but I'd make some minor improvements:

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
            'items.*.references.*.type' => 'required|in:department,customer',
            'items.*.references.*.qty' => 'required|numeric|min:0.01',
            'items.*.references.*.id_department' => 'required_if:items.*.references.*.type,department|exists:departemens,id',
            'items.*.references.*.id_customer_address' => 'required_if:items.*.references.*.type,customer|exists:customer_addresses,id',
            'items.*.references.*.id_kartu_instruksi_kerja' => 'required_if:items.*.references.*.type,customer|exists:kartu_instruksi_kerjas,id',
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
                        $referenceData['id_customer_address'] = null;
                        $referenceData['id_kartu_instruksi_kerja'] = null;
                    } else {
                        $referenceData['id_department'] = null;
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

    public function generatePdf($id)
    {
        $purchaseRequest = PurchaseRequest::with([
            'departemen',
            'purchaseRequestItems.masterItem.typeItem',
            'purchaseRequestItems.masterItem.unit',
            'purchaseRequestItems.itemReferences'
        ])->findOrFail($id);

        return response()->json($purchaseRequest);

    }
}
