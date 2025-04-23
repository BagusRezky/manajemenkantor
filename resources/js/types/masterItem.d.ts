import { CategoryItem } from "./categoryItem";
import { TypeItem } from "./typeItem";
import { Unit } from "./unit";


export interface MasterItem {
    id: string;
    kode_master_item: string;
    satuan_satu_id: string;
    id_category_item: string;
    id_type_item: string;
    qty: string | null;
    panjang: string | null;
    lebar: string | null;
    tinggi: string | null;
    berat: string | null;
    nama_master_item: string;
    min_stock: string;
    min_order: string;
    unit?: Unit;
    category_item?: CategoryItem;
    type_item?: TypeItem;
}
