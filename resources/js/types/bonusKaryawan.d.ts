
import { Karyawan } from './karyawan';

export type BonusKaryawan = {
    id: string;
    kode_gudang: string;
    id_karyawan: string;
    karyawan?: Karyawan;
    tanggal_bonus: string;
    nilai_bonus: number;
    keterangan: string;
};
