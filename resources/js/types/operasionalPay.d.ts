import { Karyawan } from './karyawan';
import { MasterCoa } from './masterCoa';

export interface OperasionalPay {
    id: number;
    id_karyawan: number | null;
    id_account_kas: number | null;
    id_account_beban: number | null;
    no_bukti: string;
    gudang: string;
    periode: number;
    tanggal_transaksi: string | null;
    nominal: number;
    keterangan: string | null;
    mesin: string | null;
    kode: number | null;
    nopol: string | null;
    odometer: string | null;
    jenis: string | null;
    status: number;
    karyawan?: Karyawan;
    account_kas?: MasterCoa;
    account_beban?: MasterCoa;
    created_at?: string;
}
