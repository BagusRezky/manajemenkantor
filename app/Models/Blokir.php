<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Blokir extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_kartu_instruksi_kerja',
        'no_blokir',
        'tgl_blokir',
        'operator',
        'qty_blokir',
        'keterangan_blokir',
    ];

    public function kartuInstruksiKerja()
    {
        return $this->belongsTo(KartuInstruksiKerja::class, 'id_kartu_instruksi_kerja');
    }
}
