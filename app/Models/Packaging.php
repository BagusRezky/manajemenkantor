<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Packaging extends Model
{
    use HasFactory;
    protected $fillable = [
        'kode_packaging',
        'id_kartu_instruksi_kerja',
        'satuan_transfer',
        'jenis_transfer',
        'tgl_transfer',
        'jumlah_satuan_penuh',
        'qty_persatuan_penuh',
        'jumlah_satuan_sisa',
        'qty_persatuan_sisa',
    ];

    public function kartuInstruksiKerja()
    {
        return $this->belongsTo(KartuInstruksiKerja::class, 'id_kartu_instruksi_kerja');
    }
}
