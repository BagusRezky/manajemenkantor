import { SearchableSelect } from '@/components/search-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { CustomerAddress } from '@/types/customerAddress';
import { Karyawan } from '@/types/karyawan';
import { MasterCoa } from '@/types/masterCoa';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs = [
    { title: 'Kas', href: route('trans-kas.index') },
    { title: 'Masuk', href: '#' },
];

export default function CreateMasuk({
    karyawans,
    customerAddresses,
    accountKas,
    accountLawan,
    type,
}: {
    karyawans: Karyawan[];
    customerAddresses: CustomerAddress[];
    accountKas: MasterCoa[];
    accountLawan: MasterCoa[];
    type: 1;
}) {
    const { data, setData, post, processing, errors } = useForm({
        transaksi: type,
        id_karyawan: '',
        id_account_kas: '',
        id_account_kas_lain: '',
        id_customer_address: '',

        gudang: '',
        periode: new Date().getFullYear(),
        tanggal_transaksi: new Date().toISOString().split('T')[0],
        nominal: 0,
        keterangan: '',
        status: '1',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('trans-kas.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kas Masuk" />
            <div className="mx-5 py-5">
                <Card className="border-t-4 border-t-green-500">
                    <CardHeader>
                        <CardTitle>Transaksi Kas Masuk</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                
                                <div className="space-y-2">
                                    <Label>Gudang</Label>
                                    <Input value={data.gudang} onChange={(e) => setData('gudang', e.target.value)} placeholder="Gudang A" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Tanggal Transaksi</Label>
                                    <Input
                                        type="date"
                                        value={data.tanggal_transaksi}
                                        onChange={(e) => setData('tanggal_transaksi', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Periode</Label>
                                    <Input value={data.periode} onChange={(e) => setData('periode', Number(e.target.value))} placeholder="2024" />
                                </div>
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
                                    <Label>Account Bank</Label>
                                    <SearchableSelect
                                        items={accountKas.map((a) => ({
                                            key: String(a.id),
                                            value: String(a.id),
                                            label: `${a.kode_akuntansi} - ${a.nama_akun}`,
                                        }))}
                                        value={data.id_account_kas}
                                        onChange={(val) => setData('id_account_kas', val)}
                                        placeholder="Pilih Account Bank"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Account Kas (Debit)</Label>
                                    <SearchableSelect
                                        items={accountLawan.map((a) => ({
                                            key: String(a.id),
                                            value: String(a.id),
                                            label: `${a.kode_akuntansi} - ${a.nama_akun}`,
                                        }))}
                                        value={data.id_account_kas_lain}
                                        onChange={(val) => setData('id_account_kas_lain', val)}
                                        placeholder="Pilih Account Kas (Debit)"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Nominal</Label>
                                    <Input type="number" value={data.nominal} onChange={(e) => setData('nominal', Number(e.target.value))} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Customer </Label>
                                    <SearchableSelect
                                        items={customerAddresses.map((k) => ({
                                            key: String(k.id),
                                            value: String(k.id),
                                            label: k.nama_customer ?? '',
                                        }))}
                                        value={data.id_customer_address}
                                        onChange={(val) => setData('id_customer_address', val)}
                                        placeholder="Pilih Customer"
                                    />
                                    {errors.id_customer_address && <p className="text-sm text-red-500">{errors.id_customer_address}</p>}
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
                                <div className="col-span-full space-y-2">
                                    <Label>Keterangan</Label>
                                    <Textarea value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)} />
                                </div>
                            </div>
                            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 md:w-auto" disabled={processing}>
                                Simpan Kas Masuk
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
