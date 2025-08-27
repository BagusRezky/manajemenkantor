import { PenerimaanBarang } from './penerimaanBarang';

export interface PaymentEntryGood {
    id: string;
    id_penerimaan_barang: string;
    no_tagihan: string;
    tanggal_transaksi: Date;
    tanggal_jatuh_tempo: Date;
    harga_per_qty: number;
    diskon: number;
    ppn: number;
    keterangan: string;
    penerimaan_barang?: PenerimaanBarang;
}
