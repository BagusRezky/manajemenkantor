import { SubcountOut } from './subcountOut';

export interface SubcountInItem {
    id: string;
    id_subcount_in: string;
    id_subcount_out: string;
    qty: number;
    keterangan: string | null;
    created_at: string;
    updated_at: string;
    subcount_out?: SubcountOut;
}

export interface SubcountIn {
    id: string;
    no_subcount_in: string;
    tgl_subcount_in: string;
    no_surat_jalan_pengiriman: string;
    admin_produksi: string;
    supervisor: string;
    admin_mainstore: string;
    keterangan: string | null;
    created_at: string;
    updated_at: string;
    subcount_in_items?: SubcountInItem[];
}
