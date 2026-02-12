<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_surat_jalan',
        'id_metode_bayar',
        'no_surat_jalan_lama',
        'no_invoice_lama',
        'no_spk_lama',
        'no_so_lama',
        'no_invoice',
        'tgl_invoice',
        'tgl_jatuh_tempo',
        'tempo',
        'total_sub',
        'ppn_nominal',
        'total',
        'bayar',
        'kembali',
        'ppn',
        'ongkos_kirim',
        'uang_muka',
        'discount',
        'is_legacy',
        'keterangan'
    ];

    public function suratJalan()
    {
        return $this->belongsTo(SuratJalan::class, 'id_surat_jalan');
    }

    public function metodeBayar()
    {
        return $this->belongsTo(MetodeBayar::class, 'id_metode_bayar');
    }
    public function details()
    {
        return $this->hasMany(InvoiceDetail::class, 'id_invoice');
    }

    public function bonPays()
    {
        return $this->hasMany(BonPay::class, 'id_invoice');
    }
}
