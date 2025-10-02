import { User } from '@/types/index';

export interface Karyawan {
    id: number;
    user_id: number | null;

    pin: string | null;
    nip: string | null;
    nama: string | null;
    jadwal_kerja: string | null;
    tgl_mulai_jadwal: string | null;
    tempat_lahir: string | null;
    tanggal_lahir: string | null;
    jabatan: string | null;
    departemen: string | null;
    kantor: string | null;
    password: string | null;
    rfid: string | null;
    no_telp: string | null;
    privilege: string | null;
    status_pegawai: string; // default: "Aktif"

    fp_zk: number | null;
    fp_neo: number | null;
    fp_revo: number | null;
    fp_livo: number | null;
    fp_uareu: number | null;
    wajah: number | null;
    telapak_tangan: number | null;

    tgl_masuk_kerja: string | null;
    tgl_akhir_kontrak: string | null;

    created_at: string;
    updated_at: string;
    user?: User; // Relasi ke model User
}
