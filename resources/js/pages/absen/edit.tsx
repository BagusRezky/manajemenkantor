import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Absen } from '@/types/absen';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Absen', href: route('absens.index') },
    { title: 'Edit Data', href: '#' },
];

interface Props {
    absen: Absen;
}

export default function Edit({ absen }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        tanggal_scan: absen.tanggal_scan || '',
        io: absen.io || '',
        verifikasi: absen.verifikasi || '',
        workcode: absen.workcode || '',
        sn: absen.sn || '',
        mesin: absen.mesin || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('absens.update', absen.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Absen" />
            <div className='py-12'>
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Edit Data Absen</CardTitle>
                            </CardHeader>

                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Data karyawan (readonly) */}
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <Label>Nama</Label>
                                            <Input value={absen.nama || ''} disabled />
                                        </div>
                                        <div>
                                            <Label>PIN</Label>
                                            <Input value={absen.pin || ''} disabled />
                                        </div>
                                        <div>
                                            <Label>NIP</Label>
                                            <Input value={absen.nip || ''} disabled />
                                        </div>
                                        <div>
                                            <Label>Jabatan</Label>
                                            <Input value={absen.jabatan || ''} disabled />
                                        </div>
                                        <div>
                                            <Label>Departemen</Label>
                                            <Input value={absen.departemen || ''} disabled />
                                        </div>
                                        <div>
                                            <Label>Kantor</Label>
                                            <Input value={absen.kantor || ''} disabled />
                                        </div>
                                    </div>

                                    {/* Field yang bisa diubah */}
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <Label>Tanggal Scan</Label>
                                            <Input
                                                type="datetime-local"
                                                value={data.tanggal_scan}
                                                onChange={(e) => setData('tanggal_scan', e.target.value)}
                                            />
                                            {errors.tanggal_scan && <p className="mt-1 text-sm text-red-500">{errors.tanggal_scan}</p>}
                                        </div>
                                        <div>
                                            <Label>Verifikasi</Label>
                                            <Input value={data.verifikasi} onChange={(e) => setData('verifikasi', e.target.value)} />
                                            {errors.verifikasi && <p className="mt-1 text-sm text-red-500">{errors.verifikasi}</p>}
                                        </div>

                                        <div>
                                            <Label>Workcode</Label>
                                            <Input value={data.workcode} onChange={(e) => setData('workcode', e.target.value)} />
                                            {errors.workcode && <p className="mt-1 text-sm text-red-500">{errors.workcode}</p>}
                                        </div>

                                        <div>
                                            <Label>SN</Label>
                                            <Input value={data.sn} onChange={(e) => setData('sn', e.target.value)} />
                                            {errors.sn && <p className="mt-1 text-sm text-red-500">{errors.sn}</p>}
                                        </div>

                                        <div>
                                            <Label>Mesin</Label>
                                            <Input value={data.mesin} onChange={(e) => setData('mesin', e.target.value)} />
                                            {errors.mesin && <p className="mt-1 text-sm text-red-500">{errors.mesin}</p>}
                                        </div>

                                        <div>
                                            <Label>IO (Masuk/Keluar)</Label>
                                            <select
                                                className="mt-1 w-full rounded-md border p-2"
                                                value={data.io}
                                                onChange={(e) => setData('io', e.target.value)}
                                            >
                                                <option value="">-- Pilih IO --</option>
                                                <option value="1">Masuk</option>
                                                <option value="2">Keluar</option>
                                            </select>
                                            {errors.io && <p className="mt-1 text-sm text-red-500">{errors.io}</p>}
                                        </div>
                                    </div>

                                    {/* Tombol Submit */}
                                    <div className="pt-4">
                                        <Button type="submit" disabled={processing}>
                                            Update
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
