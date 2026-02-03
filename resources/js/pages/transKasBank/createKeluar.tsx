import { SearchableSelect } from '@/components/search-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Karyawan } from '@/types/karyawan';

import { MasterCoa } from '@/types/masterCoa';
import { CustomerAddress } from '@/types/predit';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs = [
    { title: 'Bank', href: route('trans-kas-banks.index') },
    { title: 'Keluar', href: '#' },
];

export default function CreateKeluar({ karyawans,  accountBank, accountBankLain, customerAddresses, type }: {
    karyawans: Karyawan[];
    accountBank: MasterCoa[];
    accountBankLain: MasterCoa[];
    customerAddresses: CustomerAddress[];
    type: 22;
}) {
    const { data, setData, post, processing, errors } = useForm({
        transaksi: type,
        id_karyawan: '',
        id_account_bank: '',
        id_account_bank_lain: '',
        id_customer_address: '',
        gudang: 'UGRMS',
        periode: new Date().getFullYear(),
        tanggal_transaksi: new Date().toISOString().split('T')[0],
        nominal: 0,
        keterangan: '',
        bank: '',
        bank_an: '',
        no_rekening: '',
        mesin: '',
        kode: 0,
        status: '1',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('trans-kas-banks.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bank Keluar" />
            <div className="mx-5 py-5">
                <Card className="border-t-4 border-t-orange-500">
                    <CardHeader>
                        <CardTitle>Transaksi Bank Keluar</CardTitle>
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
                                    <Label>Account Bank </Label>
                                    <SearchableSelect
                                        items={accountBank.map((c) => ({
                                            key: String(c.id),
                                            value: String(c.id),
                                            label: `${c.kode_akuntansi} - ${c.nama_akun}`,
                                        }))}
                                        value={data.id_account_bank}
                                        onChange={(val) => setData('id_account_bank', val)}
                                        placeholder="Pilih Account Bank"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Account Lain </Label>
                                    <SearchableSelect
                                        items={accountBankLain.map((c) => ({
                                            key: String(c.id),
                                            value: String(c.id),
                                            label: `${c.kode_akuntansi} - ${c.nama_akun}`,
                                        }))}
                                        value={data.id_account_bank_lain}
                                        onChange={(val) => setData('id_account_bank_lain', val)}
                                        placeholder="Pilih Account Lain"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Nominal</Label>
                                    <Input type="number" value={data.nominal} onChange={(e) => setData('nominal', Number(e.target.value))} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Periode</Label>
                                    <Input type="number" value={data.periode} onChange={(e) => setData('periode', Number(e.target.value))} />
                                </div>
                                <div className="col-span-full space-y-2">
                                    <Label>Keterangan</Label>
                                    <Textarea value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                                    <Label>Bank</Label>
                                    <Input value={data.bank} onChange={(e) => setData('bank', e.target.value)} placeholder="BCA / Mandiri / dll" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Bank A/N</Label>
                                    <Input value={data.bank_an} onChange={(e) => setData('bank_an', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>No. Rekening</Label>
                                    <Input value={data.no_rekening} onChange={(e) => setData('no_rekening', e.target.value)} />
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
                                    <Label>Mesin</Label>
                                    <Input value={data.mesin} onChange={(e) => setData('mesin', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Kode</Label>
                                    <Input type="number" value={data.kode} onChange={(e) => setData('kode', Number(e.target.value))} />
                                </div>
                            </div>
                            <Button type="submit" disabled={processing} className="bg-orange-600 hover:bg-orange-700">
                                Simpan Bank Keluar
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
