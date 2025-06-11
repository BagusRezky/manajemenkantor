/* eslint-disable @typescript-eslint/no-explicit-any */
import { PenerimaanBarang, PenerimaanBarangItem } from './penerimaanBarang';

export interface ReturEksternal {
    id: string;
    id_penerimaan_barang: string;
    no_retur: string;
    tgl_retur_barang: string;
    nama_retur: string;
    catatan_retur?: string;
    created_at: string;
    updated_at: string;
    penerimaan_barang?: PenerimaanBarang;
    items?: ReturEksternalItem[];
    // Computed property dari accessor
    no_laporan_barang?: string;
}

export interface ReturEksternalItem {
    id: string;
    id_retur_eksternal: string;
    id_penerimaan_barang_item: string;
    qty_retur: number;
    catatan_retur_item?: string;
    created_at: string;
    updated_at: string;
    penerimaan_barang_item?: PenerimaanBarangItem;
}

// ✅ PERBAIKAN: Type untuk form dengan index signature
export interface ReturEksternalFormData {
    id_penerimaan_barang: string;
    tgl_retur_barang: string;
    nama_retur: string;
    catatan_retur?: string;
    items: ReturEksternalItemFormData[];
    [key: string]: any; // ✅ Index signature untuk kompatibilitas Inertia
}

export interface ReturEksternalItemFormData {
    id_penerimaan_barang_item: string;
    qty_retur: number;
    catatan_retur_item?: string;
}
