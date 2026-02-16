import { BonPay } from './bonPay';
import { SuratJalan } from './suratJalan';

export interface InvoiceDetail {
    id: number;
    id_invoice: number;
    id_account?: number;
    kode_group?: string;
    kode_produk?: string;
    nama_produk?: string;
    jumlah: number;
    harga: number;
    diskon_barang: number;
    diskon_member: number;
    bayar: number;
    kembali: number;
    total: number;
    unit?: string;
    marketing?: string;
    qty_small: number;
}

export interface Invoice {
    id: string;
    id_surat_jalan?: string;
    no_invoice: string;
    tgl_invoice: string;
    tgl_jatuh_tempo: string;
    kode:number;

    // Kolom Legacy
    no_surat_jalan_lama?: string;
    no_invoice_lama?: string;
    no_spk_lama?: string;
    no_so_lama?: string;
    total_sub: number;
    ppn_nominal: number;
    total: number;
    bayar: number;
    kembali: number;
    is_legacy: boolean;
    keterangan?: string;

    discount: number;
    ppn: number;
    ongkos_kirim: number;
    uang_muka: number;

    // Relasi
    surat_jalan?: SuratJalan;
    details?: InvoiceDetail[];
    bon_pays?: BonPay;
}
