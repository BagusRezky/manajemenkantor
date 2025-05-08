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
            'tolerasi_pengiriman' => 'string',
            'catatan_colour_range' => 'string',
            'catatan' => 'string',
        ];
    }

    public static function generateSalesOrderNumber($id)
    {
        $yearMonth = now()->format('ym'); // Format: yymm
        $formattedId = str_pad($id, 5, '0', STR_PAD_LEFT);
        return "SO/{$formattedId}.{$yearMonth}";
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
    public function customerAddress()
    {
        return $this->belongsTo(CustomerAddress::class, 'id_customer_address');
    }

    public function kartuInstruksiKerja()
    {
        return $this->hasOne(KartuInstruksiKerja::class, 'id_sales_order');
    }
}
