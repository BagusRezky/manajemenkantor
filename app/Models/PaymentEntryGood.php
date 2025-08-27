<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentEntryGood extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_penerimaan_barang',
        'no_tagihan',
        'tanggal_transaksi',
        'tanggal_jatuh_tempo',
        'harga_per_qty',
        'diskon',
        'ppn',
        'keterangan',
    ];

    public function penerimaanBarang()
    {
        return $this->belongsTo(PenerimaanBarang::class, 'id_penerimaan_barang');
    }
}
