<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Absen extends Model
{
    use HasFactory;

    protected $fillable = [
        'tanggal_scan',
        'tanggal',
        'jam',
        'pin',
        'nip',
        'nama',
        'jabatan',
        'departemen',
        'kantor',
        'verifikasi',
        'io',
        'workcode',
        'sn',
        'mesin',
    ];
}
