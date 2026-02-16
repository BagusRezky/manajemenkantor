<?php

namespace App\Imports;

use App\Models\TransPaymentDetail;
use App\Models\TransPayment;
use App\Models\MetodeBayar;
use App\Models\MasterCoa;
use Carbon\Carbon;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class TransPaymentDetailImport implements ToModel, WithHeadingRow
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        // 1. Cari Header berdasarkan no_pembayaran (di excel kolom id_trans_payment)
        $noPembayaran = trim($row['id_trans_payment'] ?? '');
        $payment = TransPayment::where('no_pembayaran', $noPembayaran)->first();

        // VALIDASI: Jika tidak ada pembayaran induk, JANGAN dimasukkan
        if (!$payment) {
            return null;
        }

        // 2. Cari ID Metode Bayar berdasarkan nama
        $metodeName = trim($row['id_metode_bayar'] ?? '');
        $metode = MetodeBayar::where(
            'metode_bayar',
            'like',
            '%' . $metodeName . '%'
        )->first();

        // 3. Cari ID COA (Debit & Kredit) berdasarkan Kode Akun
        $coaDebitCode = trim($row['id_account_debit'] ?? '');
        $coaKreditCode = trim($row['id_account_kredit'] ?? '');

        $coaDebit = MasterCoa::where('kode_akuntansi', $coaDebitCode)->first();
        $coaKredit = MasterCoa::where('kode_akuntansi', $coaKreditCode)->first();

        // 4. Bersihkan nominal (Menghapus koma jika ada, misal "18,000,000" -> 18000000)
        $nominal = $row['nominal'] ?? 0;
        if (is_string($nominal)) {
            $nominal = str_replace(',', '', $nominal);
        }

        return new TransPaymentDetail([
            'id_trans_payment'   => $payment->id,
            'id_metode_bayar'    => $metode ? $metode->id : null,
            'id_account_debit'   => $coaDebit ? $coaDebit->id : null,
            'id_account_kredit'  => $coaKredit ? $coaKredit->id : null,
            'tanggal_pembayaran' => $this->transformDate($row['tanggal_pembayaran']),
            'curs'               => $row['curs'] ?? 'RP',
            'bank'               => $row['bank'] ?? null,
            'an_rekening'        => $row['an_rekening'] ?? null,
            'nominal'            => (float) $nominal,
            'keterangan'         => $row['keterangan'] ?? null,
        ]);
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
