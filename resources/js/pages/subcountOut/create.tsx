/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchableSelect } from '@/components/search-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { KartuInstruksiKerja } from '@/types/kartuInstruksiKerja';
import { Supplier } from '@/types/supplier';
import { Unit } from '@/types/unit';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Subcount Out',
        href: '/subcountOuts',
    },
    {
        title: 'Tambah',
        href: '#',
    },
];

interface SubcountOutItem {
    id_kartu_instruksi_kerja: string;
    id_unit: string;
    qty: number;
    keterangan: string;
    nama_produk?: string;
    no_kik?: string;
    nama_satuan?: string;
    [key: string]: any; // Allow additional properties for display purposes
}

interface CreateProps {
    suppliers: Supplier[];
    kartuInstruksiKerjas: KartuInstruksiKerja[];
    units: Unit[];
}

export default function Create({ suppliers, kartuInstruksiKerjas, units }: CreateProps) {
    const [items, setItems] = useState<SubcountOutItem[]>([]);
    const [currentItem, setCurrentItem] = useState<SubcountOutItem>({
        id_kartu_instruksi_kerja: '',
        id_unit: '',
        qty: 0,
        keterangan: '',
    });

    const { data, setData, post, processing, errors } = useForm({
        // no_subcount_out: '',
        tgl_subcount_out: '',
        id_supplier: '',
        admin_produksi: '',
        supervisor: '',
        admin_mainstore: '',
        keterangan: '',
        items: [] as SubcountOutItem[],
    });

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().split('T')[0];
    };

    const addItem = () => {
        // Validasi item sebelum ditambahkan
        if (!currentItem.id_kartu_instruksi_kerja) {
            toast.error('Pilih No.KIK terlebih dahulu');
            return;
        }
        if (!currentItem.id_unit) {
            toast.error('Pilih satuan terlebih dahulu');
            return;
        }
        if (!currentItem.qty || currentItem.qty <= 0) {
            toast.error('Masukkan qty yang valid');
            return;
        }

        // Cek apakah item sudah ada
        const existingItemIndex = items.findIndex(
            (item) => item.id_kartu_instruksi_kerja === currentItem.id_kartu_instruksi_kerja && item.id_unit === currentItem.id_unit,
        );

        if (existingItemIndex >= 0) {
            toast.error('Item dengan KIK dan satuan yang sama sudah ada');
            return;
        }

        // Get display data
        const selectedKik = kartuInstruksiKerjas.find((kik) => kik.id === currentItem.id_kartu_instruksi_kerja);
        const selectedUnit = units.find((unit) => unit.id === currentItem.id_unit);

        const newItem: SubcountOutItem = {
            ...currentItem,
            nama_produk: selectedKik?.sales_order?.finish_good_item?.nama_barang || '',
            no_kik: selectedKik?.no_kartu_instruksi_kerja || '',
            nama_satuan: selectedUnit?.nama_satuan || '',
        };

        setItems([...items, newItem]);

        // Reset current item
        setCurrentItem({
            id_kartu_instruksi_kerja: '',
            id_unit: '',
            qty: 0,
            keterangan: '',
        });

        toast.success('Item berhasil ditambahkan');
    };

    const removeItem = (index: number) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
        toast.success('Item berhasil dihapus');
    };

    const resetItems = () => {
        setItems([]);
        setCurrentItem({
            id_kartu_instruksi_kerja: '',
            id_unit: '',
            qty: 0,
            keterangan: '',
        });
        toast.success('Semua item berhasil direset');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (items.length === 0) {
            toast.error('Tambahkan minimal satu item');
            return;
        }

        // Prepare items data
        const itemsData = items.map((item) => ({
            id_kartu_instruksi_kerja: item.id_kartu_instruksi_kerja,
            id_unit: item.id_unit,
            qty: item.qty,
            keterangan: item.keterangan,
        }));

        // Prepare complete form data
        const formData = {
            ...data,
            items: itemsData,
        };

        // Submit using router.post directly with complete data
        router.post(route('subcountOuts.store'), formData, {
            onSuccess: () => {
                toast.success('Subcount Out berhasil dibuat');
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
                toast.error('Gagal membuat Subcount Out');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Subcount Out" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tambah Subcount Out</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Header Information */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    {/* No Subcount Out
                                    <div className="space-y-2">
                                        <Label htmlFor="no_subcount_out">
                                            No. Surat Jalan Subcont <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="no_subcount_out"
                                            value={data.no_subcount_out}
                                            onChange={(e) => setData('no_subcount_out', e.target.value)}
                                            placeholder="SUB-OUT/07-2025/000096"
                                            className={errors.no_subcount_out ? 'border-red-500' : ''}
                                        />
                                        {errors.no_subcount_out && <p className="text-sm text-red-500">{errors.no_subcount_out}</p>}
                                    </div> */}

                                    {/* Tanggal */}
                                    <div className="space-y-2">
                                        <Label htmlFor="tgl_subcount_out">
                                            Tgl.Surat Jalan Subcont <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="tgl_subcount_out"
                                            type="date"
                                            value={formatDate(data.tgl_subcount_out)}
                                            onChange={(e) => setData('tgl_subcount_out', e.target.value)}
                                            className={errors.tgl_subcount_out ? 'border-red-500' : ''}
                                        />
                                        {errors.tgl_subcount_out && <p className="text-sm text-red-500">{errors.tgl_subcount_out}</p>}
                                    </div>

                                    {/* Supplier */}
                                    <div className="space-y-2">
                                        <Label htmlFor="id_supplier">
                                            Supplier <span className="text-red-500">*</span>
                                        </Label>
                                        <Select value={data.id_supplier} onValueChange={(value) => setData('id_supplier', value)}>
                                            <SelectTrigger className={errors.id_supplier ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Input Supplier" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {suppliers.map((supplier) => (
                                                    <SelectItem key={supplier.id} value={supplier.id}>
                                                        {supplier.nama_suplier}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.id_supplier && <p className="text-sm text-red-500">{errors.id_supplier}</p>}
                                    </div>

                                    {/* Admin Produksi */}
                                    <div className="space-y-2">
                                        <Label htmlFor="admin_produksi">
                                            Admin Produksi <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="admin_produksi"
                                            value={data.admin_produksi}
                                            onChange={(e) => setData('admin_produksi', e.target.value)}
                                            placeholder="input admin produksi"
                                            className={errors.admin_produksi ? 'border-red-500' : ''}
                                        />
                                        {errors.admin_produksi && <p className="text-sm text-red-500">{errors.admin_produksi}</p>}
                                    </div>

                                    {/* Supervisor */}
                                    <div className="space-y-2">
                                        <Label htmlFor="supervisor">
                                            Supervisor / Forman <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="supervisor"
                                            value={data.supervisor}
                                            onChange={(e) => setData('supervisor', e.target.value)}
                                            placeholder="input supervisor / forman"
                                            className={errors.supervisor ? 'border-red-500' : ''}
                                        />
                                        {errors.supervisor && <p className="text-sm text-red-500">{errors.supervisor}</p>}
                                    </div>

                                    {/* Admin Mainstore */}
                                    <div className="space-y-2">
                                        <Label htmlFor="admin_mainstore">
                                            Admin Mainstore <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="admin_mainstore"
                                            value={data.admin_mainstore}
                                            onChange={(e) => setData('admin_mainstore', e.target.value)}
                                            placeholder="input admin mainstore"
                                            className={errors.admin_mainstore ? 'border-red-500' : ''}
                                        />
                                        {errors.admin_mainstore && <p className="text-sm text-red-500">{errors.admin_mainstore}</p>}
                                    </div>
                                </div>

                                {/* Keterangan */}
                                <div className="space-y-2">
                                    <Label htmlFor="keterangan">Keterangan Surat Jalan Subcont</Label>
                                    <Textarea
                                        id="keterangan"
                                        value={data.keterangan}
                                        onChange={(e) => setData('keterangan', e.target.value)}
                                        placeholder="keterangan surat jalan subcont"
                                        className={errors.keterangan ? 'border-red-500' : ''}
                                    />
                                    {errors.keterangan && <p className="text-sm text-red-500">{errors.keterangan}</p>}
                                </div>

                                {/* Form Items Subcont Out */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Form Items Subcont Out</h3>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        {/* No.KIK */}
                                        <div className="space-y-2">
                                            <Label htmlFor="id_kartu_instruksi_kerja">No.SPK</Label>
                                            <SearchableSelect
                                                items={kartuInstruksiKerjas.map((kik) => ({
                                                    key: String(kik.id),
                                                    value: String(kik.id),
                                                    label: `${kik.no_kartu_instruksi_kerja}`,
                                                }))}
                                                value={currentItem.id_kartu_instruksi_kerja}
                                                placeholder="Pilih SPK..."
                                                onChange={(value) => setCurrentItem({ ...currentItem, id_kartu_instruksi_kerja: value })}
                                            />
                                        </div>

                                        {/* Qty */}
                                        <div className="space-y-2">
                                            <Label htmlFor="qty">Qty</Label>
                                            <Input
                                                id="qty"
                                                type="number"
                                                min="1"
                                                value={currentItem.qty || ''}
                                                onChange={(e) => setCurrentItem({ ...currentItem, qty: parseInt(e.target.value) || 0 })}
                                                placeholder="input qty"
                                            />
                                        </div>

                                        {/* Satuan */}
                                        <div className="space-y-2">
                                            <Label htmlFor="id_unit">Satuan Qty</Label>
                                            <SearchableSelect
                                                items={units.map((unit) => ({
                                                    key: String(unit.id),
                                                    value: String(unit.id),
                                                    label: unit.nama_satuan,
                                                }))}
                                                value={currentItem.id_unit}
                                                placeholder="Input Satuan"
                                                onChange={(value) => setCurrentItem({ ...currentItem, id_unit: value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Nama Produk (Auto fill) */}
                                    <div className="space-y-2">
                                        <Label htmlFor="nama_produk">Nama Produk</Label>
                                        <Input
                                            id="nama_produk"
                                            value={
                                                currentItem.id_kartu_instruksi_kerja
                                                    ? kartuInstruksiKerjas.find(
                                                          (kik) => String(kik.id) === String(currentItem.id_kartu_instruksi_kerja),
                                                      )?.sales_order?.finish_good_item?.nama_barang || ''
                                                    : ''
                                            }
                                            readOnly
                                            placeholder="auto"
                                            className="bg-gray-100"
                                        />
                                    </div>

                                    {/* Catatan Item */}
                                    <div className="space-y-2">
                                        <Label htmlFor="keterangan_item">Catatan Item</Label>
                                        <Input
                                            id="keterangan_item"
                                            value={currentItem.keterangan}
                                            onChange={(e) => setCurrentItem({ ...currentItem, keterangan: e.target.value })}
                                            placeholder="catatan item"
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <Button type="button" onClick={addItem} className="bg-blue-500 hover:bg-blue-600">
                                            <Plus className="mr-2 h-4 w-4" />
                                            TAMBAH ITEM
                                        </Button>
                                        <Button type="button" onClick={resetItems} variant="outline">
                                            RESET ITEM
                                        </Button>
                                    </div>
                                </div>

                                {/* Data Items Table */}
                                <div className="space-y-4">
                                    <div className="rounded-md bg-gray-800 p-4 text-center text-white">
                                        <h3 className="text-lg font-medium">DATA ITEMS SUBCONT OUT</h3>
                                    </div>

                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>No</TableHead>
                                                    <TableHead>No.SPK | Nama Produk</TableHead>
                                                    <TableHead>Qty</TableHead>
                                                    <TableHead>Catatan Item</TableHead>
                                                    <TableHead>Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {items.length > 0 ? (
                                                    items.map((item, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{index + 1}</TableCell>
                                                            <TableCell>
                                                                <div className="space-y-1">
                                                                    <div className="font-medium">{item.no_kik}</div>
                                                                    <div className="text-sm text-gray-500">{item.nama_produk}</div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className="font-medium">
                                                                    {item.qty} {item.nama_satuan}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell>{item.keterangan || '-'}</TableCell>
                                                            <TableCell>
                                                                <Button
                                                                    type="button"
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    onClick={() => removeItem(index)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                                                            Belum ada item yang ditambahkan
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end space-x-2">
                                    <Link href={route('subcountOuts.index')}>
                                        <Button type="button" variant="outline">
                                            Batal
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing || items.length === 0}>
                                        {processing ? 'Menyimpan...' : 'Simpan'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
