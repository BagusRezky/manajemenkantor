<?php

namespace App\Imports;

use App\Models\Supplier;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class SupplierImport implements ToModel, WithHeadingRow
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        return new Supplier([
            'kode_suplier'      => $row['kode_supplier'] ?? '-',
            'nama_suplier'      => $row['cname'] ?? '-',
            'alamat_lengkap'    => $row['addr'] ?? '-',
            'jenis_suplier'     => $row['cjenis'] ?? '-',
            'keterangan'        => $row['keterangan'] ?? '-',
        ]);
    }
}
