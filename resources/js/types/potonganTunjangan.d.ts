// types/potonganTunjangan.d.ts

import { Karyawan } from './karyawan';

export type PotonganTunjangan = {
    id: string;
    id_karyawan: string;
    karyawan?: Karyawan;
    periode_payroll: string;
    potongan_tunjangan_jabatan: number;
    potongan_tunjangan_kompetensi: number;
    potongan_intensif: number;
    keterangan: string;
};
