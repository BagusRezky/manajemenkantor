<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_invoice',
        'id_account',
        'kode_group',
        'kode_produk',
        'nama_produk',
        'jumlah',
        'harga',
        'diskon_barang',
        'diskon_member',
        'bayar',
        'kembali',
        'total',
        'unit',
        'marketing',
        'qty_small'
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class, 'id_invoice');
    }
    public function account()
    {
        return $this->belongsTo(MasterCoa::class, 'id_account');
    }
}
