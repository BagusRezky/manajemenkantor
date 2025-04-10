<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'kode_suplier',
        'nama_suplier',
        'jenis_suplier',
        'keterangan',
        'alamat_lengkap',
    ];
}
