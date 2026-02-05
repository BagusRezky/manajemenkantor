<?php

namespace App\Imports;

use App\Models\PoBilling;
use App\Models\PurchaseOrder;
use App\Models\Karyawan;
use App\Models\PenerimaanBarang;
use Carbon\Carbon;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\ToModel;

class PoBillingImport implements ToModel, WithHeadingRow
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {

        // dd($row);

        $noPoLama = $row['id_purchase_order'] ?? null;

        
        $po = null;
        if ($noPoLama && !in_array(strtoupper((string)$noPoLama), ['', 'NULL', '-'])) {
            $po = PurchaseOrder::where('old_po_number', trim($noPoLama))->first();
        }

        // 3. Cari ID Karyawan
        $karyawanName = $row['id_username'] ?? null;
        $idKaryawan = null;
        if ($karyawanName && !in_array(strtoupper((string)$karyawanName), ['', 'NULL', '-'])) {
            $karyawan = Karyawan::where('nama', 'like', '%' . trim($karyawanName) . '%')->first();
            $idKaryawan = $karyawan ? $karyawan->id : null;
        }

        $tglTrans = $this->transformDate($row['tanggal_transaksi']);


        $idPenerimaan = null;
        if ($po) {
            $lpb = PenerimaanBarang::updateOrCreate(
                ['no_laporan_barang' => 'LPB-MIG-' . trim($row['no_bukti_tagihan'])],
                [
                    'id_purchase_order' => $po->id,
                    'no_surat_jalan'    => $row['invoice_vendor'] ?? '-',
                    'tgl_terima_barang' => $tglTrans,
                ]
            );
            $idPenerimaan = $lpb->id;
        }


        return PoBilling::updateOrCreate(
            ['no_bukti_tagihan' => trim($row['no_bukti_tagihan'])],
            [
                'id_penerimaan_barang' => $idPenerimaan,
                'id_karyawan'          => $idKaryawan,
                'id_purchase_order'    => $po ? $po->id : null,
                'no_po_asal'           => $noPoLama,
                'invoice_vendor'       => $row['invoice_vendor'] ?? null,
                'gudang'               => $row['gudang'] ?? '-',
                'periode'              => $row['periode'] ?? date('Y'),
                'tanggal_transaksi'    => $tglTrans,
                'jatuh_tempo'          => $this->transformDate($row['jatuh_tempo']),
                'ongkir'               => (float) ($row['ongkir'] ?? 0),
                'keterangan'           => $row['keterangan'] ?? null,
                'status'               => 1,
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
