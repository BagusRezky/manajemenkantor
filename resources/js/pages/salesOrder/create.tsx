import { DatePicker } from '@/components/date-picker';
import { SearchableSelect } from '@/components/search-select';
import { SelectInput } from '@/components/select-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { CustomerAddress } from '@/types/customerAddress';
import { FinishGoodItem } from '@/types/finishGoodItem';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sales Order',
        href: '/salesOrders',
    },
    {
        title: 'Create',
        href: '/salesOrders/create',
    },
];

interface CreateProps {
    finishGoodItems: FinishGoodItem[];
    customerAddresses: CustomerAddress[];
    lastId: number;
}

export default function Create({ finishGoodItems, customerAddresses, lastId }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        id_finish_good_item: '',
        id_customer_address: '',
        no_bon_pesanan: '',
        no_po_customer: '',
        jumlah_pesanan: '',
        harga_pcs_bp: '',
        harga_pcs_kirim: '',
        mata_uang: '',
        syarat_pembayaran: '',
        eta_marketing: '',
        klaim_kertas: '',
        dipesan_via: '',
        tipe_pesanan: '',
        toleransi_pengiriman: '',
        catatan_colour_range: '',
        catatan: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // No need for special handling of custom_part/no_bon_pesanan as it's now read-only
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const currentDate = new Date();
    const yearMonth = `${currentDate.getFullYear().toString().slice(-2)}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
    const nextId = String(lastId + 1).padStart(5, '0');
    const salesOrderNumber = `SO/${nextId}.${yearMonth}`;

    useEffect(() => {
        setData((prevData) => ({
            ...prevData,
            // Setting the salesOrderNumber directly to be used in the backend
            no_bon_pesanan: salesOrderNumber,
        }));
    }, [salesOrderNumber]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('salesOrders.store'), {
            onSuccess: () => {
                toast.success('Sales Order created successfully');
            },
            onError: () => {
                toast.error('Failed to create Sales Order');
            },
        });
    };

    const pesanViaOptions = [
        { value: 'WA', label: 'WhatsApp' },
        { value: 'EMAIL', label: 'Email' },
        { value: 'SOSMED', label: 'Sosmed' },
    ];

    const claimPaperOptions = [
        { value: 'CLAIM', label: 'Claim' },
        { value: 'NOT CLAIM', label: 'Not Claim' },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Sales Order" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Create Sales Order</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="id_finish_good_item">Master Barang</Label>
                                            {/* <Select value={data.id_finish_good_item} onValueChange={(value) => setData('id_finish_good_item', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Master Barang" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {finishGoodItems.map((finishGoodItem) => (
                                                        <SelectItem key={finishGoodItem.id} value={finishGoodItem.id.toString()}>
                                                            {finishGoodItem.kode_material_produk ? `${finishGoodItem.kode_material_produk} | ` : ''}
                                                            {finishGoodItem.nama_barang}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select> */}
                                            <SearchableSelect
                                                items={finishGoodItems.map((item) => ({
                                                    key: String(item.id),
                                                    value: String(item.id),
                                                    label: item.nama_barang,
                                                }))}
                                                value={data.id_finish_good_item || ''} // Add fallback to empty string
                                                placeholder="Pilih Master Barang"
                                                onChange={(value) => setData('id_finish_good_item', value)}
                                            />
                                            {errors.id_finish_good_item && <p className="text-sm text-red-500">{errors.id_finish_good_item}</p>}
                                        </div>

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
                                            <Label htmlFor="custom_part">No. Sales Order</Label>
                                            <div className="flex flex-col space-y-2">
                                                <div className="bg-popover flex items-center rounded-md border p-2 shadow-lg">
                                                    <span className="font-medium text-white">{salesOrderNumber}</span>
                                                </div>
                                                {/* Hidden field for the actual form submission */}
                                                <Input id="no_bon_pesanan" name="no_bon_pesanan" value={salesOrderNumber} type="hidden" />
                                                {/* We're removing custom_part entirely since it's no longer needed */}
                                            </div>
                                            {errors.no_bon_pesanan && <p className="text-sm text-red-500">{errors.no_bon_pesanan}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="no_po_customer">No.PO Customer</Label>
                                            <Input
                                                id="no_po_customer"
                                                value={data.no_po_customer}
                                                onChange={(e) => setData('no_po_customer', e.target.value)}
                                            />
                                            {errors.no_po_customer && <p className="text-sm text-red-500">{errors.no_po_customer}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="jumlah_pesanan">Jumlah Pesanan</Label>
                                            <Input
                                                id="jumlah_pesanan"
                                                value={data.jumlah_pesanan}
                                                onChange={(e) => setData('jumlah_pesanan', e.target.value)}
                                            />
                                            {errors.jumlah_pesanan && <p className="text-sm text-red-500">{errors.jumlah_pesanan}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="harga_pcs_bp">Harga PCS (BP)</Label>
                                            <Input id="harga_pcs_bp" name="harga_pcs_bp" value={data.harga_pcs_bp} onChange={handleChange} />
                                            {errors.harga_pcs_bp && <p className="text-sm text-red-500">{errors.harga_pcs_bp}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="harga_pcs_kirim">Harga PCS (Kirim)</Label>
                                            <Input
                                                id="harga_pcs_kirim"
                                                value={data.harga_pcs_kirim}
                                                onChange={(e) => setData('harga_pcs_kirim', e.target.value)}
                                            />
                                            {errors.harga_pcs_kirim && <p className="text-sm text-red-500">{errors.harga_pcs_kirim}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="mata_uang">Mata Uang</Label>
                                            <Input id="mata_uang" value={data.mata_uang} onChange={(e) => setData('mata_uang', e.target.value)} />
                                            {errors.mata_uang && <p className="text-sm text-red-500">{errors.mata_uang}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="syarat_pembayaran">Syarat Pembayaran</Label>
                                            <Input
                                                id="syarat_pembayaran"
                                                value={data.syarat_pembayaran}
                                                onChange={(e) => setData('syarat_pembayaran', e.target.value)}
                                            />
                                            {errors.syarat_pembayaran && <p className="text-sm text-red-500">{errors.syarat_pembayaran}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="eta_marketing">ETA Marketing</Label>
                                            <DatePicker
                                                id="eta_marketing"
                                                value={data.eta_marketing}
                                                onChange={(e) => setData('eta_marketing', e.target.value ? e.target.value : '')}
                                            />
                                            {errors.eta_marketing && <p className="text-sm text-red-500">{errors.eta_marketing}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="klaim_kertas">Klaim Kertas</Label>
                                            <SelectInput
                                                id="klaim_kertas"
                                                value={data.klaim_kertas}
                                                onChange={(value) => setData('klaim_kertas', value)}
                                                options={claimPaperOptions}
                                                placeholder="Pilih klaim kertas"
                                            />
                                            {errors.klaim_kertas && <p className="text-sm text-red-500">{errors.klaim_kertas}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="dipesan_via">Dipesan Via</Label>
                                            <SelectInput
                                                id="dipesan_via"
                                                value={data.dipesan_via}
                                                onChange={(value) => setData('dipesan_via', value)}
                                                options={pesanViaOptions}
                                                placeholder="Pilih media pemesanan"
                                            />
                                            {errors.dipesan_via && <p className="text-sm text-red-500">{errors.dipesan_via}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="tipe_pesanan">Tipe Pesanan</Label>
                                            <Input
                                                id="tipe_pesanan"
                                                value={data.tipe_pesanan}
                                                onChange={(e) => setData('tipe_pesanan', e.target.value)}
                                            />
                                            {errors.tipe_pesanan && <p className="text-sm text-red-500">{errors.tipe_pesanan}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="toleransi_pengiriman">Toleransi Pengiriman</Label>
                                            <Input
                                                id="toleransi_pengiriman"
                                                type="number"
                                                step="0.01"
                                                value={data.toleransi_pengiriman}
                                                onChange={(e) => setData('toleransi_pengiriman', e.target.value)}
                                            />
                                            {errors.toleransi_pengiriman && <p className="text-sm text-red-500">{errors.toleransi_pengiriman}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="catatan_colour_range">Catatan Colour Range</Label>
                                            <Input
                                                id="catatan_colour_range"
                                                value={data.catatan_colour_range}
                                                onChange={(e) => setData('catatan_colour_range', e.target.value)}
                                            />
                                            {errors.catatan_colour_range && <p className="text-sm text-red-500">{errors.catatan_colour_range}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="catatan">Catatan</Label>
                                            <Input id="catatan" value={data.catatan} onChange={(e) => setData('catatan', e.target.value)} />
                                            {errors.catatan && <p className="text-sm text-red-500">{errors.catatan}</p>}
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-4">
                                        <Link href={route('salesOrders.index')}>
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
