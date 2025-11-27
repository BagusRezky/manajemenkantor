<?php

namespace App\Imports;

use App\Models\MasterItem;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Row;
use App\Models\Unit;
use App\Models\CategoryItem;
use App\Models\TypeItem;

class MasterItemImport implements OnEachRow, WithHeadingRow
{
    /**
     * @param \Maatwebsite\Excel\Row $row
     */
    public function onRow(Row $row)
    {
        $data = $row->toArray();

        // 0. Ambil dan standardisasi data kunci
        $kodeMasterItem = trim($data['kode_master_item'] ?? '');
        $namaMasterItem = trim($data['nama_master_item'] ?? '');

        // Lewati baris jika data kunci (kode atau nama item) kosong
        if (empty($kodeMasterItem) || empty($namaMasterItem)) {
            return;
        }

        // --- 1. Lookup/Create Unit (Satuan) ---
        // Kolom 'satuan_satu_id' di Excel berisi nama, bukan ID
        $unitName = trim(strtoupper($data['satuan_satu_id'] ?? ''));
        if (empty($unitName)) {
             return;
        }

        // Cari unit berdasarkan nama. Jika tidak ada, buat baru.
        $unit = Unit::firstOrCreate(
            ['nama_satuan' => $unitName], // Asumsi kolom nama di model Unit adalah 'nama_satuan'
            ['kode_satuan' => 'AUTO_GEN'] // Sediakan nilai default untuk kolom yang required jika membuat baru
        );

        if (!$unit) {
            return; // Gagal mendapatkan atau membuat Unit
        }
        $idUnit = $unit->id;


        // --- 2. Lookup/Create Category Item ---
        // Kolom 'id_category_item' di Excel berisi nama, bukan ID
        $categoryName = trim(strtoupper($data['id_category_item'] ?? ''));
        if (empty($categoryName)) {
            return;
        }

        // Cari kategori berdasarkan nama. Jika tidak ada, buat baru.
        $category = CategoryItem::firstOrCreate(
            ['nama_category_item' => $categoryName],
            ['kode_category_item' => 'AUTO_GEN']
        );

        if (!$category) {
            return;
        }
        $idCategory = $category->id;


        // --- 3. Lookup/Create Type Item ---
        // Kolom 'id_type_item' di Excel berisi nama, bukan ID
        $typeName = trim(strtoupper($data['id_type_item'] ?? ''));
        if (empty($typeName)) {
            return;
        }

        // Cari Type Item berdasarkan nama DAN Category ID. Jika tidak ada, buat baru.
        // Ini memastikan Type Item unik dalam konteks Category-nya, seperti di TypeItemImport.
        $typeItem = TypeItem::firstOrCreate(
            [
                'id_category_item' => $idCategory,
                'nama_type_item' => $typeName,
            ],
            [
                'kode_type_item' => 'AUTO_GEN',
            ]
        );

        if (!$typeItem) {
            return;
        }
        $idTypeItem = $typeItem->id;

        // --- 4. Siapkan Data Master Item ---
        // Ambil data lain, gunakan null/default jika tidak ada di Excel
        $minStock = $data['min_stock'] ?? 0;
        $minOrder = $data['min_order'] ?? 0;
        $tipePenjualan = $data['tipe_penjualan'] ?? null;

        // Data Dimensi (pastikan kolom ini ada di file Excel jika ingin diimpor)
        $panjang = $data['panjang'] ?? null;
        $lebar = $data['lebar'] ?? null;
        $tinggi = $data['tinggi'] ?? null;
        $berat = $data['berat'] ?? null;
        $qty = $data['qty'] ?? null;


        // --- 5. Gunakan updateOrCreate untuk Master Item ---
        // Kunci unik yang pasti adalah 'kode_master_item' (berdasarkan validasi)
        MasterItem::updateOrCreate(
            [
                'kode_master_item' => $kodeMasterItem,
            ],
            [
                // Foreign Keys
                'satuan_satu_id' => $idUnit,
                'id_category_item' => $idCategory,
                'id_type_item' => $idTypeItem,

                // Data Wajib & Opsional
                'nama_master_item' => $namaMasterItem,
                'min_stock' => $minStock,
                'min_order' => $minOrder,
                'tipe_penjualan' => $tipePenjualan,

                // Dimensi
                'qty' => $qty,
                'panjang' => $panjang,
                'lebar' => $lebar,
                'tinggi' => $tinggi,
                'berat' => $berat,
            ]
        );
    }
}
