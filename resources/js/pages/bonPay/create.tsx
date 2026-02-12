import { SearchableSelect } from '@/components/search-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Invoice } from '@/types/invoice';
import { Karyawan } from '@/types/karyawan';
import { MasterCoa } from '@/types/masterCoa';
import { MetodeBayar } from '@/types/metodeBayar'; // Pastikan type ini ada
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs = [
    { title: 'Bon Pay', href: route('bonPays.index') },
    { title: 'Tambah', href: '#' },
];

interface Props {
    invoices: Invoice[];
    metodeBayars: MetodeBayar[];
    karyawans: Karyawan[];
    accounts: MasterCoa[];
}

export default function Create({ invoices, metodeBayars, karyawans, accounts }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        id_invoice: '',
        id_metode_bayar: '',
        id_account: '',
        id_karyawan: '',
        nominal_pembayaran: 0,
        tanggal_pembayaran: new Date().toISOString().split('T')[0],
        gudang: '',
        keterangan: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('bonPays.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Bon Pay" />
            <div className="mx-5 py-5">
                <Card className="border-t-4 border-t-purple-500">
                    <CardHeader>
                        <CardTitle>Tambah Pembayaran (Bon Pay)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Invoice Selection */}
                                <div className="space-y-2">
                                    <Label>Pilih Invoice</Label>
                                    <SearchableSelect
                                        items={invoices.map((inv) => ({
                                            key: String(inv.id),
                                            value: String(inv.id),
                                            label: `${inv.no_invoice} - ${inv.surat_jalan?.kartu_instruksi_kerja?.sales_order?.customer_address?.nama_customer || 'No Name'} `,
                                        }))}
                                        value={data.id_invoice}
                                        onChange={(val) => setData('id_invoice', val)}
                                        placeholder="Cari Nomor Invoice..."
                                    />
                                    {errors.id_invoice && <p className="text-sm text-red-500">{errors.id_invoice}</p>}
                                </div>

                                {/* Tanggal Pembayaran */}
                                <div className="space-y-2">
                                    <Label>Tanggal Pembayaran</Label>
                                    <Input
                                        type="date"
                                        value={data.tanggal_pembayaran}
                                        onChange={(e) => setData('tanggal_pembayaran', e.target.value)}
                                    />
                                    {errors.tanggal_pembayaran && <p className="text-sm text-red-500">{errors.tanggal_pembayaran}</p>}
                                </div>

                                {/* Metode Bayar */}
                                <div className="space-y-2">
                                    <Label>Metode Bayar</Label>
                                    <SearchableSelect
                                        items={metodeBayars.map((m) => ({
                                            key: String(m.id),
                                            value: String(m.id),
                                            label: m.metode_bayar,
                                        }))}
                                        value={data.id_metode_bayar}
                                        onChange={(val) => setData('id_metode_bayar', val)}
                                        placeholder="Pilih Metode"
                                    />
                                    {errors.id_metode_bayar && <p className="text-sm text-red-500">{errors.id_metode_bayar}</p>}
                                </div>

                                {/* Account / COA */}
                                <div className="space-y-2">
                                    <Label>Account (COA)</Label>
                                    <SearchableSelect
                                        items={accounts.map((a) => ({
                                            key: String(a.id),
                                            value: String(a.id),
                                            label: `${a.kode_akuntansi} - ${a.nama_akun}`,
                                        }))}
                                        value={data.id_account}
                                        onChange={(val) => setData('id_account', val)}
                                        placeholder="Pilih Account"
                                    />
                                    {errors.id_account && <p className="text-sm text-red-500">{errors.id_account}</p>}
                                </div>

                                {/* Nominal */}
                                <div className="space-y-2">
                                    <Label>Nominal Pembayaran</Label>
                                    <Input
                                        type="number"
                                        value={data.nominal_pembayaran}
                                        onChange={(e) => setData('nominal_pembayaran', Number(e.target.value))}
                                    />
                                    {errors.nominal_pembayaran && <p className="text-sm text-red-500">{errors.nominal_pembayaran}</p>}
                                </div>

                                {/* Karyawan */}
                                <div className="space-y-2">
                                    <Label>Karyawan (Penerima/Sales)</Label>
                                    <SearchableSelect
                                        items={karyawans.map((k) => ({
                                            key: String(k.id),
                                            value: String(k.id),
                                            label: k.nama ?? '',
                                        }))}
                                        value={data.id_karyawan}
                                        onChange={(val) => setData('id_karyawan', val)}
                                        placeholder="Pilih Karyawan"
                                    />
                                    {errors.id_karyawan && <p className="text-sm text-red-500">{errors.id_karyawan}</p>}
                                </div>

                                {/* Gudang */}
                                <div className="space-y-2">
                                    <Label>Gudang</Label>
                                    <Input value={data.gudang} onChange={(e) => setData('gudang', e.target.value)} placeholder="Nama Gudang..." />
                                </div>

                                {/* Keterangan */}
                                <div className="col-span-full space-y-2">
                                    <Label>Keterangan</Label>
                                    <Textarea
                                        value={data.keterangan}
                                        onChange={(e) => setData('keterangan', e.target.value)}
                                        placeholder="Catatan pembayaran..."
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing} className="bg-purple-600 text-white hover:bg-purple-700">
                                    Simpan Pembayaran
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
