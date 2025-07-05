import { KartuInstruksiKerja } from "./kartuInstruksiKerja";

export interface MesinFinishing {
    id: string;
    nama_mesin_finishing: string;
}

export interface OperatorFinishing {
    id: string;
    nama_operator_finishing: string;
}

export interface Finishing {
    id: string;
    kode_finishing: string;
    id_kartu_instruksi_kerja: string;
    id_mesin_finishing: string;
    id_operator_finishing: string;
    tanggal_entri: string;
    proses_finishing: string;
    tahap_finishing: string;
    hasil_baik_finishing: number;
    hasil_rusak_finishing: number;
    semi_waste_finishing: number;
    keterangan_finishing: string;
    created_at: string;
    updated_at: string;
    kartu_instruksi_kerja?: KartuInstruksiKerja;
    mesin_finishing?: MesinFinishing;
    operator_finishing?: OperatorFinishing;
}
