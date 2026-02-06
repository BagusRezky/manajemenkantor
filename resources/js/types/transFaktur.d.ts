import { Karyawan } from './karyawan';
import { PurchaseOrder } from './purchaseOrder';


export interface TransFakturDetail {
    id?: number;
    id_trans_faktur?: number;
    master_item: string;
    qty: number;
    harga_per_qty: number;
    unit: string | null;
    subtotal: number;
    ppn_persen: number;
    ppn_nilai: number;
    total_item: number;
    keterangan: string | null;
}

export interface TransFaktur {
    id: number;
    id_purchase_order: number | null;
    no_po_asal: string | null;
    no_faktur: string;
    no_invoice: string | null;
    tanggal_transaksi: string | null;
    periode: number | null;
    gudang: string | null;
    kode_customer: string | null;
    npwp: string | null;
    alamat: string | null;
    keterangan: string | null;
    id_karyawan: number | null;
    total_dpp: number;
    total_ppn: number;
    grand_total: number;
    purchase_order?: PurchaseOrder;
    karyawan?: Karyawan;
    details?: TransFakturDetail[];
    created_at?: string;
}
