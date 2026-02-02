<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterCoaClass extends Model
{
    protected $table = 'master_coa_classes';

    protected $fillable = [
        'id_karyawan',
        'code',
        'name',
        'status',
    ];

    public function karyawan()
    {
        return $this->belongsTo(Karyawan::class, 'id_karyawan');
    }

    public function masterCoa()
    {
        return $this->hasMany(MasterCoa::class, 'id_master_coa_class');
    }
}
