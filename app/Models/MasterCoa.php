<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MasterCoa extends Model
{
    use HasFactory;

    protected $table = 'master_coas';

    protected $fillable = [
        'id_karyawan',
        'id_master_coa_class',
        'periode',
        'gudang',
        'kode_akuntansi',
        'nama_akun',
        'saldo_debit',
        'saldo_kredit',
        'nominal_default',
        'keterangan',
        'status',
    ];

    public function karyawan()
    {
        return $this->belongsTo(Karyawan::class, 'id_karyawan');
    }

    public function masterCoaClass()
    {
        return $this->belongsTo(MasterCoaClass::class, 'id_master_coa_class');
    }
}
