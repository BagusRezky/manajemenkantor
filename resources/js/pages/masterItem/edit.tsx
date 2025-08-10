import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { CategoryItem } from '@/types/categoryItem';
import { MasterItem } from '@/types/masterItem';
import { TypeItem } from '@/types/typeItem';
import { Unit } from '@/types/unit';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';

interface EditProps {
    masterItem: MasterItem;
    units: Unit[];
    categoryItems: CategoryItem[];
    typeItems: TypeItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Master Items',
        href: '/master-items',
    },
    {
        title: 'Edit',
        href: '/masterItems/edit',
    },
];

export default function Edit({ masterItem, units, categoryItems, typeItems: initialTypeItems }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        kode_master_item: masterItem.kode_master_item || '',
        satuan_satu_id: masterItem.satuan_satu_id?.toString() || '',
        id_category_item: masterItem.id_category_item?.toString() || '',
        id_type_item: masterItem.id_type_item?.toString() || '',
        qty: masterItem.qty || '',
        panjang: masterItem.panjang || '',
        lebar: masterItem.lebar || '',
        tinggi: masterItem.tinggi || '',
        berat: masterItem.berat || '',
        nama_master_item: masterItem.nama_master_item || '',
        min_stock: masterItem.min_stock || '',
        min_order: masterItem.min_order || '',
        tipe_penjualan: masterItem.tipe_penjualan || '', // Added field for sales type
    });

    const [typeItems, setTypeItems] = useState<TypeItem[]>(initialTypeItems || []);
    const [showDimensions, setShowDimensions] = useState(false);

    useEffect(() => {
        // Cek apakah category yang dipilih adalah production atau finish good item
        if (data.id_category_item) {
            const selectedCategory = categoryItems.find((cat) => cat.id.toString() === data.id_category_item);
            const categoryName = selectedCategory?.nama_category_item.toLowerCase();
            setShowDimensions(['material production', 'finish good'].includes(categoryName || ''));
        }
    }, []);

    const handleCategoryChange = async (value: string) => {
        setData('id_category_item', value);
        setData('id_type_item', ''); // Reset type item when category changes

        try {
            const response = await fetch(route('api.type-items', { categoryId: value }));
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTypeItems(data);
        } catch (error) {
            console.error('Error fetching type items:', error);
            toast.error('Failed to fetch type items');
        }

        // Cek apakah category yang dipilih adalah production atau finish good item
        const selectedCategory = categoryItems.find((cat) => cat.id.toString() === value);
        const categoryName = selectedCategory?.nama_category_item.toLowerCase();
        setShowDimensions(['material production', 'finish good'].includes(categoryName || ''));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('master-items.update', masterItem.id), {
            onSuccess: () => {
                toast.success('Master Item updated successfully');
            },
            onError: () => {
                toast.error('Failed to update Master Item');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Master Item" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Edit Master Item</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="kode_master_item">Kode Master Item</Label>
                                            <Input
                                                id="kode_master_item"
                                                value={data.kode_master_item}
                                                onChange={(e) => setData('kode_master_item', e.target.value)}
                                            />
                                            {errors.kode_master_item && <p className="text-sm text-red-500">{errors.kode_master_item}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="nama_master_item">Nama Master Item</Label>
                                            <Input
                                                id="nama_master_item"
                                                value={data.nama_master_item}
                                                onChange={(e) => setData('nama_master_item', e.target.value)}
                                            />
                                            {errors.nama_master_item && <p className="text-sm text-red-500">{errors.nama_master_item}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="min_stock">Min Stock</Label>
                                            <Input
                                                id="min_stock"
                                                type="number"
                                                value={data.min_stock}
                                                onChange={(e) => setData('min_stock', e.target.value)}
                                            />
                                            {errors.min_stock && <p className="text-sm text-red-500">{errors.min_stock}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="min_order">Min Order</Label>
                                            <Input
                                                id="min_order"
                                                type="number"
                                                value={data.min_order}
                                                onChange={(e) => setData('min_order', e.target.value)}
                                            />
                                            {errors.min_order && <p className="text-sm text-red-500">{errors.min_order}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="satuan_satu_id">Satuan</Label>
                                            <Select value={data.satuan_satu_id} onValueChange={(value) => setData('satuan_satu_id', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Satuan" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {units.map((unit) => (
                                                        <SelectItem key={unit.id} value={unit.id.toString()}>
                                                            {unit.nama_satuan}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.satuan_satu_id && <p className="text-sm text-red-500">{errors.satuan_satu_id}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="id_category_item">Kategori Item</Label>
                                            <Select value={data.id_category_item} onValueChange={handleCategoryChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Kategori" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categoryItems.map((category) => (
                                                        <SelectItem key={category.id} value={category.id.toString()}>
                                                            {category.nama_category_item}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.id_category_item && <p className="text-sm text-red-500">{errors.id_category_item}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="id_type_item">Tipe Item</Label>
                                            <Select
                                                value={data.id_type_item}
                                                onValueChange={(value) => setData('id_type_item', value)}
                                                disabled={!data.id_category_item}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Tipe" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {typeItems.map((type) => (
                                                        <SelectItem key={type.id} value={type.id.toString()}>
                                                            {type.nama_type_item}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.id_type_item && <p className="text-sm text-red-500">{errors.id_type_item}</p>}
                                        </div>

                                        { showDimensions && (
                                            <div className="space-y-2">
                                                <Label htmlFor="tipe_penjualan">Tipe Penjualan</Label>
                                                <Select
                                                    value={data.tipe_penjualan}
                                                    onValueChange={(value) => setData('tipe_penjualan', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih Tipe Penjualan" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="For Sale">For Sale</SelectItem>
                                                        <SelectItem value="Not For Sale">Not For Sale</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.tipe_penjualan && <p className="text-sm text-red-500">{errors.tipe_penjualan}</p>}
                                            </div>
                                        )}
                                    </div>

                                    {showDimensions && (
                                        <div className="mt-4 rounded-md border p-4">
                                            <h3 className="mb-4 text-lg font-medium">Informasi Dimensi</h3>
                                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                                <div className="space-y-2">
                                                    <Label htmlFor="qty">Quantity</Label>
                                                    <Input
                                                        id="qty"
                                                        type="number"
                                                        step="0.01"
                                                        value={data.qty}
                                                        onChange={(e) => setData('qty', e.target.value)}
                                                    />
                                                    {errors.qty && <p className="text-sm text-red-500">{errors.qty}</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="panjang">Panjang</Label>
                                                    <Input
                                                        id="panjang"
                                                        type="number"
                                                        step="0.01"
                                                        value={data.panjang}
                                                        onChange={(e) => setData('panjang', e.target.value)}
                                                    />
                                                    {errors.panjang && <p className="text-sm text-red-500">{errors.panjang}</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="lebar">Lebar</Label>
                                                    <Input
                                                        id="lebar"
                                                        type="number"
                                                        step="0.01"
                                                        value={data.lebar}
                                                        onChange={(e) => setData('lebar', e.target.value)}
                                                    />
                                                    {errors.lebar && <p className="text-sm text-red-500">{errors.lebar}</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="tinggi">Tinggi</Label>
                                                    <Input
                                                        id="tinggi"
                                                        type="number"
                                                        step="0.01"
                                                        value={data.tinggi}
                                                        onChange={(e) => setData('tinggi', e.target.value)}
                                                    />
                                                    {errors.tinggi && <p className="text-sm text-red-500">{errors.tinggi}</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="berat">Berat</Label>
                                                    <Input
                                                        id="berat"
                                                        type="number"
                                                        step="0.01"
                                                        value={data.berat}
                                                        onChange={(e) => setData('berat', e.target.value)}
                                                    />
                                                    {errors.berat && <p className="text-sm text-red-500">{errors.berat}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-end space-x-4">
                                        <Link href={route('master-items.index')}>
                                            <Button variant="outline" type="button">
                                                Cancel
                                            </Button>
                                        </Link>
                                        <Button type="submit" disabled={processing}>
                                            Update
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <Toaster />
        </AppLayout>
    );
}
