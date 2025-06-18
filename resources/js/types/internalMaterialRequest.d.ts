/* eslint-disable @typescript-eslint/no-explicit-any */
import { KartuInstruksiKerja, KartuInstruksiKerjaBom } from './kartuInstruksiKerja';

export interface InternalMaterialRequest {
    id: string;
    id_kartu_instruksi_kerja: string;
    no_imr: string;
    tgl_request: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
    kartu_instruksi_kerja?: KartuInstruksiKerja;
    items?: InternalMaterialRequestItem[];
}

export interface InternalMaterialRequestItem {
    id: string;
    id_imr: string;
    id_kartu_instruksi_kerja_bom: string;
    qty_request: number;
    qty_approved: number;
    created_at: string;
    updated_at: string;
    kartu_instruksi_kerja_bom?: KartuInstruksiKerjaBom;
}

export interface InternalMaterialRequestFormData {
    id_kartu_instruksi_kerja: string;
    tgl_request: string;
    items: InternalMaterialRequestItemFormData[];
    [key: string]: any;
}

export interface InternalMaterialRequestItemFormData {
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
