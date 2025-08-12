import { ImrDiemaking, ImrDiemakingItem } from './imrDiemaking';
import { ImrFinishing, ImrFinishingItem } from './imrFinishing';
import { InternalMaterialRequest, InternalMaterialRequestItem } from './internalMaterialRequest';

export interface ReturInternal {
    id: number;
    id_imr_finishing: number;
    id_imr_diemaking: number;
    id_imr: number;
    no_retur_internal: string;
    tgl_retur_internal: Date;
    nama_retur_internal: string;
    catatan_retur_internal: string;
    created_at: string;
    updated_at: string;
    imrFinishing?: ImrFinishing;
    imrDiemaking?: ImrDiemaking;
    imr?: InternalMaterialRequest;
    items?: ReturInternalItem[];
}

export interface ReturInternalItem {
    id: number;
    id_retur_internal: number;
    id_imr_item: number;
    id_imr_diemaking_item: number;
    id_imr_finishing_item: number;
    qty_approved_retur: number;
    imrItem?: InternalMaterialRequestItem;
    imrDiemakingItem?: ImrDiemakingItem;
    imrFinishingItem?: ImrFinishingItem;
    created_at: string;
    updated_at: string;
}
