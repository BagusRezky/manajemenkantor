<?php

namespace App\Imports;

use App\Models\TransKasBank;
use App\Models\Karyawan;
use App\Models\MasterCoa;
use App\Models\customerAddress;
use Carbon\Carbon;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\ToModel;

class TransKasBankImport implements ToModel, WithHeadingRow
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
        if (in_array(strtoupper((string)$kode), ['', 'NULL', '-'])) {
            $kode = null;
        }

        $mesin = $row['mesin'] ?? null;
        if (in_array(strtoupper((string)$mesin), ['', 'NULL', '-'])) {
            $mesin = null;
        }

        // 3. Handling Tanggal Transaksi
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

        // 4. Cari ID Karyawan (Berdasarkan Nama)
        $idKaryawan = null;
        $karyawanName = $row['id_karyawan'] ?? null;
        if ($karyawanName && !in_array(strtoupper((string)$karyawanName), ['', 'NULL', '-'])) {
            $karyawan = Karyawan::where('nama', 'like', '%' . $karyawanName . '%')->first();
            $idKaryawan = $karyawan ? $karyawan->id : null;
        }

        // 5. Cari ID Account Bank & Bank Lain (Berdasarkan Kode Akuntansi)
        $idAccBank = null;
        if (!empty($row['id_account_bank']) && strtoupper((string)$row['id_account_bank']) !== 'NULL') {
            $coa = MasterCoa::where('kode_akuntansi', $row['id_account_bank'])->first();
            $idAccBank = $coa ? $coa->id : null;
        }

        $idAccBankLain = null;
        if (!empty($row['id_account_bank_lain']) && strtoupper((string)$row['id_account_bank_lain']) !== 'NULL') {
            $coaLain = MasterCoa::where('kode_akuntansi', $row['id_account_bank_lain'])->first();
            $idAccBankLain = $coaLain ? $coaLain->id : null;
        }

        // 6. Cari ID Customer Address
        $idCustomerAddress = null;
        $kodeCust = $row['kode_customer'] ?? null;
        if ($kodeCust && !in_array(strtoupper((string)$kodeCust), ['', 'NULL', '-'])) {
            $cust = customerAddress::where('kode_customer', $kodeCust)->first();
            $idCustomerAddress = $cust ? $cust->id : null;
        }


        return TransKasBank::create([
            'no_bukti'             => $row['no_bukti'],
            'nominal'              => $row['nominal'] ?? 0,
            'keterangan'           => $row['keterangan'] ?? null,
            'id_karyawan'          => $idKaryawan,
            'id_account_bank'      => $idAccBank,
            'id_account_bank_lain' => $idAccBankLain,
            'id_customer_address'  => $idCustomerAddress,
            'transaksi'            => $row['transaksi'],
            'gudang'               => $row['gudang'] ?? '-',
            'periode'              => $row['periode'] ?? 0,
            'tanggal_transaksi'    => $tanggalTransaksi,
            'mesin'                => $mesin,
            'kode'                 => $kode,
            'bank'                 => $row['bank'] ?? null,
            'bank_an'              => $row['bank_an'] ?? null,
            'no_rekening'          => $row['no_rekening'] ?? null,
            'status'               => $status,
        ]);
    }
}
