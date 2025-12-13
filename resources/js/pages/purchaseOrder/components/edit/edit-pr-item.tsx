import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatRupiah } from '@/utils/formatter/currency';

import { useState } from 'react';

import { toast } from 'sonner';
import EditItemModal from './edit-item-modal';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface EditPrItemsProps {
    poItems: any[];
    setPoItems: (items: any[]) => void;
}

export default function EditPrItems({ poItems, setPoItems }: EditPrItemsProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEditItem, setCurrentEditItem] = useState<any | null>(null);

    // Handler untuk klik tombol edit (dengan perbaikan untuk mencegah submit)
    const handleEditItem = (item: any, e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        console.log('Item yang akan diedit:', item);

        // Deep copy item untuk mencegah perubahan langsung
        const itemCopy = { ...item };

        setCurrentEditItem(itemCopy);
        setIsModalOpen(true);
    };

    // Handler untuk menyimpan perubahan item
    const handleSaveItemChanges = (updatedItem: any) => {
        try {
            console.log('Saving item changes:', updatedItem);

            if (!updatedItem.id_purchase_request_item) {
                throw new Error('ID Purchase Request Item tidak valid');
            }

            // Hitung total dengan formula jumlah = harga_satuan × qty_after_conversion × (1 - diskon_satuan/100)
            const qtyAfterConversion = updatedItem.qty_after_conversion || 0;
            const hargaSatuan = updatedItem.harga_satuan || 0;
            const diskon = updatedItem.diskon_satuan || 0;
            const jumlah = hargaSatuan * qtyAfterConversion * (1 - diskon / 100);

            // Update items array dengan item yang diperbarui
            const updatedItems = poItems.map((item) =>
                item.id === updatedItem.id
                    ? {
                          ...updatedItem,
                          jumlah: parseFloat(jumlah.toFixed(2)),
                      }
                    : item,
            );

            console.log('Updated items array:', updatedItems);
            setPoItems(updatedItems);
            setIsModalOpen(false);
            setCurrentEditItem(null);

            toast.success('Item berhasil diperbarui');
        } catch (error) {
            console.error('Error saving item changes:', error);
            toast.error(`Gagal menyimpan perubahan`);
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Purchase Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No</TableHead>
                                <TableHead>Kode - Nama Item</TableHead>
                                <TableHead>Qty PR</TableHead>
                                <TableHead>Satuan PR</TableHead>
                                <TableHead>Qty PO</TableHead>
                                <TableHead>Satuan PO</TableHead>
                                {/* <TableHead>Qty After Conversion</TableHead> */}
                                <TableHead>Harga Satuan</TableHead>
                                <TableHead>Diskon</TableHead>
                                <TableHead>Jumlah</TableHead>
                                <TableHead>Remark PR</TableHead>
                                <TableHead>Remark PO</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {poItems.map((item, index) => (
                                <TableRow key={item.id || index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        {/* Pastikan akses master_item aman */}
                                        {item.master_item
                                            ? `${item.master_item.kode_master_item} - ${item.master_item.nama_master_item}`
                                            : item.purchaseRequestItem?.master_item
                                              ? `${item.purchaseRequestItem.master_item.kode_master_item} - ${item.purchaseRequestItem.master_item.nama_master_item}`
                                              : '-'}
                                    </TableCell>
                                    {/* Gunakan purchaseRequestItem (hasil mapping di edit.tsx)
                atau purchase_request_items (backup)
            */}
                                    <TableCell>{item.purchaseRequestItem?.qty || item.purchase_request_items?.qty || '-'}</TableCell>
                                    <TableCell>
                                        {item.purchaseRequestItem?.master_item?.unit?.nama_satuan ||
                                            item.purchase_request_items?.master_item?.unit?.nama_satuan ||
                                            '-'}
                                    </TableCell>

                                    <TableCell>{item.qty_po || 0}</TableCell>
                                    <TableCell>{item.satuan?.nama_satuan || '-'}</TableCell>
                                    {/* <TableCell>{item.qty_after_conversion || 0}</TableCell> */}
                                    <TableCell>{formatRupiah(item.harga_satuan || 0)}</TableCell>
                                    <TableCell>{item.diskon_satuan || 0}%</TableCell>
                                    <TableCell>{formatRupiah(item.jumlah || 0)}</TableCell>

                                    <TableCell>{item.purchaseRequestItem?.catatan || item.purchase_request_items?.catatan || '-'}</TableCell>
                                    <TableCell>{item.remark_item_po || '-'}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            type="button" // Eksplisit sebagai button, bukan submit
                                            onClick={(e) => handleEditItem(item, e)}
                                        >
                                            Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Modal Edit Item khusus untuk Edit */}
            {currentEditItem && (
                <EditItemModal
                    isOpen={isModalOpen}
                    setIsOpen={setIsModalOpen}
                    currentItem={currentEditItem}
                    setCurrentItem={setCurrentEditItem}
                    onSave={handleSaveItemChanges}
                />
            )}
        </>
    );
}
