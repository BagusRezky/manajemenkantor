<?php

namespace App\Imports;

use App\Models\TypeItem;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Row;
use App\Models\CategoryItem;

class TypeItemImport implements OnEachRow, WithHeadingRow
{
    /**
     * @param \Maatwebsite\Excel\Row $row
     */
    public function onRow(Row $row)
    {
        $data = $row->toArray();

        // 1. Ambil dan standardisasi nama kategori dari Excel (Kolom 'id_category_item' di Excel berisi nama, bukan ID)
        $categoryName = trim(strtoupper($data['id_category_item'] ?? ''));

        // Lewati baris jika nama kategori kosong
        if (empty($categoryName)) {
            return;
        }

        // 2. Lookup CategoryItem ID
        // Kita cari ID kategori berdasarkan nama yang sudah di-standardisasi.
        // Jika kategori tidak ditemukan, kita buat entri kategori baru (opsional, tapi aman) atau skip baris.
        $category = CategoryItem::firstOrCreate(
            ['nama_category_item' => $categoryName],
            ['kode_category_item' => 'AUTO_GEN'] // Sediakan nilai default untuk kolom yang required jika membuat baru
        );

        if (!$category) {
            // Jika lookup gagal atau tidak ditemukan dan tidak dibuat, skip
            return;
        }

        $idCategory = $category->id;

        // 3. Ambil dan standardisasi data Type Item
        $kodeTypeItem = $data['kode_type_item'] ?? '-';
        $namaTypeItem = trim(strtoupper($data['nama_type_item'] ?? ''));

        // Jika nama type item kosong, skip
        if (empty($namaTypeItem)) {
            return;
        }

        // 4. Gunakan updateOrCreate untuk menghindari duplikasi Type Item
        // Kunci uniknya adalah kombinasi ID Kategori dan Nama Type Item,
        // karena Type Item yang sama bisa saja ada di Kategori berbeda,
        // atau Nama Type Itemnya sama, tapi kodenya berbeda.
        TypeItem::updateOrCreate(
            [
                // Kriteria Pencarian: Pastikan Type Item unik untuk Kategori tersebut
                'id_category_item' => $idCategory,
                'nama_type_item' => $namaTypeItem,
            ],
            [
                // Data yang akan dibuat/diupdate
                'kode_type_item' => $kodeTypeItem,
                'nama_type_item' => $namaTypeItem,
            ]
        );
    }
}
