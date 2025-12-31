import { SelectInput } from '@/components/select-input';
import { Textarea } from '@/components/ui/textarea';
import { Head, useForm } from '@inertiajs/react';
import { SearchableSelect } from '../../components/search-select';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import AppLayout from '../../layouts/app-layout';
import { BreadcrumbItem } from '../../types';
import { Karyawan } from '../../types/karyawan';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Izin', href: route('izins.index') },
    { title: 'Tambah Data', href: route('izins.create') },
];

interface Props {
    karyawans: Karyawan[];
}

export default function CreateIzin({ karyawans }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        id_karyawan: '',
        tanggal_izin: '',
        jenis_izin: '',
        jam_awal_izin: '',
        jam_selesai_izin: '',
        keterangan: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('izins.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Data Izin" />
            <div className="mx-5 py-5">
                <Card>
                    <CardHeader>
                        <CardTitle>Tambah Data Izin</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Karyawan */}
                                <div className="space-y-2">
                                    <Label htmlFor="id_karyawan">Karyawan *</Label>
                                    <SearchableSelect
                                        items={karyawans.map((k) => ({
                                            key: String(k.id),
                                            value: String(k.id),
                                            label: k.nama ?? '',
                                        }))}
                                        value={data.id_karyawan}
                                        placeholder="Pilih Karyawan"
                                        onChange={(value) => setData('id_karyawan', value)}
                                    />
                                    {errors.id_karyawan && <p className="text-sm text-red-500">{errors.id_karyawan}</p>}
                                </div>

                                {/* Tanggal Izin */}
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_izin">Tanggal Izin *</Label>
                                    <Input
                                        id="tanggal_izin"
                                        type="date"
                                        value={data.tanggal_izin}
                                        onChange={(e) => setData('tanggal_izin', e.target.value)}
                                        className={errors.tanggal_izin ? 'border-red-500' : ''}
                                    />
                                    {errors.tanggal_izin && <p className="text-sm text-red-500">{errors.tanggal_izin}</p>}
                                </div>

                                {/* Jenis Izin */}
                                <div className="space-y-2">
                                    <Label htmlFor="jenis_izin">Jenis Izin *</Label>
                                    <SelectInput
                                        id="jenis_izin"
                                        value={data.jenis_izin}
                                        onChange={(value) => setData('jenis_izin', value)}
                                        options={[
                                            { value: 'Izin Datang Terlambat', label: 'Izin Datang Terlambat' },
                                            { value: 'Izin Meninggalkan Kantor', label: 'Izin Meninggalkan Kantor' },
                                            { value: 'Izin Pulang Awal', label: 'Izin Pulang Awal' },
                                            { value: 'Dinas Luar', label: 'Dinas Luar' },
                                            { value: 'Alpha', label: 'Alpha' },
                                        ]}
                                        placeholder="Pilih Jenis Izin"
                                        className={errors.jenis_izin ? 'border-red-500' : ''}
                                    />
                                    {errors.jenis_izin && <p className="text-sm text-red-500">{errors.jenis_izin}</p>}
                                </div>

                                {/* Jam Awal */}
                                <div className="space-y-2">
                                    <Label htmlFor="jam_awal_izin">Jam Awal *</Label>
                                    <Input
                                        id="jam_awal_izin"
                                        type="time"
                                        value={data.jam_awal_izin}
                                        onChange={(e) => setData('jam_awal_izin', e.target.value)}
                                    />
                                    {errors.jam_awal_izin && <p className="text-sm text-red-500">{errors.jam_awal_izin}</p>}
                                </div>

                                {/* Jam Selesai */}
                                <div className="space-y-2">
                                    <Label htmlFor="jam_selesai_izin">Jam Selesai *</Label>
                                    <Input
                                        id="jam_selesai_izin"
                                        type="time"
                                        value={data.jam_selesai_izin}
                                        onChange={(e) => setData('jam_selesai_izin', e.target.value)}
                                    />
                                    {errors.jam_selesai_izin && <p className="text-sm text-red-500">{errors.jam_selesai_izin}</p>}
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
