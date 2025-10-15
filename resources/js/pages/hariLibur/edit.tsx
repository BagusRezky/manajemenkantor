// pages/hariLibur/edit.tsx

import { Textarea } from '@/components/ui/textarea';
import { HariLibur } from '@/types/hariLibur';
import { Head, useForm } from '@inertiajs/react';
import { DatePicker } from '../../components/date-picker';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import AppLayout from '../../layouts/app-layout';
import { BreadcrumbItem } from '../../types';

interface Props {
    hariLibur: HariLibur;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Hari Libur', href: route('hariLiburs.index') },
    { title: 'Edit Data', href: '#' },
];

export default function EditHariLibur({ hariLibur }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        tanggal_libur: hariLibur.tanggal_libur || '',
        keterangan: hariLibur.keterangan || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('hariLiburs.update', hariLibur.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Hari Libur" />
            <div className="mx-5 py-5">
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Edit Hari Libur</CardTitle>
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
                                                const formatted = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                                                    .toISOString()
                                                    .split('T')[0];
                                                setData('tanggal_libur', formatted);
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
