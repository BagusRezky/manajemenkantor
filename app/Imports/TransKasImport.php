<?php

namespace App\Imports;

use App\Models\TransKas;
use App\Models\Karyawan;
use App\Models\MasterCoa;
use App\Models\customerAddress;
use Carbon\Carbon;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class TransKasImport implements ToModel, WithHeadingRow
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        // 1. Cari ID Karyawan (Case Insensitive)
        $karyawanName = $row['id_karyawan'] ?? null;
        $idKaryawan = null;
        if ($karyawanName && $karyawanName !== '' && $karyawanName !== 'NULL') {
            $karyawan = Karyawan::where('nama', 'like', '%' . $karyawanName . '%')->first();
            $idKaryawan = $karyawan ? $karyawan->id : null;
        }

        // 2. Cari ID Account Kas (berdasarkan kode_akuntansi di excel)
        $kodeKas = $row['id_account_kas'] ?? null;
        $idAccKas = null;
        if ($kodeKas) {
            $coaKas = MasterCoa::where('kode_akuntansi', $kodeKas)->first();
            $idAccKas = $coaKas ? $coaKas->id : null;
        }

        // 3. Cari ID Account Kas Lain (berdasarkan kode_akuntansi di excel)
        $kodeKasLain = $row['id_account_kas_lain'] ?? null;
        $idAccKasLain = null;
        if ($kodeKasLain) {
            $coaLain = MasterCoa::where('kode_akuntansi', $kodeKasLain)->first();
            $idAccKasLain = $coaLain ? $coaLain->id : null;
        }

        $idCustomerAddress = null;
        $kodeCust = $row['kode_customer'] ?? null;
        if ($kodeCust && !in_array(strtoupper($kodeCust), ['', 'NULL', '-'])) {
            $cust = customerAddress::where('kode_customer', $kodeCust)->first();
            $idCustomerAddress = $cust ? $cust->id : null;
        }

        $tanggalTransaksi = $row['tanggal_transaksi'] ?? null;
        if ($tanggalTransaksi) {
            if (is_numeric($tanggalTransaksi)) {
                $tanggalTransaksi = Date::excelToDateTimeObject($tanggalTransaksi)->format('Y-m-d');
            } else {
                try {
                    $tanggalTransaksi = Carbon::parse($tanggalTransaksi)->format('Y-m-d');
                } catch (\Exception $e) {
                    $tanggalTransaksi = null;
                }
            }
        }

        $kode = $row['kode'] ?? null;
        if (in_array(strtoupper((string)$kode), ['', 'NULL', '-'])) {
            $kode = null;
        }

        $mesin = $row['mesin'] ?? null;
        if (in_array(strtoupper((string)$mesin), ['', 'NULL', '-'])) {
            $mesin = null;
        }

        $status = $row['status'];
        if ($status === null || $status === '' || strtoupper($status) === 'NULL') {
            $status = 1;
        }

        return TransKas::create(

            [
                'no_bukti'   => $row['no_bukti'],
                'keterangan' => $row['keterangan'] ?? null,
                'nominal'    => $row['nominal'] ?? 0,
                'id_karyawan'         => $idKaryawan,
                'id_account_kas'      => $idAccKas,
                'id_account_kas_lain' => $idAccKasLain,
                'id_customer_address' => $idCustomerAddress,
                'transaksi'           => $row['transaksi'],
                'gudang'              => $row['gudang'] ?? '-',
                'periode'             => $row['periode'] ?? 0,
                'nominal'             => $row['nominal'] ?? 0,
                'tanggal_transaksi'    => $tanggalTransaksi,
                'mesin'               => $mesin,
                'kode'                => $kode,
                'status'              => $status,
            ]
        );
    }
}
