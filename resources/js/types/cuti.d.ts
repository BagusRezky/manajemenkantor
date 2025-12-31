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


export type CutiTahunan = {
  id_karyawan: number
  nama_karyawan: string
  total_cuti_tahunan: number
  cuti_digunakan: number
  sisa_cuti_tahunan: number
}
