<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PoBilling extends Model
{
    use HasFactory;
    protected $table = 'po_billings';

    protected $fillable = [
        'id_penerimaan_barang',
        'id_karyawan',
        'id_purchase_order',
        'no_bukti_tagihan',
        'invoice_vendor',
        'no_po_asal',
        'gudang',
        'periode',
        'tanggal_transaksi',
        'jatuh_tempo',
        'ongkir',
        'total_nilai_barang',
        'ppn',
        'dp',
        'total_akhir',
        'keterangan',
  
    ];

    public function penerimaanBarang()
    {
        return $this->belongsTo(PenerimaanBarang::class, 'id_penerimaan_barang');
    }

    public function karyawan()
    {
        return $this->belongsTo(Karyawan::class, 'id_karyawan');
    }

    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class, 'id_purchase_order');
    }

    public function details()
    {
        return $this->hasMany(PoBillingDetail::class, 'id_po_billing');
    }
}
