<?php

namespace App\Imports;

use App\Models\TransFaktur;
use App\Models\PurchaseOrder;
use App\Models\Karyawan;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class TransFakturImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        // 1. Bersihkan No Faktur dari Scientific Notation (misal 4.00E+15 jadi string asli)
        $noFaktur = trim((string)$row['no_faktur']);

        // 2. Cari ID Purchase Order berdasarkan No PO Asal (jika ada)
        $po = null;
        if (!empty($row['no_po_asal'])) {
            $po = PurchaseOrder::where('old_po_number', trim($row['no_po_asal']))
                               ->orWhere('no_po', trim($row['no_po_asal']))
                               ->first();
        }

        // 3. Cari ID Karyawan berdasarkan nama (jika ada di kolom id_karyawan)
        $idKaryawan = null;
        if (!empty($row['id_karyawan'])) {
            $karyawan = Karyawan::where('nama', 'like', '%' . trim($row['id_karyawan']) . '%')->first();
            $idKaryawan = $karyawan ? $karyawan->id : null;
        }

        // 4. Transform Tanggal
        $tanggal = $this->transformDate($row['tanggal_transaksi']);

        return TransFaktur::create(

            [
                'id_purchase_order' => $po ? $po->id : null,
                'no_faktur' => $noFaktur,
                'no_po_asal' => $row['no_po_asal'] ?? null,
                'no_invoice'       => $row['no_invoice'] ?? null,
                'tanggal_transaksi' => $tanggal,
                'periode'           => $row['periode'],
                'gudang'            => $row['gudang'] ?? 'UGRMS',
                'kode_customer'     => $row['kode_customer'],
                'npwp'              => (string)$row['npwp'], // Cast to string agar tidak jadi float
                'alamat'            => $row['alamat'],
                'keterangan'        => $row['keterangan'] ?? null,
                'id_karyawan'       => $idKaryawan,
                // Inisialisasi awal finansial 0, akan diupdate oleh DetailImport
                'total_dpp'         => 0,
                'total_ppn'         => 0,
                'grand_total'       => 0,
            ]
        );
    }

    private function transformDate($value)
    {
        if (empty($value)) return null;
        if (is_numeric($value)) return Date::excelToDateTimeObject($value)->format('Y-m-d');

        try {
            return Carbon::parse($value)->format('Y-m-d');
        } catch (\Exception $e) {
            return null;
        }
    }
}
