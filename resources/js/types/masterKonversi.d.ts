import { Unit } from "./unit";

export type MasterKonversi = {
    id: string;
    id_type_item: string;
    satuan_satu_id: string;
    satuan_dua_id: string;
    jumlah_satuan_konversi: string;
    satuan_satu?: Unit;
    satuan_dua?: Unit;
};
