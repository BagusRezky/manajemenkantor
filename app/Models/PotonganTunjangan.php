<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PotonganTunjangan extends Model
{
    use HasFactory;

    protected $filable = [
        'id_karyawan',
        'periode_payroll',
        'potongan_tunjangan_jabatan',
        'potongan_tunjangan_kompetensi',
        'potongan_intensif',
        'keterangan',
    ];

    public function karyawan()
    {
        return $this->belongsTo(Karyawan::class, 'id_karyawan');
    }
}
