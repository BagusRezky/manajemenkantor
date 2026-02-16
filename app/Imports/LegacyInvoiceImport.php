<?php

namespace App\Imports;

use App\Models\Invoice;
use App\Models\MetodeBayar;
use Carbon\Carbon;
use Illuminate\Support\Facades\Date;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\ToModel;

class LegacyInvoiceImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        // Cari ID metode bayar berdasarkan kode (MB0004, dll)
        $kodeMetode = trim($row['id_kode_bayar'] ?? '');
        $metode = MetodeBayar::where('kode_bayar', $kodeMetode)->first();

        $tempoValue = $row['tempo'];
        if ($tempoValue === '#N/A' || !is_numeric($tempoValue)) {
            $tempoValue = 0;
        }

        // Kita gunakan updateOrCreate agar jika file diupload ulang tidak duplikat
        return Invoice::updateOrCreate(
            ['no_invoice' => trim($row['no_invoice'])],
            [
                'kode'                => $row['kode'] ?? null,
                'no_invoice_lama'     => trim($row['no_invoice']),
                'no_surat_jalan_lama' => $row['surat_jalan'] ?? null,
                'no_spk_lama'         => $row['spk'] ?? null,
                'no_so_lama'          => $row['sales_order'] ?? null,
                'tgl_invoice'         => $this->transformDate($row['awal_tempo']),
                'tgl_jatuh_tempo'     => $this->transformDate($row['akhir_tempo']),
                'tempo'               => (int) $tempoValue,
                'total_sub'           => $row['total_sub'] ?? 0,
                'ppn_nominal'         => $row['ppn_nominal'] ?? 0,
                'total'               => $row['total'] ?? 0,
                'bayar'               => $row['bayar'] ?? 0,
                'kembali'             => $row['kembali'] ?? 0,
                'ppn'                 => $row['ppn'] ?? 0,
                'ongkos_kirim'        => $row['ongkir'] ?? 0,
                'discount'            => $row['diskon'] ?? 0,
                'id_metode_bayar'     => $metode ? $metode->id : null,
                'is_legacy'           => true,
                'keterangan'          => $row['keterangan'] ?? null,

            ]
        );
    }

    private function transformDate($value)
    {
        // Cek apakah value kosong, null, atau berisi string #N/A
        if (empty($value) || $value === '#N/A' || strtoupper((string)$value) === 'NULL') {
            return null;
        }

        if (is_numeric($value)) {
            return Date::excelToDateTimeObject($value)->format('Y-m-d');
        }

        try {
            return Carbon::parse($value)->format('Y-m-d');
        } catch (\Exception $e) {
            return null;
        }
    }
}
