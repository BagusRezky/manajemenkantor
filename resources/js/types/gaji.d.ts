export interface Gaji {
    nama: string;
    hadir: number;
    total_lembur: string; // HH:MM:SS
    total_cuti_semua: number;
    cuti_tahunan_digunakan: number;

    gaji_pokok: number;
    tunjangan_kompetensi: number;
    tunjangan_jabatan: number;
    tunjangan_intensif: number;
    total_tunjangan: number;
    bonus: number;
    total_gaji: number;
}
