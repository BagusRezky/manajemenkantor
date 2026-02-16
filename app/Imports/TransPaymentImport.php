<?php

namespace App\Imports;

use App\Models\TransPayment;
use App\Models\PoBilling;
use App\Models\Karyawan;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use Maatwebsite\Excel\Concerns\ToModel;

class TransPaymentImport implements ToModel, WithHeadingRow
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {

        // 1. Cari ID Billing berdasarkan no_bukti_tagihan (di excel kolom id_po_billing)
        $noBilling = trim($row['id_po_billing'] ?? '');
        $billing = PoBilling::where('no_bukti_tagihan', $noBilling)->first();

        // Sesuai aturan: Jika billing tidak ditemukan, data tidak masuk (atau sesuaikan kebutuhan)
        if (!$billing) {
            return null;
        }

        // 2. Cari ID Karyawan berdasarkan nama
        $karyawanName = trim($row['id_karyawan'] ?? '');
        $karyawan = Karyawan::where('nama', 'like', '%' . $karyawanName . '%')->first();

        return TransPayment::updateOrCreate(
            ['no_pembayaran' => trim($row['no_pembayaran'])],
            [
                'id_po_billing'  => $billing->id,
                'id_karyawan'    => $karyawan ? $karyawan->id : null,
                'tanggal_header' => $this->transformDate($row['tanggal_header']),
                'gudang'         => $row['gudang'] ?? '-',
                'periode'        => $row['tahun'] ?? '-',
            ]
        );
    }

    private function transformDate($value)
    {
        if (empty($value) || strtoupper((string)$value) === 'NULL') return null;
        if (is_numeric($value)) return Date::excelToDateTimeObject($value)->format('Y-m-d');
        try {
            return Carbon::parse($value)->format('Y-m-d');
        } catch (\Exception $e) {
            return null;
        }
    }
}
