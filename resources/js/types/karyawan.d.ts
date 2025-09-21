import { User } from '@/types/index';

export interface Karyawan {
    id: number;
    user_id: number;
    nik: string;
    npwp: string | null;
    tgl_lahir: string;
    alamat: string;
    telp: string;
    tanggal_masuk: string;
    tanggal_keluar: string | null;
    status: 'Aktif' | 'Non Aktif';
    created_at: string;
    updated_at: string;
    user?: User; // Relasi ke model User
}
