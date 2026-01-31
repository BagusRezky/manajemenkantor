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
        'nik',
        'no_ktp',
        'jenis_kelamin',
        'status_perkawinan',
        'agama',
        'keterangan_tambahan',
        'alamat_domisili',
        'kota_domisili',
        'kecamatan_domisili',
        'desa_domisili',
        'kode_pos_domisili',
        'alamat_ktp',
        'kota_ktp',
        'kecamatan_ktp',
        'desa_ktp',
        'kode_pos_ktp',
        'gaji_pokok',
        'tipe_gaji',
        'nama_npwp',
        'alamat_npwp',
        'nama_bank',
        'rekening_an',
        'nomor_rekening',
        'ptkp',
        'tunjangan_kompetensi',
        'tunjangan_jabatan',
        'tunjangan_intensif',
        'tanggal_npwp',
        'nomor_npwp',
        'bpjs_nama',
        'bpjs_kesehatan',
        'bpjs_ketenagakerjaan',
        'bpjs_cabang',
        'bpjs_tanggal',
        'status_lembur',
    ];


    // Relasi ke model User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke model Lembur
    public function lembur()
    {
        return $this->hasMany(Lembur::class, 'id_karyawan');
    }

    // Relasi ke model Izin
    public function izin()
    {
        return $this->hasMany(Izin::class, 'id_karyawan');
    }

    // Relasi ke model BonusKaryawan
    public function bonusKaryawan()
    {
        return $this->hasMany(BonusKaryawan::class, 'id_karyawan');
    }

    // Relasi ke model PotonganTunjangan
    public function potonganTunjangan()
    {
        return $this->hasMany(PotonganTunjangan::class, 'id_karyawan');
    }

    // Relasi ke model PengajuanPinjaman
    public function pengajuanPinjaman()
    {
        return $this->hasMany(PengajuanPinjaman::class, 'id_karyawan');
    }

    // Relasi ke model Cuti
    public function cuti()
    {
        return $this->hasMany(Cuti::class, 'id_karyawan');
    }

    // Relasi ke model MasterCoaClass
    public function masterCoaClasses()
    {
        return $this->hasMany(MasterCoaClass::class, 'id_karyawan');
    }
}
