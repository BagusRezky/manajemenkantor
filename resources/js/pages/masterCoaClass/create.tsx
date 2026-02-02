import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    { title: 'Master COA Class', href: route('masterCoaClasses.index') },
    { title: 'Tambah Data', href: route('masterCoaClasses.create') },
];

export default function CreateMasterCoaClass({ karyawans }: { karyawans: Karyawan[] }) {
    const { data, setData, post, processing, errors } = useForm({
        id_karyawan: '',
        code: '',
        name: '',
        status: '1',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('masterCoaClasses.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Master COA Class" />
            <div className="mx-5 py-5">
                <Card>
                    <CardHeader>
                        <CardTitle>Tambah Master COA Class</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="id_karyawan">Karyawan *</Label>
                                    <SearchableSelect
                                        items={karyawans.map((k) => ({ key: String(k.id), value: String(k.id), label: k.nama ?? '' }))}
                                        value={data.id_karyawan}
                                        onChange={(val) => setData('id_karyawan', val)}
                                        placeholder="Pilih Karyawan"
                                    />
                                    {errors.id_karyawan && <p className="text-sm text-red-500">{errors.id_karyawan}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="code">Code *</Label>
                                    <Input id="code" value={data.code} onChange={(e) => setData('code', e.target.value)} />
                                    {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name *</Label>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status *</Label>
                                    <Select value={data.status} onValueChange={(val) => setData('status', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Active</SelectItem>
                                            <SelectItem value="0">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    Simpan
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
