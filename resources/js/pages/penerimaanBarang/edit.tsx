/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PurchaseOrder } from '@/types/purchaseOrder';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, PencilIcon, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface PenerimaanItem {
    id: string; // id_purchase_order_item
    qty_po: number;
    qty_penerimaan: number;
    qty_penerimaan_sebelumnya: number;
    catatan_item: string;
    tgl_expired: string;
    no_delivery_order: string;
    isEdited: boolean;
    master_item?: {
        nama_master_item: string;
        kode_master_item: string;
    };
    satuan?: {
        nama_satuan: string;
    };
    remark_item_po?: string;
}

interface EditProps {
    penerimaanBarang: any;
    purchaseOrders: PurchaseOrder[];
    previousReceipts: {
        id_purchase_order_item: string;
        total_qty_penerimaan: number;
    }[];
}

export default function Edit({ penerimaanBarang, purchaseOrders, previousReceipts }: EditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Penerimaan Barang', href: '/penerimaanBarangs' },
        { title: 'Edit', href: '#' },
    ];

    const [poItems, setPoItems] = useState<PenerimaanItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEditItem, setCurrentEditItem] = useState<PenerimaanItem | null>(null);

    const { data, setData, put, processing, errors } = useForm({
        no_surat_jalan: penerimaanBarang.no_surat_jalan || '',
        tgl_terima_barang: penerimaanBarang.tgl_terima_barang || '',
        nopol_kendaraan: penerimaanBarang.nopol_kendaraan || '',
        nama_pengirim: penerimaanBarang.nama_pengirim || '',
        catatan_pengirim: penerimaanBarang.catatan_pengirim || '',
        id_purchase_order: penerimaanBarang.id_purchase_order || '',
        items: [] as any[],
    });

    // Inisialisasi item tabel saat load data PO
    useEffect(() => {
        if (data.id_purchase_order) {
            const po = purchaseOrders.find((p) => String(p.id) === String(data.id_purchase_order));
            if (po && po.items) {
                const mappedItems = po.items.map((poItem: any) => {
                    // Cari data item yang sudah tersimpan di LPB ini
                    const existingLpbItem = penerimaanBarang.items.find((item: any) => String(item.id_purchase_order_item) === String(poItem.id));

                    // Cari riwayat penerimaan LPB LAIN untuk item ini
                    const prevOtherLpb = previousReceipts?.find((r) => String(r.id_purchase_order_item) === String(poItem.id));

                    return {
                        id: poItem.id,
                        qty_po: poItem.qty_po,
                        qty_penerimaan: existingLpbItem?.qty_penerimaan || 0,
                        qty_penerimaan_sebelumnya: prevOtherLpb?.total_qty_penerimaan || 0,
                        catatan_item: existingLpbItem?.catatan_item || '',
                        tgl_expired: existingLpbItem?.tgl_expired || '',
                        no_delivery_order: existingLpbItem?.no_delivery_order || '',
                        isEdited: !!existingLpbItem,
                        master_item: poItem.master_item,
                        satuan: poItem.satuan,
                        remark_item_po: poItem.remark_item_po,
                    };
                });
                setPoItems(mappedItems);
            }
        }
    }, [data.id_purchase_order, purchaseOrders]);

    const openEditModal = (item: PenerimaanItem) => {
        setCurrentEditItem({ ...item });
        setIsModalOpen(true);
    };

    const handleUpdateItem = () => {
        if (!currentEditItem) return;

        const updatedPoItems = poItems.map((item) => (item.id === currentEditItem.id ? { ...currentEditItem, isEdited: true } : item));

        setPoItems(updatedPoItems);

        // Update data.items untuk useForm
        const formItems = updatedPoItems
            .filter((item) => item.isEdited && item.qty_penerimaan > 0)
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('penerimaanBarangs.update', penerimaanBarang.id), {
            onSuccess: () => toast.success('Penerimaan barang berhasil diperbarui'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit LPB - ${penerimaanBarang.no_laporan_barang}`} />
            <div className="mx-5 py-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Edit Laporan Penerimaan Barang: {penerimaanBarang.no_laporan_barang}</CardTitle>
                        <Link href={route('penerimaanBarangs.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label>ID Purchase Order</Label>
                                    <Input value={penerimaanBarang.purchase_order?.no_po} disabled className="bg-gray-100" />
                                </div>
                                <div className="space-y-2">
                                    <Label>No. Surat Jalan Kirim *</Label>
                                    <Input
                                        value={data.no_surat_jalan}
                                        onChange={(e) => setData('no_surat_jalan', e.target.value)}
                                        placeholder="Input no surat jalan"
                                    />
                                    {errors.no_surat_jalan && <p className="text-xs text-red-500">{errors.no_surat_jalan}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Tgl. Terima Barang *</Label>
                                    <Input
                                        type="date"
                                        value={data.tgl_terima_barang}
                                        onChange={(e) => setData('tgl_terima_barang', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label>Nopol Kendaraan *</Label>
                                    <Input value={data.nopol_kendaraan} onChange={(e) => setData('nopol_kendaraan', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Nama Pengirim *</Label>
                                    <Input value={data.nama_pengirim} onChange={(e) => setData('nama_pengirim', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Catatan Pengirim</Label>
                                    <Textarea value={data.catatan_pengirim} onChange={(e) => setData('catatan_pengirim', e.target.value)} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="border-b pb-2 text-lg font-medium text-blue-600">Data Item Purchase Order</h3>
                                <div className="overflow-x-auto rounded-md border">
                                    <Table>
                                        <TableHeader className="bg-gray-50">
                                            <TableRow>
                                                <TableHead className="w-12">No</TableHead>
                                                <TableHead>Kode - Nama Item</TableHead>
                                                <TableHead>Qty PO</TableHead>
                                                {/* <TableHead>Diterima Sebelumnya</TableHead> */}
                                                <TableHead className="text-blue-600">Qty Terima Sekarang</TableHead>
                                                <TableHead>Catatan</TableHead>
                                                <TableHead>Exp | DO</TableHead>
                                                <TableHead className="w-20">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {poItems.map((item, index) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>
                                                        <div className="font-medium">{item.master_item?.nama_master_item}</div>
                                                        <div className="font-mono text-xs text-gray-500">{item.master_item?.kode_master_item}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.qty_po} {item.satuan?.nama_satuan}
                                                    </TableCell>
                                                    {/* <TableCell>
                                                        {item.qty_penerimaan_sebelumnya} {item.satuan?.nama_satuan}
                                                    </TableCell> */}
                                                    <TableCell className="font-bold text-blue-600">
                                                        {item.qty_penerimaan} {item.satuan?.nama_satuan}
                                                    </TableCell>
                                                    <TableCell className="max-w-[150px] truncate">{item.catatan_item || '-'}</TableCell>
                                                    <TableCell>
                                                        <div className="text-xs">{item.tgl_expired || '-'}</div>
                                                        <div className="text-xs font-semibold">{item.no_delivery_order || '-'}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button type="button" variant="outline" size="sm" onClick={() => openEditModal(item)}>
                                                            <PencilIcon className="h-4 w-4 text-blue-600" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button type="submit" disabled={processing} className="bg-green-600 hover:bg-green-700">
                                    <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Modal Edit Item */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Form Penerimaan: {currentEditItem?.master_item?.nama_master_item}</DialogTitle>
                    </DialogHeader>
                    {currentEditItem && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-xs text-gray-500">Qty Purchase Order</Label>
                                    <p className="font-mono font-medium">{currentEditItem.qty_po}</p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-gray-500">Diterima Sebelumnya</Label>
                                    <p className="font-mono font-medium">{currentEditItem.qty_penerimaan_sebelumnya}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Qty Penerimaan Sekarang *</Label>
                                <Input
                                    type="number"
                                    value={currentEditItem.qty_penerimaan}
                                    onChange={(e) => setCurrentEditItem({ ...currentEditItem, qty_penerimaan: parseFloat(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Catatan Item</Label>
                                <Input
                                    value={currentEditItem.catatan_item}
                                    onChange={(e) => setCurrentEditItem({ ...currentEditItem, catatan_item: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Tgl. Expired</Label>
                                    <Input
                                        type="date"
                                        value={currentEditItem.tgl_expired}
                                        onChange={(e) => setCurrentEditItem({ ...currentEditItem, tgl_expired: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>No. Delivery Order</Label>
                                    <Input
                                        value={currentEditItem.no_delivery_order}
                                        onChange={(e) => setCurrentEditItem({ ...currentEditItem, no_delivery_order: e.target.value })}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                                    Batal
                                </Button>
                                <Button onClick={handleUpdateItem}>Proses</Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
