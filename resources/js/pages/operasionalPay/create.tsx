import { SearchableSelect } from '@/components/search-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Karyawan } from '@/types/karyawan';
import { MasterCoa } from '@/types/masterCoa';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs = [
    { title: 'Operasional', href: route('operasionalPays.index') },
    { title: 'Tambah', href: '#' },
];

export default function Create({ karyawans, accountKas, accountBeban }: {
    karyawans: Karyawan[];
    accountKas: MasterCoa[];
    accountBeban: MasterCoa[];
}) {
    const { data, setData, post, processing, errors } = useForm({
        id_karyawan: '',
        id_account_kas: '',
        id_account_beban: '',
        no_bukti: 'BOPK/',
        gudang: 'UGRMS',
        periode: new Date().getFullYear(),
        tanggal_transaksi: new Date().toISOString().split('T')[0],
        nominal: 0,
        keterangan: '',
        mesin: '',
        kode: 0,
        nopol: '',
        odometer: '',
        jenis: '',
        status: '1',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('operasionalPays.store'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Operasional Pay" />
            <div className="mx-5 py-5">
                <Card className="border-t-4 border-t-purple-500">
                    <CardHeader>
                        <CardTitle>Transaksi Operasional Keluar</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Gudang</Label>
                                    <Input value={data.gudang} onChange={(e) => setData('gudang', e.target.value)} />
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
                                    <Label>No. Bukti</Label>
                                    <Input value={data.no_bukti} onChange={(e) => setData('no_bukti', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Periode</Label>
                                    <Input type="number" value={data.periode} onChange={(e) => setData('periode', Number(e.target.value))} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Account Kas</Label>
                                    <SearchableSelect
                                        items={accountKas.map((c) => ({
                                            key: String(c.id),
                                            value: String(c.id),
                                            label: `${c.kode_akuntansi} - ${c.nama_akun}`,
                                        }))}
                                        value={data.id_account_kas}
                                        onChange={(val) => setData('id_account_kas', val)}
                                        placeholder="Pilih Account Kas"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Account Beban</Label>
                                    <SearchableSelect
                                        items={accountBeban.map((c) => ({
                                            key: String(c.id),
                                            value: String(c.id),
                                            label: `${c.kode_akuntansi} - ${c.nama_akun}`,
                                        }))}
                                        value={data.id_account_beban}
                                        onChange={(val) => setData('id_account_beban', val)}
                                        placeholder="Pilih Account Beban"
                                    />
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
                                    <Label>Nominal</Label>
                                    <Input type="number" value={data.nominal} onChange={(e) => setData('nominal', Number(e.target.value))} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Nopol</Label>
                                    <Input value={data.nopol} onChange={(e) => setData('nopol', e.target.value)} placeholder="B 1234 ABC" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Odometer</Label>
                                    <Input value={data.odometer} onChange={(e) => setData('odometer', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Mesin</Label>
                                    <Input value={data.mesin} onChange={(e) => setData('mesin', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Kode</Label>
                                    <Input type="number" value={data.kode} onChange={(e) => setData('kode', Number(e.target.value))} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Jenis</Label>
                                    <Input value={data.jenis} onChange={(e) => setData('jenis', e.target.value)} />
                                </div>
                                <div className="col-span-full space-y-2">
                                    <Label>Keterangan</Label>
                                    <Textarea value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)} />
                                </div>
                            </div>
                            <Button type="submit" disabled={processing} className="bg-purple-600 hover:bg-purple-700">
                                Simpan Data
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
