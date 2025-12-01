import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SalesOrder } from '@/types/salesOrder';

interface DetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: SalesOrder | null;
}

export const DetailModal = ({ isOpen, onClose, item }: DetailModalProps) => {
    if (!item) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[1200px]">
                <DialogHeader>
                    <DialogTitle>Detail Sales Order</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-4 gap-4 py-4">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Customer</span>
                        <span>{item.customer_address?.nama_customer || '-'}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">No. Sales Order</span>
                        <span>{item.no_bon_pesanan}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">No.PO Customer</span>
                        <span>{item.no_po_customer}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Produk</span>
                        <span>{item.finish_good_item?.nama_barang || item.master_item?.nama_master_item || '-'}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Jumlah Pesanan</span>
                        <span>{item.jumlah_pesanan}</span>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Harga PCS SO</span>
                        <span>{item.harga_pcs_bp}</span>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Harga PCS Kirim</span>
                        <span>{item.harga_pcs_kirim}</span>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Mata Uang</span>
                        <span>{item.mata_uang}</span>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Syarat Pembayaran</span>
                        <span>{item.syarat_pembayaran}</span>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Tanggal PO</span>
                        <span>{item.eta_marketing}</span>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Klaim Kertas</span>
                        <span>{item.klaim_kertas}</span>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Dipesan Via</span>
                        <span>{item.dipesan_via}</span>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Tipe Pesanan</span>
                        <span>{item.tipe_pesanan}</span>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Toleransi Pengiriman</span>
                        <span>{item.toleransi_pengiriman}</span>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Catatan Colour Range</span>
                        <span>{item.catatan_colour_range}</span>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Catatan</span>
                        <span>{item.catatan}</span>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Tipe Penjualan</span>
                        <span>{item.master_item?.tipe_penjualan || '-'}</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
