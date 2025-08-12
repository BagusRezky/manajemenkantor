<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReturInternal extends Model
{

    use HasFactory;

    protected $fillable = [
        'id_imr_finishing',
        'id_imr_diemaking',
        'id_imr',
        'no_retur_internal',
        'tgl_retur_internal',
        'nama_retur_internal',
        'catatan_retur_internal',
    ];

    public function imrFinishing()
    {
        return $this->belongsTo(ImrFinishing::class, 'id_imr_finishing');
    }

    public function imrDiemaking()
    {
        return $this->belongsTo(ImrDiemaking::class, 'id_imr_diemaking');
    }

    public function imr()
    {
        return $this->belongsTo(InternalMaterialRequest::class, 'id_imr');
    }

    public function items()
    {
        return $this->hasMany(ReturInternalItem::class, 'id_retur_internal');
    }
}
