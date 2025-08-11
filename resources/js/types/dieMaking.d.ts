import { KartuInstruksiKerja } from './kartuInstruksiKerja';
import { MesinDiemaking } from './mesinDiemaking';
import { OperatorDiemaking } from './operatorDiemaking';

export interface DieMaking {
    id: string;
    kode_diemaking: string;
    id_kartu_instruksi_kerja: string;
    id_mesin_diemaking: string;
    id_operator_diemaking: string;
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
    mesin_diemaking?: MesinDiemaking;
    operator_diemaking?: OperatorDiemaking;
}
