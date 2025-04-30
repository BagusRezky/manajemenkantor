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

    const calculatePrice = (conversionRate: number) => {
        const qtyPr = currentItem.purchase_request_items?.qty || 0;
        const diskon = currentItem.diskon_satuan || 0;

        if (qtyPr === 0) return;

        const pricePerUnit = conversionRate / qtyPr;
        const total = pricePerUnit * qtyPr * (1 - diskon / 100);

        setCurrentItem({
            ...currentItem,
            harga_satuan: parseFloat(pricePerUnit.toFixed(2)),
            jumlah: parseFloat(total.toFixed(2)),
        });
    };

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

        const qtyPr = currentItem.purchase_request_items?.qty || 1; // Quantity PR
        const conversionRate = parseFloat(conversion.jumlah_satuan_konversi) || 1; // Jumlah konversi

        // Debug: Log nilai qtyPr dan conversionRate
        console.log('qtyPr:', qtyPr, 'conversionRate:', conversionRate);

        // Validasi harga satuan, pastikan tidak ada pembagian dengan 0
        if (qtyPr <= 0 || conversionRate <= 0) {
            toast.error('Invalid quantity or conversion rate.');
            return;
        }

        const hargaSatuan = conversionRate / qtyPr;
        console.log('hargaSatuan:', hargaSatuan); // Debug: Log hargaSatuan

        // Perhitungan jumlah
        const diskon = currentItem.diskon_satuan || 0;
        const jumlah = hargaSatuan * qtyPr * (1 - diskon / 100);

        // Debug: Log jumlah sebelum dibatasi
        console.log('jumlah before discount:', jumlah);

        // Pastikan jumlah tidak negatif
        const finalJumlah = Math.max(jumlah, 0);

        // Debug: Log finalJumlah setelah pembatasan
        console.log('finalJumlah:', finalJumlah);

        const updatedItem = {
            ...currentItem,
            id_satuan_po: conversion.satuan_dua_id,
            satuan: conversion.satuan_dua,
            master_konversi: conversion,
            harga_satuan: parseFloat(hargaSatuan.toFixed(2)),
            jumlah: parseFloat(finalJumlah.toFixed(2)),
        };

        setCurrentItem(updatedItem);
    };

    const handleQtyPoChange = (qty: string) => {
        const qtyPo = parseFloat(qty) || 0;
        const qtyPr = currentItem.purchase_request_items?.qty || 1;
        const conversionRate = parseFloat(currentItem.master_konversi?.jumlah_satuan_konversi || '1') || 1;
        const hargaSatuan = conversionRate / qtyPr;
        const jumlah = hargaSatuan * qtyPr * (1 - (currentItem.diskon_satuan || 0) / 100);

        setCurrentItem({
            ...currentItem,
            qty_po: qtyPo,
            harga_satuan: parseFloat(hargaSatuan.toFixed(2)),
            jumlah: parseFloat(jumlah.toFixed(2)),
        });
    };

    const handleDiskonChange = (diskon: string) => {
        const newDiskon = parseFloat(diskon) || 0;
        const qtyPr = currentItem.purchase_request_items?.qty || 0;
        const totalHarga = (currentItem.harga_satuan || 0) * qtyPr;
        const totalSetelahDiskon = totalHarga * (1 - newDiskon / 100);

        setCurrentItem({
            ...currentItem,
            diskon_satuan: newDiskon,
            jumlah: parseFloat(totalSetelahDiskon.toFixed(2)),
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

        const qtyPr = currentItem.purchase_request_items?.qty || 0;
        const subtotal = (currentItem.harga_satuan || 0) * qtyPr;
        const total = subtotal * (1 - (currentItem.diskon_satuan || 0) / 100);

        const finalItem = {
            ...currentItem,
            jumlah: parseFloat(total.toFixed(2)),
        };

        onSave(finalItem); // Pastikan ini dipanggil untuk menyimpan perubahan
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
                            <Input id="price" type="number" min="0" step="0.01" value={currentItem.harga_satuan || 0} disabled />
                            <p className="mt-1 text-xs text-gray-500">Price per unit = jumlah konversi / qty PR</p>
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
