<?php

namespace App\Imports;

use App\Models\Departemen;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class DepartemenImport implements ToModel, WithHeadingRow
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */

    public function uniqueBy()
    {
        return ['kode_departemen'];
    }

    public function model(array $row)
    {
        // cari data lama berdasarkan kode_departemen
        $existing = Departemen::where('kode_departemen', $row['id_dept'] ?? null)->first();

        // buat array data baru
        $data = [
            'kode_departemen' => strtoupper($row['id_dept'] ?? $existing?->kode_departemen),
            'nama_departemen' => strtoupper($row['cdept'] ?? $existing?->nama_departemen),
        ];

        // return sebagai model baru (Laravel Excel otomatis handle upsert)
        return new Departemen($data);
    }
}
