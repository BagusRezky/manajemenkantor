<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lembur extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode_gudang',
        'id_karyawan',
        'tanggal_lembur',
        'jam_awal_lembur',
        'jam_selesai_lembur',
        'keterangan',
    ];

    public function karyawan()
    {
        return $this->belongsTo(Karyawan::class, 'id_karyawan');
    }
}
