/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchableSelect } from '@/components/search-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Invoice } from '@/types/invoice';
import { SuratJalan } from '@/types/suratJalan';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Invoice', href: '/invoices' },
    { title: 'Edit', href: '#' },
];

interface EditProps {
    invoice: Invoice;
    suratJalans: SuratJalan[];
}

export default function Edit({ invoice, suratJalans }: EditProps) {
    const [selectedSuratJalan, setSelectedSuratJalan] = useState<SuratJalan | null>(null);

    const { data, setData, put, processing, errors } = useForm({
        id_surat_jalan: invoice.id_surat_jalan || '',
        no_invoice: invoice.no_invoice || '',
        tgl_invoice: invoice.tgl_invoice || '',
        tgl_jatuh_tempo: invoice.tgl_jatuh_tempo || '',
        discount: invoice.discount.toString() || '0',
        ppn: invoice.ppn.toString() || '0',
        ongkos_kirim: invoice.ongkos_kirim.toString() || '0',
        uang_muka: invoice.uang_muka.toString() || '0',
    });

    // Inisialisasi selectedSuratJalan saat halaman dimuat
    useEffect(() => {
        if (invoice.id_surat_jalan) {
            const sj = suratJalans.find((s) => String(s.id) === String(invoice.id_surat_jalan));
            if (sj) setSelectedSuratJalan(sj);
        }
    }, [invoice, suratJalans]);

    const handleSJChange = (value: string) => {
        const suratJalan = suratJalans.find((sj) => String(sj.id) === value);
        setSelectedSuratJalan(suratJalan || null);
        setData('id_surat_jalan', value);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('invoices.update', invoice.id), {
            onSuccess: () => toast.success('Invoice berhasil diperbarui'),
            onError: () => toast.error('Gagal memperbarui Invoice'),
        });
    };

    // Helper untuk kalkulasi
    const calculateSummary = () => {
        const qty = Number(selectedSuratJalan?.qty_pengiriman || 0);
        const harga = Number((selectedSuratJalan as any)?.kartu_instruksi_kerja?.sales_order?.harga_pcs_bp || 0);
        const disc = Number(data.discount || 0);
        const ppnRate = Number(data.ppn || 0);
        const ongkir = Number(data.ongkos_kirim || 0);
        const dp = Number(data.uang_muka || 0);

        const subtotal = qty * harga - disc;
        const ppnNominal = (subtotal * ppnRate) / 100;
        const total = subtotal + ppnNominal + ongkir;
        const sisa = total - dp;

        return { subtotal, ppnNominal, total, sisa };
    };

    const summary = calculateSummary();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Invoice - ${invoice.no_invoice}`} />
            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Edit Invoice: {invoice.no_invoice}</CardTitle>
                            <Link href={route('invoices.index')}>
                                <Button variant="outline" size="sm">
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="space-y-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="no_invoice">Nomor Invoice</Label>
                                        <Input
                                            id="no_invoice"
                                            type="text"
                                            value={data.no_invoice}
                                            onChange={(e) => setData('no_invoice', e.target.value)}
                                            placeholder="000001/INV/MMYY"
                                            className="font-mono font-bold text-blue-600 uppercase"
                                        />
                                        {errors.no_invoice && <p className="text-sm text-red-600">{errors.no_invoice}</p>}
                                    </div>
                                    <Label>Pilih Surat Jalan *</Label>
                                    <SearchableSelect
                                        items={suratJalans.map((sj) => ({
                                            key: String(sj.id),
                                            value: String(sj.id),
                                            label: `${sj.no_surat_jalan} | SPK: ${sj.kartu_instruksi_kerja?.no_kartu_instruksi_kerja || '-'}`,
                                        }))}
                                        value={data.id_surat_jalan}
                                        onChange={handleSJChange}
                                        placeholder={
                                            selectedSuratJalan
                                                ? `${selectedSuratJalan.no_surat_jalan} | SPK: ${selectedSuratJalan.kartu_instruksi_kerja?.no_kartu_instruksi_kerja || '-'}`
                                                : 'Pilih Surat Jalan...'
                                        }
                                    />
                                    {errors.id_surat_jalan && <p className="text-sm text-red-600">{errors.id_surat_jalan}</p>}
                                </div>

                                {selectedSuratJalan && (
                                    <div className="grid grid-cols-1 gap-4 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm md:grid-cols-2 dark:border-blue-800 dark:bg-blue-900/20">
                                        <div className="space-y-1">
                                            <p>
                                                <span className="text-gray-500">Customer:</span>{' '}
                                                <span className="font-semibold">
                                                    {(selectedSuratJalan as any).kartu_instruksi_kerja?.sales_order?.customer_address
                                                        ?.nama_customer || '-'}
                                                </span>
                                            </p>
                                            <p>
                                                <span className="text-gray-500">Qty Kirim:</span>{' '}
                                                <span className="font-semibold">{selectedSuratJalan.qty_pengiriman} pcs</span>
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p>
                                                <span className="text-gray-500">Harga Satuan:</span>{' '}
                                                <span className="font-mono font-semibold text-blue-600">
                                                    Rp{' '}
                                                    {Number(
                                                        (selectedSuratJalan as any).kartu_instruksi_kerja?.sales_order?.harga_pcs_bp || 0,
                                                    ).toLocaleString('id-ID')}
                                                </span>
                                            </p>
                                            <p>
                                                <span className="text-gray-500">No. SO:</span>{' '}
                                                <span className="font-semibold">
                                                    {(selectedSuratJalan as any).kartu_instruksi_kerja?.sales_order?.no_bon_pesanan || '-'}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="tgl_invoice">Tanggal Invoice</Label>
                                        <Input type="date" value={data.tgl_invoice} onChange={(e) => setData('tgl_invoice', e.target.value)} />
                                        {errors.tgl_invoice && <p className="text-xs text-red-500">{errors.tgl_invoice}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="tgl_jatuh_tempo">Jatuh Tempo</Label>
                                        <Input
                                            type="date"
                                            value={data.tgl_jatuh_tempo}
                                            onChange={(e) => setData('tgl_jatuh_tempo', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Discount (Rp)</Label>
                                        <Input
                                            type="number"
                                            value={data.discount}
                                            onChange={(e) => setData('discount', e.target.value)}
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>PPN (%)</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={data.ppn}
                                            onChange={(e) => setData('ppn', e.target.value)}
                                            placeholder="11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Ongkos Kirim (Rp)</Label>
                                        <Input
                                            type="number"
                                            value={data.ongkos_kirim}
                                            onChange={(e) => setData('ongkos_kirim', e.target.value)}
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Uang Muka / DP (Rp)</Label>
                                        <Input
                                            type="number"
                                            value={data.uang_muka}
                                            onChange={(e) => setData('uang_muka', e.target.value)}
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                {/* Live Summary Calculation */}
                                <div className="mt-8 space-y-3 rounded-xl bg-gray-900 p-6 font-mono text-white shadow-inner">
                                    <div className="flex justify-between text-sm opacity-70">
                                        <span>Subtotal (Net)</span>
                                        <span>Rp {summary.subtotal.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-sm opacity-70">
                                        <span>PPN Nominal ({data.ppn}%)</span>
                                        <span>Rp {summary.ppnNominal.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-sm opacity-70">
                                        <span>Ongkos Kirim</span>
                                        <span>Rp {Number(data.ongkos_kirim || 0).toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-white/20 pt-2 font-bold text-blue-400">
                                        <span>Total Tagihan</span>
                                        <span>Rp {summary.total.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-orange-400">
                                        <span>Uang Muka (DP)</span>
                                        <span>- Rp {Number(data.uang_muka || 0).toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between rounded border-t border-white/20 bg-white/5 p-2 pt-2 text-xl font-black">
                                        <span>SISA TAGIHAN</span>
                                        <span>Rp {summary.sisa.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="submit" disabled={processing} className="bg-green-600 hover:bg-green-700">
                                        <Save className="mr-2 h-4 w-4" /> {processing ? 'Menyimpan...' : 'Perbarui Invoice'}
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
