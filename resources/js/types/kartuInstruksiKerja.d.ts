import { SalesOrder } from "./salesOrder";


export interface KartuInstruksiKerja {
    id: string;
    id_sales_order: string;
    no_kartu_instruksi_kerja: string;
    production_plan: string;
    tgl_estimasi_selesai: string;
    spesifikasi_kertas: string | null;
    up_satu: number | null;
    up_dua: number | null;
    up_tiga: number | null;
    ukuran_potong: string | null;
    ukuran_cetak: string | null;
    created_at: string;
    updated_at: string;
    sales_order?: SalesOrder;
}
