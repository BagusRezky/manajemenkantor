import { SearchableSelect } from '@/components/search-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { MasterCoa } from '@/types/masterCoa';
import { CustomerAddress } from '@/types/predit';
import { TransKasBank } from '@/types/transKasBank';

import { Head, useForm } from '@inertiajs/react';

interface Props {
    item: TransKasBank;
    accountBank: MasterCoa[];
    accountBankLain: MasterCoa[];
    customerAddresses: CustomerAddress[];
}

export default function EditMasuk({ item, accountBank, accountBankLain, customerAddresses }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Bank', href: route('trans-kas-banks.index') },
        { title: 'Edit Bank Masuk', href: '#' },
    ];

    const { data, setData, put, processing, errors } = useForm({
        transaksi: item.transaksi,
        id_karyawan: item.id_karyawan ? String(item.id_karyawan) : '',
        id_account_bank: item.id_account_bank ? String(item.id_account_bank) : '',
        id_account_bank_lain: item.id_account_bank_lain ? String(item.id_account_bank_lain) : '',
        id_customer_address: item.id_customer_address ? String(item.id_customer_address) : '',
        no_bukti: item.no_bukti,
        gudang: item.gudang,
        periode: item.periode,
        tanggal_transaksi: item.tanggal_transaksi || '',
        nominal: item.nominal,
        keterangan: item.keterangan || '',
        bank: item.bank || '',
        bank_an: item.bank_an || '',
        no_rekening: item.no_rekening || '',
        status: String(item.status),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('trans-kas-banks.update', item.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Bank Masuk" />
            <div className="mx-5 py-5">
                <Card className="border-t-4 border-t-blue-500">
                    <CardHeader>
                        <CardTitle>Edit Transaksi Bank Masuk: {item.no_bukti}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Gudang</Label>
                                    <Input value={data.gudang} onChange={(e) => setData('gudang', e.target.value)} />
                                    {errors.gudang && <p className="text-sm text-red-500">{errors.gudang}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Tanggal Transaksi</Label>
                                    <Input
                                        type="date"
                                        value={data.tanggal_transaksi}
                                        onChange={(e) => setData('tanggal_transaksi', e.target.value)}
                                    />
                                    {errors.tanggal_transaksi && <p className="text-sm text-red-500">{errors.tanggal_transaksi}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Account Bank (Debit)</Label>
                                    <SearchableSelect
                                        items={accountBank.map((c) => ({
                                            key: String(c.id),
                                            value: String(c.id),
                                            label: `${c.kode_akuntansi} - ${c.nama_akun}`,
                                        }))}
                                        value={data.id_account_bank}
                                        onChange={(val) => setData('id_account_bank', val)}
                                    />
                                    {errors.id_account_bank && <p className="text-sm text-red-500">{errors.id_account_bank}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Account Lain (Kredit)</Label>
                                    <SearchableSelect
                                        items={accountBankLain.map((c) => ({
                                            key: String(c.id),
                                            value: String(c.id),
                                            label: `${c.kode_akuntansi} - ${c.nama_akun}`,
                                        }))}
                                        value={data.id_account_bank_lain}
                                        onChange={(val) => setData('id_account_bank_lain', val)}
                                    />
                                    {errors.id_account_bank_lain && <p className="text-sm text-red-500">{errors.id_account_bank_lain}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>No. Bukti</Label>
                                    <Input value={data.no_bukti} onChange={(e) => setData('no_bukti', e.target.value)} />
                                    {errors.no_bukti && <p className="text-sm text-red-500">{errors.no_bukti}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Nominal</Label>
                                    <Input type="number" value={data.nominal} onChange={(e) => setData('nominal', Number(e.target.value))} />
                                    {errors.nominal && <p className="text-sm text-red-500">{errors.nominal}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Periode</Label>
                                    <Input type="number" value={data.periode} onChange={(e) => setData('periode', Number(e.target.value))} />
                                    {errors.periode && <p className="text-sm text-red-500">{errors.periode}</p>}
                                </div>
                                <div className="col-span-full space-y-2">
                                    <Label>Keterangan</Label>
                                    <Textarea value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="col-span-full">
                                    <h4 className="text-lg font-semibold text-gray-700">Terima dari:</h4>
                                </div>
                                <div className="space-y-2">
                                    <Label>Customer</Label>
                                    <SearchableSelect
                                        items={customerAddresses.map((k) => ({
                                            key: String(k.id),
                                            value: String(k.id),
                                            label: k.nama_customer ?? '',
                                        }))}
                                        value={data.id_customer_address}
                                        onChange={(val) => setData('id_customer_address', val)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Bank</Label>
                                    <Input value={data.bank} onChange={(e) => setData('bank', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Bank A/N</Label>
                                    <Input value={data.bank_an} onChange={(e) => setData('bank_an', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>No. Rekening</Label>
                                    <Input value={data.no_rekening} onChange={(e) => setData('no_rekening', e.target.value)} />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">
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
