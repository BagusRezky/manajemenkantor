import { KartuInstruksiKerja } from "./kartuInstruksiKerja";

export interface Mesin {
    id: string;
    nama_mesin: string;
}

export interface Operator {
    id: string;
    nama_operator: string;
}

export interface DieMaking {
    id: string;
    kode_diemaking: string;
    id_kartu_instruksi_kerja: string;
    id_mesin: string;
    id_operator: string;
    tanggal_entri: string;
    proses_diemaking: string;
    tahap_diemaking: string;
    hasil_baik_diemaking: number;
    hasil_rusak_diemaking: number;
    semi_waste_diemaking: number;
    keterangan_diemaking: string | null;
    created_at: string;
    updated_at: string;
    kartu_instruksi_kerja?: KartuInstruksiKerja;
    mesin?: Mesin;
    operator?: Operator;
}
