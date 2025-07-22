<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SuratJalan extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_kartu_instruksi_kerja',
        'no_surat_jalan',
        'tgl_surat_jalan',
        'transportasi',
        'no_polisi',
        'driver',
        'pengirim',
        'keterangan',
        'alamat_tujuan',
        'qty_pengiriman',
    ];

    public function kartuInstruksiKerja()
    {
        return $this->belongsTo(KartuInstruksiKerja::class, 'id_kartu_instruksi_kerja');
    }

    public function invoice()
    {
        return $this->hasOne(Invoice::class, 'id_surat_jalan');
    }

}
