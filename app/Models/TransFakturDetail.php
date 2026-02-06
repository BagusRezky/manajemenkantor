<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransFakturDetail extends Model
{
    protected $table = 'trans_faktur_details';

    protected $fillable = [
        'id_trans_faktur',
        'master_item',
        'qty',
        'harga_per_qty',
        'unit',
        'subtotal',
        'ppn_persen',
        'ppn_nilai',
        'total_item',
        'keterangan',
    ];

    public function transFaktur()
    {
        return $this->belongsTo(TransFaktur::class, 'id_trans_faktur');
    }

}
