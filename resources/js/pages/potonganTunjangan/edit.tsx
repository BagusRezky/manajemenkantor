// pages/potonganTunjangan/edit.tsx

import { Head, useForm } from '@inertiajs/react';
import { DatePicker } from '../../components/date-picker';
import { SearchableSelect } from '../../components/search-select';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import AppLayout from '../../layouts/app-layout';
import { BreadcrumbItem } from '../../types';
import { Karyawan } from '../../types/karyawan';
import { PotonganTunjangan } from '../../types/potonganTunjangan';

interface Props {
    potonganTunjangan: PotonganTunjangan;
    karyawans: Karyawan[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Potongan Tunjangan', href: route('potonganTunjangans.index') },
    { title: 'Edit Data', href: '#' },
];

export default function EditPotonganTunjangan({ potonganTunjangan, karyawans }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        id_karyawan: potonganTunjangan.id_karyawan || '',
        periode_payroll: potonganTunjangan.periode_payroll || '',
        potongan_tunjangan_jabatan: potonganTunjangan.potongan_tunjangan_jabatan || 0,
        potongan_tunjangan_kompetensi: potonganTunjangan.potongan_tunjangan_kompetensi || 0,
        potongan_intensif: potonganTunjangan.potongan_intensif || 0,
        keterangan: potonganTunjangan.keterangan || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('potonganTunjangans.update', potonganTunjangan.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Data Potongan Tunjangan" />

            <div className="mx-5 py-5">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Data Potongan Tunjangan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Karyawan */}
                                <div className="space-y-2">
                                    <Label htmlFor="id_karyawan">Karyawan *</Label>
                                    <SearchableSelect
                                        items={karyawans.map((karyawan) => ({
                                            key: String(karyawan.id),
                                            value: String(karyawan.id),
                                            label: karyawan.nama ?? '',
                                        }))}
                                        value={String(data.id_karyawan)}
                                        placeholder="Pilih Karyawan"
                                        onChange={(value) => setData('id_karyawan', value)}
                                    />
                                    {errors.id_karyawan && <p className="text-sm text-red-500">{errors.id_karyawan}</p>}
                                </div>

                                {/* Periode Payroll */}
                                <div className="space-y-2">
                                    <Label htmlFor="periode_payroll">Periode Payroll *</Label>
                                    <DatePicker
                                        value={data.periode_payroll}
                                        onChange={(date) => {
                                            if (date) {
                                                const formatted = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                                                    .toISOString()
                                                    .split('T')[0];
                                                setData('periode_payroll', formatted);
                                            } else {
                                                setData('periode_payroll', '');
                                            }
                                        }}
                                    />
                                    {errors.periode_payroll && <p className="text-sm text-red-500">{errors.periode_payroll}</p>}
                                </div>

                                {/* Potongan Tunjangan Jabatan */}
                                <div className="space-y-2">
                                    <Label htmlFor="potongan_tunjangan_jabatan">Potongan Tunjangan Jabatan *</Label>
                                    <Input
                                        id="potongan_tunjangan_jabatan"
                                        type="number"
                                        value={data.potongan_tunjangan_jabatan}
                                        onChange={(e) => setData('potongan_tunjangan_jabatan', parseInt(e.target.value, 10))}
                                        className={errors.potongan_tunjangan_jabatan ? 'border-red-500' : ''}
                                    />
                                    {errors.potongan_tunjangan_jabatan && <p className="text-sm text-red-500">{errors.potongan_tunjangan_jabatan}</p>}
                                </div>

                                {/* Potongan Tunjangan Kompetensi */}
                                <div className="space-y-2">
                                    <Label htmlFor="potongan_tunjangan_kompetensi">Potongan Tunjangan Kompetensi *</Label>
                                    <Input
                                        id="potongan_tunjangan_kompetensi"
                                        type="number"
                                        value={data.potongan_tunjangan_kompetensi}
                                        onChange={(e) => setData('potongan_tunjangan_kompetensi', parseInt(e.target.value, 10))}
                                        className={errors.potongan_tunjangan_kompetensi ? 'border-red-500' : ''}
                                    />
                                    {errors.potongan_tunjangan_kompetensi && (
                                        <p className="text-sm text-red-500">{errors.potongan_tunjangan_kompetensi}</p>
                                    )}
                                </div>

                                {/* Potongan Intensif */}
                                <div className="space-y-2">
                                    <Label htmlFor="potongan_intensif">Potongan Intensif *</Label>
                                    <Input
                                        id="potongan_intensif"
                                        type="number"
                                        value={data.potongan_intensif}
                                        onChange={(e) => setData('potongan_intensif', parseInt(e.target.value, 10))}
                                        className={errors.potongan_intensif ? 'border-red-500' : ''}
                                    />
                                    {errors.potongan_intensif && <p className="text-sm text-red-500">{errors.potongan_intensif}</p>}
                                </div>

                                {/* Keterangan */}
                                <div className="space-y-2">
                                    <Label htmlFor="keterangan">Keterangan</Label>
                                    <Input id="keterangan" value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)} />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
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
