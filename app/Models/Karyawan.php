<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Karyawan extends Model
{
    use HasFactory;

    protected $fillable = [
        'pin',
        'nip',
        'nama',
        'jadwal_kerja',
        'tgl_mulai_jadwal',
        'tempat_lahir',
        'tanggal_lahir',
        'jabatan',
        'departemen',
        'kantor',
        'password',
        'rfid',
        'no_telp',
        'privilege',
        'status_pegawai',
        'fp_zk',
        'fp_neo',
        'fp_revo',
        'fp_livo',
        'fp_uareu',
        'wajah',
        'telapak_tangan',
        'tgl_masuk_kerja',
        'tgl_akhir_kontrak',
        'user_id',
    ];


    // Relasi ke model User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
