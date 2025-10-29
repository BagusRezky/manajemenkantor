import { PengajuanPinjaman } from "./pengajuanPinjaman";

export type PembayaranPinjaman = {
    id: string;
    id_pengajuan_pinjaman: string;
    no_bukti_pembayaran: string;
    tanggal_pembayaran: string;
    nominal_pembayaran: number;
    keterangan: string;
    created_at?: string;
    updated_at?: string;
    pengajuan_pinjaman?: PengajuanPinjaman;
};
