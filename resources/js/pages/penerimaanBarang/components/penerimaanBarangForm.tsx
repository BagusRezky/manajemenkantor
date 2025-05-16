/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePicker } from '@/components/date-picker';
import { SearchableSelect } from '@/components/search-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PurchaseOrder } from '@/types/purchaseOrder';
import { Textarea } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';

import { PencilIcon, TrashIcon } from 'lucide-react';
import { useEffect, useState } from 'react';


interface Unit {
    id: string;
    nama_satuan: string;
}
interface MasterItem {
    id: string;
    nama_master_item: string;
    kode_master_item: string;
}

interface MasterKonversi {
    id: string;
    satuan_dua_id: string;
    satuan_dua?: Unit;
}

interface PurchaseOrderItem {
    id: string;
    id_purchase_order: string;
    id_master_item: string;
    id_satuan_po: string;
    qty_po: number;
    remark_item_po: string;
    satuan?: Unit;
    master_item?: MasterItem;
    master_konversi?: MasterKonversi;
}

interface EditItemFormData {
    id: string;
    qty_penerimaan: number;
    catatan_item: string;
    tgl_expired: string;
    no_delivery_order: string;
}

interface PenerimaanItem extends PurchaseOrderItem {
    qty_penerimaan: number;
    qty_penerimaan_sebelumnya: number;
    catatan_item: string;
    tgl_expired: string;
    no_delivery_order: string;
    isEdited: boolean;
}

interface PreviousReceipt {
    id_purchase_order_item: string;
    total_qty_penerimaan: number;
}


// Tambahkan interface ini di bagian deklarasi tipe
interface FormItemData {
    id: string;
    qty_penerimaan: number;
    catatan_item: string;
    tgl_expired: string;
    no_delivery_order: string;
}

interface FormData {
    no_surat_jalan: string;
    tgl_terima_barang: string;
    nopol_kendaraan: string;
    nama_pengirim: string;
    catatan_pengirim: string;
    id_purchase_order: string;
    items: FormItemData[]; // Gunakan FormItemData, bukan PenerimaanItem
    [key: string]: any; // Tambahkan ini untuk mengatasi constraint
}

interface PenerimaanBarangFormProps {
    purchaseOrders: PurchaseOrder[];
    previousReceipts: PreviousReceipt[];
}

