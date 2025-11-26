<?php

namespace App\Imports;

use App\Models\Unit;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Row;

class UnitImport implements OnEachRow, WithHeadingRow
{
    /**
     * Handle a row during import.
     *
     * @param \Maatwebsite\Excel\Row $row
     *
     * @return void
     */

    public function onRow(Row $row)
    {
        $data = $row->toArray();

        // 1. Standardisasi nama_satuan:
        // - trim() untuk menghapus spasi di awal/akhir.
        // - strtoupper() untuk menyeragamkan huruf kapital (misal: "pcs" dan "PCS" dianggap sama).
        // Hasilnya: "REAMS (50 lembar)" akan menjadi "REAMS (50 LEMBAR)".
        // Hasilnya: "REAMS" akan menjadi "REAMS".
        $namaSatuan = trim(strtoupper($data['nama_satuan'] ?? ''));

        // 2. Set kode_satuan: Gunakan '-' jika kolom dari Excel kosong.
        $kodeSatuan = $data['kode_satuan'] ?? '-';

        // Lewati baris jika nama_satuan kosong
        if (empty($namaSatuan)) {
            return;
        }

        // 3. Gunakan updateOrCreate (Upsert):
        // Kriteria pencarian: ['nama_satuan' => $namaSatuan]
        //
        // Kasus 1: Konsolidasi (Update)
        // Jika di Excel ada "PCS" dan "pcs", keduanya akan menjadi "PCS".
        // Entri kedua akan MENGUPDATE entri pertama.
        //
        // Kasus 2: Unique Item (Insert)
        // "REAMS" dan "REAMS (50 LEMBAR)" adalah string yang berbeda.
        // Keduanya akan INSERT sebagai data terpisah (sesuai permintaan Anda).
        Unit::updateOrCreate(
            ['nama_satuan' => $namaSatuan],
            ['kode_satuan' => $kodeSatuan]
        );
    }
}
