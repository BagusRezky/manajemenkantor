/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePicker } from '@/components/date-picker';
import { SearchableSelect } from '@/components/search-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { KartuInstruksiKerja } from '@/types/kartuInstruksiKerja';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Blokir',
        href: '/blokirs',
    },
    {
        title: 'Tambah Data',
        href: '/blokirs/create',
    },
];

interface Props {
    kartuInstruksiKerjas: KartuInstruksiKerja[];
}

export default function CreateBlokir({ kartuInstruksiKerjas }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        id_kartu_instruksi_kerja: '',
        no_blokir: '',
        tgl_blokir: new Date().toISOString().split('T')[0],
        operator: '',
        qty_blokir: '',
        keterangan_blokir: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Debug: Log data sebelum submit
        console.log('Data before submit:', data);

        post(route('blokirs.store'), {
            onSuccess: () => {
                console.log('Success!');
            },
            onError: (errors) => {
                console.log('Errors:', errors);
            },
        });
    };

    // Handler untuk number inputs dengan validasi
    const handleNumberChange = (field: string, value: string) => {
        // Pastikan value tidak negatif dan adalah angka valid
        const numValue = value === '' ? '' : Math.max(0, parseInt(value) || 0).toString();
        setData(field as any, numValue);
    };

    // Update the selectedKik logic
    const selectedKik = data.id_kartu_instruksi_kerja
        ? kartuInstruksiKerjas.find((k) => String(k.id) === String(data.id_kartu_instruksi_kerja))
        : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Data Blokir" />
            <div className="mx-5 py-5">
                <Card>
                    <CardHeader>
                        <CardTitle>Tambah Data Blokir</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Surat Perintah Kerja */}
                                <div className="space-y-2">
                                    <Label htmlFor="id_kartu_instruksi_kerja">Surat Perintah Kerja *</Label>
                                    <SearchableSelect
                                        items={kartuInstruksiKerjas.map((kartu) => ({
                                            key: String(kartu.id),
                                            value: String(kartu.id),
                                            label: `${kartu.no_kartu_instruksi_kerja} - ${kartu.sales_order?.finish_good_item?.nama_barang || ''}`,
                                        }))}
                                        value={data.id_kartu_instruksi_kerja || ''} // fallback to empty string
                                        placeholder="Pilih SPK"
                                        onChange={(value) => setData('id_kartu_instruksi_kerja', value)}
                                    />
                                    {errors.id_kartu_instruksi_kerja && <div className="text-sm text-red-600">{errors.id_kartu_instruksi_kerja}</div>}
                                </div>

                                {/* No Blokir */}
                                <div className="space-y-2">
                                    <Label htmlFor="no_blokir">No. Blokir *</Label>
                                    <Input
                                        id="no_blokir"
                                        type="text"
                                        value={data.no_blokir}
                                        onChange={(e) => setData('no_blokir', e.target.value)}
                                        placeholder="Masukkan nomor blokir"
                                        className={errors.no_blokir ? 'border-red-500' : ''}
                                    />
                                    {errors.no_blokir && <div className="text-sm text-red-600">{errors.no_blokir}</div>}
                                </div>

                                {/* Tanggal Blokir */}
                                <div className="space-y-2">
                                    <Label htmlFor="tgl_blokir">Tanggal Blokir *</Label>
                                    <DatePicker
                                        value={data.tgl_blokir}
                                        onChange={(date) => {
                                            if (date) {
                                                const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                                                    .toISOString()
                                                    .split('T')[0];
                                                setData('tgl_blokir', formattedDate);
                                            } else {
                                                setData('tgl_blokir', '');
                                            }
                                        }}
                                    />
                                    {errors.tgl_blokir && <p className="text-sm text-red-500">{errors.tgl_blokir}</p>}
                                </div>

                                {/* Operator */}
                                <div className="space-y-2">
                                    <Label htmlFor="operator">Operator *</Label>
                                    <Input
                                        id="operator"
                                        type="text"
                                        value={data.operator}
                                        onChange={(e) => setData('operator', e.target.value)}
                                        placeholder="Nama operator"
                                        className={errors.operator ? 'border-red-500' : ''}
                                    />
                                    {errors.operator && <div className="text-sm text-red-600">{errors.operator}</div>}
                                </div>

                                {/* Qty Blokir */}
                                <div className="space-y-2">
                                    <Label htmlFor="qty_blokir">Qty Blokir *</Label>
                                    <Input
                                        id="qty_blokir"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={data.qty_blokir}
                                        onChange={(e) => handleNumberChange('qty_blokir', e.target.value)}
                                        placeholder="0"
                                        className={errors.qty_blokir ? 'border-red-500' : ''}
                                    />
                                    {errors.qty_blokir && <div className="text-sm text-red-600">{errors.qty_blokir}</div>}
                                    <div className="text-xs text-gray-500">Current value: {data.qty_blokir || '0'}</div>
                                </div>
                            </div>

                            {/* Keterangan Blokir */}
                            <div className="space-y-2">
                                <Label htmlFor="keterangan_blokir">Keterangan</Label>
                                <Textarea
                                    id="keterangan_blokir"
                                    value={data.keterangan_blokir}
                                    onChange={(e) => setData('keterangan_blokir', e.target.value)}
                                    placeholder="Keterangan blokir (opsional)"
                                    rows={3}
                                    className={errors.keterangan_blokir ? 'border-red-500' : ''}
                                />
                                {errors.keterangan_blokir && <div className="text-sm text-red-600">{errors.keterangan_blokir}</div>}
                            </div>

                            {/* Selected KIK Details */}
                            {selectedKik && (
                                <div className="rounded-lg border bg-gray-50 p-4">
                                    <h4 className="mb-3 font-medium">Detail Surat Perintah Kerja</h4>
                                    <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                                        <div>
                                            <span className="font-medium">No. SO:</span> {selectedKik.sales_order?.no_bon_pesanan || '-'}
                                        </div>
                                        <div>
                                            <span className="font-medium">Customer:</span>{' '}
                                            {selectedKik.sales_order?.customer_address?.nama_customer || '-'}
                                        </div>
                                        <div>
                                            <span className="font-medium">Nama Barang:</span>{' '}
                                            {selectedKik.sales_order?.finish_good_item?.nama_barang || '-'}
                                        </div>
                                        <div>
                                            <span className="font-medium">Jumlah Pesanan:</span>{' '}
                                            {selectedKik.sales_order?.jumlah_pesanan?.toLocaleString() || '-'}
                                        </div>
                                        <div>
                                            <span className="font-medium">Deskripsi:</span>{' '}
                                            {selectedKik.sales_order?.finish_good_item?.deskripsi || '-'}
                                        </div>
                                        <div>
                                            <span className="font-medium">Ukuran Potong:</span>{' '}
                                            {selectedKik.sales_order?.finish_good_item?.ukuran_potong || '-'}
                                        </div>
                                        <div>
                                            <span className="font-medium">Ukuran Cetak:</span>{' '}
                                            {selectedKik.sales_order?.finish_good_item?.ukuran_cetak || '-'}
                                        </div>
                                        <div>
                                            <span className="font-medium">Spesifikasi Kertas:</span>{' '}
                                            {selectedKik.sales_order?.finish_good_item?.spesifikasi_kertas || '-'}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Debug Info - Remove in production
                            {process.env.NODE_ENV === 'development' && (
                                <div className="rounded bg-gray-100 p-4 text-sm">
                                    <strong>Debug Info:</strong>
                                    <pre>{JSON.stringify(data, null, 2)}</pre>
                                </div>
                            )} */}

                            {/* Actions */}
                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                    Batal
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
