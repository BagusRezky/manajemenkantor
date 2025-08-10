<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubcountIn extends Model
{
    protected $fillable = [
        'no_subcount_in',
        'tgl_subcount_in',
        'no_surat_jalan_pengiriman',
        'admin_produksi',
        'supervisor',
        'admin_mainstore',
        'keterangan',
    ];

    public function subcountInItems()
    {
        return $this->hasMany(SubcountInItem::class, 'id_subcount_in');
    }
}
