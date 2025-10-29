import { Karyawan } from "./karyawan";

export type Cuti = {
    id: string;
    id_karyawan: string;
    tanggal_cuti: string;
    jenis_cuti: string;
    lampiran: string | null;
    keterangan: string | null;
    created_at?: string;
    updated_at?: string;
    karyawan?: Karyawan; // Berdasarkan 'with' di controller
};
