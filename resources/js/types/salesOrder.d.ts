import { CustomerAddress } from "./customerAddress";
import { FinishGoodItem } from "./finishGoodItem";

export interface SalesOrder {
    id: string;
    id_cusomer_address: string;
    id_finish_good_item: string;
    no_bon_pesanan: string;
    no_po_customer: string;
    jumlah_pesanan: string;
    harga_pcs_bp: string;
    harga_pcs_kirim: string;
    mata_uang: string;
    syarat_pembayaran: string;
    eta_marketing: string;
    klaim_kertas: string;
    dipesan_via: string;
    tipe_pesanan: string;
    toleransi_pengiriman: string;
    catatan_colour_range: string;
    catatan: string;
    customer_address?: CustomerAddress;
    finish_good_item?: FinishGoodItem;
    kartu_instruksi_kerja?: KartuInstruksiKerja;
}
