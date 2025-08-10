<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubcountInItem extends Model
{
    protected $fillable = [
        'id_subcount_in',
        'id_subcount_out',
        'qty',
        'keterangan',
    ];

    public function subcountIn()
    {
        return $this->belongsTo(SubcountIn::class, 'id_subcount_in');
    }
    public function subcountOut()
    {
        return $this->belongsTo(SubcountOut::class, 'id_subcount_out');
    }
}
