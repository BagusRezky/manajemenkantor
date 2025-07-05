<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MesinFinishing extends Model
{
    use HasFactory;
    protected $fillable = [
        'nama_mesin_finishing',
        'jenis_mesin_finishing',
        'kapasitas_finishing',
        'proses_finishing',
        'status_finishing',
    ];

    public function finishings()
    {
        return $this->hasMany(Finishing::class, 'id_mesin_finishing');
    }

}
