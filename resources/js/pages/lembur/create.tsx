import { Textarea } from '@/components/ui/textarea';
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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lembur',
        href: route('lemburs.index'),
    },
    {
        title: 'Tambah Data',
        href: route('lemburs.create'),
    },
];

interface Props {
    karyawans: Karyawan[];
}

export default function CreateLembur({ karyawans }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        kode_gudang: '',
        id_karyawan: '',
        tanggal_lembur: '',
        jam_awal_lembur: '',
        jam_selesai_lembur: '',
        keterangan: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('lemburs.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Data Lembur" />
            <div className="mx-5 py-5">
                <Card>
                    <CardHeader>
                        <CardTitle>Tambah Data Lembur</CardTitle>
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

                                {/* Tanggal Lembur */}
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_lembur">Tanggal Lembur *</Label>
                                    <DatePicker
                                        value={data.tanggal_lembur}
                                        onChange={(date) => {
                                            if (date) {
                                                const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                                                    .toISOString()
                                                    .split('T')[0];
                                                setData('tanggal_lembur', formattedDate);
                                            } else {
                                                setData('tanggal_lembur', '');
                                            }
                                        }}
                                    />
                                    {errors.tanggal_lembur && <p className="text-sm text-red-500">{errors.tanggal_lembur}</p>}
                                </div>

                                {/* Jam Awal Lembur */}
                                <div className="space-y-2">
                                    <Label htmlFor="jam_awal_lembur">Jam Awal Lembur *</Label>
                                    <Input
                                        id="jam_awal_lembur"
                                        type="time"
                                        value={data.jam_awal_lembur}
                                        onChange={(e) => setData('jam_awal_lembur', e.target.value)}
                                        className={errors.jam_awal_lembur ? 'border-red-500' : ''}
                                    />
                                    {errors.jam_awal_lembur && <p className="text-sm text-red-500">{errors.jam_awal_lembur}</p>}
                                </div>

                                {/* Jam Selesai Lembur */}
                                <div className="space-y-2">
                                    <Label htmlFor="jam_selesai_lembur">Jam Selesai Lembur *</Label>
                                    <Input
                                        id="jam_selesai_lembur"
                                        type="time"
                                        value={data.jam_selesai_lembur}
                                        onChange={(e) => setData('jam_selesai_lembur', e.target.value)}
                                        className={errors.jam_selesai_lembur ? 'border-red-500' : ''}
                                    />
                                    {errors.jam_selesai_lembur && <p className="text-sm text-red-500">{errors.jam_selesai_lembur}</p>}
                                </div>

                                {/* Keterangan */}
                                <div className="space-y-2">
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
