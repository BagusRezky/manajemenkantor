// pages/hariLibur/create.tsx

import { Textarea } from '@/components/ui/textarea';
import { Head, useForm } from '@inertiajs/react';
import { DatePicker } from '../../components/date-picker';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import AppLayout from '../../layouts/app-layout';
import { BreadcrumbItem } from '../../types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Hari Libur',
        href: route('hariLiburs.index'),
    },
    {
        title: 'Tambah Data',
        href: route('hariLiburs.create'),
    },
];

export default function CreateHariLibur() {
    const { data, setData, post, processing, errors } = useForm({
        tanggal_libur: '',
        keterangan: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('hariLiburs.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Hari Libur" />
            <div className="mx-5 py-5">
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Tambah Hari Libur</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                {/* Tanggal Libur */}
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_libur">Tanggal Libur *</Label>
                                    <DatePicker
                                        value={data.tanggal_libur}
                                        onChange={(date) => {
                                            if (date) {
                                                const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                                                    .toISOString()
                                                    .split('T')[0];
                                                setData('tanggal_libur', formattedDate);
                                            } else {
                                                setData('tanggal_libur', '');
                                            }
                                        }}
                                    />
                                    {errors.tanggal_libur && <p className="text-sm text-red-500">{errors.tanggal_libur}</p>}
                                </div>

                                {/* Keterangan */}
                                <div className="space-y-2">
                                    <Label htmlFor="keterangan">Keterangan</Label>
                                    <Textarea
                                        id="keterangan"
                                        value={data.keterangan}
                                        onChange={(e) => setData('keterangan', e.target.value)}
                                        placeholder="Contoh: Hari Raya Idul Fitri"
                                    />
                                    {errors.keterangan && <p className="text-sm text-red-500">{errors.keterangan}</p>}
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
