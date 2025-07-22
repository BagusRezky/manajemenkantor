import { DatePicker } from '@/components/date-picker';
import { SearchableSelect } from '@/components/search-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { KartuInstruksiKerja } from '@/types/kartuInstruksiKerja';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Packaging',
        href: '/packagings',
    },
    {
        title: 'Tambah Packaging',
        href: '/packagings/create',
    },
];

interface Props {
    kartuInstruksiKerjas: KartuInstruksiKerja[];
}

export default function CreatePackaging({ kartuInstruksiKerjas }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        id_kartu_instruksi_kerja: '',
        satuan_transfer: '',
        jenis_transfer: '',
        tgl_transfer: '',
        jumlah_satuan_penuh: 0,
        qty_persatuan_penuh: 0,
        jumlah_satuan_sisa: 0,
        qty_persatuan_sisa: 0,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('packagings.store'), {
            onSuccess: () => {
                toast.success('Packaging berhasil dibuat');
            },
            onError: () => {
                toast.error('Gagal membuat packaging');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Packaging" />
            <div className="mx-5 py-5">
                <Card>
                    <CardHeader>
                        <CardTitle>Tambah Packaging</CardTitle>
                        <CardDescription>Buat data packaging baru</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="id_kartu_instruksi_kerja">Surat Perintah Kerja *</Label>
                                    <SearchableSelect
                                        items={kartuInstruksiKerjas.map((kartu) => ({
                                            key: String(kartu.id),
                                            value: String(kartu.id),
                                            label: kartu.no_kartu_instruksi_kerja,
                                        }))}
                                        value={data.id_kartu_instruksi_kerja || ''} // fallback to empty string
                                        placeholder="Pilih SPK"
                                        onChange={(value) => setData('id_kartu_instruksi_kerja', value)}
                                    />
                                    {errors.id_kartu_instruksi_kerja && <div className="text-sm text-red-600">{errors.id_kartu_instruksi_kerja}</div>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="satuan_transfer">Satuan Transfer *</Label>
                                    <Select value={data.satuan_transfer} onValueChange={(value) => setData('satuan_transfer', value)}>
                                        <SelectTrigger className={errors.satuan_transfer ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Pilih Satuan Transfer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Box">Box</SelectItem>
                                            <SelectItem value="Pallete">Pallete</SelectItem>
                                            <SelectItem value="Pack">Pack</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {errors.satuan_transfer && <p className="text-sm text-red-600">{errors.satuan_transfer}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jenis_transfer">Jenis Transfer *</Label>
                                    <Select value={data.jenis_transfer} onValueChange={(value) => setData('jenis_transfer', value)}>
                                        <SelectTrigger className={errors.jenis_transfer ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Pilih Jenis Transfer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Barang Hasil Baik">Barang Hasil Baik</SelectItem>
                                            <SelectItem value="Label Kuning">Label Kuning</SelectItem>
                                            <SelectItem value="Blokir">Blokir</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.jenis_transfer && <p className="text-sm text-red-600">{errors.jenis_transfer}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tgl_transfer">Tanggal Transfer *</Label>
                                    <DatePicker
                                        id="tgl_transfer"
                                        value={data.tgl_transfer}
                                        onChange={(e) => setData('tgl_transfer', e.target.value ? e.target.value : '')}
                                    />
                                    {errors.tgl_transfer && <p className="text-sm text-red-600">{errors.tgl_transfer}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jumlah_satuan_penuh">Jumlah Satuan Penuh *</Label>
                                    <Input
                                        id="jumlah_satuan_penuh"
                                        type="number"
                                        min="0"
                                        value={data.jumlah_satuan_penuh}
                                        onChange={(e) => setData('jumlah_satuan_penuh', parseInt(e.target.value) || 0)}
                                        placeholder="0"
                                    />
                                    {errors.jumlah_satuan_penuh && <p className="text-sm text-red-600">{errors.jumlah_satuan_penuh}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="qty_persatuan_penuh">Qty Per Satuan Penuh *</Label>
                                    <Input
                                        id="qty_persatuan_penuh"
                                        type="number"
                                        min="0"
                                        value={data.qty_persatuan_penuh}
                                        onChange={(e) => setData('qty_persatuan_penuh', parseInt(e.target.value) || 0)}
                                        placeholder="0"
                                    />
                                    {errors.qty_persatuan_penuh && <p className="text-sm text-red-600">{errors.qty_persatuan_penuh}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jumlah_satuan_sisa">Jumlah Satuan Sisa *</Label>
                                    <Input
                                        id="jumlah_satuan_sisa"
                                        type="number"
                                        min="0"
                                        value={data.jumlah_satuan_sisa}
                                        onChange={(e) => setData('jumlah_satuan_sisa', parseInt(e.target.value) || 0)}
                                        placeholder="0"
                                    />
                                    {errors.jumlah_satuan_sisa && <p className="text-sm text-red-600">{errors.jumlah_satuan_sisa}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="qty_persatuan_sisa">Qty Per Satuan Sisa *</Label>
                                    <Input
                                        id="qty_persatuan_sisa"
                                        type="number"
                                        min="0"
                                        value={data.qty_persatuan_sisa}
                                        onChange={(e) => setData('qty_persatuan_sisa', parseInt(e.target.value) || 0)}
                                        placeholder="0"
                                    />
                                    {errors.qty_persatuan_sisa && <p className="text-sm text-red-600">{errors.qty_persatuan_sisa}</p>}
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                                    <h3 className="mb-2 font-medium">Ringkasan</h3>
                                    <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                                        <div>
                                            <span className="text-gray-600 dark:text-gray-400">Total Satuan Penuh:</span>
                                            <p className="font-medium">{data.jumlah_satuan_penuh * data.qty_persatuan_penuh}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600 dark:text-gray-400">Total Satuan Sisa:</span>
                                            <p className="font-medium">{data.jumlah_satuan_sisa * data.qty_persatuan_sisa}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600 dark:text-gray-400">Grand Total:</span>
                                            <p className="text-lg font-bold">
                                                {data.jumlah_satuan_penuh * data.qty_persatuan_penuh +
                                                    data.jumlah_satuan_sisa * data.qty_persatuan_sisa}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
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
