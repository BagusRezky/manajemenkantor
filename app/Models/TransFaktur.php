<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransFaktur extends Model
{
    protected $table = 'trans_fakturs';

    protected $fillable = [
        'id_purchase_order',
        'no_po_asal',
        'no_faktur',
        'no_invoice',
        'tanggal_transaksi',
        'periode',
        'gudang',
        'kode_customer',
        'npwp',
        'alamat',
        'keterangan',
        'id_karyawan',
        'total_dpp',
        'total_ppn',
        'grand_total',

    ];


    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class, 'id_purchase_order');
    }

    public function details()
    {
        return $this->hasMany(TransFakturDetail::class, 'id_trans_faktur');
    }

    public function karyawan()
    {
        return $this->belongsTo(Karyawan::class, 'id_karyawan');
    }
}
