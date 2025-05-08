/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { CustomerAddress } from '@/types/customerAddress';
import { Departemen } from '@/types/departemen';
import { FinishGoodItem } from '@/types/finishGoodItem';
import { MasterItem } from '@/types/masterItem';
import { TypeItem } from '@/types/typeItem';
import { Unit } from '@/types/unit';
import { Head, Link, useForm } from '@inertiajs/react';

import { Toaster, toast } from 'sonner';

interface EditProps {
    finishGoodItem: FinishGoodItem;
    customerAddresses: CustomerAddress[];
    units: Unit[];
    typeItems: TypeItem[];
    masterItems: MasterItem[];
    departements: Departemen[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customer Address',
        href: '/customerAddresses',
    },
    {
        title: 'Edit',
        href: '/customerAddresses/edit',
    },
];

interface FormData {
    id_customer_address: string;
    id_type_item: string;
    satuan_satu_id: string;
    kode_material_produk: string;
    kode_barcode: string;
    pc_number: string;
    nama_barang: string;
    deskripsi: string;
    spesifikasi_kertas: string;
    up_satu: string;
    up_dua: string;
    up_tiga: string;
    ukuran_potong: string;
    ukuran_cetak: string;
    panjang: string;
    lebar: string;
    tinggi: string;
    berat_kotor: string;
    berat_bersih: string;
    bill_of_materials: any[]; // Use any[] to avoid TypeScript issues
    [key: string]: any; // Add index signature for useForm compatibility
}

