import { CustomerAddress } from './customerAddress';
import { Karyawan } from './karyawan';
import { MasterCoa } from './masterCoa';

export interface TransKasBank {
    id: number;
    id_karyawan: number | null;
    id_account_bank: number | null;
    id_account_bank_lain: number | null;
    id_customer_address: number | null;
    transaksi: number;
    no_bukti: string;
    gudang: string;
    periode: number;
    tanggal_transaksi: string | null;
    nominal: number;
    keterangan: string | null;
    mesin: string | null;
    kode: number | null;
    bank: string | null;
    bank_an: string | null;
    no_rekening: string | null;
    status: number;
    karyawan?: Karyawan;
    account_bank?: MasterCoa;
    account_bank_lain?: MasterCoa;
    customer_address?: CustomerAddress;
    created_at?: string;
}
