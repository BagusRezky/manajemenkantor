import { KartuInstruksiKerja } from './kartuInstruksiKerja';

export interface Blokir {
    id: string;
    id_kartu_instruksi_kerja: string;
    no_blokir: string;
    tgl_blokir: string;
    operator: string;
    qty_blokir: number;
    keterangan_blokir: string | null;
    created_at: string;
    updated_at: string;
    kartu_instruksi_kerja?: KartuInstruksiKerja;
}
