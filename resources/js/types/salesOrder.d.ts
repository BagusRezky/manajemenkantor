import { CustomerAddress } from './customerAddress';
import { FinishGoodItem } from './finishGoodItem';
import { KartuInstruksiKerja } from './kartuInstruksiKerja';
import { MasterItem } from './masterItem';

export interface SalesOrder {
    id: string;
    id_customer_address: string;
    id_finish_good_item: string;
    id_master_item: string; // New field for Master Item
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
    kartu_instruksi_kerja?: KartuInstruksiKerja[];
    master_item?: MasterItem; // New relation for Master Item
}

interface CombinedItem {
    id: string;
    original_id: string;
    label: string;
    type: 'finish_good' | 'master_item';
}
