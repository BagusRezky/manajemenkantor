export interface MasterItem {
    id: number;
    kode_master_item: string;
    kode_item: string;
    nama_master_item: string;
    nama_item: string;
    unit?: {
        id: number;
        nama_satuan: string;
    };
    type_item: {
        id: number;
        nama_type_item: string;
    };
    typeItem?: {
        id: number;
        name: string;
        nama_type_item: string;
    };
}

export interface Department {
    id: number;
    kode_departemen?: string;
    nama_departemen: string;
}

export interface CustomerAddress {
    id: number;
    nama_customer: string;
}

export interface KartuInstruksiKerja {
    id: number;
    no_kik: string;
    no_kartu_instruksi_kerja: string;
}

export interface Reference {
    id?: number;
    type: 'department' | 'customer';
    qty: string | number;
    id_department?: string | number | null;
    id_customer?: string | number | null;
    id_customer_address?: string | number | null;
    id_kartu_instruksi_kerja?: string | number | null;
}

export interface PurchaseRequestItem {
    id?: number;
    id_master_item: string | number;
    kode_master_item?: string;
    qty: string | number;
    eta: string;
    catatan?: string;
    satuan?: string;
    references: Reference[];
    item_references?: Reference[];
}

export interface PurchaseRequest {
    id: number;
    no_pr: string;
    id_department: string | number;
    tgl_pr: string;
    status: string;
    departemen?: Department;
    purchase_request_items: PurchaseRequestItem[];
}

export interface ItemInput {
    id_master_item: string;
    qty: string;
    eta: string;
    catatan: string;
    satuan: string;
    type_item?: string;
    kode_master_item?: string;
}

export interface ReferenceInput {
    type: 'department' | 'customer';
    id_department: string;
    id_customer: string;
    id_customer_address?: string;
    id_kartu_instruksi_kerja: string;
    qty: string;
}

export interface PurchaseRequestEditProps {
    purchaseRequest: PurchaseRequest;
    departments: Department[];
    masterItems: MasterItem[];
    customerAddresses: CustomerAddress[];
    kartuInstruksiKerjas: KartuInstruksiKerja[];
}
