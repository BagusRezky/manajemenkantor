import { Karyawan } from './karyawan';

// Untuk data form
export type Lembur = {
    id: string;
    kode_gudang: string;
    id_karyawan: string;
    karyawan?: Karyawan;
    tanggal_lembur: string;
    jam_awal_lembur: string;
    jam_selesai_lembur: string;
    keterangan: string;
};
