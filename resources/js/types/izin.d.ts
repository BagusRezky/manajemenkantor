import { Karyawan } from './karyawan';

export type Izin = {
    id: string;
    id_karyawan: string;
    karyawan?: Karyawan;
    tanggal_izin: string;
    jenis_izin: string;
    jam_awal_izin: string;
    jam_selesai_izin: string;
    keterangan?: string;
};
