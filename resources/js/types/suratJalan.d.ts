import { KartuInstruksiKerja } from './kartuInstruksiKerja';
import { SalesOrder } from './salesOrder';

export interface SuratJalan {
    id: string;
    id_kartu_instruksi_kerja: string | null;
    id_sales_order: string;
    no_surat_jalan: string;
    tgl_surat_jalan: string;
    transportasi: string;
    no_polisi: string;
    driver: string;
    pengirim: string;
    keterangan: string | null;
    alamat_tujuan: string;
    created_at: string;
    updated_at: string;
    qty_pengiriman: number;
    salesOrder?: SalesOrder;
    sales_order?: SalesOrder; 
    kartuInstruksiKerja?: KartuInstruksiKerja;
    kartu_instruksi_kerja?: KartuInstruksiKerja; 
}

export interface SuratJalanFormData {
    id_sales_order: string;
    id_kartu_instruksi_kerja: string;
    no_surat_jalan: string;
    tgl_surat_jalan: string;
    transportasi: string;
    no_polisi: string;
    driver: string;
    pengirim: string;
    keterangan: string;
    alamat_tujuan: string;
    qty_pengiriman: string;
    [key: string]: string | undefined;
}
