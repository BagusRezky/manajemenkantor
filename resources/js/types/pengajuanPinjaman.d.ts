// types/pengajuanPinjaman.d.ts

import { Karyawan } from './karyawan';

export type PengajuanPinjaman = {
    id: string;
    id_karyawan: string;
    karyawan?: Karyawan;
    kode_gudang: string;
    nomor_bukti_pengajuan: string;
    tanggal_pengajuan: string;
    nilai_pinjaman: number;
    jangka_waktu_pinjaman: number; // dalam bulan
    cicilan_per_bulan: number;
    keperluan_pinjaman: string;
};
