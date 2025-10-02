export interface Absen {
    id: number;
    tanggal_scan: string;
    tanggal: string;
    jam: string;
    pin: string;
    nip: string;
    nama: string;
    jabatan?: string;
    departemen?: string;
    kantor?: string;
    verifikasi?: string;
    io?: string;
    workcode?: string;
    sn?: string;
    mesin?: string;
    created_at: string;
    updated_at: string;
}
