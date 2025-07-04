import { KartuInstruksiKerja } from "./kartuInstruksiKerja";

export interface Mesin {
    id: string;
    nama_mesin: string;
}

export interface Operator {
    id: string;
    nama_operator: string;
}

export interface Printing {
    id: string;
    kode_printing: string;
    id_kartu_instruksi_kerja: string;
    id_mesin: string;
    id_operator: string;
    tanggal_entri: string;
    proses_printing: string;
    tahap_printing: string;
    hasil_baik_printing: number;
    hasil_rusak_printing: number;
    semi_waste_printing: number;
    keterangan_printing: string | null;
    created_at: string;
    updated_at: string;
    kartu_instruksi_kerja?: KartuInstruksiKerja;
    mesin?: Mesin;
    operator?: Operator;
}
