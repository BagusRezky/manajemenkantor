<?php

namespace App\Imports;

use App\Models\PoBillingDetail;
use App\Models\PoBilling;
use App\Models\PenerimaanBarangItem;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToModel;

class PoBillingDetailImport implements ToModel, WithHeadingRow
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        $noBukti = trim($row['no_bukti_tagihan'] ?? '');

        // 1. Cari Header
        $header = PoBilling::where('no_bukti_tagihan', $noBukti)->first();

        if (!$header) {
            [
                'no_bukti_tagihan' => $noBukti,
                'row' => $row
            ];
            return null;
        }


        $idLpbItem = null;

        if ($header->id_penerimaan_barang) {
            $lpbItem = PenerimaanBarangItem::create([
                'id_penerimaan_barang'   => $header->id_penerimaan_barang,
                'catatan_item'           => 'MIGRASI-' . ($row['master_item'] ?? '-'),
                'qty_penerimaan'         => $row['qty'] ?? 0,
                'id_purchase_order_item' => null,
            ]);

            $idLpbItem = $lpbItem->id;
        }

        
        return PoBillingDetail::create([
            'id_po_billing'                => $header->id,
            'master_item'                  => $row['master_item'] ?? '-',
            'qty'                          => $row['qty'] ?? 0,
            'id_penerimaan_barang_item'    => $idLpbItem,
            'harga_per_qty'                => $row['harga_per_qty'] ?? 0,
            'discount'                     => $row['discount'] ?? 0,
            'total'                        => $row['total'] ?? 0,
            'ppn'                          => $row['ppn'] ?? 0,
            'total_semua'                  => $row['total_semua'] ?? 0,
            'unit'                         => $row['unit'] ?? '-',
        ]);
    }
}
