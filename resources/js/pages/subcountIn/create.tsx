/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { SubcountOut } from '@/types/subcountOut';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Subcount In',
        href: '/subcountIns',
    },
    {
        title: 'Tambah',
        href: '#',
    },
];

interface SubcountInItem {
    id_subcount_out: string;
    qty: number;
    keterangan: string;
    subcountOut?: SubcountOut;
    [key: string]: any; // Allow additional properties
}

interface CreateProps {
    subcountOuts: SubcountOut[];
}

export default function Create({ subcountOuts }: CreateProps) {
    const [items, setItems] = useState<SubcountInItem[]>([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        no_subcount_in: '',
        tgl_subcount_in: '',
        no_surat_jalan_pengiriman: '',
        admin_produksi: '',
        supervisor: '',
        admin_mainstore: '',
        keterangan: '',
        items: [] as SubcountInItem[],
    });

    // Get available SubcountOuts (yang belum dipilih di tabel)
    const getAvailableSubcountOuts = () => {
        return subcountOuts.filter((subcountOut) => !items.some((item) => item.id_subcount_out === subcountOut.id));
    };

    // Handle dropdown selection change - otomatis tambah ke tabel
    const handleSubcountOutSelect = (selectedId: string) => {
        if (!selectedId) return;

        const selectedSubcountOut = subcountOuts.find((s) => s.id === selectedId);
        if (!selectedSubcountOut) return;

        // Check if already exists
        if (items.some((item) => item.id_subcount_out === selectedId)) {
            toast.error('SubcountOut sudah ada di tabel');
            return;
        }

        const newItem: SubcountInItem = {
            id_subcount_out: selectedId,
            qty: selectedSubcountOut.subcount_out_items?.[0]?.qty || 0, // Set default dari SubcountOut
            keterangan: '',
            subcountOut: selectedSubcountOut,
        };

        setItems([...items, newItem]);
        toast.success('Item berhasil ditambahkan ke tabel');
    };

    // Remove item from table
    const removeItemFromTable = (index: number) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
        toast.success('Item berhasil dihapus dari tabel');
    };

    // Update qty untuk item tertentu
    const updateItemQty = (index: number, qty: number) => {
        const updatedItems = [...items];
        updatedItems[index].qty = qty;
        setItems(updatedItems);
    };

    // Update keterangan untuk item tertentu
    const updateItemKeterangan = (index: number, keterangan: string) => {
        const updatedItems = [...items];
        updatedItems[index].keterangan = keterangan;
        setItems(updatedItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (items.length === 0) {
            toast.error('Tambahkan minimal satu item');
            return;
        }

        // Filter items yang memiliki qty > 0
        const filteredItems = items.filter((item) => item.qty > 0);

        if (filteredItems.length === 0) {
            toast.error('Minimal harus ada 1 item dengan qty > 0');
            return;
        }

        // Prepare items data
        const itemsData = filteredItems.map((item) => ({
            id_subcount_out: item.id_subcount_out,
            qty: item.qty,
            keterangan: item.keterangan,
        }));

        // Prepare complete form data
        const formData = {
            ...data,
            items: itemsData,
        };

        // Submit using router.post directly with complete data
        router.post(route('subcountIns.store'), formData, {
            onSuccess: () => {
                toast.success('Subcount In berhasil dibuat');
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
                toast.error('Gagal membuat Subcount In');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Subcount In" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tambah Subcount In</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div onSubmit={handleSubmit}>
                                <div className="space-y-6">
                                    {/* Form Header */}
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="no_subcount_in">No. Subcount In *</Label>
                                            <Input
                                                id="no_subcount_in"
                                                value={data.no_subcount_in}
                                                onChange={(e) => setData('no_subcount_in', e.target.value)}
                                                className={errors.no_subcount_in ? 'border-red-500' : ''}
                                            />
                                            {errors.no_subcount_in && <p className="text-sm text-red-500">{errors.no_subcount_in}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="tgl_subcount_in">Tanggal Subcount In *</Label>
                                            <Input
                                                id="tgl_subcount_in"
                                                type="date"
                                                value={data.tgl_subcount_in}
                                                onChange={(e) => setData('tgl_subcount_in', e.target.value)}
                                                className={errors.tgl_subcount_in ? 'border-red-500' : ''}
                                            />
                                            {errors.tgl_subcount_in && <p className="text-sm text-red-500">{errors.tgl_subcount_in}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="no_surat_jalan_pengiriman">No. Surat Jalan Pengiriman *</Label>
                                            <Input
                                                id="no_surat_jalan_pengiriman"
                                                value={data.no_surat_jalan_pengiriman}
                                                onChange={(e) => setData('no_surat_jalan_pengiriman', e.target.value)}
                                                className={errors.no_surat_jalan_pengiriman ? 'border-red-500' : ''}
                                            />
                                            {errors.no_surat_jalan_pengiriman && (
                                                <p className="text-sm text-red-500">{errors.no_surat_jalan_pengiriman}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="admin_produksi">Admin Produksi *</Label>
                                            <Input
                                                id="admin_produksi"
                                                value={data.admin_produksi}
                                                onChange={(e) => setData('admin_produksi', e.target.value)}
                                                className={errors.admin_produksi ? 'border-red-500' : ''}
                                            />
                                            {errors.admin_produksi && <p className="text-sm text-red-500">{errors.admin_produksi}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="supervisor">Supervisor *</Label>
                                            <Input
                                                id="supervisor"
                                                value={data.supervisor}
                                                onChange={(e) => setData('supervisor', e.target.value)}
                                                className={errors.supervisor ? 'border-red-500' : ''}
                                            />
                                            {errors.supervisor && <p className="text-sm text-red-500">{errors.supervisor}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="admin_mainstore">Admin Mainstore *</Label>
                                            <Input
                                                id="admin_mainstore"
                                                value={data.admin_mainstore}
                                                onChange={(e) => setData('admin_mainstore', e.target.value)}
                                                className={errors.admin_mainstore ? 'border-red-500' : ''}
                                            />
                                            {errors.admin_mainstore && <p className="text-sm text-red-500">{errors.admin_mainstore}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="keterangan">Keterangan</Label>
                                        <Textarea
                                            id="keterangan"
                                            value={data.keterangan}
                                            onChange={(e) => setData('keterangan', e.target.value)}
                                            rows={3}
                                        />
                                    </div>

                                    {/* SubcountOut Selection */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Pilih Subcount Out Items</h3>
                                        <div className="space-y-2">
                                            <Label htmlFor="subcount_out_select">Pilih SubcountOut</Label>
                                            <Select value="" onValueChange={handleSubcountOutSelect}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih SubcountOut untuk ditambahkan..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {getAvailableSubcountOuts().map((subcountOut) => (
                                                        <SelectItem key={subcountOut.id} value={subcountOut.id}>
                                                            {subcountOut.no_subcount_out} - {subcountOut.subcount_out_items?.map(item => item.kartu_instruksi_kerja?.no_kartu_instruksi_kerja).join(', ') }
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {getAvailableSubcountOuts().length === 0 && (
                                                <p className="text-sm text-gray-500">Semua SubcountOut sudah ditambahkan</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Items Table */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Items yang Dipilih</h3>
                                        {items.length > 0 ? (
                                            <div className="rounded-md border">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>No. Subcount Out</TableHead>
                                                            <TableHead>No. SPK</TableHead>
                                                            <TableHead>Qty *</TableHead>
                                                            <TableHead>Keterangan</TableHead>
                                                            <TableHead className="w-20">Aksi</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {items.map((item, index) => (
                                                            <TableRow key={item.id_subcount_out}>
                                                                <TableCell className="font-medium">{item.subcountOut?.no_subcount_out}</TableCell>
                                                                <TableCell>
                                                                    {item.subcountOut?.subcount_out_items
                                                                        ? item.subcountOut.subcount_out_items
                                                                              .map((kartu) => kartu.kartu_instruksi_kerja?.no_kartu_instruksi_kerja)
                                                                              .join(', ')
                                                                        : 'Tidak ada SPK'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Input
                                                                        type="number"
                                                                        value={item.qty}
                                                                        onChange={(e) => updateItemQty(index, Number(e.target.value))}
                                                                        className="w-24"
                                                                        placeholder="0"
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Input
                                                                        value={item.keterangan}
                                                                        onChange={(e) => updateItemKeterangan(index, e.target.value)}
                                                                        placeholder="Keterangan item..."
                                                                        className="min-w-[200px]"
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Button
                                                                        type="button"
                                                                        variant="destructive"
                                                                        size="sm"
                                                                        onClick={() => removeItemFromTable(index)}
                                                                        className="p-2"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        ) : (
                                            <div className="rounded-md border py-8 text-center text-gray-500">
                                                <p>Belum ada item yang dipilih</p>
                                                <p className="text-sm">Pilih SubcountOut dari dropdown di atas untuk menambahkan item</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-end space-x-2">
                                        <Link href={route('subcountIns.index')}>
                                            <Button variant="outline" type="button">
                                                Batal
                                            </Button>
                                        </Link>
                                        <Button
                                            onClick={handleSubmit}
                                            disabled={processing || items.length === 0 || items.filter((item) => item.qty > 0).length === 0}
                                        >
                                            {processing ? 'Menyimpan...' : 'Simpan'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
