import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { KartuInstruksiKerja } from '@/types/kartuInstruksiKerja';


interface DetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: KartuInstruksiKerja | null;
}

export const DetailModal = ({ isOpen, onClose, item }: DetailModalProps) => {
    if (!item) return null;



    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Detail Kartu Instruksi Kerja</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">No. Kartu Instruksi Kerja</span>
                        <span>{item.no_kartu_instruksi_kerja}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">No. Bon Pesanan</span>
                        <span>{item.sales_order?.no_bon_pesanan || '-'}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Production Plan</span>
                        <span>{item.production_plan}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Tanggal Estimasi Selesai</span>
                        <span>{item.tgl_estimasi_selesai}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Customer</span>
                        <span>{item.sales_order?.customer_address?.nama_customer || '-'}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Nama Produk</span>
                        <span>{item.sales_order?.finish_good_item?.nama_barang || '-'}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Kode Material</span>
                        <span>{item.sales_order?.finish_good_item?.kode_material_produk || '-'}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Spesifikasi Kertas</span>
                        <span>{item.spesifikasi_kertas || '-'}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Up Satu</span>
                        <span>{item.up_satu || '-'}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Up Dua</span>
                        <span>{item.up_dua || '-'}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Up Tiga</span>
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
                </div>
            </DialogContent>
        </Dialog>
    );
};
