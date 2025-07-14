/* eslint-disable @typescript-eslint/no-explicit-any */
import { KartuInstruksiKerja } from "./kartuInstruksiKerja";

export interface SuratJalan {
    id: string;
    id_kartu_instruksi_kerja: string;
    no_surat_jalan: string;
    tgl_surat_jalan: string;
    transportasi: string;
    no_polisi: string;
    driver: string;
    pengirim: string;
    keterangan: string | null;
    alamat_tujuan: string;
    created_at: string;
    updated_at: string;
    kartuInstruksiKerja?: KartuInstruksiKerja;
    kartu_instruksi_kerja?: KartuInstruksiKerja; // snake_case version for backward compatibility
}

export interface SuratJalanFormData {
    id_kartu_instruksi_kerja: string;
    no_surat_jalan: string;
    tgl_surat_jalan: string;
    transportasi: string;
    no_polisi: string;
    driver: string;
    pengirim: string;
    keterangan: string;
    alamat_tujuan: string;
    [key: string]: string | undefined;
}
