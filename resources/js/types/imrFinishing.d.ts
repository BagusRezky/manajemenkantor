/* eslint-disable @typescript-eslint/no-explicit-any */
import { KartuInstruksiKerja, KartuInstruksiKerjaBom } from './kartuInstruksiKerja';

export interface ImrFinishing {
    id: string;
    id_kartu_instruksi_kerja: string;
    no_imr_finishing: string;
    tgl_request: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
    kartu_instruksi_kerja?: KartuInstruksiKerja;
    items?: ImrFinishingItem[];
}

export interface ImrFinishingItem {
    id: string;
    id_imr_finishing: string;
    id_kartu_instruksi_kerja_bom: string;
    qty_request: number;
    qty_approved: number;
    created_at: string;
    updated_at: string;
    kartu_instruksi_kerja_bom?: KartuInstruksiKerjaBom;
}

export interface ImrFinishingFormData {
    id_kartu_instruksi_kerja: string;
    tgl_request: string;
    items: ImrFinishingItemFormData[];
    [key: string]: any;
}

export interface ImrFinishingItemFormData {
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
