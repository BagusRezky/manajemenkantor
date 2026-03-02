<?php

namespace App\Exports;

use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class MutationReportExport implements FromView
{
    protected $startDate, $endDate, $idAccounts;

    public function __construct($startDate, $endDate, $idAccounts)
    {
        $this->startDate  = $startDate;
        $this->endDate    = $endDate;
        $this->idAccounts = is_array($idAccounts) ? $idAccounts : [$idAccounts];
    }

    public function view(): View
    {
        $accounts = DB::table('master_coas')
            ->whereIn('id', $this->idAccounts)
            ->get()
            ->keyBy('id');

        // Mutasi periode
        $mutations = $this->getAllMutations(
            $this->startDate,
            $this->endDate
        )->groupBy('account_id');

        // Saldo awal (sebelum periode)
        $saldoAwalData = $this->getSaldoAwalAllAccounts();

        $reportData = [];

        foreach ($this->idAccounts as $accountId) {

            if (!isset($accounts[$accountId])) continue;

            $acc = $accounts[$accountId];

            $saldoAwal = $saldoAwalData[$accountId] ?? 0;

            // Normal balance rule
            $prefix = substr($acc->kode_akuntansi, 0, 1);
            if (in_array($prefix, ['2','3','4'])) {
                $saldoAwal = -$saldoAwal;
            }

            $reportData[] = [
                'account_kode' => $acc->kode_akuntansi,
                'account_nama' => $acc->nama_akun,
                'saldo_awal'   => $saldoAwal,
                'mutations'    => $mutations[$accountId] ?? collect()
            ];
        }

        return view('exports.mutation_report', [
            'data'      => $reportData,
            'startDate' => $this->startDate,
            'endDate'   => $this->endDate
        ]);
    }

    /* ===================================================== */
    /* ================= CORE UNION QUERY ================== */
    /* ===================================================== */

    private function getAllMutations($startDate, $endDate)
    {
        $ids = implode(',', $this->idAccounts);

        // TRANS KAS
        $q1 = DB::table('trans_kas as t')
            ->leftJoin('master_coas as c1', 't.id_account_kas', '=', 'c1.id')
            ->leftJoin('master_coas as c2', 't.id_account_kas_lain', '=', 'c2.id')
            ->selectRaw("
                t.tanggal_transaksi as tgl,
                t.no_bukti,
                t.keterangan,
                t.nominal,
                CASE
                    WHEN t.id_account_kas IN ($ids) THEN t.id_account_kas
                    ELSE t.id_account_kas_lain
                END as account_id,
                CASE
                    WHEN t.transaksi = 1 AND t.id_account_kas_lain IN ($ids) THEN 'D'
                    WHEN t.transaksi = 1 THEN 'K'
                    WHEN t.transaksi = 2 AND t.id_account_kas IN ($ids) THEN 'K'
                    ELSE 'D'
                END as tipe,
                CASE
                    WHEN t.id_account_kas IN ($ids) THEN c2.kode_akuntansi
                    ELSE c1.kode_akuntansi
                END as lawan_akun
            ")
            ->where(function ($q) {
                $q->whereIn('t.id_account_kas', $this->idAccounts)
                  ->orWhereIn('t.id_account_kas_lain', $this->idAccounts);
            })
            ->whereBetween('t.tanggal_transaksi', [$startDate, $endDate]);

        // TRANS KAS BANK
        $q2 = DB::table('trans_kas_banks as t')
            ->leftJoin('master_coas as c1', 't.id_account_bank', '=', 'c1.id')
            ->leftJoin('master_coas as c2', 't.id_account_bank_lain', '=', 'c2.id')
            ->selectRaw("
                t.tanggal_transaksi as tgl,
                t.no_bukti,
                t.keterangan,
                t.nominal,
                CASE
                    WHEN t.id_account_bank IN ($ids) THEN t.id_account_bank
                    ELSE t.id_account_bank_lain
                END as account_id,
                CASE
                    WHEN t.transaksi = 21 AND t.id_account_bank IN ($ids) THEN 'D'
                    WHEN t.transaksi = 22 AND t.id_account_bank IN ($ids) THEN 'K'
                    WHEN t.transaksi = 21 THEN 'K'
                    ELSE 'D'
                END as tipe,
                CASE
                    WHEN t.id_account_bank IN ($ids) THEN c2.kode_akuntansi
                    ELSE c1.kode_akuntansi
                END as lawan_akun
            ")
            ->where(function ($q) {
                $q->whereIn('t.id_account_bank', $this->idAccounts)
                  ->orWhereIn('t.id_account_bank_lain', $this->idAccounts);
            })
            ->whereBetween('t.tanggal_transaksi', [$startDate, $endDate]);

        // OPERASIONAL PAY
        $q3 = DB::table('operasional_pays as t')
            ->leftJoin('master_coas as c_kas', 't.id_account_kas', '=', 'c_kas.id')
            ->leftJoin('master_coas as c_beban', 't.id_account_beban', '=', 'c_beban.id')
            ->selectRaw("
                t.tanggal_transaksi as tgl,
                t.no_bukti,
                t.keterangan,
                t.nominal,
                CASE
                    WHEN t.id_account_kas IN ($ids) THEN t.id_account_kas
                    ELSE t.id_account_beban
                END as account_id,
                CASE
                    WHEN t.id_account_beban IN ($ids) THEN 'D'
                    ELSE 'K'
                END as tipe,
                CASE
                    WHEN t.id_account_kas IN ($ids) THEN c_beban.kode_akuntansi
                    ELSE c_kas.kode_akuntansi
                END as lawan_akun
            ")
            ->where(function ($q) {
                $q->whereIn('t.id_account_kas', $this->idAccounts)
                  ->orWhereIn('t.id_account_beban', $this->idAccounts);
            })
            ->whereBetween('t.tanggal_transaksi', [$startDate, $endDate]);

        // TRANS PAYMENT
        $q4 = DB::table('trans_payment_details as d')
            ->join('trans_payments as h', 'd.id_trans_payment', '=', 'h.id')
            ->leftJoin('master_coas as c_deb', 'd.id_account_debit', '=', 'c_deb.id')
            ->leftJoin('master_coas as c_kre', 'd.id_account_kredit', '=', 'c_kre.id')
            ->selectRaw("
                d.tanggal_pembayaran as tgl,
                h.no_pembayaran as no_bukti,
                d.keterangan,
                d.nominal,
                CASE
                    WHEN d.id_account_debit IN ($ids) THEN d.id_account_debit
                    ELSE d.id_account_kredit
                END as account_id,
                CASE
                    WHEN d.id_account_debit IN ($ids) THEN 'D'
                    ELSE 'K'
                END as tipe,
                CASE
                    WHEN d.id_account_debit IN ($ids) THEN c_kre.kode_akuntansi
                    ELSE c_deb.kode_akuntansi
                END as lawan_akun
            ")
            ->where(function ($q) {
                $q->whereIn('d.id_account_debit', $this->idAccounts)
                  ->orWhereIn('d.id_account_kredit', $this->idAccounts);
            })
            ->whereBetween('d.tanggal_pembayaran', [$startDate, $endDate]);

        // BON PAY
        $q5 = DB::table('bon_pays as t')
            ->selectRaw("
                t.tanggal_pembayaran as tgl,
                t.nomor_pembayaran as no_bukti,
                t.keterangan,
                t.nominal_pembayaran as nominal,
                t.id_account as account_id,
                'D' as tipe,
                NULL as lawan_akun
            ")
            ->whereIn('t.id_account', $this->idAccounts)
            ->whereBetween('t.tanggal_pembayaran', [$startDate, $endDate]);

        return $q1
            ->unionAll($q2)
            ->unionAll($q3)
            ->unionAll($q4)
            ->unionAll($q5)
            ->orderBy('tgl', 'asc')
            ->get();
    }

    /* ===================================================== */
    /* ================= SALDO AWAL ======================== */
    /* ===================================================== */

    private function getSaldoAwalAllAccounts()
    {
        $beforeDate = date('Y-m-d', strtotime($this->startDate . ' -1 day'));

        $allBefore = $this->getAllMutations('2000-01-01', $beforeDate);

        $grouped = $allBefore->groupBy('account_id');

        $result = [];

        foreach ($grouped as $accountId => $rows) {

            $debet  = $rows->where('tipe', 'D')->sum('nominal');
            $kredit = $rows->where('tipe', 'K')->sum('nominal');

            $result[$accountId] = $debet - $kredit;
        }

        return $result;
    }
}
