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
     const [qtyAfterConversion, setQtyAfterConversion] = useState<number>(0);
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
         if (!isOpen) {
             setSelectedConversion(null);
             setQtyAfterConversion(0);
         }
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

    const calculateValues = (
        conversionAmount: number,
        qtyPR: number,
        hargaSatuan: number,
        diskon: number
    ) => {
        // Hitung qty after conversion (qty PR / conversion amount)
        const afterConversion = conversionAmount > 0 ? qtyPR / conversionAmount : 0;

        // Hitung jumlah (total) berdasarkan harga satuan × qty after conversion × (1 - diskon/100)
        const jumlah = hargaSatuan * afterConversion * (1 - diskon / 100);

        return {
            qtyAfterConversion: parseFloat(afterConversion.toFixed(3)),
            jumlah: parseFloat(jumlah.toFixed(2))
        };
    };

    const handleConversionSelection = (conversionId: string) => {
        setSelectedConversion(conversionId);

        const conversion = availableConversions.find((c) => c.id === conversionId);
        if (!conversion) return;

        const qtyPR = currentItem.purchase_request_items?.qty || 0;
        const conversionAmount = parseFloat(conversion.jumlah_satuan_konversi) || 0;
        const hargaSatuan = currentItem.harga_satuan || 0;
        const diskon = currentItem.diskon_satuan || 0;

        // Hitung nilai-nilai yang dibutuhkan
        const { qtyAfterConversion, jumlah } = calculateValues(conversionAmount, qtyPR, hargaSatuan, diskon);

        // Simpan qty after conversion untuk ditampilkan
        setQtyAfterConversion(qtyAfterConversion);

        // Update item dengan nilai-nilai baru
        const updatedItem = {
            ...currentItem,
            id_satuan_po: conversion.satuan_dua_id,
            satuan: conversion.satuan_dua,
            master_konversi: conversion,
            qty_after_conversion: qtyAfterConversion,
            jumlah: jumlah,
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
        const conversion = availableConversions.find((c) => c.id === selectedConversion);

        if (!conversion) return;

        const qtyPR = currentItem.purchase_request_items?.qty || 0;
        const conversionAmount = parseFloat(conversion.jumlah_satuan_konversi) || 0;
        const diskon = currentItem.diskon_satuan || 0;

        // Hitung nilai-nilai yang dibutuhkan
        const { jumlah } = calculateValues(conversionAmount, qtyPR, hargaSatuan, diskon);

        setCurrentItem({
            ...currentItem,
            harga_satuan: hargaSatuan,
            jumlah: jumlah,
        });
    };

     const handleDiskonChange = (diskon: string) => {
         const newDiskon = parseFloat(diskon) || 0;
         const conversion = availableConversions.find((c) => c.id === selectedConversion);

         if (!conversion) return;

         const qtyPR = currentItem.purchase_request_items?.qty || 0;
         const conversionAmount = parseFloat(conversion.jumlah_satuan_konversi) || 0;
         const hargaSatuan = currentItem.harga_satuan || 0;

         // Hitung nilai-nilai yang dibutuhkan
         const { jumlah } = calculateValues(conversionAmount, qtyPR, hargaSatuan, newDiskon);

         setCurrentItem({
             ...currentItem,
             diskon_satuan: newDiskon,
             jumlah: jumlah,
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

        const conversion = availableConversions.find((c) => c.id === selectedConversion);
        if (!conversion) {
            toast.error('Data konversi tidak valid');
            return;
        }

        // Hitung ulang jumlah untuk memastikan nilai terbaru
        const qtyPR = currentItem.purchase_request_items?.qty || 0;
        const conversionAmount = parseFloat(conversion.jumlah_satuan_konversi) || 0;
        const hargaSatuan = currentItem.harga_satuan || 0;
        const diskon = currentItem.diskon_satuan || 0;

        const { qtyAfterConversion, jumlah } = calculateValues(conversionAmount, qtyPR, hargaSatuan, diskon);

        const finalItem = {
            ...currentItem,
            qty_after_conversion: qtyAfterConversion,
            jumlah: jumlah,
        };

        onSave(finalItem);
        setIsOpen(false);
    };

    const selectedConversionData = availableConversions.find((c) => c.id === selectedConversion);
    const conversionAmount = selectedConversionData ? parseFloat(selectedConversionData.jumlah_satuan_konversi) || 0 : 0;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[900px]">
                <DialogHeader>
                    <DialogTitle>Edit Purchase Order Item</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 gap-6 py-4 md:grid-cols-2">
                    {/* Kolom kiri */}
                    <div className="space-y-4">
                        {/* Item */}
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

                        {/* Qty PO */}
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

                        {/* Convert To */}
                        <div className="grid grid-cols-4 items-center gap-4">
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
                        </div>

                        {/* Conversion Amount */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="conversion-amount" className="text-right">
                                Conversion Amount
                            </Label>
                            <div className="col-span-3">
                                <Input id="conversion-amount" value={conversionAmount || '-'} disabled />
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="qty-after-conversion" className="text-right">
                                Qty After Conversion
                            </Label>
                            <div className="col-span-3">
                                <Input id="qty-after-conversion" value={qtyAfterConversion || 0} disabled />
                                <p className="mt-1 text-xs text-gray-500">
                                    {currentItem.purchase_request_items?.qty || 0} {availableConversions[0]?.satuan_satu?.nama_satuan || ''} =
                                    {qtyAfterConversion} {selectedConversionData?.satuan_dua?.nama_satuan || ''}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Kolom kanan */}
                    <div className="space-y-4">
                        {/* Qty PR */}
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

                        {/* Harga Satuan */}
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

                        {/* Diskon */}
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
                                    value={currentItem.diskon_satuan || ''}
                                    onChange={(e) => handleDiskonChange(e.target.value)}
                                />
                                <span className="text-sm text-gray-500">%</span>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="jumlah" className="text-right">
                                Total
                            </Label>
                            <div className="col-span-3">
                                <Input id="jumlah" type="number" value={currentItem.jumlah || 0} disabled />
                                <p className="mt-1 text-xs text-gray-500">Total = Harga Satuan × Qty After Conversion × (1 - Diskon/100)</p>
                            </div>
                        </div>

                        {/* Remark */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="remark" className="text-right">
                                Remark PO
                            </Label>
                            <div className="col-span-3">
                                <Textarea id="remark" value={currentItem.remark_item_po || ''} onChange={(e) => handleRemarkChange(e.target.value)} />
                            </div>
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
