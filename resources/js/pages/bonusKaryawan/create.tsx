// pages/bonusKaryawan/create.tsx

import { Textarea } from '@/components/ui/textarea';
import { Head, useForm } from '@inertiajs/react';
import { SearchableSelect } from '../../components/search-select';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import AppLayout from '../../layouts/app-layout';
import { BreadcrumbItem } from '../../types';
import { Karyawan } from '../../types/karyawan';
import { Input } from '@/components/ui/input';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Bonus Karyawan',
        href: route('bonusKaryawans.index'),
    },
    {
        title: 'Tambah Data',
        href: route('bonusKaryawans.create'),
    },
];

interface Props {
    karyawans: Karyawan[];
}

export default function CreateBonusKaryawan({ karyawans }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        kode_gudang: '',
        id_karyawan: '',
        tanggal_bonus: '',
        nilai_bonus: 0,
        keterangan: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('bonusKaryawans.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Data Bonus Karyawan" />
            <div className="mx-5 py-5">
                <Card>
                    <CardHeader>
                        <CardTitle>Tambah Data Bonus Karyawan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Kode Gudang */}
                                <div className="space-y-2">
                                    <Label htmlFor="kode_gudang">Kode Gudang *</Label>
                                    <Input
                                        id="kode_gudang"
                                        value={data.kode_gudang}
                                        onChange={(e) => setData('kode_gudang', e.target.value)}
                                        className={errors.kode_gudang ? 'border-red-500' : ''}
                                    />
                                    {errors.kode_gudang && <p className="text-sm text-red-500">{errors.kode_gudang}</p>}
                                </div>

                                {/* Karyawan */}
                                <div className="space-y-2">
                                    <Label htmlFor="id_karyawan">Karyawan *</Label>
                                    <SearchableSelect
                                        items={karyawans.map((karyawan) => ({
                                            key: String(karyawan.id),
                                            value: String(karyawan.id),
                                            label: karyawan.nama ?? '',
                                        }))}
                                        value={data.id_karyawan || ''}
                                        placeholder="Pilih Karyawan"
                                        onChange={(value) => setData('id_karyawan', value)}
                                    />
                                    {errors.id_karyawan && <p className="text-sm text-red-500">{errors.id_karyawan}</p>}
                                </div>

                                {/* Tanggal Bonus */}
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_bonus">Tanggal Bonus *</Label>
                                    <Input
                                        type="date"
                                        id="tanggal_bonus"
                                        value={data.tanggal_bonus}
                                        onChange={(e) => setData('tanggal_bonus', e.target.value)}
                                    />
                                    {errors.tanggal_bonus && <p className="text-sm text-red-500">{errors.tanggal_bonus}</p>}
                                </div>

                                {/* Nilai Bonus */}
                                <div className="space-y-2">
                                    <Label htmlFor="nilai_bonus">Nilai Bonus *</Label>
                                    <Input
                                        id="nilai_bonus"
                                        type="number"
                                        value={data.nilai_bonus}
                                        onChange={(e) => setData('nilai_bonus', parseInt(e.target.value, 10))}
                                        className={errors.nilai_bonus ? 'border-red-500' : ''}
                                    />
                                    {errors.nilai_bonus && <p className="text-sm text-red-500">{errors.nilai_bonus}</p>}
                                </div>

                                {/* Keterangan */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="keterangan">Keterangan</Label>
                                    <Textarea id="keterangan" value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)} />
                                </div>
                            </div>

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
