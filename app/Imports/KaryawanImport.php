<?php

namespace App\Imports;

use App\Models\Karyawan;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\WithUpserts;
use PhpOffice\PhpSpreadsheet\Shared\Date;


class KaryawanImport implements ToModel, WithHeadingRow, WithUpserts
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */

    public function uniqueBy()
    {
        return 'nip';
    }

    public function model(array $row)
    {
        return new Karyawan([
            'pin'              => $row['pin'] ?? null,
            'nip'              => $row['nip'],
            'nama'             => $row['nama'] ?? null,
            'jadwal_kerja'     => $row['jadwal_kerja'] ?? null,

            // ✅ Tanggal Mulai Jadwal
            'tgl_mulai_jadwal' => isset($row['tgl_mulai_jadwal'])
                ? (is_numeric($row['tgl_mulai_jadwal'])
                    ? Carbon::instance(Date::excelToDateTimeObject($row['tgl_mulai_jadwal']))
                    : Carbon::parse($row['tgl_mulai_jadwal']))
                : null,

            'tempat_lahir'     => $row['tempat_lahir'] ?? null,

            // ✅ Tanggal Lahir
            'tanggal_lahir'    => isset($row['tanggal_lahir'])
                ? (is_numeric($row['tanggal_lahir'])
                    ? Carbon::instance(Date::excelToDateTimeObject($row['tanggal_lahir']))
                    : Carbon::parse($row['tanggal_lahir']))
                : null,

            'jabatan'          => $row['jabatan'] ?? null,
            'departemen'       => $row['departemen'] ?? null,
            'kantor'           => $row['kantor'] ?? null,
            'password'         => $row['password'] ?? null,
            'rfid'             => $row['rfid'] ?? null,
            'no_telp'          => $row['no_telp'] ?? null,
            'privilege'        => $row['privilege'] ?? null,
            'status_pegawai'   => $row['status_pegawai'] ?? 'Aktif',
            'fp_zk'            => $row['fp_zk'] ?? null,
            'fp_neo'           => $row['fp_neo'] ?? null,
            'fp_revo'          => $row['fp_revo'] ?? null,
            'fp_livo'          => $row['fp_livo'] ?? null,
            'fp_uareu'         => $row['fp_uareu'] ?? null,
            'wajah'            => $row['wajah'] ?? null,
            'telapak_tangan'   => $row['telapak_tangan'] ?? null,

            // ✅ Tanggal Masuk Kerja
            'tgl_masuk_kerja'  => isset($row['tgl_masuk_kerja'])
                ? (is_numeric($row['tgl_masuk_kerja'])
                    ? Carbon::instance(Date::excelToDateTimeObject($row['tgl_masuk_kerja']))
                    : Carbon::parse($row['tgl_masuk_kerja']))
                : null,

            // ✅ Tanggal Akhir Kontrak
            'tgl_akhir_kontrak'=> isset($row['tgl_akhir_kontrak'])
                ? (is_numeric($row['tgl_akhir_kontrak'])
                    ? Carbon::instance(Date::excelToDateTimeObject($row['tgl_akhir_kontrak']))
                    : Carbon::parse($row['tgl_akhir_kontrak']))
                : null,
        ]);
    }
}
