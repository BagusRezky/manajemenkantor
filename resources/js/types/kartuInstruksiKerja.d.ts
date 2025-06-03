import { BillOfMaterial } from "./billOfMaterial";
import { SalesOrder } from "./salesOrder";


export interface KartuInstruksiKerja {
    id: string;
    id_sales_order: string;
    no_kartu_instruksi_kerja: string;
    production_plan: string;
    tgl_estimasi_selesai: string;
    created_at: string;
    updated_at: string;
    sales_order?: SalesOrder;
    kartuInstruksiKerjaBoms?: KartuInstruksiKerjaBom[]; // camelCase version
    kartu_instruksi_kerja_boms?: KartuInstruksiKerjaBom[]; // snake_case version from Laravel
}

export interface KartuInstruksiKerjaBom {
    id: string;
    id_kartu_instruksi_kerja: string;
    id_bom: string;
    waste: number;
    total_kebutuhan: number;
    jumlah_sheet_cetak: number;
    jumlah_total_sheet_cetak: number;
    jumlah_produksi: number;

    bill_of_materials?: BillOfMaterial;
}

