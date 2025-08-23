<?php

namespace App\Http\Controllers;

use App\Models\ImrDiemaking;
use App\Models\ImrFinishing;
use App\Models\InternalMaterialRequest;
use App\Models\ReturInternal;
use App\Models\ReturInternalItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReturInternalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $returInternal = ReturInternal::with([
            'imrFinishing',
            'imrDiemaking',
            'imr',
            'items'
        ])

            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('returInternal/returInternals', [
            'returInternal' => $returInternal
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $lastReturInternal = ReturInternal::orderBy('id', 'desc')->first();
        $lastId = $lastReturInternal ? $lastReturInternal->id : 0;

        // Get IMR Regular dengan items
        $internalMaterialRequest = InternalMaterialRequest::select('id', 'no_imr', 'tgl_request')->get();
        $internalMaterialRequest = $internalMaterialRequest->map(function ($imr) {
            return [
                'id' => $imr->id,
                'label' => $imr->no_imr,
                'type' => 'printing',
            ];
        });

        // Get IMR Diemaking dengan items
        $imrDiemaking = ImrDiemaking::select('id', 'no_imr_diemaking', 'tgl_request')
            ->get()
            ->map(function ($imr) {
                return [
                    'id' => $imr->id,
                    'label' => $imr->no_imr_diemaking,
                    'type' => 'diemaking',
                ];
            });

        // Get IMR Finishing dengan items
        $imrFinishing = ImrFinishing::select('id', 'no_imr_finishing', 'tgl_request')
            ->get()
            ->map(function ($imr) {
                return [
                    'id' => $imr->id,
                    'label' => $imr->no_imr_finishing,
                    'type' => 'finishing',
                ];
            });

        $combinedImr = $internalMaterialRequest->concat($imrDiemaking)->concat($imrFinishing);

        // Prepare IMR items untuk setiap IMR
        $imrItems = [];

        // Load items untuk IMR Regular
        foreach ($internalMaterialRequest as $imr) {
            $items = InternalMaterialRequest::with([
                'items.kartuInstruksiKerjaBom.billOfMaterials.masterItem.unit',
                // 'items.qty_request',
                // 'items.qty_approved'
            ])->find($imr['id'])->items ?? collect();

            $imrItems[$imr['id']] = $items;
        }

        // Load items untuk IMR Diemaking
        foreach ($imrDiemaking as $imr) {
            $items = ImrDiemaking::with([
                'items.kartuInstruksiKerjaBom.billOfMaterials.masterItem.unit',
                // 'items.departemen',
                // 'items.unit'
            ])->find($imr['id'])->items ?? collect();

            $imrItems[$imr['id']] = $items;
        }

        // Load items untuk IMR Finishing
        foreach ($imrFinishing as $imr) {
            $items = ImrFinishing::with([
                'items.kartuInstruksiKerjaBom.billOfMaterials.masterItem.unit',
                // 'items.departemen',
                // 'items.unit'
            ])->find($imr['id'])->items ?? collect();

            $imrItems[$imr['id']] = $items;
        }

        return Inertia::render('returInternal/create', [
            'lastId' => $lastId,
            'combinedImr' => $combinedImr,
            'imrItems' => $imrItems
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_imr_finishing' => 'nullable|exists:imr_finishings,id',
            'id_imr_diemaking' => 'nullable|exists:imr_diemakings,id',
            'id_imr' => 'nullable|exists:imrs,id',
            'no_retur_internal' => 'required|string|max:255',
            'tgl_retur_internal' => 'required|date',
            'nama_retur_internal' => 'required|string|max:255',
            'catatan_retur_internal' => 'nullable|string|max:255',
            'items' => 'required|array|min:1',
            'items.*.id_imr_item' => 'nullable|exists:imr_items,id',
            'items.*.id_imr_diemaking_item' => 'nullable|exists:imr_diemaking_items,id',
            'items.*.id_imr_finishing_item' => 'nullable|exists:imr_finishing_items,id',
            'items.*.qty_approved_retur' => 'required|numeric|min:0.01',
        ]);

        // Custom validation: pastikan salah satu IMR terisi
        if ($validated['id_imr_finishing'] === null && $validated['id_imr_diemaking'] === null && $validated['id_imr'] === null) {
            return redirect()->back()->withErrors(['error' => 'Please select at least one IMR type.']);
        }

        // Validation untuk setiap item: pastikan salah satu item type terisi
        foreach ($validated['items'] as $index => $item) {
            if (empty($item['id_imr_item']) && empty($item['id_imr_diemaking_item']) && empty($item['id_imr_finishing_item'])) {
                return redirect()->back()->withErrors(['items.' . $index => 'Each item must have a valid IMR item reference.']);
            }
        }

        DB::transaction(function () use ($validated) {
            // Create retur internal
            $returInternal = ReturInternal::create([
                'id_imr_finishing' => $validated['id_imr_finishing'],
                'id_imr_diemaking' => $validated['id_imr_diemaking'],
                'id_imr' => $validated['id_imr'],
                'no_retur_internal' => $validated['no_retur_internal'],
                'tgl_retur_internal' => $validated['tgl_retur_internal'],
                'nama_retur_internal' => $validated['nama_retur_internal'],
                'catatan_retur_internal' => $validated['catatan_retur_internal'],
            ]);

            // Create retur internal items
            foreach ($validated['items'] as $item) {
                ReturInternalItem::create([
                    'id_retur_internal' => $returInternal->id,
                    'id_imr_item' => $item['id_imr_item'] ?? null,
                    'id_imr_diemaking_item' => $item['id_imr_diemaking_item'] ?? null,
                    'id_imr_finishing_item' => $item['id_imr_finishing_item'] ?? null,
                    'qty_approved_retur' => $item['qty_approved_retur'],
                ]);
            }
        });

        return redirect()->route('returInternals.index')->with('success', 'Retur Internal created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(ReturInternal $returInternal)
    {
        $returInternal->load([
            'imrFinishing',
            'imrDiemaking',
            'imr',
            'items'
        ]);

        return Inertia::render('returInternal/show', [
            'returInternal' => $returInternal
        ]);
    }

    public function edit(ReturInternal $returInternal)
    {
        $returInternal->load([
            'imrFinishing',
            'imrDiemaking',
            'imr',
            'items'
        ]);

        return Inertia::render('returInternal/edit', [
            'returInternal' => $returInternal
        ]);
    }

    public function update(Request $request, ReturInternal $returInternal)
    {
        $validated = $request->validate([
            'id_imr_finishing' => 'nullable|exists:imr_finishings,id',
            'id_imr_diemaking' => 'nullable|exists:imr_diemakings,id',
            'id_imr' => 'nullable|exists:internal_material_requests,id',
            'no_retur_internal' => 'required|string|max:255|unique:retur_internals,no_retur_internal,' . $returInternal->id,
            'tgl_retur_internal' => 'required|date',
            'nama_retur_internal' => 'required|string|max:255',
            'catatan_retur_internal' => 'nullable|string',
        ]);

        DB::transaction(function () use ($returInternal, $validated) {
            $returInternal->update($validated);
        });

        return redirect()->route('returInternals.index')
            ->with('success', 'Retur Internal berhasil diperbarui');
    }

    public function destroy(ReturInternal $returInternal)
    {
        DB::transaction(function () use ($returInternal) {
            $returInternal->delete();
        });

        return redirect()->route('returInternals.index')
            ->with('success', 'Retur Internal berhasil dihapus');
    }
    /**
     * Generate PDF for the specified Retur Internal.
     */
    public function generatePdf($id)
    {
        $returInternal = ReturInternal::with([
            'imrFinishing',
            'imrDiemaking',
            'imr',
            'items'
        ])->findOrFail($id);


        return response()->json($returInternal);
    }
}
