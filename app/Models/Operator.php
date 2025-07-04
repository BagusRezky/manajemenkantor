<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Operator extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_operator',
    ];
    public function printings()
    {
        return $this->hasMany(Printing::class, 'id_operator');
    }
    public function dieMakings()
    {
        return $this->hasMany(DieMaking::class, 'id_operator');
    }
}
