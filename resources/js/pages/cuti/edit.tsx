import { Head, useForm } from '@inertiajs/react'; // Import 'router'
import { DatePicker } from '../../components/date-picker';
import { SearchableSelect } from '../../components/search-select';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import AppLayout from '../../layouts/app-layout';
import { BreadcrumbItem } from '../../types';
import { Cuti } from '../../types/cuti'; // Ganti
import { Karyawan } from '../../types/karyawan';

interface Props {
    cuti: Cuti;
    karyawans: Karyawan[];
}

// Ganti breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Cuti', href: route('cutis.index') },
    { title: 'Edit Data', href: '#' },
];

export default function EditCuti({ cuti, karyawans }: Props) {
    // Ganti field form
    const { data, setData, post, processing, errors, progress } = useForm({
        id_karyawan: cuti.id_karyawan || '',
        tanggal_cuti: cuti.tanggal_cuti || '',
        jenis_cuti: cuti.jenis_cuti || '',
        keterangan: cuti.keterangan || '',
        lampiran: null as File | null,
        _method: 'put', // Penting untuk file upload
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Gunakan 'post' untuk file upload, Inertia akan menanganinya
        post(route('cutis.update', cuti.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {/* Ganti title */}
            <Head title="Edit Data Cuti" />

            <div className="mx-5 py-5">
                <Card>
                    <CardHeader>
                        {/* Ganti card title */}
                        <CardTitle>Edit Data Cuti</CardTitle>
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

                                {/* Jenis Cuti */}
                                <div className="space-y-2">
                                    <Label htmlFor="jenis_cuti">Jenis Cuti *</Label>
                                    <Input
                                        id="jenis_cuti"
                                        value={data.jenis_cuti}
                                        onChange={(e) => setData('jenis_cuti', e.target.value)}
                                        className={errors.jenis_cuti ? 'border-red-500' : ''}
                                    />
                                    {errors.jenis_cuti && <p className="text-sm text-red-500">{errors.jenis_cuti}</p>}
                                </div>

                                {/* Tanggal Cuti */}
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_cuti">Tanggal Cuti *</Label>
                                    <DatePicker
                                        value={data.tanggal_cuti}
                                        onChange={(date) => {
                                            if (date) {
                                                const formatted = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                                                    .toISOString()
                                                    .split('T')[0];
                                                setData('tanggal_cuti', formatted);
                                            } else {
                                                setData('tanggal_cuti', '');
                                            }
                                        }}
                                    />
                                    {errors.tanggal_cuti && <p className="text-sm text-red-500">{errors.tanggal_cuti}</p>}
                                </div>

                                {/* Lampiran */}
                                <div className="space-y-2">
                                    <Label htmlFor="lampiran">Lampiran Baru (Opsional)</Label>
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

                                    {/* Tampilkan lampiran saat ini */}
                                    {cuti.lampiran && !data.lampiran && (
                                        <a
                                            href={`/storage/${cuti.lampiran}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-500 hover:underline"
                                        >
                                            Lihat Lampiran Saat Ini
                                        </a>
                                    )}
                                    <p className="text-xs text-gray-500">Kosongkan jika tidak ingin mengubah lampiran.</p>
                                </div>

                                {/* Keterangan */}
                                <div className="space-y-2 md:col-span-2">
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
