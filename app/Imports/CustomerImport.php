<?php

namespace App\Imports;

use App\Models\customerAddress;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class CustomerImport implements ToModel, WithHeadingRow
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        return new customerAddress([
            'kode_customer'      => $row['kode_customer'],
            'nama_customer'      => $row['cname'],
            'alamat_lengkap'     => $row['addr'] ?? 'Alamat Belum Diisi',
        ]);
    }
}
