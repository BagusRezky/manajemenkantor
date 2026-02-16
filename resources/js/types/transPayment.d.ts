import { Karyawan } from './karyawan';
import { MasterCoa } from './masterCoa';
import { MetodeBayar } from './metodeBayar';
import { PoBilling } from './poBilling';

export interface TransPaymentDetail {
    id?: number;
    id_trans_payment?: number;
    id_metode_bayar:  string ;
    id_account_debit:  string ;
    id_account_kredit:  string ;
    tanggal_pembayaran: string ;
    curs: string ;
    bank: string ;
    an_rekening: string ;
    no_rekening: string ;
    nominal: number;
    keterangan: string;
    metode_bayar?: MetodeBayar;
    account_debit?: MasterCoa;
    account_kredit?: MasterCoa;
}

export interface TransPayment {
    id: number;
    id_po_billing: number | string;
    id_karyawan: number | string | null;
    no_pembayaran: string;
    tanggal_header: string | null;
    gudang: string;
    periode: string;
    po_billing?: PoBilling;
    karyawan?: Karyawan;
    details?: TransPaymentDetail[];
    created_at?: string;
}
