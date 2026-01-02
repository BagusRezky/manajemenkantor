import { SearchableSelect } from '@/components/search-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { KartuInstruksiKerja } from '@/types/kartuInstruksiKerja';
import { Packaging } from '@/types/packaging';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';

interface Props {
    packaging: Packaging;
    kartuInstruksiKerjas: KartuInstruksiKerja[];
}

export default function EditPackaging({ packaging, kartuInstruksiKerjas }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Packaging', href: '/packagings' },
        { title: 'Edit Packaging', href: '#' },
    ];

    const { data, setData, put, processing, errors } = useForm({
        id_kartu_instruksi_kerja: String(packaging.id_kartu_instruksi_kerja),
        satuan_transfer: packaging.satuan_transfer,
        jenis_transfer: packaging.jenis_transfer,
        tgl_transfer: packaging.tgl_transfer,
        jumlah_satuan_penuh: packaging.jumlah_satuan_penuh,
        qty_persatuan_penuh: packaging.qty_persatuan_penuh,
        jumlah_satuan_sisa: packaging.jumlah_satuan_sisa,
        qty_persatuan_sisa: packaging.qty_persatuan_sisa,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('packagings.update', packaging.id), {
            onSuccess: () => toast.success('Packaging berhasil diperbarui'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Packaging - ${packaging.kode_packaging}`} />
            <div className="mx-5 py-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Edit Packaging: {packaging.kode_packaging}</CardTitle>
                        <Link href={route('packagings.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Surat Perintah Kerja *</Label>
                                    <SearchableSelect
                                        items={kartuInstruksiKerjas.map((k) => ({
                                            key: String(k.id),
                                            value: String(k.id),
                                            label: k.no_kartu_instruksi_kerja,
                                        }))}
                                        value={data.id_kartu_instruksi_kerja}
                                        onChange={(val) => setData('id_kartu_instruksi_kerja', val)}
                                    />
                                    {errors.id_kartu_instruksi_kerja && <p className="text-sm text-red-600">{errors.id_kartu_instruksi_kerja}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Tanggal Transfer *</Label>
                                    <Input type="date" value={data.tgl_transfer} onChange={(e) => setData('tgl_transfer', e.target.value)} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Satuan Transfer *</Label>
                                    <Select value={data.satuan_transfer} onValueChange={(val) => setData('satuan_transfer', val)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Box">Box</SelectItem>
                                            <SelectItem value="Pallete">Pallete</SelectItem>
                                            <SelectItem value="Pack">Pack</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Jenis Transfer *</Label>
                                    <Select value={data.jenis_transfer} onValueChange={(val) => setData('jenis_transfer', val)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Barang Hasil Baik">Barang Hasil Baik</SelectItem>
                                            <SelectItem value="Label Kuning">Label Kuning</SelectItem>
                                            <SelectItem value="Blokir">Blokir</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-8 rounded-lg border border-dashed bg-gray-50 p-4 md:grid-cols-2 dark:bg-gray-900/50">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold uppercase">Satuan Penuh</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Jumlah {data.satuan_transfer}</Label>
                                            <Input
                                                type="number"
                                                value={data.jumlah_satuan_penuh}
                                                onChange={(e) => setData('jumlah_satuan_penuh', parseInt(e.target.value) || 0)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Qty / {data.satuan_transfer}</Label>
                                            <Input
                                                type="number"
                                                value={data.qty_persatuan_penuh}
                                                onChange={(e) => setData('qty_persatuan_penuh', parseInt(e.target.value) || 0)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold uppercase">Satuan Sisa</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Jumlah Sisa</Label>
                                            <Input
                                                type="number"
                                                value={data.jumlah_satuan_sisa}
                                                onChange={(e) => setData('jumlah_satuan_sisa', parseInt(e.target.value) || 0)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Qty / Sisa</Label>
                                            <Input
                                                type="number"
                                                value={data.qty_persatuan_sisa}
                                                onChange={(e) => setData('qty_persatuan_sisa', parseInt(e.target.value) || 0)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button type="submit" disabled={processing} className="bg-green-600 hover:bg-green-700">
                                    <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
