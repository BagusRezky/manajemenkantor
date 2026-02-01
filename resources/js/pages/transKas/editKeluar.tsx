import { SearchableSelect } from '@/components/search-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { CustomerAddress } from '@/types/customerAddress';
import { Karyawan } from '@/types/karyawan';
import { MasterCoa } from '@/types/masterCoa';
import { TransKas } from '@/types/transKas';

import { Head, useForm } from '@inertiajs/react';

interface Props {
    item: TransKas;
    karyawans: Karyawan[];
    customerAddresses: CustomerAddress[];
    accountKas: MasterCoa[];
    accountLawan: MasterCoa[];
}

export default function EditKeluar({ item, karyawans, customerAddresses, accountKas, accountLawan }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Kas', href: route('trans-kas.index') },
        { title: 'Edit Kas Keluar', href: '#' },
    ];

    // Inisialisasi useForm dengan data dari item (type 2 untuk Keluar)
    const { data, setData, put, processing, errors } = useForm({
        transaksi: item.transaksi, // Nilainya 2
        id_karyawan: item.id_karyawan ? String(item.id_karyawan) : '',
        id_account_kas: item.id_account_kas ? String(item.id_account_kas) : '',
        id_account_kas_lain: item.id_account_kas_lain ? String(item.id_account_kas_lain) : '',
        id_customer_address: item.id_customer_address ? String(item.id_customer_address) : '',
        no_bukti: item.no_bukti,
        gudang: item.gudang,
        periode: item.periode,
        nominal: item.nominal,
        keterangan: item.keterangan || '',
        mesin: item.mesin || '',
        kode: item.kode || 0,
        status: String(item.status),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Method PUT untuk update data
        put(route('trans-kas.update', item.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Kas Keluar" />
            <div className="mx-5 py-5">
                <Card className="border-t-4 border-t-red-500">
                    <CardHeader>
                        <CardTitle>Edit Transaksi Kas Keluar: {item.no_bukti}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* No. Bukti */}
                                <div className="space-y-2">
                                    <Label>No. Bukti</Label>
                                    <Input value={data.no_bukti} onChange={(e) => setData('no_bukti', e.target.value)} />
                                    {errors.no_bukti && <p className="text-sm text-red-500">{errors.no_bukti}</p>}
                                </div>

                                {/* Gudang */}
                                <div className="space-y-2">
                                    <Label>Gudang</Label>
                                    <Input value={data.gudang} onChange={(e) => setData('gudang', e.target.value)} />
                                    {errors.gudang && <p className="text-sm text-red-500">{errors.gudang}</p>}
                                </div>

                                {/* Periode */}
                                <div className="space-y-2">
                                    <Label>Periode</Label>
                                    <Input type="number" value={data.periode} onChange={(e) => setData('periode', Number(e.target.value))} />
                                </div>

                                {/* Karyawan */}
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

                                {/* Account Kas */}
                                <div className="space-y-2">
                                    <Label>Account Kas</Label>
                                    <SearchableSelect
                                        items={accountKas.map((a) => ({
                                            key: String(a.id),
                                            value: String(a.id),
                                            label: `${a.kode_akuntansi} - ${a.nama_akun}`,
                                        }))}
                                        value={data.id_account_kas}
                                        onChange={(val) => setData('id_account_kas', val)}
                                    />
                                </div>

                                {/* Account Lain (Beban) */}
                                <div className="space-y-2">
                                    <Label>Account Lain (Beban)</Label>
                                    <SearchableSelect
                                        items={accountLawan.map((a) => ({
                                            key: String(a.id),
                                            value: String(a.id),
                                            label: `${a.kode_akuntansi} - ${a.nama_akun}`,
                                        }))}
                                        value={data.id_account_kas_lain}
                                        onChange={(val) => setData('id_account_kas_lain', val)}
                                    />
                                </div>

                                {/* Nominal */}
                                <div className="space-y-2">
                                    <Label>Nominal</Label>
                                    <Input type="number" value={data.nominal} onChange={(e) => setData('nominal', Number(e.target.value))} />
                                    {errors.nominal && <p className="text-sm text-red-500">{errors.nominal}</p>}
                                </div>

                                {/* Customer */}
                                <div className="space-y-2">
                                    <Label>Customer</Label>
                                    <SearchableSelect
                                        items={customerAddresses.map((c) => ({
                                            key: String(c.id),
                                            value: String(c.id),
                                            label: c.nama_customer ?? '',
                                        }))}
                                        value={data.id_customer_address}
                                        onChange={(val) => setData('id_customer_address', val)}
                                    />
                                </div>

                                {/* Mesin */}
                                <div className="space-y-2">
                                    <Label>Mesin</Label>
                                    <Input value={data.mesin} onChange={(e) => setData('mesin', e.target.value)} />
                                </div>

                                {/* Kode */}
                                <div className="space-y-2">
                                    <Label>Kode</Label>
                                    <Input type="number" value={data.kode} onChange={(e) => setData('kode', Number(e.target.value))} />
                                </div>

                                {/* Status */}
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

                            {/* Keterangan */}
                            <div className="col-span-full space-y-2">
                                <Label>Keterangan</Label>
                                <Textarea value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)} />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={processing}>
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
