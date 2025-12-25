export interface Gaji {
    nama: string;
    hadir: number;
    total_izin: number; // Tambahan
    total_alpha: number; // Tambahan
    total_lembur: string;
    total_cuti_semua: number;
    cuti_tahunan_digunakan: number;

    gaji_pokok: number;
    tunjangan_kompetensi: number;
    potongan_kompetensi: number; // Tambahan
    tunjangan_jabatan: number;
    potongan_jabatan: number; // Tambahan
    tunjangan_intensif: number;
    potongan_intensif: number; // Tambahan
    bonus: number;
    total_gaji: number;
}
