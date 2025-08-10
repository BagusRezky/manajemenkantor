<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubcountOut extends Model
{
    protected $fillable = [
        'no_subcount_out',
        'tgl_subcount_out',
        'id_supplier',
        'admin_produksi',
        'supervisor',
        'admin_mainstore',
        'keterangan',
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'id_supplier');
    }

    public function subcountOutItems()
    {
        return $this->hasMany(SubcountOutItem::class, 'id_subcount_out');
    }

    public function subcountInItems()
    {
        return $this->hasMany(SubcountInItem::class, 'id_subcount_out');
    }
}
