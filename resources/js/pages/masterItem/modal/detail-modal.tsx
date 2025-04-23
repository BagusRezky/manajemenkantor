import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MasterItem } from "@/types/masterItem";

interface DetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: MasterItem | null;
}

export const DetailModal = ({ isOpen, onClose, item }: DetailModalProps) => {
    if (!item) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Detail Master Item</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Kode Item</span>
                        <span>{item.kode_master_item}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Nama Item</span>
                        <span>{item.nama_master_item || '-'}</span>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Minimal Order</span>
                        <span>{item.min_order || '-'}</span>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Minimal Stock</span>
                        <span>{item.min_stock || '-'}</span>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Satuan</span>
                        <span>{item.unit?.nama_satuan || '-'}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Kategori</span>
                        <span>{item.category_item?.nama_category_item || '-'}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Tipe</span>
                        <span>{item.type_item?.nama_type_item || '-'}</span>
                    </div>
                    {(item.qty !== null || item.panjang !== null) && (
                        <>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-500">Quantity</span>
                                <span>{item.qty || '-'}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-500">Panjang</span>
                                <span>{item.panjang || '-'}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-500">Lebar</span>
                                <span>{item.lebar || '-'}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-500">Tinggi</span>
                                <span>{item.tinggi || '-'}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-500">Berat</span>
                                <span>{item.berat || '-'}</span>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
