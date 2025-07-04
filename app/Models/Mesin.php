<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Mesin extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_mesin',
        'jenis_mesin',
        'kapasitas',
        'proses',
        'status',
    ];
    public function printings()
    {
        return $this->hasMany(Printing::class, 'id_mesin');
    }
    public function dieMakings()
    {
        return $this->hasMany(DieMaking::class, 'id_mesin');
    }
}
