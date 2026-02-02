<?php

namespace App\Imports;

use App\Models\OperasionalPay;
use App\Models\Karyawan;
use App\Models\MasterCoa;
use Carbon\Carbon;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\ToModel;

class OperasionalPayImport implements ToModel, WithHeadingRow
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        // 1. Logika Status (Jika kosong/string "NULL", default ke 1)
        $status = $row['status'] ?? null;
        if ($status === null || $status === '' || strtoupper((string)$status) === 'NULL') {
            $status = 1;
        }

        // 2. Pembersihan Kolom Integer & String (Teks "NULL" jadi null)
        $kode = $row['kode'] ?? null;
        if (in_array(strtoupper((string)$kode), ['', 'NULL', '-'])) { $kode = null; }

        $mesin = $row['mesin'] ?? null;
        if (in_array(strtoupper((string)$mesin), ['', 'NULL', '-'])) { $mesin = null; }

        $nopol = $row['nopol'] ?? null;
        if (in_array(strtoupper((string)$nopol), ['', 'NULL', '-'])) { $nopol = null; }

        $odometer = $row['odometer'] ?? null;
        if (in_array(strtoupper((string)$odometer), ['', 'NULL', '-'])) { $odometer = null; }

        $jenis = $row['jenis'] ?? null;
        if (in_array(strtoupper((string)$jenis), ['', 'NULL', '-'])) { $jenis = null; }

        // 3. Handling Tanggal Transaksi
        $tanggalTransaksi = $row['tanggal_transaksi'] ?? null;
        if ($tanggalTransaksi) {
            if (is_numeric($tanggalTransaksi)) {
                // Jika format Excel date (numeric)
                $tanggalTransaksi = Date::excelToDateTimeObject($tanggalTransaksi)->format('Y-m-d');
            } else {
                try {
                    // Jika format string (misal: 1/30/2026)
                    $tanggalTransaksi = Carbon::parse($tanggalTransaksi)->format('Y-m-d');
                } catch (\Exception $e) {
                    $tanggalTransaksi = null;
                }
            }
        }

        // 4. Cari ID Karyawan (Berdasarkan Nama - Case Insensitive)
        $idKaryawan = null;
        $karyawanName = $row['id_karyawan'] ?? null;
        if ($karyawanName && !in_array(strtoupper((string)$karyawanName), ['', 'NULL', '-'])) {
            $karyawan = Karyawan::where('nama', 'like', '%' . $karyawanName . '%')->first();
            $idKaryawan = $karyawan ? $karyawan->id : null;
        }

        // 5. Cari ID Account Kas & Account Beban (Berdasarkan Kode Akuntansi)
        $idAccKas = null;
        if (!empty($row['id_account_kas']) && strtoupper((string)$row['id_account_kas']) !== 'NULL') {
            $coaKas = MasterCoa::where('kode_akuntansi', $row['id_account_kas'])->first();
            $idAccKas = $coaKas ? $coaKas->id : null;
        }

        $idAccBeban = null;
        if (!empty($row['id_account_beban']) && strtoupper((string)$row['id_account_beban']) !== 'NULL') {
            $coaBeban = MasterCoa::where('kode_akuntansi', $row['id_account_beban'])->first();
            $idAccBeban = $coaBeban ? $coaBeban->id : null;
        }

        // 6. Gunakan updateOrCreate untuk mencegah data double
        // Kunci unik: no_bukti, nominal, dan keterangan
        return new OperasionalPay([
            'no_bukti'            => $row['no_bukti'],
            'nominal'             => $row['nominal'] ?? 0,
            'keterangan'          => $row['keterangan'] ?? null,
            'id_karyawan'         => $idKaryawan,
            'id_account_kas'      => $idAccKas,
            'id_account_beban'    => $idAccBeban,
            'gudang'              => $row['gudang'] ?? '-',
            'periode'             => $row['periode'] ?? date('Y'),
            'tanggal_transaksi'   => $tanggalTransaksi,
            'mesin'               => $mesin,
            'kode'                => $kode,
            'nopol'               => $nopol,
            'odometer'            => $odometer,
            'jenis'               => $jenis,
            'status'              => $status,
        ]);
    }
}
