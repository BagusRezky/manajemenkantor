/* eslint-disable @typescript-eslint/no-explicit-any */
import { KartuInstruksiKerja, KartuInstruksiKerjaBom } from './kartuInstruksiKerja';

export interface ImrDiemaking {
    id: string;
    id_kartu_instruksi_kerja: string;
    no_imr_diemaking: string;
    tgl_request: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
    kartu_instruksi_kerja?: KartuInstruksiKerja;
    items?: ImrDiemakingItem[];
}

export interface ImrDiemakingItem {
    id: string;
    id_imr_diemaking: string;
    id_kartu_instruksi_kerja_bom: string;
    qty_request: number;
    qty_approved: number;
    created_at: string;
    updated_at: string;
    kartu_instruksi_kerja_bom?: KartuInstruksiKerjaBom;
}

export interface ImrDiemakingFormData {
    id_kartu_instruksi_kerja: string;
    tgl_request: string;
    items: ImrDiemakingItemFormData[];
    [key: string]: any;
}

export interface ImrDiemakingItemFormData {
    id_kartu_instruksi_kerja_bom: string;
    qty_request: number;
}

export interface ApprovalFormData {
    items: ApprovalItemFormData[];
    [key: string]: any;
}

export interface ApprovalItemFormData {
    id: string;
    qty_approved: number;
}
