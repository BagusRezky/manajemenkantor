import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PurchaseOrderItem } from '@/types/purchaseOrder';
import { formatRupiah } from '@/utils/formatter/currency';
import { useState } from 'react';
import EditItemPr from './edit-item-pr';

interface PrItemsProps {
    poItems: Partial<PurchaseOrderItem>[];
    setPoItems: (items: Partial<PurchaseOrderItem>[]) => void;
}

export default function PrItems({ poItems, setPoItems }: PrItemsProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEditItem, setCurrentEditItem] = useState<Partial<PurchaseOrderItem> | null>(null);

    // Handler untuk klik tombol edit
    const handleEditItem = (item: Partial<PurchaseOrderItem>) => {
        setCurrentEditItem(item);
        setIsModalOpen(true);
    };

    // Handler untuk menyimpan perubahan item
    const handleSaveItemChanges = (updatedItem: Partial<PurchaseOrderItem>) => {
        console.log('Harga Satuan:', updatedItem.harga_satuan);
        console.log('Qty PO:', updatedItem.qty_po);
        console.log('Qty After Conversion:', updatedItem.qty_after_conversion);
        console.log('Diskon Satuan:', updatedItem.diskon_satuan);

        // Rumus baru: jumlah = harga_satuan × qty_after_conversion × (1 - diskon_satuan/100)
        const qtyAfterConversion = updatedItem.qty_after_conversion || 0;
        const jumlah = (updatedItem.harga_satuan || 0) * qtyAfterConversion * (1 - (updatedItem.diskon_satuan || 0) / 100);

        console.log('Jumlah (before saving):', jumlah);

        const updatedItems = poItems.map((item) =>
            item.id_purchase_request_item === updatedItem.id_purchase_request_item
                ? {
                      ...updatedItem,
                      jumlah: parseFloat(jumlah.toFixed(2)),
                  }
                : item,
        );

        setPoItems(updatedItems);
        setIsModalOpen(false);
        setCurrentEditItem(null);
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
                                <TableHead>Qty After Conversion</TableHead>
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
                                <TableRow key={item.id_purchase_request_item}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        {item.master_item ? `${item.master_item.kode_master_item} - ${item.master_item.nama_master_item}` : '-'}
                                    </TableCell>
                                    <TableCell>{item.purchase_request_items?.qty || '-'}</TableCell>
                                    <TableCell>{item.purchase_request_items?.master_item?.unit?.nama_satuan || '-'}</TableCell>
                                    <TableCell>{item.qty_po || 0}</TableCell>
                                    <TableCell>{item.master_konversi?.satuan_dua?.nama_satuan || '-'}</TableCell>
                                    <TableCell>{item.qty_after_conversion || 0}</TableCell>
                                    <TableCell>{formatRupiah(item.harga_satuan || 0)}</TableCell>
                                    <TableCell>{item.diskon_satuan || 0}%</TableCell>
                                    <TableCell>{formatRupiah(item.jumlah || 0)}</TableCell>
                                    <TableCell>{item.purchase_request_items?.catatan || '-'}</TableCell>
                                    <TableCell>{item.remark_item_po || '-'}</TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm" onClick={() => handleEditItem(item)}>
                                            Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Modal Edit Item */}
            {currentEditItem && (
                <EditItemPr
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
