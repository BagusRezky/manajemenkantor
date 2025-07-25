<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_surat_jalan',
        'no_invoice',
        'tgl_invoice',
        'tgl_jatuh_tempo',
        'discount',
        'ppn',
        'ongkos_kirim',
        'uang_muka',
    ];

    public function suratJalan()
    {
        return $this->belongsTo(SuratJalan::class, 'id_surat_jalan');
    }
}
