import { SearchableSelect } from '@/components/search-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Karyawan } from '@/types/karyawan';
import { MasterCoaClass } from '@/types/masterCoaClass';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Master COA', href: route('masterCoas.index') },
    { title: 'Tambah Data', href: route('masterCoas.create') },
];

export default function Create({ karyawans, coaClasses }: { karyawans: Karyawan[]; coaClasses: MasterCoaClass[] }) {
    const { data, setData, post, processing, errors } = useForm({
        id_karyawan: '',
        id_master_coa_class: '',
        periode: new Date().getFullYear(),
        gudang: '',
        kode_akuntansi: '',
        nama_akun: '',
        saldo_debit: 0,
        saldo_kredit: 0,
        nominal_default: 0,
        keterangan: '',
        status: '1',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('masterCoas.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Master COA" />
            <div className="mx-5 py-5">
                <Card>
                    <CardHeader>
                        <CardTitle>Form Master COA</CardTitle>
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
                                        placeholder="Pilih Karyawan"
                                    />
                                    {errors.id_karyawan && <p className="text-sm text-red-500">{errors.id_karyawan}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>COA Class</Label>
                                    <Select onValueChange={(val) => setData('id_master_coa_class', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Class" />
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
                                    {errors.periode && <p className="text-sm text-red-500">{errors.periode}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Gudang</Label>
                                    <Input value={data.gudang} onChange={(e) => setData('gudang', e.target.value)} />
                                    {errors.gudang && <p className="text-sm text-red-500">{errors.gudang}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Kode Akuntansi</Label>
                                    <Input value={data.kode_akuntansi} onChange={(e) => setData('kode_akuntansi', e.target.value)} />
                                    {errors.kode_akuntansi && <p className="text-sm text-red-500">{errors.kode_akuntansi}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Nama Akun</Label>
                                    <Input value={data.nama_akun} onChange={(e) => setData('nama_akun', e.target.value)} />
                                    {errors.nama_akun && <p className="text-sm text-red-500">{errors.nama_akun}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Saldo Debit</Label>
                                    <Input type="number" value={data.saldo_debit} onChange={(e) => setData('saldo_debit', Number(e.target.value))} />
                                    {errors.saldo_debit && <p className="text-sm text-red-500">{errors.saldo_debit}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Saldo Kredit</Label>
                                    <Input
                                        type="number"
                                        value={data.saldo_kredit}
                                        onChange={(e) => setData('saldo_kredit', Number(e.target.value))}
                                    />
                                    {errors.saldo_kredit && <p className="text-sm text-red-500">{errors.saldo_kredit}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Nominal Default</Label>
                                    <Input
                                        type="number"
                                        value={data.nominal_default}
                                        onChange={(e) => setData('nominal_default', Number(e.target.value))}
                                    />
                                    {errors.nominal_default && <p className="text-sm text-red-500">{errors.nominal_default}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Keterangan</Label>
                                    <Input value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)} />
                                    {errors.keterangan && <p className="text-sm text-red-500">{errors.keterangan}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
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
                            <Button type="submit" disabled={processing}>
                                Simpan
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
