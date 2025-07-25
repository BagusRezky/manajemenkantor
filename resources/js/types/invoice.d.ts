import { SuratJalan } from "./suratJalan";

export interface Invoice {
    id: string;
    id_surat_jalan: string;
    no_invoice: string;
    tgl_invoice: string;
    tgl_jatuh_tempo: string;
    discount: number;
    ppn: number;
    ongkos_kirim: number;
    uang_muka: number;
    surat_jalan: SuratJalan
}
