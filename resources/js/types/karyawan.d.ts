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
    status_pegawai: string;

    fp_zk: number | null;
    fp_neo: number | null;
    fp_revo: number | null;
    fp_livo: number | null;
    fp_uareu: number | null;
    wajah: number | null;
    telapak_tangan: number | null;

    tgl_masuk_kerja: string | null;
    tgl_akhir_kontrak: string | null;

    nik: string | null;
    no_ktp: string | null;
    jenis_kelamin: string | null;
    status_perkawinan: string | null;
    agama: string | null;
    keterangan_tambahan: string | null;

    alamat_domisili: string | null;
    kota_domisili: string | null;
    kecamatan_domisili: string | null;
    desa_domisili: string | null;
    kode_pos_domisili: string | null;

    alamat_ktp: string | null;
    kota_ktp: string | null;
    kecamatan_ktp: string | null;
    desa_ktp: string | null;
    kode_pos_ktp: string | null;

    gaji_pokok: number | null;
    tipe_gaji: string | null;
    nama_npwp: string | null;
    alamat_npwp: string | null;
    nama_bank: string | null;
    rekening_an: string | null;
    nomor_rekening: string | null;
    ptkp: string | null;
    tunjangan_kompetensi: number | null;
    tunjangan_jabatan: number | null;
    tunjangan_intensif: number | null;
    tanggal_npwp: string | null;
    nomor_npwp: string | null;

    bpjs_nama: string | null;
    bpjs_kesehatan: string | null;
    bpjs_ketenagakerjaan: string | null;
    bpjs_cabang: string | null;
    bpjs_tanggal: string | null;

    created_at: string;
    updated_at: string;
    user?: User; // Relasi ke model User
}
