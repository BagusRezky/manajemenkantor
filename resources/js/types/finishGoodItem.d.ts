import { BomItem } from "./billOfMaterial";
import { CustomerAddress } from "./customerAddress";
import { TypeItem } from "./typeItem";
import { Unit } from "./unit";


export interface FinishGoodItem {
    id: string;
    id_customer_address: string;
    id_type_item: string;
    satuan_satu_id: string;
    kode_material_produk: string;
    kode_barcode: string;
    pc_number: string;
    nama_barang: string;
    deskripsi: string;
    spesifikasi_kertas: string;
    up_satu: string;
    up_dua: string;
    up_tiga: string;
    ukuran_potong: string;
    ukuran_cetak: string;
    panjang: string;
    lebar: string;
    tinggi: string;
    berat_kotor: string;
    berat_bersih: string;
    deleted_at: string;
    unit?: Unit;
    customer_address?: CustomerAddress;
    type_item?: TypeItem;
    bill_of_materials?: BomItem[];
}
