import { KartuInstruksiKerja } from "./kartuInstruksiKerja";
import { Supplier } from "./supplier";
import { Unit } from "./unit";

export interface SubcountOutItem {
    id: string;
    id_subcount_out: string;
    id_kartu_instruksi_kerja: string;
    id_unit: string;
    qty: number;
    keterangan: string | null;
    created_at: string;
    updated_at: string;
    kartu_instruksi_kerja?: KartuInstruksiKerja;
    unit?: Unit;
}

export interface SubcountOut {
    id: string;
    no_subcount_out: string;
    tgl_subcount_out: string;
    id_supplier: string;
    admin_produksi: string;
    supervisor: string;
    admin_mainstore: string;
    keterangan: string | null;
    created_at: string;
    updated_at: string;
    supplier?: Supplier;
    subcount_out_items?: SubcountOutItem[];
}
