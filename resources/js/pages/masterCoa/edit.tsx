import { SearchableSelect } from '@/components/search-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Karyawan } from '@/types/karyawan';
import { MasterCoa } from '@/types/masterCoa';
import { MasterCoaClass } from '@/types/masterCoaClass';
import { Head, useForm } from '@inertiajs/react';

interface Props {
    item: MasterCoa;
    karyawans: Karyawan[];
    coaClasses: MasterCoaClass[];
}

export default function Edit({ item, karyawans, coaClasses }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Master COA', href: route('masterCoas.index') },
        { title: 'Edit Data', href: '#' },
    ];

    const { data, setData, put, processing, errors } = useForm({
        id_karyawan: String(item.id_karyawan),
        id_master_coa_class: String(item.id_master_coa_class),
        periode: item.periode,
        gudang: item.gudang,
        kode_akuntansi: item.kode_akuntansi,
        nama_akun: item.nama_akun,
        saldo_debit: item.saldo_debit,
        saldo_kredit: item.saldo_kredit,
        nominal_default: item.nominal_default,
        keterangan: item.keterangan || '',
        status: String(item.status),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('masterCoas.update', item.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Master COA" />
            <div className="mx-5 py-5">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Master COA: {item.nama_akun}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Karyawan</Label>
                                    <SearchableSelect
                                        items={karyawans.map((k) => ({ key: String(k.id), value: String(k.id), label: k.nama ?? '' }))}
                                        value={data.id_karyawan}
                                        onChange={(val) => setData('id_karyawan', val)}
                                    />
                                    {errors.id_karyawan && <p className="text-sm text-red-500">{errors.id_karyawan}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>COA Class</Label>
                                    <Select value={data.id_master_coa_class} onValueChange={(val) => setData('id_master_coa_class', val)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {coaClasses.map((c) => (
                                                <SelectItem key={c.id} value={String(c.id)}>
                                                    {c.code} || {c.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Periode</Label>
                                    <Input value={data.periode} onChange={(e) => setData('periode', Number(e.target.value))} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Gudang</Label>
                                    <Input value={data.gudang} onChange={(e) => setData('gudang', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Kode Akuntansi</Label>
                                    <Input value={data.kode_akuntansi} onChange={(e) => setData('kode_akuntansi', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Nama Akun</Label>
                                    <Input value={data.nama_akun} onChange={(e) => setData('nama_akun', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Saldo Debit</Label>
                                    <Input type="number" value={data.saldo_debit} onChange={(e) => setData('saldo_debit', Number(e.target.value))} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Saldo Kredit</Label>
                                    <Input
                                        type="number"
                                        value={data.saldo_kredit}
                                        onChange={(e) => setData('saldo_kredit', Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Nominal Default</Label>
                                    <Input
                                        type="number"
                                        value={data.nominal_default}
                                        onChange={(e) => setData('nominal_default', Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Keterangan</Label>
                                    <Input
                                        value={data.keterangan}
                                        onChange={(e) => setData('keterangan', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select value={data.status} onValueChange={(val) => setData('status', val)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Active</SelectItem>
                                            <SelectItem value="0">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex gap-2">
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
