<?php

namespace App\Http\Controllers;

use App\Models\BonPay;
use App\Models\Invoice;
use App\Models\MasterCoa;
use App\Models\MetodeBayar;
use App\Models\Karyawan;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BonPayController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bonPays = BonPay::with(['invoice', 'metodeBayar', 'karyawan', 'account'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('bonPay/bonPays', [
            'bonPays' => $bonPays
        ]);
    }

    public function create()
    {
        $invoices = Invoice::with(['suratJalan.kartuInstruksiKerja.salesOrder.customerAddress'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('bonPay/create', [
            'invoices' => $invoices,
            'metodeBayars' => MetodeBayar::all(),
            'karyawans' => Karyawan::all(),
            'accounts' => MasterCoa::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_invoice' => 'required|exists:invoices,id',
            'id_metode_bayar' => 'required|exists:metode_bayars,id',
            'id_account' => 'nullable|exists:master_coas,id',
            'id_karyawan' => 'nullable|exists:karyawans,id',
            'nominal_pembayaran' => 'required|numeric|min:1',
            'tanggal_pembayaran' => 'required|date',
            'gudang' => 'nullable|string',
            'keterangan' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated) {
            // Generate Nomor Pembayaran
            $datePart = date('Ym');
            $latest = BonPay::where('nomor_pembayaran', 'like', "PAY/$datePart/%")->count();
            $validated['nomor_pembayaran'] = "PAY/$datePart/" . str_pad($latest + 1, 4, '0', STR_PAD_LEFT);

            BonPay::create($validated);

            // Update saldo di tabel invoices
            $this->updateInvoiceBalance($validated['id_invoice']);
        });

        return redirect()->route('bonPays.index')->with('success', 'Pembayaran berhasil disimpan');
    }

    private function updateInvoiceBalance($invoiceId)
    {
        $invoice = Invoice::with(['suratJalan.kartuInstruksiKerja.salesOrder'])->find($invoiceId);

        if ($invoice->is_legacy) {
            $grandTotal = $invoice->total;
        } else {
            // Pakai rumus sistem baru
            $qty = $invoice->surat_jalan->qty_pengiriman ?? 0;
            $harga = $invoice->surat_jalan->kartu_instruksi_kerja->sales_order->harga_pcs_bp ?? 0;
            $subtotal = ($qty * $harga) - $invoice->discount;
            $ppn = ($subtotal * $invoice->ppn) / 100;
            $grandTotal = $subtotal + $ppn + $invoice->ongkos_kirim;
        }

        // 2. Hitung Total yang sudah dibayar
        $totalBonPay = BonPay::where('id_invoice', $invoiceId)->sum('nominal_pembayaran');
        $bayarAwal = $invoice->is_legacy ? 0 : $invoice->uang_muka;

        $totalBayar = $bayarAwal + $totalBonPay;
        $kembali = $totalBayar - $grandTotal;

        // 3. Update ke tabel Invoices
        // Sekarang kolom 'kembali' di sistem baru nggak akan 0 lagi, tapi sesuai sisa bayar
        $invoice->update([
            'bayar' => $totalBayar,
            'kembali' => $kembali
        ]);
    }

    public function show(BonPay $bonPay)
    {
        $bonPay->load(['invoice.suratJalan.kartuInstruksiKerja.salesOrder.customerAddress', 'metodeBayar', 'karyawan', 'account']);
        return Inertia::render('bonPay/show', ['bonPay' => $bonPay]);
    }

    public function destroy(BonPay $bonPay)
    {
        $invoiceId = $bonPay->id_invoice;

        DB::transaction(function () use ($bonPay, $invoiceId) {
            $bonPay->delete();
            $this->updateInvoiceBalance($invoiceId);
        });

        return redirect()->route('bonPays.index')->with('success', 'Pembayaran berhasil dihapus');
    }
}
