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
    protected $appends = ['custom_part'];
    protected function casts(): array
    {
        return [
            'tolerasi_pengiriman' => 'string',
            'catatan_colour_range' => 'string',
            'catatan' => 'string',
        ];
    }

    public function getCustomPartAttribute()
    {
        // If no_bon_pesanan exists, try to extract the custom part
        if ($this->no_bon_pesanan) {
            $parts = explode('/', $this->no_bon_pesanan);
            if (count($parts) >= 3) {
                return $parts[2];
            }
        }
        return 'XX-XXX'; // Default value
    }

    public function setCustomPartAttribute($value)
    {
        // This is just for capturing the value during form submission
        // It won't be stored in the database directly
        $this->attributes['custom_part_temp'] = $value;
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($salesOrder) {
            // Use the temporary attribute or default value
            $customPart = $salesOrder->attributes['custom_part_temp'] ?? 'XX-XXX';

            if (!$salesOrder->no_bon_pesanan) {
                $salesOrder->no_bon_pesanan = self::generateOrderNumber($customPart);
            }
        });
    }

    public static function generateOrderNumber($customPart)
    {
        // Get the current month and year in mmyy format
        $dateSection = now()->format('my');

        // Get the last order number from this month/year
        $lastOrder = self::where('no_bon_pesanan', 'like', "%/{$dateSection}")
            ->orderBy('id', 'desc')
            ->first();

        // Generate the next sequential number
        $sequentialNumber = '001';
        if ($lastOrder) {
            // Extract the sequential number part from the last order
            $lastSequentialPart = explode('/', $lastOrder->no_bon_pesanan)[0];
            // Increment and pad with leading zeros
            $sequentialNumber = str_pad((int)$lastSequentialPart + 1, 3, '0', STR_PAD_LEFT);
        }

        // Format: xxx/00/xx-xxx/mmyy
        return "{$sequentialNumber}/00/{$customPart}/{$dateSection}";
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
