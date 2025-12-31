<?php

namespace App\Http\Controllers;

use App\Models\SubcountIn;
use App\Models\SubcountInItem;
use App\Models\SubcountOut;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Http\Request;

class SubcountInController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $subcountIns = SubcountIn::with([
            'subcountInItems.subcountOut'
        ])->orderBy('created_at', 'desc')->get();

        return Inertia::render('subcountIn/subcountIns', [
            'subcountIns' => $subcountIns
        ]);
    }

    public function create()
    {
        // Ambil SubcountOut yang belum ada di SubcountInItem
        $subcountOuts = SubcountOut::with([
            'subcountOutItems',
            'subcountOutItems.kartuInstruksiKerja',
        ])->orderBy('created_at', 'desc')->get();

        return Inertia::render('subcountIn/create', [
            'subcountOuts' => $subcountOuts
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tgl_subcount_in' => 'required|date',
            'no_surat_jalan_pengiriman' => 'required|string|max:255',
            'admin_produksi' => 'required|string|max:255',
            'supervisor' => 'required|string|max:255',
            'admin_mainstore' => 'required|string|max:255',
            'keterangan' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.id_subcount_out' => 'required|exists:subcount_outs,id',
            'items.*.qty' => 'required|integer|min:0',
            'items.*.keterangan' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated) {
            // === Generate Nomor Otomatis ===
            $monthYear = date('m-Y');
            $prefix = "SUB-IN/{$monthYear}/";

            // Ambil nomor terakhir di bulan ini
            $lastSubcount = SubcountIn::where('no_subcount_in', 'like', $prefix . '%')
                ->orderBy('no_subcount_in', 'desc')
                ->first();

            if ($lastSubcount) {
                // Ambil 6 digit terakhir dari nomor terakhir
                $lastNumber = (int)substr($lastSubcount->no_subcount_in, -6);
                $nextNumber = str_pad($lastNumber + 1, 6, '0', STR_PAD_LEFT);
            } else {
                $nextNumber = '000001';
            }

            $noSubcountIn = $prefix . $nextNumber;

            // === Simpan ke DB ===
            $subcountIn = SubcountIn::create([
                'no_subcount_in' => $noSubcountIn,
                'tgl_subcount_in' => $validated['tgl_subcount_in'],
                'no_surat_jalan_pengiriman' => $validated['no_surat_jalan_pengiriman'],
                'admin_produksi' => $validated['admin_produksi'],
                'supervisor' => $validated['supervisor'],
                'admin_mainstore' => $validated['admin_mainstore'],
                'keterangan' => $validated['keterangan'] ?? null,
            ]);

            // === Insert items ===
            foreach ($validated['items'] as $item) {
                SubcountInItem::create([
                    'id_subcount_in' => $subcountIn->id,
                    'id_subcount_out' => $item['id_subcount_out'],
                    'qty' => $item['qty'],
                    'keterangan' => $item['keterangan'] ?? null,
                ]);
            }
        });

        return redirect()->route('subcountIns.index')
            ->with('success', 'Subcount In berhasil dibuat');
    }

    public function show(SubcountIn $subcountIn)
    {
        $subcountIn->load([
            'subcountInItems.subcountOut',
            'subcountInItems.subcountOut.subcountOutItems.kartuInstruksiKerja'
        ]);

        return Inertia::render('subcountIn/show', [
            'subcountIn' => $subcountIn
        ]);
    }

    public function edit(SubcountIn $subcountIn)
    {
        $subcountIn->load([
            'subcountInItems.subcountOut'
        ]);

        // Ambil SubcountOut yang belum ada di SubcountInItem ATAU yang sudah ada di subcountIn ini
        $subcountOuts = SubcountOut::where(function ($query) use ($subcountIn) {
            $query->whereDoesntHave('subcountInItems')
                ->orWhereHas('subcountInItems', function ($q) use ($subcountIn) {
                    $q->where('id_subcount_in', $subcountIn->id);
                });
        })
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('subcountIn/edit', [
            'subcountIn' => $subcountIn,
            'subcountOuts' => $subcountOuts
        ]);
    }

    public function update(Request $request, SubcountIn $subcountIn)
    {
        $validated = $request->validate([
            'no_subcount_in' => 'required|string|max:255|unique:subcount_ins,no_subcount_in,' . $subcountIn->id,
            'tgl_subcount_in' => 'required|date',
            'no_surat_jalan_pengiriman' => 'required|string|max:255',
            'admin_produksi' => 'required|string|max:255',
            'supervisor' => 'required|string|max:255',
            'admin_mainstore' => 'required|string|max:255',
            'keterangan' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.id_subcount_out' => 'required|exists:subcount_outs,id',
            'items.*.qty' => 'required|integer|min:0',
            'items.*.keterangan' => 'nullable|string',
        ]);

        DB::transaction(function () use ($subcountIn, $validated) {
            // Update SubcountIn
            $subcountIn->update([
                'no_subcount_in' => $validated['no_subcount_in'],
                'tgl_subcount_in' => $validated['tgl_subcount_in'],
                'no_surat_jalan_pengiriman' => $validated['no_surat_jalan_pengiriman'],
                'admin_produksi' => $validated['admin_produksi'],
                'supervisor' => $validated['supervisor'],
                'admin_mainstore' => $validated['admin_mainstore'],
                'keterangan' => $validated['keterangan'],
            ]);

            // Delete existing items
            $subcountIn->subcountInItems()->delete();

            // Create new items
            foreach ($validated['items'] as $item) {
                SubcountInItem::create([
                    'id_subcount_in' => $subcountIn->id,
                    'id_subcount_out' => $item['id_subcount_out'],
                    'qty' => $item['qty'],
                    'keterangan' => $item['keterangan'],
                ]);
            }
        });

        return redirect()->route('subcountIns.index')
            ->with('success', 'Subcount In berhasil diperbarui');
    }

    public function destroy(SubcountIn $subcountIn)
    {
        DB::transaction(function () use ($subcountIn) {
            $subcountIn->delete();
        });

        return redirect()->route('subcountIns.index')
            ->with('success', 'Subcount In berhasil dihapus');
    }

    public function generatePdf(SubcountIn $subcountIn)
    {
        $subcountIn->load([
            'subcountInItems.subcountOut.subcountOutItems.kartuInstruksiKerja',
            'subcountInItems.subcountOut'
        ]);

        return response()->json($subcountIn);
    }
}
