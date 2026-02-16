import { Karyawan } from './karyawan';
import { PurchaseOrder } from './purchaseOrder';

export interface PoBillingDetail {
    id?: number;
    id_po_billing?: number;
    id_penerimaan_barang_item: number | null;
    master_item: string;
    qty: number;
    harga_per_qty: number;
    discount: number;
    unit: string | null;
    // 3 legacy columns
    total?: number | null;
    ppn?: number | null;
    total_semua?: number | null;
}

export interface PoBilling {
    id: number;
    id_penerimaan_barang: number | null;
    id_karyawan: number | null;
    id_purchase_order: number | null;
    no_bukti_tagihan: string;
    no_po_asal?: string | null; 
    invoice_vendor: string | null;
    gudang: string;
    periode: number;
    tanggal_transaksi: string | null;
    jatuh_tempo: string | null;
    ongkir: number;
    total_nilai_barang: number | null;
    ppn: number | null;
    dp: number | null;
    total_akhir: number | null;
    keterangan: string | null;

    details?: PoBillingDetail[];
    karyawan?: Karyawan;
    purchase_order?: PurchaseOrder;
    created_at?: string;
}
