import { Head, useForm } from '@inertiajs/react';
import { SearchableSelect } from '../../components/search-select';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import AppLayout from '../../layouts/app-layout';
import { BreadcrumbItem } from '../../types';
import { Karyawan } from '../../types/karyawan';
import { Textarea } from '@/components/ui/textarea';
import { SelectInput } from '@/components/select-input';

// Ganti breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cuti',
        href: route('cutis.index'),
    },
    {
        title: 'Tambah Data',
        href: route('cutis.create'),
    },
];

interface Props {
    // Ganti prop
    karyawans: Karyawan[];
}

export default function CreateCuti({ karyawans }: Props) {
    // Ganti field form
    const { data, setData, post, processing, errors, progress } = useForm({
        id_karyawan: '',
        tanggal_cuti: '',
        jenis_cuti: '',
        lampiran: null as File | null, // Siapkan untuk file
        keterangan: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Ganti route
        post(route('cutis.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {/* Ganti title */}
            <Head title="Tambah Data Cuti" />
            <div className="mx-5 py-5">
                <Card>
                    <CardHeader>
                        {/* Ganti card title */}
                        <CardTitle>Tambah Data Cuti</CardTitle>
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
                                        value={data.id_karyawan || ''}
                                        placeholder="Pilih Karyawan"
                                        onChange={(value) => setData('id_karyawan', value)}
                                    />
                                    {errors.id_karyawan && <p className="text-sm text-red-500">{errors.id_karyawan}</p>}
                                </div>

                                {/* Jenis Cuti */}
                                <div className="space-y-2">
                                    <Label htmlFor="jenis_cuti">Jenis Cuti *</Label>
                                    <SelectInput
                                        id="jenis_cuti"
                                        value={data.jenis_cuti}
                                        onChange={(value) => setData('jenis_cuti', value)}
                                        options={[
                                            { label: 'Izin Sakit', value: 'Izin Sakit' },
                                            { label: 'Cuti Karyawan Menikah', value: 'Cuti Karyawan Menikah' },
                                            { label: 'Cuti Pernikahan Anak Karyawan', value: 'Cuti Pernikahan Anak Karyawan' },
                                            { label: 'Cuti Pernikahan Kakak / Adik Karyawan', value: 'Cuti Pernikahan Kakak / Adik Karyawan' },
                                            { label: 'Cuti Haid', value: 'Cuti Haid' },
                                            { label: 'Cuti Kelahiran Anak', value: 'Cuti Kelahiran Anak' },
                                            { label: 'Cuti Keguguran Kehamilan Istri', value: 'Cuti Keguguran Kehamilan Istri' },
                                            { label: 'Izin Menjaga Suami/Istri/Anak/Ortu', value: 'Izin Menjaga Suami/Istri/Anak/Ortu' },
                                            { label: 'Cuti Kematian Suami/Istri/Ortu/Mertua', value: 'Cuti Kematian Suami/Istri/Ortu/Mertua' },
                                            { label: 'Cuti Kematian Kakak / Adik Kandung', value: 'Cuti Kematian Kakak / Adik Kandung' },
                                            { label: 'Cuti Kematian Keluarga Lainnya', value: 'Cuti Kematian Keluarga Lainnya' },
                                            { label: 'Cuti Khitanan/ Pembatisan Anak Karyawan', value: 'Cuti Khitanan/ Pembatisan Anak Karyawan' },
                                            { label: 'Cuti Melahirkan Karyawati', value: 'Cuti Melahirkan Karyawati' },
                                            { label: 'Cuti Haji', value: 'Cuti Haji' },
                                            { label: 'Cuti Tidak Dibayar', value: 'Cuti Tidak Dibayar' },
                                            { label: 'Cuti Opname', value: 'Cuti Opname' },
                                            { label: 'Cuti Keguguran Kandungan', value: 'Cuti Keguguran Kandungan' },
                                            { label: 'Dinas Luar', value: 'Dinas Luar' },
                                            { label: 'Cuti Tahunan', value: 'Cuti Tahunan' },
                                        ]}
                                        placeholder="Pilih Jenis Cuti"
                                        className={errors.jenis_cuti ? 'border-red-500' : ''}
                                    />
                                    {errors.jenis_cuti && <p className="text-sm text-red-500">{errors.jenis_cuti}</p>}
                                </div>

                                {/* Tanggal Cuti */}
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_cuti">Tanggal Cuti *</Label>
                                    <Input
                                        type="date"
                                        id="tanggal_cuti"
                                        value={data.tanggal_cuti}
                                        onChange={(e) => setData('tanggal_cuti', e.target.value)}
                                    />
                                    {errors.tanggal_cuti && <p className="text-sm text-red-500">{errors.tanggal_cuti}</p>}
                                </div>

                                {/* Lampiran */}
                                <div className="space-y-2">
                                    <Label htmlFor="lampiran">Lampiran</Label>
                                    <Input
                                        id="lampiran"
                                        type="file"
                                        onChange={(e) => setData('lampiran', e.target.files ? e.target.files[0] : null)}
                                        className={errors.lampiran ? 'border-red-500' : ''}
                                    />
                                    {/* Indikator progress upload */}
                                    {progress && (
                                        <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                            <div className="h-2.5 rounded-full bg-blue-600" style={{ width: `${progress.percentage}%` }}></div>
                                        </div>
                                    )}
                                    {errors.lampiran && <p className="text-sm text-red-500">{errors.lampiran}</p>}
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
