import { MasterItem } from "./masterItem";

export interface ItemReference {
    id: string;
    type: 'customer' | 'department';
    qty: number;
    departemen?: {
        nama_departemen: string;
    };
    customerAddress?: {
        nama_customer: string;
    };
    kartuInstruksiKerja?: {
        no_kartu_instruksi_kerja: string;
    };
}

export interface PurchaseRequestItem {
    id_purchase_request: string;
    id: string;
    qty: number;
    eta: string;
    catatan: string;
    id_master_item: string;
    master_item?:MasterItem;
    item_references: ItemReference[];
}

export interface PurchaseRequest {
    id: string;
    no_pr: string;
    tgl_pr: string;
    status: string;
    departemen: {
        nama_departemen: string;
    };
    purchase_request_items: PurchaseRequestItem[];
    purchaseRequestItem?: PurchaseRequestItem;
}
