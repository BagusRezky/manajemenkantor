<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FinishGoodItem extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'id_customer_address',
        'id_type_item',
        'satuan_satu_id',
        'kode_material_produk',
        'kode_barcode',
        'pc_number',
        'nama_barang',
        'deskripsi',
        'spesifikasi_kertas',
        'up_satu',
        'up_dua',
        'up_tiga',
        'ukuran_potong',
        'ukuran_cetak',
        'panjang',
        'lebar',
        'tinggi',
        'berat_kotor',
        'berat_bersih'
    ];

    protected $dates = ['deleted_at'];

    public function typeItem()
    {
        return $this->belongsTo(TypeItem::class, 'id_type_item');
    }
    public function customerAddress()
    {
        return $this->belongsTo(customerAddress::class, 'id_customer_address');
    }
    public function unit()
    {
        return $this->belongsTo(Unit::class, 'satuan_satu_id');
    }
    public function salesOrder()
    {
        return $this->hasMany(SalesOrder::class, 'id_finish_good_item');
    }
    public function billOfMaterials()
    {
        return $this->hasMany(BillOfMaterial::class, 'id_finish_good_item');
    }
}
