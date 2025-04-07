<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MasterKonversi extends Model
{
    use HasFactory;

    protected $fillable = [
        "id_type_item",
        "satuan_satu_id",
        "satuan_dua_id",
        "jumlah_satuan_konversi"
    ];

    public function typeItem()
    {
        return $this->belongsTo(TypeItem::class, 'id_type_item');
    }

    public function satuanSatu()
    {
        return $this->belongsTo(Unit::class, 'satuan_satu_id');
    }

    public function satuanDua()
    {
        return $this->belongsTo(Unit::class, 'satuan_dua_id');
    }
}
