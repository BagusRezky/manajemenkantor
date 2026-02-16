<?php

namespace App\Http\Controllers;

use App\Models\TransFaktur;
use App\Models\PurchaseOrder;
use App\Models\Karyawan;

use App\Imports\TransFakturImport;
use App\Imports\TransFakturDetailImport;
use Maatwebsite\Excel\Facades\Excel;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class TransFakturController extends Controller
{
    /**
     * Tampilkan daftar faktur
     */
    public function index()
    {
        return Inertia::render('transFaktur/transFakturs', [
            'fakturs' => TransFaktur::with(['purchaseOrder', 'karyawan'])
                ->orderBy('tanggal_transaksi', 'desc')
                ->get()
        ]);
    }

    /**
     * Form tambah faktur baru (Bukan Legacy)
     */
    public function create()
    {
        return Inertia::render('transFaktur/create', [
            // Tambahkan relasi 'supplier' dan pastikan penulisan relasi benar (biasanya camelCase atau snake_case)
            'purchaseOrders' => PurchaseOrder::with(['items.masterItem', 'items.satuan', 'supplier'])->get(),
            'karyawans' => Karyawan::all(),
        ]);
    }

    /**
     * Simpan faktur baru dari form
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'no_faktur'         => 'required|unique:trans_fakturs,no_faktur',
            'id_purchase_order' => 'nullable|exists:purchase_orders,id',
            'no_po_asal'        => 'nullable|string', // Pastikan ini ada untuk data legacy
            'no_invoice'        => 'nullable|string',
            'tanggal_transaksi' => 'required|date',
            'kode_customer'     => 'nullable|string',
            'gudang'            => 'required|string',
            'npwp'              => 'nullable|string',
            'alamat'            => 'nullable|string',
            'id_karyawan'       => 'nullable|exists:karyawans,id',
            'total_dpp'         => 'required|numeric',
            'total_ppn'         => 'required|numeric',
            'grand_total'       => 'required|numeric',
            'items'             => 'required|array|min:1',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                // 1. Simpan Header
                $faktur = TransFaktur::create($validated);

                // 2. Simpan Details
                foreach ($validated['items'] as $item) {
                    $faktur->details()->create([
                        'master_item'   => $item['master_item'],
                        'qty'           => $item['qty'],
                        'harga_per_qty' => $item['harga_per_qty'],
                        // Jika ada diskon_satuan di database detail, tambahkan di sini:
                        // 'diskon_satuan' => $item['diskon_satuan'] ?? 0,
                        'unit'          => $item['unit'],
                        'subtotal'      => $item['subtotal'],
                        'ppn_persen'    => $item['ppn_persen'] ?? 0,
                        'ppn_nilai'     => $item['ppn_nilai'],
                        'total_item'    => $item['total_item'],
                        'keterangan'    => $item['keterangan'] ?? null,
                    ]);
                }
            });

            return redirect()->route('transFakturs.index')->with('success', 'Faktur berhasil disimpan');
        } catch (\Exception $e) {
            // Jika gagal, kembali dengan pesan error
            return back()->withErrors(['error' => 'Gagal menyimpan data: ' . $e->getMessage()]);
        }
    }

    /**
     * Detail Faktur
     */
    public function show(TransFaktur $transFaktur)
    {
        return Inertia::render('transFaktur/show', [
            // Ganti 'faktur' jadi 'item'
            'item' => $transFaktur->load(['details', 'purchaseOrder', 'karyawan'])
        ]);
    }

    public function edit(TransFaktur $transFaktur)
    {
        return Inertia::render('transFaktur/edit', [
            'item' => $transFaktur->load(['details']),
            'purchaseOrders' => PurchaseOrder::with(['items.masterItem', 'items.satuan', 'supplier'])->get(),
            'karyawans' => Karyawan::all(),
        ]);
    }

    /**
     * Update data faktur
     */
    public function update(Request $request, TransFaktur $transFaktur)
    {
        $validated = $request->validate([
            'no_faktur'         => 'required|unique:trans_fakturs,no_faktur,' . $transFaktur->id,
            'id_purchase_order' => 'nullable|exists:purchase_orders,id',
            'no_po_asal'        => 'nullable|string',
            'no_invoice'        => 'nullable|string',
            'tanggal_transaksi' => 'required|date',
            'kode_customer'     => 'nullable|string',
            'gudang'            => 'required|string',
            'npwp'              => 'nullable|string',
            'alamat'            => 'nullable|string',
            'id_karyawan'       => 'nullable|exists:karyawans,id',
            'total_dpp'         => 'required|numeric',
            'total_ppn'         => 'required|numeric',
            'grand_total'       => 'required|numeric',
            'items'             => 'required|array|min:1',
        ]);

        try {
            DB::transaction(function () use ($validated, $transFaktur) {
                // 1. Update Header
                $transFaktur->update($validated);

                // 2. Sync Details (Hapus lama, simpan baru)
                $transFaktur->details()->delete();
                foreach ($validated['items'] as $item) {
                    $transFaktur->details()->create([
                        'master_item'   => $item['master_item'],
                        'qty'           => $item['qty'],
                        'harga_per_qty' => $item['harga_per_qty'],
                        'unit'          => $item['unit'],
                        'subtotal'      => $item['subtotal'],
                        'ppn_persen'    => $item['ppn_persen'] ?? 0,
                        'ppn_nilai'     => $item['ppn_nilai'],
                        'total_item'    => $item['total_item'],
                        'discount'    => $item['discount'] ?? null,
                    ]);
                }
            });

            return redirect()->route('transFakturs.index')->with('success', 'Faktur berhasil diperbarui');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal memperbarui data: ' . $e->getMessage()]);
        }
    }

    /**
     * Hapus Faktur
     */
    public function destroy(TransFaktur $transFaktur)
    {
        $transFaktur->delete();
        return back()->with('success', 'Faktur berhasil dihapus');
    }

    public function import(Request $request)
    {
        // dd($request->all());
        $request->validate([
            'file_header' => 'required',
            'file_detail' => 'required',
        ]);


        Excel::import(new TransFakturImport, $request->file('file_header'));
        Excel::import(new TransFakturDetailImport, $request->file('file_detail'));
        // });

        return back()->with('success', 'Selesai!');
    }
}
