<?php

namespace App\Imports;

use App\Models\TransFakturDetail;
use App\Models\TransFaktur;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class TransFakturDetailImport implements ToModel, WithHeadingRow
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        // 1. Identifikasi Header berdasarkan ID Faktur dari Excel
        $idFakturExcel = trim((string)$row['id_trans_faktur']);
        $header = TransFaktur::where('no_faktur', $idFakturExcel)->first();

        if (!$header) {
            // Jika header tidak ditemukan, skip baris ini atau bisa log error
            return null;
        }

        // 2. Ambil nilai finansial dari baris detail
        $subtotal  = (float) ($row['sub_total'] ?? 0);
        $ppnNilai  = (float) ($row['ppn_nilai'] ?? 0);
        $totalItem = (float) ($row['total_semua'] ?? 0);
        $ppnPersen = (float) ($row['ppn_persen'] ?? 0);

        // 3. Simpan Detail Item
        $detail = new TransFakturDetail([
            'id_trans_faktur' => $header->id,
            'master_item'     => $row['master_item'],
            'qty'             => (float) $row['qty'],
            'harga_per_qty'   => (float) $row['harga_per_qty'],
            'unit'            => $row['unit'] ?? '-',
            'subtotal'        => $subtotal,
            'ppn_persen'      => $ppnPersen,
            'ppn_nilai'       => $ppnNilai,
            'total_item'      => $totalItem,
            'keterangan'      => $row['keterangan'] ?? null,
        ]);

        // 4. LOGIC ROLL UP: Update total di Header
        // Kita tambahkan nilai baris ini ke akumulasi di Header
        $header->increment('total_dpp', $subtotal);
        $header->increment('total_ppn', $ppnNilai);
        $header->increment('grand_total', $totalItem);

        return $detail;
    }
}
