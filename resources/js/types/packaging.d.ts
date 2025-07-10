import { KartuInstruksiKerja } from "./kartuInstruksiKerja";

export interface Packaging {
    id: string;
    kode_packaging: string;
    id_kartu_instruksi_kerja: string;
    satuan_transfer: string;
    jenis_transfer: string;
    tgl_transfer: string;
    jumlah_satuan_penuh: number;
    qty_persatuan_penuh: number;
    jumlah_satuan_sisa: number;
    qty_persatuan_sisa: number;
    created_at: string;
    updated_at: string;
    kartu_instruksi_kerja?: KartuInstruksiKerja;
}
