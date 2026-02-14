<?php

namespace App\Exports;

use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class MutationReportExport implements FromView, ShouldAutoSize
{
    protected $startDate, $endDate, $idAccount;

    public function __construct($startDate, $endDate, $idAccount)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->idAccount = $idAccount;
    }

    public function view(): View
    {
        // Ambil info akun yang sedang ditarik laporannya
        $acc = DB::table('master_coas')->where('id', $this->idAccount)->first();

        // 1. Hitung Saldo Awal (Akumulasi semua sebelum startDate)
        $saldoAwal = $this->calculateSaldoBefore($this->idAccount, $this->startDate);

        // 2. Ambil Mutasi dalam periode yang dipilih
        $mutations = $this->getMutationData($this->idAccount, $this->startDate, $this->endDate);

        $reportData = [
            [
                'account_kode' => $acc->kode_akuntansi,
                'account_nama' => $acc->nama_akun,
                'saldo_awal'   => $saldoAwal,
                'mutations'    => $mutations
            ]
        ];

        return view('exports.mutation_report', [
            'data'      => $reportData,
            'startDate' => $this->startDate,
            'endDate'   => $this->endDate
        ]);
    }

    private function calculateSaldoBefore($accountId, $date)
    {
        // Ambil data dari awal sistem sampai H-1 tanggal filter
        $data = $this->getMutationData($accountId, '2000-01-01', date('Y-m-d', strtotime($date . ' -1 day')));

        $debet = $data->where('tipe', 'D')->sum('nominal');
        $kredit = $data->where('tipe', 'K')->sum('nominal');

        return $debet - $kredit;
    }

    private function getMutationData($accountId, $start, $end)
    {
        // 1. Trans Kas (1=Masuk, 2=Keluar)
        $q1 = DB::table('trans_kas as t')
            ->leftJoin('master_coas as c_utama', 't.id_account_kas', '=', 'c_utama.id')
            ->leftJoin('master_coas as c_lain', 't.id_account_kas_lain', '=', 'c_lain.id')
            ->select(
                't.tanggal_transaksi as tgl',
                't.no_bukti',
                't.keterangan',
                't.nominal',
                DB::raw("CASE
                    -- Jika Transaksi MASUK (BKM)
                    WHEN t.transaksi = 1 THEN
                        CASE
                            WHEN LEFT(c_utama.kode_akuntansi, 1) = '1' AND t.id_account_kas = $accountId THEN 'D'
                            WHEN LEFT(c_utama.kode_akuntansi, 1) != '1' AND t.id_account_kas = $accountId THEN 'K'
                            WHEN t.id_account_kas_lain = $accountId THEN 'K'
                            ELSE 'D' END
                    -- Jika Transaksi KELUAR (BKK)
                    WHEN t.transaksi = 2 THEN
                        CASE
                            WHEN LEFT(c_utama.kode_akuntansi, 1) = '1' AND t.id_account_kas = $accountId THEN 'K'
                            WHEN LEFT(c_utama.kode_akuntansi, 1) != '1' AND t.id_account_kas = $accountId THEN 'D'
                            WHEN t.id_account_kas_lain = $accountId THEN 'D'
                            ELSE 'K' END
                    ELSE 'D' END as tipe"),
                DB::raw("CASE WHEN t.id_account_kas = $accountId THEN c_lain.kode_akuntansi ELSE c_utama.kode_akuntansi END as lawan_akun")
            )
            ->where(function ($q) use ($accountId) {
                $q->where('t.id_account_kas', $accountId)->orWhere('t.id_account_kas_lain', $accountId);
            })
            ->whereBetween('t.tanggal_transaksi', [$start, $end]);

        // 2. Trans Kas Bank (21=Masuk, 22=Keluar)
        $q2 = DB::table('trans_kas_banks as t')
            ->leftJoin('master_coas as c_utama', 't.id_account_bank', '=', 'c_utama.id')
            ->leftJoin('master_coas as c_lain', 't.id_account_bank_lain', '=', 'c_lain.id')
            ->select(
                't.tanggal_transaksi as tgl',
                't.no_bukti',
                't.keterangan',
                't.nominal',
                DB::raw("CASE
                    -- Jika Transaksi MASUK (BBM)
                    WHEN t.transaksi = 21 THEN
                        CASE
                            WHEN LEFT(c_utama.kode_akuntansi, 1) = '1' AND t.id_account_bank = $accountId THEN 'D'
                            WHEN LEFT(c_utama.kode_akuntansi, 1) != '1' AND t.id_account_bank = $accountId THEN 'K'
                            WHEN t.id_account_bank_lain = $accountId THEN 'K'
                            ELSE 'D' END
                    -- Jika Transaksi KELUAR (BBK)
                    WHEN t.transaksi = 22 THEN
                        CASE
                            WHEN LEFT(c_utama.kode_akuntansi, 1) = '1' AND t.id_account_bank = $accountId THEN 'K'
                            WHEN LEFT(c_utama.kode_akuntansi, 1) != '1' AND t.id_account_bank = $accountId THEN 'D'
                            WHEN t.id_account_bank_lain = $accountId THEN 'D'
                            ELSE 'K' END
                    ELSE 'D' END as tipe"),
                DB::raw("CASE WHEN t.id_account_bank = $accountId THEN c_lain.kode_akuntansi ELSE c_utama.kode_akuntansi END as lawan_akun")
            )
            ->where(function ($q) use ($accountId) {
                $q->where('t.id_account_bank', $accountId)->orWhere('t.id_account_bank_lain', $accountId);
            })
            ->whereBetween('t.tanggal_transaksi', [$start, $end]);

        // 3. Operasional Pay (Uang Keluar Kas = Kredit)
        $q3 = DB::table('operasional_pays as t')
            ->leftJoin('master_coas as c', 't.id_account_beban', '=', 'c.id')
            ->select(
                't.tanggal_transaksi as tgl',
                't.no_bukti',
                't.keterangan',
                't.nominal',
                DB::raw("'K' as tipe"),
                'c.kode_akuntansi as lawan_akun'
            )
            ->where('t.id_account_kas', $accountId)
            ->whereBetween('t.tanggal_transaksi', [$start, $end]);

        // 4. Trans Payment (Uang Keluar Bayar Supplier)
        $q4 = DB::table('trans_payment_details as d')
            ->join('trans_payments as h', 'd.id_trans_payment', '=', 'h.id')
            ->leftJoin('master_coas as c_deb', 'd.id_account_debit', '=', 'c_deb.id')
            ->leftJoin('master_coas as c_kre', 'd.id_account_kredit', '=', 'c_kre.id')
            ->select(
                'd.tanggal_pembayaran as tgl',
                'h.no_pembayaran as no_bukti',
                'd.keterangan',
                'd.nominal',
                DB::raw("CASE WHEN d.id_account_debit = $accountId THEN 'D' ELSE 'K' END as tipe"),
                DB::raw("CASE WHEN d.id_account_debit = $accountId THEN c_kre.kode_akuntansi ELSE c_deb.kode_akuntansi END as lawan_akun")
            )
            ->where(function ($q) use ($accountId) {
                $q->where('d.id_account_debit', $accountId)->orWhere('d.id_account_kredit', $accountId);
            })
            ->whereBetween('d.tanggal_pembayaran', [$start, $end]);

        // 5. Bon Pay (Uang Masuk dari Customer = Debet)
        $q5 = DB::table('bon_pays as t')
            ->select(
                't.tanggal_pembayaran as tgl',
                't.nomor_pembayaran as no_bukti',
                't.keterangan',
                't.nominal_pembayaran as nominal',
                DB::raw("'D' as tipe"),
                DB::raw("NULL as lawan_akun")
            )
            ->where('t.id_account', $accountId)
            ->whereBetween('t.tanggal_pembayaran', [$start, $end]);

        return $q1->unionAll($q2)->unionAll($q3)->unionAll($q4)->unionAll($q5)
            ->orderBy('tgl', 'asc')
            ->get();
    }
}
