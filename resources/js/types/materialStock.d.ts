export interface MaterialStock {
    id: string;
    kode_master_item: string;
    nama_master_item: string;
    nama_type_barang: string;
    satuan: string;
    min_stock: number;
    min_order: number;
    onhand_stock: number;
    outstanding_stock: number;
    allocation_stock: number;
    available_stock: number;
    status: 'normal' | 'low_stock' | 'out_of_stock';
}

export interface MaterialStockDetail {
    item: MasterItem;
    onhand_stock: number;
    outstanding_stock: number;
    allocation_stock: number;
    transactions: {
        received: ReceivedTransaction[];
        returned: ReturnedTransaction[];
        requested: RequestTransaction[];
    };
}

export interface ReceivedTransaction {
    id: string;
    qty_penerimaan: number;
    created_at: string;
    penerimaan_barang: {
        no_laporan_barang: string;
        tgl_terima_barang: string;
    };
}

export interface ReturnedTransaction {
    id: string;
    qty_retur: number;
    created_at: string;
    retur_eksternal: {
        no_retur?: string;
        tgl_retur_barang: string;
    };
}

export interface RequestTransaction {
    id: string;
    qty_request: number;
    qty_approved: number;
    created_at: string;
    internal_material_request: {
        no_imr: string;
        tgl_request: string;
        status: string;
    };
}

export interface MasterItem {
    id: string;
    kode_master_item: string;
    nama_master_item: string;
    min_stock: number;
    min_order: number;
    type_item?: {
        nama_type_item: string;
    };
    unit?: {
        nama_satuan: string;
    };
}
