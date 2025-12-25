export type RekapAbsen = {
    nama: string;
    hadir: number;
    kedatangan_kali: number;
    pulang_kali: number;
    lembur_kali: number;
    total_jam_lembur: string; // diubah ke string karena format HH:MM:SS
    izin_kali: number;
    cuti_kali: number;
    alpha_kali: number; // Tambahkan ini
    bulan?: number;
    tahun?: number;
};
