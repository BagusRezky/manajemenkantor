<?php

namespace App\Imports;

use App\Models\Absen;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use Carbon\Carbon;


class AbsenImport implements ToModel, WithHeadingRow
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        // --- TANGGAL SCAN ---
        $tanggalScan = $row['tanggal_scan'] ?? null;
        if ($tanggalScan) {
            if (is_numeric($tanggalScan)) {
                // Excel numeric date
                $tanggalScan = Date::excelToDateTimeObject($tanggalScan)
                    ->format('Y-m-d H:i:s');
            } else {
                // String date format DD-MM-YYYY HH:MM:SS
                try {
                    $tanggalScan = Carbon::createFromFormat('d-m-Y H:i:s', $tanggalScan)
                        ->format('Y-m-d H:i:s');
                } catch (\Exception $e) {
                    $tanggalScan = null; // fallback jika gagal parse
                }
            }
        }

        // --- TANGGAL ---
        $tanggal = $row['tanggal'] ?? null;
        if ($tanggal) {
            if (is_numeric($tanggal)) {
                $tanggal = Date::excelToDateTimeObject($tanggal)
                    ->format('Y-m-d');
            } else {
                try {
                    $tanggal = Carbon::createFromFormat('d-m-Y', $tanggal)
                        ->format('Y-m-d');
                } catch (\Exception $e) {
                    $tanggal = null;
                }
            }
        }

        return new Absen([
            'tanggal_scan' => $tanggalScan,
            'tanggal'      => $tanggal,
            'jam'          => $row['jam'] ?? null,
            'pin'          => $row['pin'] ?? null,
            'nip'          => $row['nip'] ?? null,
            'nama'         => $row['nama'] ?? null,
            'jabatan'      => $row['jabatan'] ?? null,
            'departemen'   => $row['departemen'] ?? null,
            'kantor'       => $row['kantor'] ?? null,
            'verifikasi'   => $row['verifikasi'] ?? null,
            'io'           => $row['io'] ?? null,
            'workcode'     => $row['workcode'] ?? null,
            'sn'           => $row['sn'] ?? null,
            'mesin'        => $row['mesin'] ?? null,
        ]);
    }
}
