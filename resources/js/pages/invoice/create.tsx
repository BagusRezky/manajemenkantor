import { DatePicker } from '@/components/date-picker';
import { SearchableSelect } from '@/components/search-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { SuratJalan } from '@/types/suratJalan';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
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
    const [selectedSuratJalan, setSelectedSuratJalan] = useState<SuratJalan | null>(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        id_surat_jalan: '',
        no_invoice: '',
        tgl_invoice: '',
        tgl_jatuh_tempo: '',
        discount: '',
        ppn: '',
        ongkos_kirim: '',
        uang_muka: '',
    });

    const handleSJChange = (value: string) => {
        const suratJalan = suratJalans.find((sj) => String(sj.id) === value);
        setSelectedSuratJalan(suratJalan || null);
        setData('id_surat_jalan', suratJalan ? suratJalan.id : '');
    };

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Invoice" />
            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tambah Invoice </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                {/* Surat Jalan */}
                                <div className="space-y-2">
                                    <Label htmlFor="id_surat_jalan">
                                        Surat Jalan <span className="text-red-500">*</span>
                                    </Label>
                                    <SearchableSelect
                                        items={suratJalans.map((surat) => ({
                                            key: String(surat.id),
                                            value: String(surat.id),
                                            label: `${surat.no_surat_jalan} || ${surat.kartu_instruksi_kerja?.no_kartu_instruksi_kerja || '-'}`,
                                        }))}
                                        value={data.id_surat_jalan || ''} // fallback to empty string
                                        placeholder="Pilih Surat Jalan"
                                        onChange={handleSJChange}
                                    />
                                    {errors.id_surat_jalan && <div className="text-sm text-red-600">{errors.id_surat_jalan}</div>}
                                </div>

                                {selectedSuratJalan && (
                                    <div className="rounded-md border bg-gray-50 p-4 dark:bg-gray-800">
                                        <h3 className="mb-3 font-medium">Detail Surat Jalan Terpilih</h3>
                                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                            <div>
                                                <p>
                                                    <span className="font-medium">No. Surat Jalan:</span> {selectedSuratJalan.no_surat_jalan}
                                                </p>
                                                <p>
                                                    <span className="font-medium">Tanggal Surat Jalan:</span>{' '}
                                                    {selectedSuratJalan.tgl_surat_jalan || '-'}
                                                </p>
                                                <p>
                                                    <span className="font-medium">Qty Pengiriman:</span> {selectedSuratJalan.qty_pengiriman || '-'}
                                                </p>
                                            </div>
                                            <div>
                                                <p>
                                                    <span className="font-medium">No. SPK:</span>{' '}
                                                    {selectedSuratJalan.kartu_instruksi_kerja?.no_kartu_instruksi_kerja || '-'}
                                                </p>
                                                <p>
                                                    <span className="font-medium">No. SO:</span>{' '}
                                                    {selectedSuratJalan.kartu_instruksi_kerja?.sales_order?.no_bon_pesanan || '-'}
                                                </p>
                                                <p>
                                                    <span className="font-medium">Harga:</span>{' '}
                                                    {selectedSuratJalan.kartu_instruksi_kerja?.sales_order?.harga_pcs_bp || '-'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Tanggal Invoice */}
                                    <div className="space-y-2">
                                        <Label htmlFor="tgl_invoice">
                                            Tanggal Invoice <span className="text-red-500">*</span>
                                        </Label>
                                        <DatePicker
                                            value={data.tgl_invoice}
                                            onChange={(date) => {
                                                if (date) {
                                                    const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                                                        .toISOString()
                                                        .split('T')[0];
                                                    setData('tgl_invoice', formattedDate);
                                                } else {
                                                    setData('tgl_invoice', '');
                                                }
                                            }}
                                        />
                                        {errors.tgl_invoice && <p className="text-sm text-red-600">{errors.tgl_invoice}</p>}
                                    </div>

                                    {/* Tanggal Jatuh Tempo */}
                                    <div className="space-y-2">
                                        <Label htmlFor="tgl_jatuh_tempo">
                                            Tanggal Jatuh Tempo <span className="text-red-500">*</span>
                                        </Label>

                                        <DatePicker
                                            value={data.tgl_jatuh_tempo}
                                            onChange={(date) => {
                                                if (date) {
                                                    const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                                                        .toISOString()
                                                        .split('T')[0];
                                                    setData('tgl_jatuh_tempo', formattedDate);
                                                } else {
                                                    setData('tgl_jatuh_tempo', '');
                                                }
                                            }}
                                        />
                                        {errors.tgl_jatuh_tempo && <p className="text-sm text-red-600">{errors.tgl_jatuh_tempo}</p>}
                                    </div>

                                    {/* Discount */}
                                    <div className="space-y-2">
                                        <Label htmlFor="discount">
                                            Discount <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="discount"
                                            type="number"
                                            min="0"
                                            value={data.discount}
                                            onChange={(e) => setData('discount', e.target.value)}
                                            placeholder="0"
                                        />
                                        {errors.discount && <p className="text-sm text-red-600">{errors.discount}</p>}
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
                                            placeholder="0"
                                        />
                                        {errors.ppn && <p className="text-sm text-red-600">{errors.ppn}</p>}
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
                                        {errors.ongkos_kirim && <p className="text-sm text-red-600">{errors.ongkos_kirim}</p>}
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
                                        {errors.uang_muka && <p className="text-sm text-red-600">{errors.uang_muka}</p>}
                                    </div>
                                </div>

                                {/* Summary Card */}
                                {(data.discount || data.ppn || data.ongkos_kirim || data.uang_muka) && (
                                    <Card className="bg-gray-50 dark:bg-gray-800">
                                        <CardHeader>
                                            <CardTitle className="text-lg">Ringkasan Invoice</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span>Subtotal:</span>
                                                    <span>
                                                        Rp{' '}
                                                        {(() => {
                                                            const discount = Number(data.discount || 0);
                                                            const qtyPengiriman = Number(selectedSuratJalan?.qty_pengiriman || 0);
                                                            const hargaSO = Number(
                                                                selectedSuratJalan?.kartu_instruksi_kerja?.sales_order?.harga_pcs_bp || 0,
                                                            );

                                                            // Subtotal
                                                            const subtotalSebelumToleransi = hargaSO * qtyPengiriman;

                                                            const subtotal = subtotalSebelumToleransi - discount;

                                                            return subtotal.toLocaleString('id-ID');
                                                        })()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>PPN ({data.ppn}%):</span>
                                                    <span>
                                                        Rp{' '}
                                                        {(() => {
                                                            const discount = Number(data.discount || 0);
                                                            const qtyPengiriman = Number(selectedSuratJalan?.qty_pengiriman || 0);
                                                            const hargaSO = Number(
                                                                selectedSuratJalan?.kartu_instruksi_kerja?.sales_order?.harga_pcs_bp || 0,
                                                            );
                                                            const ppnRate = Number(data.ppn || 0);

                                                            // Hitung subtotal terlebih dahulu
                                                            const subtotalSebelumToleransi = hargaSO * qtyPengiriman;

                                                            const subtotal = subtotalSebelumToleransi - discount;

                                                            // PPN = subtotal * ppn_rate / 100
                                                            const ppnAmount = (subtotal * ppnRate) / 100;

                                                            return ppnAmount.toLocaleString('id-ID');
                                                        })()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Ongkos Kirim:</span>
                                                    <span>Rp {Number(data.ongkos_kirim || 0).toLocaleString('id-ID')}</span>
                                                </div>
                                                <div className="flex justify-between border-t pt-2">
                                                    <span>Total:</span>
                                                    <span className="font-semibold">
                                                        Rp{' '}
                                                        {(() => {
                                                            const discount = Number(data.discount || 0);
                                                            const qtyPengiriman = Number(selectedSuratJalan?.qty_pengiriman || 0);
                                                            const hargaSO = Number(
                                                                selectedSuratJalan?.kartu_instruksi_kerja?.sales_order?.harga_pcs_bp || 0,
                                                            );
                                                            const ppnRate = Number(data.ppn || 0);
                                                            const ongkosKirim = Number(data.ongkos_kirim || 0);

                                                            // Hitung subtotal
                                                            const subtotalSebelumToleransi = hargaSO * qtyPengiriman;
                                                            const subtotal = subtotalSebelumToleransi - discount;

                                                            // Hitung PPN
                                                            const ppnAmount = (subtotal * ppnRate) / 100;

                                                            // Total = subtotal + PPN + ongkos kirim
                                                            const total = subtotal + ppnAmount + ongkosKirim;

                                                            return total.toLocaleString('id-ID');
                                                        })()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Uang Muka:</span>
                                                    <span>Rp {Number(data.uang_muka || 0).toLocaleString('id-ID')}</span>
                                                </div>
                                                <div className="flex justify-between border-t pt-2 font-bold">
                                                    <span>Sisa Tagihan:</span>
                                                    <span>
                                                        Rp{' '}
                                                        {(() => {
                                                            const discount = Number(data.discount || 0);
                                                            const qtyPengiriman = Number(selectedSuratJalan?.qty_pengiriman || 0);
                                                            const hargaSO = Number(
                                                                selectedSuratJalan?.kartu_instruksi_kerja?.sales_order?.harga_pcs_bp || 0,
                                                            );
                                                            const ppnRate = Number(data.ppn || 0);
                                                            const ongkosKirim = Number(data.ongkos_kirim || 0);
                                                            const uangMuka = Number(data.uang_muka || 0);

                                                            // Hitung subtotal
                                                            const subtotalSebelumToleransi = hargaSO * qtyPengiriman;
                                                            const subtotal = subtotalSebelumToleransi - discount;

                                                            // Hitung PPN
                                                            const ppnAmount = (subtotal * ppnRate) / 100;

                                                            // Hitung total
                                                            const total = subtotal + ppnAmount + ongkosKirim;

                                                            // Sisa tagihan = total - uang muka
                                                            const sisaTagihan = total - uangMuka;

                                                            return sisaTagihan.toLocaleString('id-ID');
                                                        })()}
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
