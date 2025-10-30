export type RekapAbsen = {
    nama: string;
    hadir: number;
    kedatangan_kali: number;
    pulang_kali: number;
    lembur_kali: number;
    total_jam_lembur: number;
    izin_kali: number;
    cuti_kali: number;
    bulan?: number;
    tahun?: number;
};
