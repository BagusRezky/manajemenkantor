<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MetodeBayar extends Model
{
    protected $table = 'metode_bayars';

    protected $fillable = [
        'kode_bayar',
        'metode_bayar',
    ];
}
