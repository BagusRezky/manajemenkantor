import { SearchableSelect } from '@/components/search-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { CustomerAddress } from '@/types/customerAddress';
import { Karyawan } from '@/types/karyawan';
import { MasterCoa } from '@/types/masterCoa';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs = [
    { title: 'Kas', href: route('trans-kas.index') },
    { title: 'Keluar', href: '#' },
];

export default function CreateKeluar({
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
    type: 2;
}) {
    const { data, setData, post, processing, errors } = useForm({
        transaksi: type,
        id_karyawan: '',
        id_account_kas: '',
        id_account_kas_lain: '',
        id_customer_address: '',

        gudang: 'UGRMS',
        periode: new Date().getFullYear(),
        tanggal_transaksi: new Date().toISOString().split('T')[0],
        nominal: 0,
        keterangan: '',
        mesin: '',
        kode: 0,
        status: '1',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('trans-kas.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kas Keluar" />
            <div className="mx-5 py-5">
                <Card className="border-t-4 border-t-red-500">
                    <CardHeader>
                        <CardTitle>Transaksi Kas Keluar</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Gudang</Label>
                                    <Input value={data.gudang} onChange={(e) => setData('gudang', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Periode</Label>
                                    <Input value={data.periode} onChange={(e) => setData('periode', Number(e.target.value))} placeholder="2024" />
                                </div>
                                <div className="space-y-2">
                                    <Label>
                                        Tanggal Transaksi <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="date"
                                        value={data.tanggal_transaksi}
                                        onChange={(e) => setData('tanggal_transaksi', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>
                                        Karyawan (PIC) <span className="text-red-500">*</span>
                                    </Label>
                                    <SearchableSelect
                                        items={karyawans.map((k) => ({ key: String(k.id), value: String(k.id), label: k.nama ?? '' }))}
                                        value={data.id_karyawan}
                                        onChange={(val) => setData('id_karyawan', val)}
                                        placeholder="Pilih Karyawan"
                                    />
                                    {errors.id_karyawan && <p className="text-sm text-red-500">{errors.id_karyawan}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>
                                        Account Kas <span className="text-red-500">*</span>
                                    </Label>
                                    <SearchableSelect
                                        items={accountKas.map((a) => ({
                                            key: String(a.id),
                                            value: String(a.id),
                                            label: `${a.kode_akuntansi} - ${a.nama_akun}`,
                                        }))}
                                        value={data.id_account_kas}
                                        onChange={(val) => setData('id_account_kas', val)}
                                        placeholder="Pilih Account Kas"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>
                                        Account Lain (Beban) <span className="text-red-500">*</span>
                                    </Label>
                                    <SearchableSelect
                                        items={accountLawan.map((a) => ({
                                            key: String(a.id),
                                            value: String(a.id),
                                            label: `${a.kode_akuntansi} - ${a.nama_akun}`,
                                        }))}
                                        value={data.id_account_kas_lain}
                                        onChange={(val) => setData('id_account_kas_lain', val)}
                                        placeholder="Pilih Account Lain"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>
                                        Nominal <span className="text-red-500">*</span>
                                    </Label>
                                    <Input type="number" value={data.nominal} onChange={(e) => setData('nominal', Number(e.target.value))} required />
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
                                    <Label>Mesin</Label>
                                    <Input value={data.mesin} onChange={(e) => setData('mesin', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>
                                        Kode <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={data.kode}
                                        onChange={(e) => setData('kode', Number(e.target.value))}
                                        required
                                    />
                                </div>
                                <div className="col-span-full space-y-2">
                                    <Label>Keterangan</Label>
                                    <Textarea value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)} />
                                </div>
                            </div>
                            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 md:w-auto" disabled={processing}>
                                Simpan Kas Keluar
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
