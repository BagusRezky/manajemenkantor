<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ReturEksternalItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_retur_eksternal',
        'id_penerimaan_barang_item',
        'qty_retur',
        'catatan_retur_item',
    ];

    public function returEksternal()
    {
        return $this->belongsTo(ReturEksternal::class, 'id_retur_eksternal');
    }

    public function penerimaanBarangItem()
    {
        return $this->belongsTo(PenerimaanBarangItem::class, 'id_penerimaan_barang_item');
    }
}
