<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BonusKaryawan extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode_gudang',
        'id_karyawan',
        'tanggal_bonus',
        'nilai_bonus',
        'keterangan'
    ];

    public function karyawan()
    {
        return $this->belongsTo(Karyawan::class, 'id_karyawan');
    }
}
