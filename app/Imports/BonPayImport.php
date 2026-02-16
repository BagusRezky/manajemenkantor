<?php

namespace App\Imports;

use App\Models\BonPay;
use App\Models\Invoice;
use App\Models\Karyawan;
use App\Models\MasterCoa;
use App\Models\MetodeBayar;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class BonPayImport implements ToModel, WithHeadingRow
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        /* * 1. Mencari Invoice
         * Cek di no_invoice (Sistem Baru) ATAU no_invoice_lama (Legacy)
         */
        $invoice = Invoice::where('no_invoice', $row['id_invoice'])
                    ->orWhere('no_invoice_lama', $row['id_invoice'])
                    ->first();

        // Jika invoice tidak ditemukan sama sekali, lewati baris ini
        if (!$invoice) {
            return null;
        }

        /* * 2. Mencari Relasi Lainnya
         */

        // Cari Metode Bayar
        $metode = MetodeBayar::where('kode_bayar', $row['id_metode_bayar'])
                    ->orWhere('metode_bayar', $row['id_metode_bayar'])
                    ->first();

        // Cari Karyawan
        $karyawanName = trim($row['id_karyawan'] ?? '');
        $karyawan = Karyawan::where('nama', 'like', '%' . $karyawanName . '%')->first();

        // Cari Account/COA (menggunakan string dari float Excel 101.103)
        $account = MasterCoa::where('kode_akuntansi', (string)$row['id_account'])->first();

        /*
         * 3. Simpan Data BonPay
         */
        return new BonPay([
            'id_invoice'         => $invoice->id,
            'id_metode_bayar'    => $metode?->id ?? 1,
            'id_account'         => $account?->id,
            'id_karyawan'        => $karyawan?->id,
            'nomor_pembayaran'   => $row['no_pembayaran'],
            'nominal_pembayaran' => $row['nominal_pembayaran'],
            'tanggal_pembayaran' => $this->transformDate($row['tanggal_pembayaran']),
            'gudang'             => $row['gudang'],
            'keterangan'         => $row['keterangan'] ?? 'Import dari Excel',
        ]);
    }

    /**
     * Helper untuk mengubah format tanggal Excel/CSV ke format Database (Y-m-d)
     */
    private function transformDate($value)
    {
        if (empty($value)) return now()->format('Y-m-d');

        try {
            // Jika formatnya m/d/Y (seperti di CSV: 1/21/2026)
            return Carbon::parse($value)->format('Y-m-d');
        } catch (\Exception $e) {
            return now()->format('Y-m-d');
        }
    }
}
