<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class customerAddress extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode_customer',
        'nama_customer',
        'alamat_lengkap',
        'alamat_kedua',
        'alamat_ketiga',
    ];
    protected function casts(): array
    {
        return [
            'alamat_kedua' => 'string',
            'alamat_ketiga' => 'string',
        ];
    }

    public function setAlamatKeduaAttribute($value)
    {
        $this->attributes['alamat_kedua'] = $value ?: null;
    }

    public function setAlamatKetigaAttribute($value)
    {
        $this->attributes['alamat_ketiga'] = $value ?: null;
    }
}