export default function Edit({ finishGoodItem, units, customerAddresses, typeItems, masterItems, departements }: EditProps) {
     const initialData: FormData = {
         id_customer_address: finishGoodItem.id_customer_address?.toString() || '',
         id_type_item: finishGoodItem.id_type_item?.toString() || '',
         satuan_satu_id: finishGoodItem.satuan_satu_id?.toString() || '',
         kode_material_produk: finishGoodItem.kode_material_produk || '',
         kode_barcode: finishGoodItem.kode_barcode || '',
         pc_number: finishGoodItem.pc_number || '',
         nama_barang: finishGoodItem.nama_barang || '',
         deskripsi: finishGoodItem.deskripsi || '',
         spesifikasi_kertas: finishGoodItem.spesifikasi_kertas || '',
         up_satu: finishGoodItem.up_satu || '',
         up_dua: finishGoodItem.up_dua || '',
         up_tiga: finishGoodItem.up_tiga || '',
         ukuran_potong: finishGoodItem.ukuran_potong || '',
         ukuran_cetak: finishGoodItem.ukuran_cetak || '',
         panjang: finishGoodItem.panjang || '',
         lebar: finishGoodItem.lebar || '',
         tinggi: finishGoodItem.tinggi || '',
         berat_kotor: finishGoodItem.berat_kotor || '',
         berat_bersih: finishGoodItem.berat_bersih || '',
         bill_of_materials: finishGoodItem.bill_of_materials || [],
     };

     const { data, setData, put, processing, errors } = useForm(initialData);

     const handleSubmit = (e: React.FormEvent) => {
         e.preventDefault();
         put(route('finishGoodItems.update', finishGoodItem.id), {
             onSuccess: () => {
                 toast.success('Finish Good Item updated successfully');
             },
             onError: () => {
                 toast.error('Failed to update Finish Good Item');
             },
         });
     };

     // Add a new BOM item
     const handleAddBomItem = () => {
         const newBomItems = Array.isArray(data.bill_of_materials) ? [...data.bill_of_materials] : [];

         newBomItems.push({
             id: `temp-${Date.now()}`,
             id_master_item: '',
             id_departemen: '',
             waste: '',
             qty: '',
             keterangan: '',
         });

         setData('bill_of_materials', newBomItems);
     };

     // Remove a BOM item
     const handleRemoveBomItem = (indexToRemove: number) => {
         if (!Array.isArray(data.bill_of_materials)) return;

         const updatedItems = data.bill_of_materials.filter((_, index) => index !== indexToRemove);
         setData('bill_of_materials', updatedItems);
     };

     // Update a BOM item field
     const handleBomItemChange = (index: number, field: string, value: string) => {
         if (!Array.isArray(data.bill_of_materials) || !data.bill_of_materials[index]) return;

         const updatedItems = [...data.bill_of_materials];
         updatedItems[index] = {
             ...updatedItems[index],
             [field]: value,
         };

         setData('bill_of_materials', updatedItems);
     };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Finish Good Item" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Edit Finish Good Item</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="id_customer_address">Customer</Label>
                                            <Select
                                                value={data.id_customer_address?.toString() || ''}


                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Customer" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {customerAddresses.map((customerAddress) => (
                                                        <SelectItem key={customerAddress.id} value={customerAddress.id.toString()}>
                                                            {customerAddress.nama_customer}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.id_customer_address && <p className="text-sm text-red-500">{errors.id_customer_address}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="id_type_item">Type Item</Label>
                                            <Select value={data.id_type_item} >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Type Item" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {typeItems.map((typeItem) => (
                                                        <SelectItem key={typeItem.id} value={typeItem.id.toString()}>
                                                            {typeItem.nama_type_item}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>


                                            {errors.id_type_item && <p className="text-sm text-red-500">{errors.id_type_item}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="kode_material_produk">Kode Material Produk</Label>
                                            <Input
                                                id="kode_material_produk"
                                                name="kode_material_produk"
                                                value={data.kode_material_produk}

                                                readOnly
                                            />
                                            {errors.kode_material_produk && <p className="text-sm text-red-500">{errors.kode_material_produk}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="kode_barcode">Kode Barcode</Label>
                                            <Input
                                                id="kode_barcode"
                                                value={data.kode_barcode}

                                                readOnly
                                            />
                                            {errors.kode_barcode && <p className="text-sm text-red-500">{errors.kode_barcode}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="pc_number">PC Number</Label>
                                            <Input id="pc_number" value={data.pc_number} readOnly />
                                            {errors.pc_number && <p className="text-sm text-red-500">{errors.pc_number}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="nama_barang">Nama Barang</Label>
                                            <Input
                                                id="nama_barang"
                                                name="nama_barang"
                                                value={data.nama_barang}
                                                readOnly
                                            />
                                            {errors.nama_barang && <p className="text-sm text-red-500">{errors.nama_barang}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="deskripsi">Deskripsi</Label>
                                            <Input id="deskripsi" value={data.deskripsi} readOnly />
                                            {errors.deskripsi && <p className="text-sm text-red-500">{errors.deskripsi}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="spesifikasi_kertas">Spesifikasi Kertas</Label>
                                            <Input
                                                id="spesifikasi_kertas"
                                                value={data.spesifikasi_kertas}
                                                readOnly
                                            />
                                            {errors.spesifikasi_kertas && <p className="text-sm text-red-500">{errors.spesifikasi_kertas}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="up_satu">UP Satu</Label>
                                            <Input id="up_satu" value={data.up_satu} readOnly />
                                            {errors.up_satu && <p className="text-sm text-red-500">{errors.up_satu}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="up_dua">UP Dua</Label>
                                            <Input id="up_dua" value={data.up_dua} readOnly />
                                            {errors.up_dua && <p className="text-sm text-red-500">{errors.up_dua}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="up_tiga">UP Tiga</Label>
                                            <Input id="up_tiga" value={data.up_tiga} readOnly />
                                            {errors.up_tiga && <p className="text-sm text-red-500">{errors.up_tiga}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="ukuran_potong">Ukuran Potong</Label>
                                            <Input
                                                id="ukuran_potong"
                                                value={data.ukuran_potong}
                                                readOnly
                                            />
                                            {errors.ukuran_potong && <p className="text-sm text-red-500">{errors.ukuran_potong}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="ukuran_cetak">Ukuran Cetak</Label>
                                            <Input
                                                id="ukuran_cetak"
                                                value={data.ukuran_cetak}
                                                readOnly
                                            />
                                            {errors.ukuran_cetak && <p className="text-sm text-red-500">{errors.ukuran_cetak}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="panjang">Panjang</Label>
                                            <Input
                                                id="panjang"
                                                type="number"
                                                step="0.01"
                                                value={data.panjang}
                                                readOnly
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
                                                readOnly
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
                                                readOnly
                                            />
                                            {errors.tinggi && <p className="text-sm text-red-500">{errors.tinggi}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="berat_kotor">Berat Kotor</Label>
                                            <Input
                                                id="berat_kotor"
                                                type="number"
                                                step="0.01"
                                                value={data.berat_kotor}
                                                readOnly
                                            />
                                            {errors.berat_kotor && <p className="text-sm text-red-500">{errors.berat_kotor}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="berat_bersih">Berat Bersih</Label>
                                            <Input
                                                id="berat_bersih"
                                                type="number"
                                                step="0.01"
                                                value={data.berat_bersih}
                                                readOnly
                                            />
                                            {errors.berat_bersih && <p className="text-sm text-red-500">{errors.berat_bersih}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="id_type_item">Satuan</Label>
                                            <Select value={data.satuan_satu_id} >
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
                                    </div>

                                    <div className="mt-8">
                                        <div className="mb-4 flex items-center justify-between">
                                            <h3 className="text-lg font-semibold">Bill of Materials</h3>
                                            <Button type="button" variant="outline" onClick={handleAddBomItem}>
                                                Add Item
                                            </Button>
                                        </div>

                                        <div className="rounded-md border">
                                            <table className="w-full divide-y ">
                                                <thead>
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                                        >
                                                            Master Item
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                                        >
                                                            Departemen
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                                        >
                                                            Waste
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                                        >
                                                            Qty
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                                        >
                                                            Keterangan
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
                                                        >
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 ">
                                                    {!Array.isArray(data.bill_of_materials) || data.bill_of_materials.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={6} className="px-4 py-4 text-center text-sm text-gray-500">
                                                                No items in bill of materials
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        data.bill_of_materials.map((item, index) => (
                                                            <tr key={item.id?.toString() || `row-${index}`}>
                                                                <td className="px-4 py-2">
                                                                    <Select
                                                                        value={item.id_master_item?.toString() || ''}
                                                                        onValueChange={(value) => handleBomItemChange(index, 'id_master_item', value)}
                                                                    >
                                                                        <SelectTrigger className="w-full">
                                                                            <SelectValue placeholder="Select Item" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {masterItems.map((masterItem) => (
                                                                                <SelectItem key={masterItem.id} value={masterItem.id.toString()}>
                                                                                    {masterItem.nama_master_item}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    {errors[`bill_of_materials.${index}.id_master_item`] && (
                                                                        <p className="mt-1 text-xs text-red-500">
                                                                            {errors[`bill_of_materials.${index}.id_master_item`]}
                                                                        </p>
                                                                    )}
                                                                </td>
                                                                <td className="px-4 py-2">
                                                                    <Select
                                                                        value={item.id_departemen?.toString() || ''}
                                                                        onValueChange={(value) => handleBomItemChange(index, 'id_departemen', value)}
                                                                    >
                                                                        <SelectTrigger className="w-full">
                                                                            <SelectValue placeholder="Select Departemen" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {departements.map((departemen) => (
                                                                                <SelectItem key={departemen.id} value={departemen.id.toString()}>
                                                                                    {departemen.nama_departemen}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    {errors[`bill_of_materials.${index}.id_departemen`] && (
                                                                        <p className="mt-1 text-xs text-red-500">
                                                                            {errors[`bill_of_materials.${index}.id_departemen`]}
                                                                        </p>
                                                                    )}
                                                                </td>
                                                                <td className="px-4 py-2">
                                                                    <Input
                                                                        value={item.waste?.toString() || ''}
                                                                        onChange={(e) => handleBomItemChange(index, 'waste', e.target.value)}
                                                                    />
                                                                    {errors[`bill_of_materials.${index}.waste`] && (
                                                                        <p className="mt-1 text-xs text-red-500">
                                                                            {errors[`bill_of_materials.${index}.waste`]}
                                                                        </p>
                                                                    )}
                                                                </td>
                                                                <td className="px-4 py-2">
                                                                    <Input
                                                                        value={item.qty?.toString() || ''}
                                                                        onChange={(e) => handleBomItemChange(index, 'qty', e.target.value)}
                                                                    />
                                                                    {errors[`bill_of_materials.${index}.qty`] && (
                                                                        <p className="mt-1 text-xs text-red-500">
                                                                            {errors[`bill_of_materials.${index}.qty`]}
                                                                        </p>
                                                                    )}
                                                                </td>
                                                                <td className="px-4 py-2">
                                                                    <Input
                                                                        value={item.keterangan?.toString() || ''}
                                                                        onChange={(e) => handleBomItemChange(index, 'keterangan', e.target.value)}
                                                                    />
                                                                    {errors[`bill_of_materials.${index}.keterangan`] && (
                                                                        <p className="mt-1 text-xs text-red-500">
                                                                            {errors[`bill_of_materials.${index}.keterangan`]}
                                                                        </p>
                                                                    )}
                                                                </td>
                                                                <td className="px-4 py-2 text-right">
                                                                    <Button
                                                                        type="button"
                                                                        variant="destructive"
                                                                        size="sm"
                                                                        onClick={() => handleRemoveBomItem(index)}
                                                                    >
                                                                        Remove
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        {errors.bill_of_materials && <p className="mt-2 text-sm text-red-500">{errors.bill_of_materials}</p>}
                                    </div>

                                    <div className="flex justify-end space-x-4">
                                        <Link href={route('finishGoodItems.index')}>
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
