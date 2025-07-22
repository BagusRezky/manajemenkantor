import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { SuratJalan } from '@/types/suratJalan';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Invoice',
        href: '/invoices',
    },
    {
        title: 'Tambah',
        href: '#',
    },
];

interface CreateProps {
    suratJalans: SuratJalan[];
}

export default function Create({ suratJalans }: CreateProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        id_surat_jalan: '',
        no_invoice: '',
        tgl_invoice: '',
        tgl_jatuh_tempo: '',
        harga: '',
        ppn: '',
        ongkos_kirim: '',
        uang_muka: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('invoices.store'), {
            onSuccess: () => {
                toast.success('Invoice berhasil dibuat');
                reset();
            },
            onError: () => {
                toast.error('Gagal membuat Invoice');
            },
        });
    };

    // Format date untuk input
    // const formatDateForInput = (dateString: string) => {
    //     if (!dateString) return '';
    //     return new Date(dateString).toISOString().split('T')[0];
    // };

    // Generate nomor invoice otomatis
    // const generateInvoiceNumber = () => {
    //     const now = new Date();
    //     const year = now.getFullYear();
    //     const month = String(now.getMonth() + 1).padStart(2, '0');
    //     const day = String(now.getDate()).padStart(2, '0');
    //     const timestamp = now.getTime().toString().slice(-4);

    //     const invoiceNumber = `INV-${year}${month}${day}-${timestamp}`;
    //     setData('no_invoice', invoiceNumber);
    // };

    // Hitung tanggal jatuh tempo (default 30 hari dari tanggal invoice)
    const calculateDueDate = (invoiceDate: string) => {
        if (!invoiceDate) return;

        const date = new Date(invoiceDate);
        date.setDate(date.getDate() + 30); // 30 hari

        const formattedDate = date.toISOString().split('T')[0];
        setData('tgl_jatuh_tempo', formattedDate);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Invoice" />
            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tambah Invoice (Masih Maintanance karena salah ngitung)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Surat Jalan */}
                                    <div className="space-y-2">
                                        <Label htmlFor="id_surat_jalan">
                                            Surat Jalan <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={data.id_surat_jalan}
                                            onValueChange={(value) => setData('id_surat_jalan', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Surat Jalan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {suratJalans.map((suratJalan) => (
                                                    <SelectItem key={suratJalan.id} value={suratJalan.id}>
                                                        {suratJalan.no_surat_jalan}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.id_surat_jalan && (
                                            <p className="text-sm text-red-600">{errors.id_surat_jalan}</p>
                                        )}
                                    </div>

                                    {/* No Invoice
                                    <div className="space-y-2">
                                        <Label htmlFor="no_invoice">
                                            No. Invoice <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="no_invoice"
                                                type="text"
                                                value={data.no_invoice}
                                                onChange={(e) => setData('no_invoice', e.target.value)}
                                                placeholder="Masukkan nomor invoice"
                                                className="flex-1"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={generateInvoiceNumber}
                                            >
                                                Generate
                                            </Button>
                                        </div>
                                        {errors.no_invoice && (
                                            <p className="text-sm text-red-600">{errors.no_invoice}</p>
                                        )}
                                    </div> */}

                                    {/* Tanggal Invoice */}
                                    <div className="space-y-2">
                                        <Label htmlFor="tgl_invoice">
                                            Tanggal Invoice <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="tgl_invoice"
                                            type="date"
                                            value={data.tgl_invoice}
                                            onChange={(e) => {
                                                setData('tgl_invoice', e.target.value);
                                                calculateDueDate(e.target.value);
                                            }}
                                        />
                                        {errors.tgl_invoice && (
                                            <p className="text-sm text-red-600">{errors.tgl_invoice}</p>
                                        )}
                                    </div>

                                    {/* Tanggal Jatuh Tempo */}
                                    <div className="space-y-2">
                                        <Label htmlFor="tgl_jatuh_tempo">
                                            Tanggal Jatuh Tempo <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="tgl_jatuh_tempo"
                                            type="date"
                                            value={data.tgl_jatuh_tempo}
                                            onChange={(e) => setData('tgl_jatuh_tempo', e.target.value)}
                                        />
                                        {errors.tgl_jatuh_tempo && (
                                            <p className="text-sm text-red-600">{errors.tgl_jatuh_tempo}</p>
                                        )}
                                    </div>

                                    {/* Harga */}
                                    <div className="space-y-2">
                                        <Label htmlFor="harga">
                                            Harga <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="harga"
                                            type="number"
                                            min="0"
                                            value={data.harga}
                                            onChange={(e) => setData('harga', e.target.value)}
                                            placeholder="0"
                                        />
                                        {errors.harga && (
                                            <p className="text-sm text-red-600">{errors.harga}</p>
                                        )}
                                    </div>

                                    {/* PPN */}
                                    <div className="space-y-2">
                                        <Label htmlFor="ppn">
                                            PPN (%) <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="ppn"
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            value={data.ppn}
                                            onChange={(e) => setData('ppn', e.target.value)}
                                            placeholder="11.00"
                                        />
                                        {errors.ppn && (
                                            <p className="text-sm text-red-600">{errors.ppn}</p>
                                        )}
                                    </div>

                                    {/* Ongkos Kirim */}
                                    <div className="space-y-2">
                                        <Label htmlFor="ongkos_kirim">Ongkos Kirim</Label>
                                        <Input
                                            id="ongkos_kirim"
                                            type="number"
                                            min="0"
                                            value={data.ongkos_kirim}
                                            onChange={(e) => setData('ongkos_kirim', e.target.value)}
                                            placeholder="0"
                                        />
                                        {errors.ongkos_kirim && (
                                            <p className="text-sm text-red-600">{errors.ongkos_kirim}</p>
                                        )}
                                    </div>

                                    {/* Uang Muka */}
                                    <div className="space-y-2">
                                        <Label htmlFor="uang_muka">Uang Muka</Label>
                                        <Input
                                            id="uang_muka"
                                            type="number"
                                            min="0"
                                            value={data.uang_muka}
                                            onChange={(e) => setData('uang_muka', e.target.value)}
                                            placeholder="0"
                                        />
                                        {errors.uang_muka && (
                                            <p className="text-sm text-red-600">{errors.uang_muka}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Summary Card */}
                                {(data.harga || data.ppn || data.ongkos_kirim || data.uang_muka) && (
                                    <Card className="bg-gray-50 dark:bg-gray-800">
                                        <CardHeader>
                                            <CardTitle className="text-lg">Ringkasan Invoice</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span>Subtotal:</span>
                                                    <span>Rp {Number(data.harga || 0).toLocaleString('id-ID')}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>PPN ({data.ppn}%):</span>
                                                    <span>Rp {(Number(data.harga || 0) * Number(data.ppn || 0) / 100).toLocaleString('id-ID')}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Ongkos Kirim:</span>
                                                    <span>Rp {Number(data.ongkos_kirim || 0).toLocaleString('id-ID')}</span>
                                                </div>
                                                <div className="flex justify-between border-t pt-2">
                                                    <span>Total:</span>
                                                    <span className="font-semibold">
                                                        Rp {(
                                                            Number(data.harga || 0) +
                                                            (Number(data.harga || 0) * Number(data.ppn || 0) / 100) +
                                                            Number(data.ongkos_kirim || 0)
                                                        ).toLocaleString('id-ID')}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Uang Muka:</span>
                                                    <span>Rp {Number(data.uang_muka || 0).toLocaleString('id-ID')}</span>
                                                </div>
                                                <div className="flex justify-between border-t pt-2 font-bold">
                                                    <span>Sisa Tagihan:</span>
                                                    <span>
                                                        Rp {(
                                                            Number(data.harga || 0) +
                                                            (Number(data.harga || 0) * Number(data.ppn || 0) / 100) +
                                                            Number(data.ongkos_kirim || 0) -
                                                            Number(data.uang_muka || 0)
                                                        ).toLocaleString('id-ID')}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                <div className="flex justify-end gap-4">
                                    <Link href={route('invoices.index')}>
                                        <Button type="button" variant="outline">
                                            Batal
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
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
