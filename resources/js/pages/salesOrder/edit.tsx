import { DatePicker } from '@/components/date-picker';
import { SearchableSelect } from '@/components/search-select';
import { SelectInput } from '@/components/select-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { CustomerAddress } from '@/types/customerAddress';
import { FinishGoodItem } from '@/types/finishGoodItem';
import { SalesOrder } from '@/types/salesOrder';
import { Head, Link, useForm } from '@inertiajs/react';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sales Order',
        href: '/salesOrders',
    },
    {
        title: 'Edit',
        href: '#',
    },
];

interface EditProps {
    salesOrder: SalesOrder;
    finishGoodItems: FinishGoodItem[];
    customerAddresses: CustomerAddress[];
}

export default function Edit({ salesOrder, finishGoodItems, customerAddresses }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        id_finish_good_item: String(salesOrder.id_finish_good_item || ''),
        id_customer_address: String(salesOrder.id_customer_address || ''),
        no_bon_pesanan: salesOrder.no_bon_pesanan || '',
        no_po_customer: salesOrder.no_po_customer || '',
        jumlah_pesanan: salesOrder.jumlah_pesanan || '',
        harga_pcs_bp: salesOrder.harga_pcs_bp || '',
        harga_pcs_kirim: salesOrder.harga_pcs_kirim || '',
        mata_uang: salesOrder.mata_uang || '',
        syarat_pembayaran: salesOrder.syarat_pembayaran || '',
        eta_marketing: salesOrder.eta_marketing || '',
        klaim_kertas: salesOrder.klaim_kertas || '',
        dipesan_via: salesOrder.dipesan_via || '',
        tipe_pesanan: salesOrder.tipe_pesanan || '',
        toleransi_pengiriman: salesOrder.toleransi_pengiriman || '',
        catatan_colour_range: salesOrder.catatan_colour_range || '',
        catatan: salesOrder.catatan || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('salesOrders.update', salesOrder.id), {
            onSuccess: () => {
                toast.success('Sales Order updated successfully');
            },
            onError: () => {
                toast.error('Failed to update Sales Order');
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

    // Find the selected finish good item name for display
    const selectedFinishGoodItem = finishGoodItems.find((item) => String(item.id) === data.id_finish_good_item);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Sales Order" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Edit Sales Order</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="id_finish_good_item">Finish Good Item</Label>
                                            <div className="flex items-center rounded-md border p-2">
                                                <span className="text-muted-foreground">
                                                    {selectedFinishGoodItem?.nama_barang || 'Item not found'}
                                                </span>
                                            </div>
                                            {/* Hidden field to maintain the value */}
                                            <Input type="hidden" name="id_finish_good_item" value={data.id_finish_good_item} readOnly />
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
                                                value={data.id_customer_address || ''}
                                                placeholder="Pilih Customer"
                                                onChange={(value) => setData('id_customer_address', value)}
                                            />
                                            {errors.id_customer_address && <p className="text-sm text-red-500">{errors.id_customer_address}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="no_bon_pesanan">No. Sales Order</Label>
                                            <div className="flex items-center rounded-md border p-2">
                                                <span className="text-muted-foreground font-medium">{data.no_bon_pesanan}</span>
                                            </div>
                                            {/* Hidden field to maintain the value */}
                                            <Input type="hidden" name="no_bon_pesanan" value={data.no_bon_pesanan} readOnly />
                                            {errors.no_bon_pesanan && <p className="text-sm text-red-500">{errors.no_bon_pesanan}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="no_po_customer">No.PO Customer</Label>
                                            <Input id="no_po_customer" name="no_po_customer" value={data.no_po_customer} onChange={handleChange} />
                                            {errors.no_po_customer && <p className="text-sm text-red-500">{errors.no_po_customer}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="jumlah_pesanan">Jumlah Pesanan</Label>
                                            <Input id="jumlah_pesanan" name="jumlah_pesanan" value={data.jumlah_pesanan} onChange={handleChange} />
                                            {errors.jumlah_pesanan && <p className="text-sm text-red-500">{errors.jumlah_pesanan}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="harga_pcs_bp">Harga PCS (SO)</Label>
                                            <Input id="harga_pcs_bp" name="harga_pcs_bp" value={data.harga_pcs_bp} onChange={handleChange} />
                                            {errors.harga_pcs_bp && <p className="text-sm text-red-500">{errors.harga_pcs_bp}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="harga_pcs_kirim">Harga PCS (Kirim)</Label>
                                            <Input id="harga_pcs_kirim" name="harga_pcs_kirim" value={data.harga_pcs_kirim} onChange={handleChange} />
                                            {errors.harga_pcs_kirim && <p className="text-sm text-red-500">{errors.harga_pcs_kirim}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="mata_uang">Mata Uang</Label>
                                            <Input id="mata_uang" name="mata_uang" value={data.mata_uang} onChange={handleChange} />
                                            {errors.mata_uang && <p className="text-sm text-red-500">{errors.mata_uang}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="syarat_pembayaran">Syarat Pembayaran</Label>
                                            <Input
                                                id="syarat_pembayaran"
                                                name="syarat_pembayaran"
                                                value={data.syarat_pembayaran}
                                                onChange={handleChange}
                                            />
                                            {errors.syarat_pembayaran && <p className="text-sm text-red-500">{errors.syarat_pembayaran}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="eta_marketing">ETA Marketing</Label>
                                            <DatePicker
                                                value={data.eta_marketing}
                                                onChange={(date) => {
                                                    if (date) {
                                                        const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                                                            .toISOString()
                                                            .split('T')[0];
                                                        setData('eta_marketing', formattedDate);
                                                    } else {
                                                        setData('eta_marketing', '');
                                                    }
                                                }}
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
                                            <Input id="tipe_pesanan" name="tipe_pesanan" value={data.tipe_pesanan} onChange={handleChange} />
                                            {errors.tipe_pesanan && <p className="text-sm text-red-500">{errors.tipe_pesanan}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="toleransi_pengiriman">Toleransi Pengiriman</Label>
                                            <Input
                                                id="toleransi_pengiriman"
                                                name="toleransi_pengiriman"
                                                type="number"
                                                step="0.01"
                                                value={data.toleransi_pengiriman}
                                                onChange={handleChange}
                                            />
                                            {errors.toleransi_pengiriman && <p className="text-sm text-red-500">{errors.toleransi_pengiriman}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="catatan_colour_range">Catatan Colour Range</Label>
                                            <Textarea
                                                id="catatan_colour_range"
                                                name="catatan_colour_range"
                                                value={data.catatan_colour_range}
                                                onChange={handleChange}
                                            />
                                            {errors.catatan_colour_range && <p className="text-sm text-red-500">{errors.catatan_colour_range}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="catatan">Catatan</Label>
                                            <Textarea id="catatan" name="catatan" value={data.catatan} onChange={handleChange} />
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
