import { Departemen } from "./departemen";
import { MasterItem } from "./masterItem";


export interface BomItem {
    id: string;
    id_master_item: string;
    id_departemen: string;
    waste: string;
    qty: string;
    keterangan: string;
    master_item?: MasterItem;
    departemen?: Departemen;
}
