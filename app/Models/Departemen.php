<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Departemen extends Model
{
    use HasFactory;
    protected $fillable = [
        'kode_departemen',
        'nama_departemen',
    ];
    public function billOfMaterials()
    {
        return $this->hasMany(BillOfMaterial::class, 'id_departemen');
    }
}
