import { Invoice } from './invoice';
import { Karyawan } from './karyawan'; 
import { MasterCoa } from './masterCoa'; 
import { MetodeBayar } from './metodeBayar'; 

export interface BonPay {
    id: number;
    id_invoice: number;
    id_metode_bayar: number;
    id_account?: number;
    id_karyawan?: number;
    nomor_pembayaran: string;
    nominal_pembayaran: number;
    gudang?: string;
    keterangan?: string;
    tanggal_pembayaran: string;
    created_at: string;
    updated_at: string;

    // Relasi
    invoice?: Invoice;
    metode_bayar?: MetodeBayar;
    karyawan?: Karyawan;
    account?: MasterCoa;
}
