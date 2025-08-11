import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MasterKonversi } from '@/types/masterKonversi';
import { Textarea } from '@headlessui/react';

import { useEffect, useState } from 'react';

import { toast } from 'sonner';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface EditItemModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    currentItem: any;
    setCurrentItem: (item: any) => void;
    onSave: (item: any) => void;
}

export default function EditItemModal({ isOpen, setIsOpen, currentItem, setCurrentItem, onSave }: EditItemModalProps) {
    const [availableConversions, setAvailableConversions] = useState<MasterKonversi[]>([]);
    const [selectedConversion, setSelectedConversion] = useState<string | null>(null);
    const [qtyAfterConversion, setQtyAfterConversion] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Fetch dan setup data saat modal dibuka
    useEffect(() => {
        console.log('Modal opened with item:', currentItem);
        setErrorMessage(null);

        if (isOpen && currentItem) {
            try {
                // Item ID untuk konversi
                const itemId = currentItem.id_master_item;

                // Unit ID harus dari purchase request item
                let unitId = null;
                if (currentItem.purchaseRequestItem?.master_item?.unit?.id) {
                    unitId = currentItem.purchaseRequestItem.master_item.unit.id;
                }

                console.log('Units for conversion:', { itemId, unitId });

                if (itemId && unitId) {
                    fetchConversions(itemId, unitId);

                    // Jika sudah ada id_satuan_po, set selectedConversion
                    if (currentItem.id_satuan_po) {
                        console.log('Item already has satuan_po:', currentItem.id_satuan_po);

                        // Akan diset setelah fetch conversions berhasil
                    }
                } else {
                    console.error('Data tidak lengkap:', { itemId, unitId, currentItem });
                    setErrorMessage('Data tidak lengkap untuk mengambil konversi');
                    toast.error('Data tidak lengkap untuk mengambil konversi');
                }
            } catch (error) {
                console.error('Error in useEffect:', error);

                toast.error('Terjadi kesalahan saat memuat data');
            }
        }

        if (!isOpen) {
            setSelectedConversion(null);
            setQtyAfterConversion(0);
            setAvailableConversions([]);
        }
    }, [isOpen, currentItem]);

    // Fetch data konversi dari API
    const fetchConversions = async (itemId: string, unitId: string) => {
        try {
            setLoading(true);
            console.log(`Fetching conversions for itemId=${itemId}, unitId=${unitId}`);

            const response = await fetch(route('purchaseOrders.getUnitConversions', [itemId, unitId]), {
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch conversions: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Conversion data received:', data);

            setAvailableConversions(data.conversions || []);

            // Jika sudah ada satuan yang dipilih sebelumnya, pilih konversi yang sesuai
            if (currentItem.id_satuan_po) {
                const matchingConversion = data.conversions.find((conv: MasterKonversi) => conv.satuan_dua_id === currentItem.id_satuan_po);

                if (matchingConversion) {
                    console.log('Found matching conversion:', matchingConversion);
                    setSelectedConversion(matchingConversion.id);

                    // Pre-calculate qty after conversion
                    if (currentItem.qty_po) {
                        const convAmount = parseFloat(matchingConversion.jumlah_satuan_konversi) || 0;
                        const afterConversion = convAmount > 0 ? currentItem.qty_po / convAmount : 0;
                        setQtyAfterConversion(parseFloat(afterConversion.toFixed(3)));

                        // Update current item dengan conversion
                        setCurrentItem({
                            ...currentItem,
                            qty_after_conversion: parseFloat(afterConversion.toFixed(3)),
                            master_konversi: matchingConversion,
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching conversions:', error);

            toast.error('Gagal memuat data konversi');
        } finally {
            setLoading(false);
        }
    };

    // Fungsi untuk menghitung qty after conversion dan jumlah
    const calculateValues = (conversionAmount: number, qtyPO: number, hargaSatuan: number, diskon: number) => {
        // Qty After Conversion = Qty PO / Conversion Amount
        const afterConversion = conversionAmount > 0 ? qtyPO / conversionAmount : 0;

        // Jumlah = Harga Satuan × Qty After Conversion × (1 - Diskon/100)
        const jumlah = hargaSatuan * afterConversion * (1 - diskon / 100);

        return {
            qtyAfterConversion: parseFloat(afterConversion.toFixed(3)),
            jumlah: parseFloat(jumlah.toFixed(2)),
        };
    };

    // Handler untuk pemilihan konversi
    const handleConversionSelection = (conversionId: string) => {
        try {
            setSelectedConversion(conversionId);

            const conversion = availableConversions.find((c) => c.id === conversionId);
            if (!conversion) {
                toast.error('Konversi tidak ditemukan');
                return;
            }

            // Update item dengan satuan tujuan
            const updatedItem = {
                ...currentItem,
                id_satuan_po: conversion.satuan_dua_id,
                satuan: conversion.satuan_dua,
                master_konversi: conversion,
            };

            setCurrentItem(updatedItem);

            // Recalculate if we have qty_po
            if (updatedItem.qty_po && conversion) {
                const qtyPO = updatedItem.qty_po || 0;
                const conversionAmount = parseFloat(conversion.jumlah_satuan_konversi) || 0;
                const hargaSatuan = updatedItem.harga_satuan || 0;
                const diskon = updatedItem.diskon_satuan || 0;

                const { qtyAfterConversion, jumlah } = calculateValues(conversionAmount, qtyPO, hargaSatuan, diskon);

                setQtyAfterConversion(qtyAfterConversion);

                setCurrentItem({
                    ...updatedItem,
                    qty_after_conversion: qtyAfterConversion,
                    jumlah: jumlah,
                });
            }
        } catch (error) {
            console.error('Error in conversion selection:', error);
            toast.error(`Error saat memilih konversi`);
        }
    };

    // Handler untuk perubahan qty PO
    const handleQtyPoChange = (qty: string) => {
        try {
            const qtyPO = parseFloat(qty) || 0;
            const qtyPR = currentItem.purchaseRequestItem?.qty || 0;

            // Validasi: Qty PO tidak boleh lebih dari Qty PR
            if (qtyPO > qtyPR) {
                toast.error(`Qty PO tidak boleh melebihi Qty PR (${qtyPR})`);
                return;
            }

            const conversion = availableConversions.find((c) => c.id === selectedConversion);
            if (!conversion) {
                setCurrentItem({
                    ...currentItem,
                    qty_po: qtyPO,
                });
                return;
            }

            const conversionAmount = parseFloat(conversion.jumlah_satuan_konversi) || 0;
            const hargaSatuan = currentItem.harga_satuan || 0;
            const diskon = currentItem.diskon_satuan || 0;

            // Hitung qty after conversion dan jumlah berdasarkan qty PO baru
            const { qtyAfterConversion, jumlah } = calculateValues(conversionAmount, qtyPO, hargaSatuan, diskon);

            setQtyAfterConversion(qtyAfterConversion);

            setCurrentItem({
                ...currentItem,
                qty_po: qtyPO,
                qty_after_conversion: qtyAfterConversion,
                jumlah: jumlah,
            });
        } catch (error) {
            console.error('Error changing qty:', error);
            toast.error(`Error saat mengubah quantity`);
        }
    };

    // Handler untuk perubahan harga satuan
    const handleHargaSatuanChange = (harga: string) => {
        try {
            const hargaSatuan = parseFloat(harga) || 0;
            const conversion = availableConversions.find((c) => c.id === selectedConversion);

            if (!conversion) {
                setCurrentItem({
                    ...currentItem,
                    harga_satuan: hargaSatuan,
                });
                return;
            }

            const qtyPO = currentItem.qty_po || 0;
            const conversionAmount = parseFloat(conversion.jumlah_satuan_konversi) || 0;
            const diskon = currentItem.diskon_satuan || 0;

            // Hitung ulang jumlah dengan harga satuan baru
            const { jumlah } = calculateValues(conversionAmount, qtyPO, hargaSatuan, diskon);

            setCurrentItem({
                ...currentItem,
                harga_satuan: hargaSatuan,
                jumlah: jumlah,
            });
        } catch (error) {
            console.error('Error changing price:', error);
            toast.error(`Error saat mengubah harga`);
        }
    };

    // Handler untuk perubahan diskon
    const handleDiskonChange = (diskon: string) => {
        try {
            const newDiskon = parseFloat(diskon) || 0;
            const conversion = availableConversions.find((c) => c.id === selectedConversion);

            if (!conversion) {
                setCurrentItem({
                    ...currentItem,
                    diskon_satuan: newDiskon,
                });
                return;
            }

            const qtyPO = currentItem.qty_po || 0;
            const conversionAmount = parseFloat(conversion.jumlah_satuan_konversi) || 0;
            const hargaSatuan = currentItem.harga_satuan || 0;

            // Hitung ulang jumlah dengan diskon baru
            const { jumlah } = calculateValues(conversionAmount, qtyPO, hargaSatuan, newDiskon);

            setCurrentItem({
                ...currentItem,
                diskon_satuan: newDiskon,
                jumlah: jumlah,
            });
        } catch (error) {
            console.error('Error changing discount:', error);
            toast.error(`Error saat mengubah diskon`);
        }
    };

    // Handler untuk perubahan remark
    const handleRemarkChange = (remark: string) => {
        setCurrentItem({ ...currentItem, remark_item_po: remark });
    };

    // Handler untuk menyimpan perubahan
    const handleSaveChanges = () => {
        try {
            if (!currentItem.id_satuan_po) {
                toast.error('Harap pilih satuan');
                return;
            }

            if (!currentItem.qty_po || currentItem.qty_po <= 0) {
                toast.error('Harap masukkan jumlah PO yang valid');
                return;
            }

            const qtyPR = currentItem.purchaseRequestItem?.qty || 0;
            if (currentItem.qty_po > qtyPR) {
                toast.error(`Qty PO tidak boleh melebihi Qty PR (${qtyPR})`);
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
            const qtyPO = currentItem.qty_po || 0;
            const conversionAmount = parseFloat(conversion.jumlah_satuan_konversi) || 0;
            const hargaSatuan = currentItem.harga_satuan || 0;
            const diskon = currentItem.diskon_satuan || 0;

            const { qtyAfterConversion, jumlah } = calculateValues(conversionAmount, qtyPO, hargaSatuan, diskon);

            const finalItem = {
                ...currentItem,
                qty_after_conversion: qtyAfterConversion,
                jumlah: jumlah,
                // Pastikan data ini juga terisi
                id_satuan_po: conversion.satuan_dua_id,
                satuan: conversion.satuan_dua,
                master_konversi: conversion,
            };

            console.log('Final item to save:', finalItem);
            onSave(finalItem);
            setIsOpen(false);
        } catch (error) {
            console.error('Error saving changes:', error);
            toast.error(`Error saat menyimpan perubahan`);
        }
    };

    // Data untuk tampilan
    const selectedConversionData = availableConversions.find((c) => c.id === selectedConversion);
    const conversionAmount = selectedConversionData ? parseFloat(selectedConversionData.jumlah_satuan_konversi) || 0 : 0;
    const maxQtyPO = currentItem?.purchaseRequestItem?.qty || 0;

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                // Konfirmasi jika ada error
                if (!open && errorMessage) {
                    if (confirm('Terdapat error pada form. Apakah Anda yakin ingin menutup?')) {
                        setIsOpen(false);
                    }
                    return;
                }
                setIsOpen(open);
            }}
        >
            <DialogContent className="sm:max-w-[900px]">
                <DialogHeader>
                    <DialogTitle>Edit Purchase Order Item</DialogTitle>
                    {errorMessage && <div className="mt-2 rounded bg-red-100 p-2 text-red-600">Error: {errorMessage}</div>}
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
                                    {currentItem?.master_item
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
                                    max={maxQtyPO}
                                    step="0.01"
                                    value={currentItem?.qty_po || ''}
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
                                    {currentItem?.purchaseRequestItem?.qty || 0} {availableConversions[0]?.satuan_satu?.nama_satuan || ''} =
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
                                    {currentItem?.purchaseRequestItem?.qty || 0}{' '}
                                    {currentItem?.purchaseRequestItem?.master_item?.unit?.nama_satuan || ''}
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
                                    value={currentItem?.harga_satuan || ''}
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
                                    value={currentItem?.diskon_satuan || ''}
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
                                <Input id="jumlah" type="number" value={currentItem?.jumlah || 0} disabled />
                                <p className="mt-1 text-xs text-gray-500">Total = Harga Satuan × Qty After Conversion × (1 - Diskon/100)</p>
                            </div>
                        </div>

                        {/* Remark */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="remark" className="text-right">
                                Remark PO
                            </Label>
                            <div className="col-span-3">
                                <Textarea
                                    id="remark"
                                    value={currentItem?.remark_item_po || ''}
                                    onChange={(e) => handleRemarkChange(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSaveChanges} disabled={!currentItem?.qty_po || !currentItem?.id_satuan_po || loading}>
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
