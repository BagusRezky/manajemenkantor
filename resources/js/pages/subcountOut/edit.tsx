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
import { SubcountOut } from '@/types/subcountOut';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface SubcountOutItemForm {
    id_kartu_instruksi_kerja: string;
    id_unit: string;
    qty: number;
    keterangan: string;
    nama_produk?: string;
    no_kik?: string;
    nama_satuan?: string;
    [key: string]: any;
}

interface EditProps {
    subcountOut: SubcountOut;
    suppliers: Supplier[];
    kartuInstruksiKerjas: KartuInstruksiKerja[];
    units: Unit[];
}

export default function Edit({ subcountOut, suppliers, kartuInstruksiKerjas, units }: EditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Subcount Out', href: '/subcountOuts' },
        { title: 'Edit', href: '#' },
    ];

    const [items, setItems] = useState<SubcountOutItemForm[]>([]);
    const [currentItem, setCurrentItem] = useState<SubcountOutItemForm>({
        id_kartu_instruksi_kerja: '',
        id_unit: '',
        qty: 0,
        keterangan: '',
    });

    const { data, setData, put, processing, errors } = useForm({
        no_subcount_out: subcountOut.no_subcount_out || '',
        tgl_subcount_out: subcountOut.tgl_subcount_out || '',
        id_supplier: subcountOut.id_supplier || '',
        admin_produksi: subcountOut.admin_produksi || '',
        supervisor: subcountOut.supervisor || '',
        admin_mainstore: subcountOut.admin_mainstore || '',
        keterangan: subcountOut.keterangan || '',
        items: [] as SubcountOutItemForm[],
    });

    // Load existing items on mount
    useEffect(() => {
        if (subcountOut.subcount_out_items) {
            const mappedItems = subcountOut.subcount_out_items.map((item: any) => ({
                id_kartu_instruksi_kerja: item.id_kartu_instruksi_kerja,
                id_unit: item.id_unit,
                qty: item.qty,
                keterangan: item.keterangan || '',
                no_kik: item.kartu_instruksi_kerja?.no_kartu_instruksi_kerja,
                nama_produk: item.kartu_instruksi_kerja?.sales_order?.finish_good_item?.nama_barang,
                nama_satuan: item.unit?.nama_satuan,
            }));
            setItems(mappedItems);
        }
    }, [subcountOut]);

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().split('T')[0];
    };

    const addItem = () => {
        if (!currentItem.id_kartu_instruksi_kerja || !currentItem.id_unit || currentItem.qty <= 0) {
            toast.error('Lengkapi data item terlebih dahulu');
            return;
        }

        const existingItemIndex = items.findIndex(
            (item) => item.id_kartu_instruksi_kerja === currentItem.id_kartu_instruksi_kerja && item.id_unit === currentItem.id_unit,
        );

        if (existingItemIndex >= 0) {
            toast.error('Item yang sama sudah ada di daftar');
            return;
        }

        const selectedKik = kartuInstruksiKerjas.find((kik) => String(kik.id) === String(currentItem.id_kartu_instruksi_kerja));
        const selectedUnit = units.find((unit) => String(unit.id) === String(currentItem.id_unit));

        const newItem: SubcountOutItemForm = {
            ...currentItem,
            no_kik: selectedKik?.no_kartu_instruksi_kerja || '',
            nama_produk: selectedKik?.sales_order?.finish_good_item?.nama_barang || '',
            nama_satuan: selectedUnit?.nama_satuan || '',
        };

        setItems([...items, newItem]);
        setCurrentItem({ id_kartu_instruksi_kerja: '', id_unit: '', qty: 0, keterangan: '' });
        toast.success('Item ditambahkan');
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (items.length === 0) {
            toast.error('Minimal harus ada satu item');
            return;
        }

        // Inertia useForm put doesn't automatically merge external state like 'items'
        // So we use router.put or update data object before submitting
        router.put(route('subcountOuts.update', subcountOut.id), {
            ...data,
            items: items.map(item => ({
                id_kartu_instruksi_kerja: item.id_kartu_instruksi_kerja,
                id_unit: item.id_unit,
                qty: item.qty,
                keterangan: item.keterangan,
            }))
        }, {
            onSuccess: () => toast.success('Data berhasil diperbarui'),
            onError: () => toast.error('Gagal memperbarui data'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Subcount Out - ${subcountOut.no_subcount_out}`} />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Edit Subcount Out</CardTitle>
                            <Link href={route('subcountOuts.index')}>
                                <Button variant="outline" size="sm">
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Header Info */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="no_subcount_out">No. Subcount Out <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="no_subcount_out"
                                            value={data.no_subcount_out}
                                            onChange={(e) => setData('no_subcount_out', e.target.value)}
                                            className={errors.no_subcount_out ? 'border-red-500' : ''}
                                            readOnly
                                        />
                                        {errors.no_subcount_out && <p className="text-sm text-red-500">{errors.no_subcount_out}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tgl_subcount_out">Tanggal <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="tgl_subcount_out"
                                            type="date"
                                            value={formatDate(data.tgl_subcount_out)}
                                            onChange={(e) => setData('tgl_subcount_out', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Supplier <span className="text-red-500">*</span></Label>
                                        <Select value={data.id_supplier} onValueChange={(v) => setData('id_supplier', v)}>
                                            <SelectTrigger><SelectValue placeholder="Pilih Supplier" /></SelectTrigger>
                                            <SelectContent>
                                                {suppliers.map((s) => (
                                                    <SelectItem key={s.id} value={s.id}>{s.nama_suplier}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label>Admin Produksi</Label>
                                        <Input value={data.admin_produksi} onChange={(e) => setData('admin_produksi', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Supervisor</Label>
                                        <Input value={data.supervisor} onChange={(e) => setData('supervisor', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Admin Mainstore</Label>
                                        <Input value={data.admin_mainstore} onChange={(e) => setData('admin_mainstore', e.target.value)} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Keterangan</Label>
                                    <Textarea value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)} />
                                </div>

                                <hr />

                                {/* Form Items (Sama dengan Create) */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Edit Items</h3>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label>No. SPK / KIK</Label>
                                            <SearchableSelect
                                                items={kartuInstruksiKerjas.map((k) => ({
                                                    key: k.id, value: k.id, label: k.no_kartu_instruksi_kerja
                                                }))}
                                                value={currentItem.id_kartu_instruksi_kerja}
                                                onChange={(v) => setCurrentItem({ ...currentItem, id_kartu_instruksi_kerja: v })}
                                                placeholder="Pilih SPK..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Qty</Label>
                                            <Input
                                                type="number"
                                                value={currentItem.qty || ''}
                                                onChange={(e) => setCurrentItem({ ...currentItem, qty: parseInt(e.target.value) || 0 })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Satuan</Label>
                                            <SearchableSelect
                                                items={units.map((u) => ({ key: u.id, value: u.id, label: u.nama_satuan }))}
                                                value={currentItem.id_unit}
                                                onChange={(v) => setCurrentItem({ ...currentItem, id_unit: v })}
                                                placeholder="Pilih Satuan..."
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-end gap-4">
                                        <div className="flex-1 space-y-2">
                                            <Label>Catatan Item</Label>
                                            <Input
                                                value={currentItem.keterangan}
                                                onChange={(e) => setCurrentItem({ ...currentItem, keterangan: e.target.value })}
                                                placeholder="Keterangan tambahan untuk item ini..."
                                            />
                                        </div>
                                        <Button type="button" onClick={addItem} className="bg-blue-600 hover:bg-blue-700">
                                            <Plus className="mr-2 h-4 w-4" /> Tambah Item
                                        </Button>
                                    </div>
                                </div>

                                {/* Table Items */}
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader className="bg-gray-50">
                                            <TableRow>
                                                <TableHead>No</TableHead>
                                                <TableHead>No.SPK </TableHead>
                                                <TableHead>Produk</TableHead>
                                                <TableHead>Qty</TableHead>
                                                <TableHead>Catatan</TableHead>
                                                <TableHead className="w-[100px]">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {items.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>
                                                        <div className="font-medium">{item.no_kik}</div>

                                                    </TableCell>
                                                    <TableCell>{item.nama_produk}</TableCell>
                                                    <TableCell>{item.qty} {item.nama_satuan}</TableCell>
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
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button type="submit" disabled={processing} className="bg-green-600 hover:bg-green-700">
                                        <Save className="mr-2 h-4 w-4" />
                                        {processing ? 'Menyimpan...' : 'Perbarui Subcount Out'}
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
