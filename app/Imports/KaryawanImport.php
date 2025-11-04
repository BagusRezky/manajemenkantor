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
        return ['nip', 'nama'];
    }

    public function model(array $row)
    {
        // cari data lama (kalau ada)
        $existing = Karyawan::where('nip', $row['nip'])
            ->where('nama', $row['nama'])
            ->first();

        // buat array baru
        $data = [
            'pin'            => $row['pin'] ?? $existing?->pin,
            'nama'           => $row['nama'] ?? $existing?->nama,
            'jadwal_kerja'   => $row['jadwal_kerja'] ?? $existing?->jadwal_kerja,
            'tempat_lahir'   => $row['tempat_lahir'] ?? $existing?->tempat_lahir,
            'jabatan'        => $row['jabatan'] ?? $existing?->jabatan,
            'departemen'     => $row['departemen'] ?? $existing?->departemen,
            'kantor'         => $row['kantor'] ?? $existing?->kantor,
            'rfid'           => $row['rfid'] ?? $existing?->rfid,
            'no_telp'        => $row['no_telp'] ?? $existing?->no_telp,
            'privilege'      => $row['privilege'] ?? $existing?->privilege,
            'status_pegawai' => $row['status_pegawai'] ?? $existing?->status_pegawai,
            'nip'            => $row['nip'] ?? $existing?->nip,
        ];

        // handle tanggal agar tidak menimpa null
        $tanggalFields = [
            'tgl_mulai_jadwal',
            'tanggal_lahir',
            'tgl_masuk_kerja',
            'tgl_akhir_kontrak'
        ];

        foreach ($tanggalFields as $field) {
            if (!empty($row[$field])) {
                $data[$field] = is_numeric($row[$field])
                    ? Carbon::instance(Date::excelToDateTimeObject($row[$field]))
                    : Carbon::parse($row[$field]);
            } else {
                $data[$field] = $existing?->$field; // pertahankan nilai lama
            }
        }

        return new Karyawan($data);
    }
}
