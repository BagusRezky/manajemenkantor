/* eslint-disable @typescript-eslint/no-unused-vars */
import { SearchableSelect } from '@/components/search-select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MasterKonversi } from '@/types/masterKonversi';
import { PurchaseOrderItem } from '@/types/purchaseOrder';
import { Textarea } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface EditItemPrProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    currentItem: Partial<PurchaseOrderItem>;
    setCurrentItem: (item: Partial<PurchaseOrderItem>) => void;
    onSave: (item: Partial<PurchaseOrderItem>) => void;
}

export default function EditItemPr({ isOpen, setIsOpen, currentItem, setCurrentItem, onSave }: EditItemPrProps) {
    const [availableConversions, setAvailableConversions] = useState<MasterKonversi[]>([]);
    const [selectedConversion, setSelectedConversion] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

     useEffect(() => {
         if (isOpen && currentItem) {
             const itemId = currentItem.id_master_item;
             const unitId = currentItem.purchase_request_items?.master_item?.unit?.id;

             if (itemId && unitId) {
                 fetchConversions(itemId, unitId);
             } else {
                 toast.error('Data tidak lengkap untuk mengambil konversi');
             }
         }
         if (!isOpen) setSelectedConversion(null);
     }, [isOpen, currentItem]);

    const fetchConversions = async (itemId: string, unitId: string) => {
        try {
            setLoading(true);
            const response = await fetch(route('purchaseOrders.getUnitConversions', [itemId, unitId]), {
                headers: { Accept: 'application/json' },
            });
            if (!response.ok) throw new Error('Failed to fetch conversions');
            const data = await response.json();
            setAvailableConversions(data.conversions || []);
        } catch (error) {
            toast.error('Gagal memuat data konversi');
        } finally {
            setLoading(false);
        }
    };

    const handleConversionSelection = (conversionId: string) => {
        setSelectedConversion(conversionId);

        const conversion = availableConversions.find((c) => c.id === conversionId);
        if (!conversion) return;

        // Update item dengan satuan yang dipilih tanpa mengubah harga
        const updatedItem = {
            ...currentItem,
            id_satuan_po: conversion.satuan_dua_id,
            satuan: conversion.satuan_dua,
            master_konversi: conversion,
            // Harga satuan tetap sama atau 0 jika belum diinput
        };

        setCurrentItem(updatedItem);
    };

    const handleQtyPoChange = (qty: string) => {
        const qtyPo = parseFloat(qty) || 0;

        // qty_po tidak mempengaruhi perhitungan jumlah
        setCurrentItem({
            ...currentItem,
            qty_po: qtyPo,
            // Tidak mengubah jumlah karena qty_po tidak digunakan dalam perhitungan
        });
    };

    const handleHargaSatuanChange = (harga: string) => {
        const hargaSatuan = parseFloat(harga) || 0;
        const qtyPr = currentItem.purchase_request_items?.qty || 0; // Gunakan qty_pr, bukan qty_po
        const diskon = currentItem.diskon_satuan || 0;

        // Hitung jumlah berdasarkan qty_pr, bukan qty_po
        const jumlah = hargaSatuan * qtyPr * (1 - diskon / 100);

        setCurrentItem({
            ...currentItem,
            harga_satuan: hargaSatuan,
            jumlah: parseFloat(jumlah.toFixed(2)),
        });
    };

     const handleDiskonChange = (diskon: string) => {
         const newDiskon = parseFloat(diskon) || 0;
         const qtyPr = currentItem.purchase_request_items?.qty || 0; // Gunakan qty_pr, bukan qty_po
         const hargaSatuan = currentItem.harga_satuan || 0;

         // Hitung jumlah berdasarkan qty_pr, bukan qty_po
         const jumlah = hargaSatuan * qtyPr * (1 - newDiskon / 100);

         setCurrentItem({
             ...currentItem,
             diskon_satuan: newDiskon,
             jumlah: parseFloat(jumlah.toFixed(2)),
         });
     };

    const handleRemarkChange = (remark: string) => {
        setCurrentItem({ ...currentItem, remark_item_po: remark });
    };

    const handleSaveChanges = () => {
        if (!currentItem.id_satuan_po) {
            toast.error('Harap pilih satuan');
            return;
        }

        if (!currentItem.qty_po || currentItem.qty_po <= 0) {
            toast.error('Harap masukkan jumlah PO yang valid');
            return;
        }

        if (!currentItem.harga_satuan) {
            toast.error('Harap masukkan harga satuan');
            return;
        }

        // Pastikan jumlah dihitung ulang sebelum simpan untuk memastikan nilai terbaru
        const qtyPr = currentItem.purchase_request_items?.qty || 0;
        const hargaSatuan = currentItem.harga_satuan || 0;
        const diskon = currentItem.diskon_satuan || 0;

        const jumlah = hargaSatuan * qtyPr * (1 - diskon / 100);

        const finalItem = {
            ...currentItem,
            jumlah: parseFloat(jumlah.toFixed(2)),
        };

        onSave(finalItem);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Purchase Order Item</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="item-name" className="text-right">
                            Item
                        </Label>
                        <div className="col-span-3">
                            <p className="text-sm font-medium">
                                {currentItem.master_item
                                    ? `${currentItem.master_item.kode_master_item} - ${currentItem.master_item.nama_master_item}`
                                    : 'Item tidak ditemukan'}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="qty-pr" className="text-right">
                            Qty PR
                        </Label>
                        <div className="col-span-3">
                            <p className="text-sm">
                                {currentItem.purchase_request_items?.qty || 0}{' '}
                                {currentItem.purchase_request_items?.master_item?.unit?.nama_satuan || ''}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="qty-po" className="text-right">
                            Qty PO
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="qty-po"
                                type="number"
                                min="0"
                                step="0.01"
                                value={currentItem.qty_po || ''}
                                onChange={(e) => handleQtyPoChange(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        {/* Field 1: Satuan Awal (satuan PR) */}
                        <Label htmlFor="source-unit" className="text-right">
                            Source Unit
                        </Label>
                        <div className="col-span-3">
                            <Input id="source-unit" value={availableConversions[0]?.satuan_satu?.nama_satuan || '-'} disabled />
                        </div>

                        {/* Field 2: Pilih Satuan Tujuan */}
                        <Label htmlFor="unit-conversion" className="text-right">
                            Convert To
                        </Label>
                        <div className="col-span-3">
                            <Select value={selectedConversion || ''} onValueChange={handleConversionSelection} disabled={loading}>
                                <SelectTrigger>
                                    <SelectValue placeholder={loading ? 'Loading...' : 'Select Conversion'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableConversions.map((conversion) => (
                                        <SelectItem key={conversion.id} value={conversion.id}>
                                            {conversion.satuan_dua?.nama_satuan}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Field 3: Jumlah Konversi */}
                        <Label htmlFor="conversion-amount" className="text-right">
                            Conversion Amount
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="conversion-amount"
                                value={availableConversions.find((c) => c.id === selectedConversion)?.jumlah_satuan_konversi || '-'}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Price per Unit
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={currentItem.harga_satuan || ''}
                                onChange={(e) => handleHargaSatuanChange(e.target.value)}
                            />
                            <p className="mt-1 text-xs text-gray-500">Masukkan harga per unit</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="diskon" className="text-right">
                            Diskon
                        </Label>
                        <div className="col-span-3 flex items-center gap-2">
                            <Input
                                id="diskon"
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={currentItem.diskon_satuan || 0}
                                onChange={(e) => handleDiskonChange(e.target.value)}
                            />
                            <span className="text-sm text-gray-500">%</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="jumlah" className="text-right">
                            Total
                        </Label>
                        <div className="col-span-3">
                            <Input id="jumlah" type="number" value={currentItem.jumlah || 0} disabled />
                            <p className="mt-1 text-xs text-gray-500">Total = Harga Satuan × Qty PR × (1 - Diskon/100)</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="remark" className="text-right">
                            Remark PO
                        </Label>
                        <div className="col-span-3">
                            <Textarea id="remark" value={currentItem.remark_item_po || ''} onChange={(e) => handleRemarkChange(e.target.value)} />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSaveChanges} disabled={!currentItem.qty_po || !currentItem.id_satuan_po || loading}>
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
