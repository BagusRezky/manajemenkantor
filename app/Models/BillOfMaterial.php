<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BillOfMaterial extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_finish_good_item',
        'id_master_item',
        'id_departemen',
        'waste',
        'qty',
        'keterangan'
    ];

    public function finishGoodItem()
    {
        return $this->belongsTo(FinishGoodItem::class,'id_finish_good_item');
    }
    public function masterItem()
    {
        return $this->belongsTo(MasterItem::class,'id_master_item');
    }
    public function departemen()
    {
        return $this->belongsTo(Departemen::class,'id_departemen');
    }
    public function kartuInstruksiKerjaBoms()
    {
        return $this->hasMany(KartuInstruksiKerjaBom::class, 'id_bom');
    }
}
