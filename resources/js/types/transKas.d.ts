import { CustomerAddress } from './customerAddress';
import { Karyawan } from './karyawan';
import { MasterCoa } from './master-coa';

export interface TransKas {
    id: number;
    id_karyawan: number | null;
    id_account_kas: number | null;
    id_account_kas_lain: number | null;
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
    status: number;
    karyawan?: Karyawan;
    account_kas?: MasterCoa;
    account_kas_lain?: MasterCoa;
    customer_address?: CustomerAddress;
    created_at?: string;
}
