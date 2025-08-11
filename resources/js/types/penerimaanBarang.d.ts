import { PurchaseOrder } from './purchaseOrder';

export interface PenerimaanBarangItem {
    id: string;
    id_penerimaan_barang: string;
    id_purchase_order_item: string;
    qty_penerimaan: number;
    catatan_item: string | null;
    tgl_expired: string | null;
    no_delivery_order: string | null;
    created_at: string;
    updated_at: string;
    purchase_order_item?: {
        id: string;
        id_purchase_order: string;
        id_master_item: string;
        id_satuan_po: string;
        qty_po: number;
        master_item?: {
            id: string;
            kode_master_item: string;
            nama_master_item: string;
        };
        master_konversi?: {
            id: string;
            nama_satuan: string;
        };
    };
}

export interface PenerimaanBarang {
    id: string;
    id_purchase_order: string;
    no_laporan_barang: string;
    no_surat_jalan: string;
    tgl_terima_barang: string;
    nopol_kendaraan: string;
    nama_pengirim: string;
    catatan_pengirim: string | null;
    created_at: string;
    updated_at: string;
    purchase_order?: PurchaseOrder;
    items?: PenerimaanBarangItem[];
}
