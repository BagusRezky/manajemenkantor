<?php

namespace App\Imports;

use App\Models\ErorProduction;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class ErorProductionImport implements ToModel, WithHeadingRow
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        return new ErorProduction([
            'kode_eror' => $row['kode_eror'],
            'nama_eror' => $row['nama_eror'],
        ]);
    }
}
