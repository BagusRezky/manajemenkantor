import { SearchableSelect } from '@/components/search-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { CustomerAddress } from '@/types/customerAddress';
import { TypeItem } from '@/types/typeItem';

import { Unit } from '@/types/unit';
import { Head, Link, useForm } from '@inertiajs/react';

import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Finish Good Items',
        href: '/finishGoodItems',
    },
    {
        title: 'Create',
        href: '/finishGoodItems/create',
    },
];

interface CreateProps {
    units: Unit[];
    customerAddresses: CustomerAddress[];
    typeItems: TypeItem[];
}

export default function Create({ units, customerAddresses, typeItems }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        id_customer_address: '',
        id_type_item: '',
        satuan_satu_id: '',
        kode_material_produk: '',
        kode_barcode: '',
        pc_number: '',
        nama_barang: '',
        deskripsi: '',
        spesifikasi_kertas: '',
        up_satu: '',
        up_dua: '',
        up_tiga: '',
        ukuran_potong: '',
        ukuran_cetak: '',
        panjang: '',
        lebar: '',
        tinggi: '',
        berat_kotor: '',
        berat_bersih: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        const upperCaseFields = ['kode_material_produk', 'nama_barang'];

        const newValue = upperCaseFields.includes(name) ? value.toUpperCase() : value;
        setData((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('finishGoodItems.store'), {
            onSuccess: () => {
                toast.success('Finish Good Item created successfully');
            },
            onError: () => {
                toast.error('Failed to create Finish Good Item');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Finish Good Item" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Create Finish Good Item</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="id_customer_address">Customer</Label>
                                            <SearchableSelect
                                                items={customerAddresses.map((item) => ({
                                                    key: String(item.id),
                                                    value: String(item.id),
                                                    label: item.nama_customer,
                                                }))}
                                                value={data.id_customer_address || ''} // Add fallback to empty string
                                                placeholder="Pilih Customer"
                                                onChange={(value) => setData('id_customer_address', value)}
                                            />
                                            {errors.id_customer_address && <p className="text-sm text-red-500">{errors.id_customer_address}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="id_type_item">Type Item</Label>
                                            <SearchableSelect
                                                items={typeItems.map((item) => ({
                                                    key: String(item.id),
                                                    value: String(item.id),
                                                    label: item.nama_type_item,
                                                }))}
                                                value={data.id_type_item || ''} // Add fallback to empty string
                                                placeholder="Pilih Type Item"
                                                onChange={(value) => setData('id_type_item', value)}
                                            />
                                            {errors.id_type_item && <p className="text-sm text-red-500">{errors.id_type_item}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="kode_material_produk">Kode Material Produk</Label>
                                            <Input
                                                id="kode_material_produk"
                                                name="kode_material_produk"
                                                value={data.kode_material_produk}
                                                onChange={handleChange}
                                            />
                                            {errors.kode_material_produk && <p className="text-sm text-red-500">{errors.kode_material_produk}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="kode_barcode">Kode Barcode</Label>
                                            <Input
                                                id="kode_barcode"
                                                value={data.kode_barcode}
                                                onChange={(e) => setData('kode_barcode', e.target.value)}
                                            />
                                            {errors.kode_barcode && <p className="text-sm text-red-500">{errors.kode_barcode}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="pc_number">PC Number</Label>
                                            <Input id="pc_number" value={data.pc_number} onChange={(e) => setData('pc_number', e.target.value)} />
                                            {errors.pc_number && <p className="text-sm text-red-500">{errors.pc_number}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="nama_barang">Nama Barang</Label>
                                            <Input id="nama_barang" name="nama_barang" value={data.nama_barang} onChange={handleChange} />
                                            {errors.nama_barang && <p className="text-sm text-red-500">{errors.nama_barang}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="deskripsi">Deskripsi</Label>
                                            <Input id="deskripsi" value={data.deskripsi} onChange={(e) => setData('deskripsi', e.target.value)} />
                                            {errors.deskripsi && <p className="text-sm text-red-500">{errors.deskripsi}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="spesifikasi_kertas">Spesifikasi Kertas</Label>
                                            <Input
                                                id="spesifikasi_kertas"
                                                value={data.spesifikasi_kertas}
                                                onChange={(e) => setData('spesifikasi_kertas', e.target.value)}
                                            />
                                            {errors.spesifikasi_kertas && <p className="text-sm text-red-500">{errors.spesifikasi_kertas}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="up_satu">UP Satu</Label>
                                            <Input id="up_satu" value={data.up_satu} onChange={(e) => setData('up_satu', e.target.value)} />
                                            {errors.up_satu && <p className="text-sm text-red-500">{errors.up_satu}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="up_dua">UP Dua</Label>
                                            <Input id="up_dua" value={data.up_dua} onChange={(e) => setData('up_dua', e.target.value)} />
                                            {errors.up_dua && <p className="text-sm text-red-500">{errors.up_dua}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="up_tiga">UP Tiga</Label>
                                            <Input id="up_tiga" value={data.up_tiga} onChange={(e) => setData('up_tiga', e.target.value)} />
                                            {errors.up_tiga && <p className="text-sm text-red-500">{errors.up_tiga}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="ukuran_potong">Ukuran Potong</Label>
                                            <Input
                                                id="ukuran_potong"
                                                value={data.ukuran_potong}
                                                onChange={(e) => setData('ukuran_potong', e.target.value)}
                                            />
                                            {errors.ukuran_potong && <p className="text-sm text-red-500">{errors.ukuran_potong}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="ukuran_cetak">Ukuran Cetak</Label>
                                            <Input
                                                id="ukuran_cetak"
                                                value={data.ukuran_cetak}
                                                onChange={(e) => setData('ukuran_cetak', e.target.value)}
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
                                            <Label htmlFor="berat_kotor">Berat Kotor</Label>
                                            <Input
                                                id="berat_kotor"
                                                type="number"
                                                step="0.01"
                                                value={data.berat_kotor}
                                                onChange={(e) => setData('berat_kotor', e.target.value)}
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
                                                onChange={(e) => setData('berat_bersih', e.target.value)}
                                            />
                                            {errors.berat_bersih && <p className="text-sm text-red-500">{errors.berat_bersih}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="id_type_item">Satuan</Label>
                                            <SearchableSelect
                                                items={units.map((item) => ({
                                                    key: String(item.id),
                                                    value: String(item.id),
                                                    label: item.nama_satuan,
                                                }))}
                                                value={data.satuan_satu_id || ''} // Add fallback to empty string
                                                placeholder="Pilih Satuan"
                                                onChange={(value) => setData('satuan_satu_id', value)}
                                            />
                                            {errors.satuan_satu_id && <p className="text-sm text-red-500">{errors.satuan_satu_id}</p>}
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-4">
                                        <Link href={route('finishGoodItems.index')}>
                                            <Button variant="outline" type="button">
                                                Cancel
                                            </Button>
                                        </Link>
                                        <Button type="submit" disabled={processing}>
                                            Save
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
