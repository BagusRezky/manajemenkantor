<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SalesOrder extends Model
{
    use HasFactory;
    protected $fillable = [
        'id_finish_good_item',
        'id_customer_address',
        'id_master_item',
        'no_bon_pesanan',
        'no_po_customer',
        'jumlah_pesanan',
        'harga_pcs_bp',
        'harga_pcs_kirim',
        'mata_uang',
        'syarat_pembayaran',
        'eta_marketing',
        'klaim_kertas',
        'dipesan_via',
        'tipe_pesanan',
        'toleransi_pengiriman',
        'catatan_colour_range',
        'catatan'
    ];
    protected function casts(): array
    {
        return [
            'toleransi_pengiriman' => 'string',
            'catatan_colour_range' => 'string',
            'catatan' => 'string',
        ];
    }

    public static function generateSalesOrderNumber($id)
    {
        // Ambil bulan & tahun sekarang
        $month = date('m');
        $year = date('Y');

        // Format urutan jadi 3 digit
        $orderNumber = str_pad($id, 3, '0', STR_PAD_LEFT);

        // Gabung sesuai format baru
        return "{$orderNumber}/IK-10/{$month}{$year}";
    }
    public function setToleransiPengirimanAttribute($value)
    {
        $this->attributes['toleransi_pengiriman'] = $value ?: null;
    }
    public function setCatatanColourRangeAttribute($value)
    {
        $this->attributes['catatan_colour_range'] = $value ?: null;
    }
    public function setCatatanAttribute($value)
    {
        $this->attributes['catatan'] = $value ?: null;
    }


    public function finishGoodItem()
    {
        return $this->belongsTo(FinishGoodItem::class, 'id_finish_good_item');
    }

    public function finish_good_item() // alias untuk backward compatibility
    {
        return $this->finishGoodItem();
    }

    public function masterItem()
    {
        return $this->belongsTo(MasterItem::class, 'id_master_item');
    }

    public function customerAddress()
    {
        return $this->belongsTo(customerAddress::class, 'id_customer_address');
    }

    public function customer_address() // alias untuk backward compatibility
    {
        return $this->customerAddress();
    }

    public function kartuInstruksiKerja()
    {
        return $this->hasOne(KartuInstruksiKerja::class, 'id_sales_order');
    }
}
