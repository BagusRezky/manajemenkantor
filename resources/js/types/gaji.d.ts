export interface Gaji {
    id: number;
    nama: string;
    hadir: number;
    total_izin: number;
    total_alpha: number;
    total_lembur: string;
    total_cuti_semua: number;
    cuti_tahunan_digunakan: number;

    gaji_pokok: number;
    tunjangan_kompetensi: number;
    potongan_kompetensi: number;
    tunjangan_jabatan: number;
    potongan_jabatan: number;
    tunjangan_intensif: number;
    potongan_intensif: number;
    bonus: number;
    total_gaji: number;
}
