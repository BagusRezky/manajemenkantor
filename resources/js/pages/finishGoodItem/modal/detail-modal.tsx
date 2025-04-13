import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FinishGoodItem } from "@/types/finishGoodItem";


interface DetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: FinishGoodItem | null;
}

export const DetailModal = ({ isOpen, onClose, item }: DetailModalProps) => {
    if (!item) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Detail Finish Good Item</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-4 gap-4 py-4">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Customer</span>
                        <span>{item.customer_address?.nama_customer}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Type Item</span>
                        <span>{item.type_item?.nama_type_item || '-'}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Kode Barang</span>
                        <span>{item.kode_material_produk || '-'}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Kode Barcode</span>
                        <span>{item.kode_barcode || '-'}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">PC Number</span>
                        <span>{item.pc_number || '-'}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Nama Barang</span>
                        <span>{item.nama_barang || '-'}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Deskripsi</span>
                        <span>{item.deskripsi || '-'}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Spesifikasi Kertas</span>
                        <span>{item.spesifikasi_kertas || '-'}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Up 1</span>
                        <span>{item.up_satu || '-'}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Up 2</span>
                        <span>{item.up_dua || '-'}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Up 3</span>
                        <span>{item.up_tiga || '-'}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Ukuran Potong</span>
                        <span>{item.ukuran_potong || '-'}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Ukuran Cetak</span>
                        <span>{item.ukuran_cetak || '-'}</span>
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
                        <span className="text-sm font-medium text-gray-500">Berat Kotor</span>
                        <span>{item.berat_kotor || '-'}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Berat Bersih</span>
                        <span>{item.berat_bersih || '-'}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Satuan</span>
                        <span>{item.unit?.nama_satuan || '-'}</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
