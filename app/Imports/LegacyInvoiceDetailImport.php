<?php

namespace App\Imports;

use App\Models\InvoiceDetail;
use App\Models\Invoice;
use App\Models\MasterCoa;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\ToModel;

class LegacyInvoiceDetailImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        // 1. Cari Header Invoice berdasarkan no_invoice
        $noInvoice = trim($row['no_invoice'] ?? '');
        $invoice = Invoice::where('no_invoice', $noInvoice)->first();

        if (!$invoice) {
            return null; // Skip jika headernya belum masuk
        }

        // 2. Cari ID Account jika ada
        $idAccount = null;
        if (!empty($row['id_account'])) {
            // Sesuaikan pencarian account berdasarkan kode atau id
            $account = MasterCoa::where('kode_akuntansi', $row['id_account'])->first();
            $idAccount = $account ? $account->id : null;
        }

        return new InvoiceDetail([
            'id_invoice'    => $invoice->id,
            'id_account'    => $idAccount,
            'kode_group'    => $row['kode_group'] ?? null,
            'kode_produk'   => $row['kode_produk'] ?? null,
            'nama_produk'   => $row['nama_produk'] ?? null,
            'jumlah'        => $row['jumlah'] ?? 0,
            'harga'         => $row['harga'] ?? 0,
            'diskon_barang' => $row['diskon_barang'] ?? 0,
            'diskon_member' => $row['diskon_member'] ?? 0,
            'total'         => $row['total'] ?? 0,
            'bayar'         => $row['bayar'] ?? 0,
            'kembali'       => $row['kembali'] ?? 0,
            'unit'          => $row['unit'] ?? null,
            'marketing'     => $row['marketing'] ?? null,
            'qty_small'     => $row['qty_small'] ?? 0,
        ]);
    }
}
