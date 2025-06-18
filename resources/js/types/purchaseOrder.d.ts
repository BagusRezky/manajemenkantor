import { MasterItem } from "./masterItem";
import { MasterKonversi } from "./masterKonversi";
import { PurchaseRequest, PurchaseRequestItem } from "./purchaseRequest";
import { Supplier } from "./supplier";
import { Unit } from "./unit";

export interface PurchaseOrderItem {
    id: string;
    id_purchase_order: string;
    id_purchase_request_item: string;
    id_master_item: string;
    id_satuan_po: string;
    qty_po: number;
    harga_satuan: number;
    diskon_satuan: number;
    jumlah: number;
    remark_item_po: string;
    qty_after_conversion: number;
    purchase_order?: PurchaseOrder;
    purchase_request_items?: PurchaseRequestItem;
    purchaseRequestItem?: PurchaseRequestItem;
    master_item?: MasterItem;
    master_konversi?: MasterKonversi;
    satuan?: Unit;
}

export interface PurchaseOrder {
    id: string;
    id_purchase_request: string;
    id_supplier: string;
    no_po: string;
    tanggal_po: string;
    eta: Date;
    mata_uang: string;
    ppn: number;
    ongkir: number;
    dp: number;
    items?: PurchaseOrderItem[];
    purchaseOrderItems?: PurchaseOrderItem[];
    supplier?: Supplier;
    purchase_request?: PurchaseRequest;
}