export const PenerimaanBarangForm: React.FC<PenerimaanBarangFormProps> = ({purchaseOrders,previousReceipts}) => {
    const [selectedPO, setSelectedPO] = useState<string>('');
    const [poItems, setPoItems] = useState<PenerimaanItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEditItem, setCurrentEditItem] = useState<PenerimaanItem | null>(null);

    const { data, setData, post, processing, errors } = useForm<FormData>({
        no_surat_jalan: '',
        tgl_terima_barang: format(new Date(), 'yyyy-MM-dd'),
        nopol_kendaraan: '',
        nama_pengirim: '',
        catatan_pengirim: '',
        id_purchase_order: '',
        items: [],
    });

    // When purchase order is selected, load the items
    useEffect(() => {
        if (selectedPO) {
            const po = purchaseOrders.find((po) => String(po.id) === selectedPO);
            if (po && po.purchase_order_items) {
                // Transform PO items to penerimaan items
                const penerimaanItems = po.purchase_order_items.map((item) => {
                    // Check if there are previous receipts for this item
                    const previousReceiptForItem = previousReceipts?.find((receipt) => receipt.id_purchase_order_item === item.id);

                    // Pastikan semua properti PenerimaanItem terpenuhi
                    return {
                        ...item, // Gunakan semua properti dari item asli
                        qty_penerimaan: 0,
                        qty_penerimaan_sebelumnya: previousReceiptForItem?.total_qty_penerimaan || 0,
                        catatan_item: '',
                        tgl_expired: '',
                        no_delivery_order: '',
                        isEdited: false,
                    } as PenerimaanItem; // Cast ke PenerimaanItem untuk mengatasi error
                });

                setPoItems(penerimaanItems);
                setData('id_purchase_order', selectedPO);
            }
        }
    }, [selectedPO, purchaseOrders, previousReceipts, setData]);

    const handlePOChange = (val: string) => {
        setSelectedPO(val); // JANGAN di-Number
    };

    const openEditModal = (item: PenerimaanItem) => {
        setCurrentEditItem(item);
        setIsModalOpen(true);
    };

    const handleEditItem = (formData: EditItemFormData) => {
        const updatedItems = poItems.map((item) => {
            if (item.id === formData.id) {
                return {
                    ...item,
                    qty_penerimaan: formData.qty_penerimaan,
                    catatan_item: formData.catatan_item,
                    tgl_expired: formData.tgl_expired,
                    no_delivery_order: formData.no_delivery_order,
                    isEdited: true,
                };
            }
            return item;
        });

        setPoItems(updatedItems);

        // Convert to the format needed for the form
        const formItems = updatedItems
            .filter((item) => item.isEdited)
            .map((item) => ({
                id: item.id,
                qty_penerimaan: item.qty_penerimaan,
                catatan_item: item.catatan_item,
                tgl_expired: item.tgl_expired,
                no_delivery_order: item.no_delivery_order,
            }));

        setData('items', formItems);
        setIsModalOpen(false);
    };

    const handleDeleteItem = (id: string) => {
        const updatedItems = poItems.map((item) => {
            if (item.id === id) {
                return {
                    ...item,
                    qty_penerimaan: 0,
                    catatan_item: '',
                    tgl_expired: '',
                    no_delivery_order: '',
                    isEdited: false,
                };
            }
            return item;
        });

        setPoItems(updatedItems);

        // Convert to the format needed for the form
        const formItems = updatedItems
            .filter((item) => item.isEdited)
            .map((item) => ({
                id: item.id,
                qty_penerimaan: item.qty_penerimaan,
                catatan_item: item.catatan_item,
                tgl_expired: item.tgl_expired,
                no_delivery_order: item.no_delivery_order,
            }));

        setData('items', formItems);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('penerimaanBarangs.store'));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Form Penerimaan Barang</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6 grid grid-cols-3 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium">ID Purchase Order:</label>
                            <SearchableSelect
                                items={purchaseOrders.map((po) => ({
                                    key: String(po.id),
                                    value: String(po.id),
                                    label: po.no_po,
                                }))}
                                value={selectedPO || ''} // fallback ke string kosong agar tidak error
                                placeholder="Input Purchase Order"
                                onChange={(value) => handlePOChange(value)}
                            />
                            {errors.id_purchase_order && <div className="text-sm text-red-500">{errors.id_purchase_order}</div>}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium">No. Surat Jalan Kirim:</label>
                            <Input
                                type="text"
                                value={data.no_surat_jalan}
                                onChange={(e) => setData('no_surat_jalan', e.target.value)}
                                placeholder="Input no surat jalan kirim"
                            />
                            {errors.no_surat_jalan && <div className="text-sm text-red-500">{errors.no_surat_jalan}</div>}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium">Tgl. Terima Barang:</label>
                            <DatePicker
                                id="tgl_terima_barang"
                                value={data.tgl_terima_barang}
                                onChange={(e) => setData('tgl_terima_barang', e.target.value ? e.target.value : '')}
                            />
                            {errors.tgl_terima_barang && <div className="text-sm text-red-500">{errors.tgl_terima_barang}</div>}
                        </div>
                    </div>

                    <div className="mb-6 grid grid-cols-3 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium">Nopol Kendaraan:</label>
                            <Input
                                type="text"
                                value={data.nopol_kendaraan}
                                onChange={(e) => setData('nopol_kendaraan', e.target.value)}
                                placeholder="Input nopol kendaraan"
                            />
                            {errors.nopol_kendaraan && <div className="text-sm text-red-500">{errors.nopol_kendaraan}</div>}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium">Nama Pengirim:</label>
                            <Input
                                type="text"
                                value={data.nama_pengirim}
                                onChange={(e) => setData('nama_pengirim', e.target.value)}
                                placeholder="Input nama pengirim"
                            />
                            {errors.nama_pengirim && <div className="text-sm text-red-500">{errors.nama_pengirim}</div>}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium">Catatan Pengirim:</label>
                            <Textarea
                                value={data.catatan_pengirim}
                                onChange={(e) => setData('catatan_pengirim', e.target.value)}
                                placeholder="Catatan pengirim"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="mb-2 text-lg font-medium">Data Item Purchase Order</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No</TableHead>
                                    <TableHead>Type | Kode - Nama Item</TableHead>
                                    <TableHead>Qty | Satuan Purchase Order</TableHead>
                                    <TableHead>Qty | Satuan Penerimaan Sebelumnya</TableHead>
                                    <TableHead>Qty | Satuan Penerimaan</TableHead>
                                    <TableHead>Catatan PO</TableHead>
                                    <TableHead>Catatan Item</TableHead>
                                    <TableHead>Tgl.Exp | No.LOT</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {poItems.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center">
                                            Pilih Purchase Order terlebih dahulu
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    poItems.map((item, index) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                {item.master_item?.kode_master_item} - {item.master_item?.nama_master_item}
                                            </TableCell>
                                            <TableCell>
                                                {item.qty_po} | {item.satuan?.nama_satuan}
                                            </TableCell>
                                            <TableCell>
                                                {item.qty_penerimaan_sebelumnya} | {item.satuan?.nama_satuan}
                                            </TableCell>
                                            <TableCell>{item.isEdited ? `${item.qty_penerimaan} | ${item.satuan?.nama_satuan}` : '0 |'}</TableCell>
                                            <TableCell>{item.remark_item_po || '-'}</TableCell>
                                            <TableCell>{item.catatan_item || '-'}</TableCell>
                                            <TableCell>{item.tgl_expired ? `${item.tgl_expired} | ${item.no_delivery_order}` : '- | -'}</TableCell>
                                            <TableCell>
                                                <div className="flex space-x-2">
                                                    <Button type="button" variant="outline" size="sm" onClick={() => openEditModal(item)}>
                                                        <PencilIcon className="h-4 w-4" />
                                                    </Button>
                                                    {item.isEdited && (
                                                        <Button type="button" variant="outline" size="sm" onClick={() => handleDeleteItem(item.id)}>
                                                            <TrashIcon className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex space-x-2">
                        <Button type="submit" disabled={processing}>
                            SIMPAN
                        </Button>
                        <Button type="button" variant="outline" onClick={() => window.history.back()}>
                            BATAL
                        </Button>
                    </div>
                </form>
            </CardContent>

            {/* Edit Item Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Form Penerimaan</DialogTitle>
                    </DialogHeader>

                    {currentEditItem && (
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium">Qty Penerimaan:</label>
                                <Input
                                    type="number"
                                    value={currentEditItem.qty_penerimaan}
                                    onChange={(e) => {
                                        if (currentEditItem) {
                                            setCurrentEditItem({
                                                ...currentEditItem,
                                                qty_penerimaan: parseFloat(e.target.value) || 0,
                                            });
                                        }
                                    }}
                                />
                                <div className="mt-1 text-sm text-gray-500">
                                    Qty Purchase Order: {currentEditItem.qty_po} {currentEditItem.master_konversi?.satuan_dua?.nama_satuan}
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">Catatan Item:</label>
                                <Textarea
                                    value={currentEditItem.catatan_item}
                                    onChange={(e) => {
                                        if (currentEditItem) {
                                            setCurrentEditItem({
                                                ...currentEditItem,
                                                catatan_item: e.target.value,
                                            });
                                        }
                                    }}
                                    placeholder="Input catatan item"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">Tgl. Expired:</label>
                                <Input
                                    type="date"
                                    value={currentEditItem.tgl_expired}
                                    onChange={(e) => {
                                        if (currentEditItem) {
                                            setCurrentEditItem({
                                                ...currentEditItem,
                                                tgl_expired: e.target.value,
                                            });
                                        }
                                    }}
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">No. Delivery Order:</label>
                                <Input
                                    type="text"
                                    value={currentEditItem.no_delivery_order}
                                    onChange={(e) => {
                                        if (currentEditItem) {
                                            setCurrentEditItem({
                                                ...currentEditItem,
                                                no_delivery_order: e.target.value,
                                            });
                                        }
                                    }}
                                    placeholder="no.delivery order"
                                />
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button
                                    onClick={() => {
                                        if (currentEditItem) {
                                            handleEditItem({
                                                id: currentEditItem.id,
                                                qty_penerimaan: currentEditItem.qty_penerimaan,
                                                catatan_item: currentEditItem.catatan_item,
                                                tgl_expired: currentEditItem.tgl_expired,
                                                no_delivery_order: currentEditItem.no_delivery_order,
                                            });
                                        }
                                    }}
                                >
                                    PROSES
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                    TUTUP
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </Card>
    );
};
