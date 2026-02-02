import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { MetodeBayar } from '@/types/metodeBayar';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Metode Bayar', href: route('metodeBayars.index') },
    { title: 'Edit Data', href: '#' },
];

export default function EditMetodeBayar({ item }: { item: MetodeBayar }) {
    const { data, setData, put, processing, errors } = useForm({
        kode_bayar: item.kode_bayar,
        metode_bayar: item.metode_bayar,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('metodeBayars.update', item.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Metode Bayar" />
            <div className="mx-5 py-5">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Metode Bayar</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="kode_bayar">Kode Bayar *</Label>
                                    <Input id="kode_bayar" value={data.kode_bayar} onChange={(e) => setData('kode_bayar', e.target.value)} />
                                    {errors.kode_bayar && <p className="text-sm text-red-500">{errors.kode_bayar}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="metode_bayar">Metode Pembayaran *</Label>
                                    <Input id="metode_bayar" value={data.metode_bayar} onChange={(e) => setData('metode_bayar', e.target.value)} />
                                    {errors.metode_bayar && <p className="text-sm text-red-500">{errors.metode_bayar}</p>}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    Simpan Perubahan
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
