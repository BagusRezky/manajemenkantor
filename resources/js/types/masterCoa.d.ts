import { Karyawan } from './karyawan';
import { MasterCoaClass } from './master-coa-class';

export interface MasterCoa {
    id: string;
    id_karyawan: string;
    id_master_coa_class: string;
    periode: number;
    gudang: string;
    kode_akuntansi: string;
    nama_akun: string;
    saldo_debit: number;
    saldo_kredit: number;
    nominal_default: number;
    keterangan?: string;
    status: number;
    karyawan?: Karyawan;
    master_coa_class?: MasterCoaClass;
}
