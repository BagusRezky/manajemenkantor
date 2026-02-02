<?php

namespace App\Imports;

use App\Models\MasterCoa;
use App\Models\Karyawan;
use App\Models\MasterCoaClass;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class MasterCoaImport implements ToModel, WithHeadingRow
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        $namaAkun = !empty($row['nama_akun']) ? $row['nama_akun'] : '-';
        $gudang = !empty($row['gudang']) ? $row['gudang'] : '-';
        $kodeAkuntansi = !empty($row['kode_akuntansi']) ? $row['kode_akuntansi'] : '-';

        $karyawanName = $row['id_karyawan'] ?? null;
        $idKaryawan = null;
        if ($karyawanName && $karyawanName !== '-') {
            $karyawan = Karyawan::where('nama', 'like', '%' . $karyawanName . '%')->first();
            $idKaryawan = $karyawan ? $karyawan->id : null;
        }

        $groupName = $row['group_akun'] ?? null;
        $idCoaClass = null;
        if ($groupName && $groupName !== '-') {
            $coaClass = MasterCoaClass::where('code', 'like', '%' . $groupName . '%')->first();
            $idCoaClass = $coaClass ? $coaClass->id : null;
        }

        return MasterCoa::updateOrCreate(
            [
                'kode_akuntansi' => $kodeAkuntansi,
                'periode'        => $row['periode'] ?? 0,
            ],
            [
                'id_karyawan'         => $idKaryawan,
                'id_master_coa_class' => $idCoaClass,
                'gudang'              => $gudang,
                'nama_akun'           => $namaAkun,
                'saldo_debit'         => $row['saldo_debit'] ?? 0,
                'saldo_kredit'        => $row['saldo_kredit'] ?? 0,
                'nominal_default'     => $row['nominal_default'] ?? 0,
                'keterangan'          => $row['keterangan'] ?? '-',
                'status'              => $row['status'] ?? 1,
            ]
        );
    }
}
