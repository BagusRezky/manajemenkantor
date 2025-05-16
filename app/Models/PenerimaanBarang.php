<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PenerimaanBarang extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_purchase_order',
        'no_laporan_barang',
        'no_surat_jalan',
        'tgl_terima_barang',
        'nopol_kendaraan',
        'nama_pengirim',
        'catatan_pengirim',
    ];

    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class, 'id_purchase_order');
    }

    // Ubah nama method ini dari penerimaanBarangItem menjadi items agar konsisten
    public function items()
    {
        return $this->hasMany(PenerimaanBarangItem::class, 'id_penerimaan_barang');
    }
}
