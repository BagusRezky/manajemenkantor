import { Head, useForm } from '@inertiajs/react';
import { DatePicker } from '../../components/date-picker';
import { SearchableSelect } from '../../components/search-select';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import AppLayout from '../../layouts/app-layout';
import { BreadcrumbItem } from '../../types';
import { PembayaranPinjaman } from '../../types/pembayaranPinjaman'; // Ganti
import { PengajuanPinjaman } from '../../types/pengajuanPinjaman'; // Ganti

interface Props {
    // Ganti props
    pembayaranPinjaman: PembayaranPinjaman;
    pengajuanPinjamans: PengajuanPinjaman[];
}

// Ganti breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pembayaran Pinjaman', href: route('pembayaranPinjamans.index') },
    { title: 'Edit Data', href: '#' },
];

export default function EditPembayaranPinjaman({ pembayaranPinjaman, pengajuanPinjamans }: Props) {
    // Ganti field form
    const { data, setData, put, processing, errors } = useForm({
        tahap_cicilan: pembayaranPinjaman.tahap_cicilan || '',
        id_pengajuan_pinjaman: pembayaranPinjaman.id_pengajuan_pinjaman || '',
        tanggal_pembayaran: pembayaranPinjaman.tanggal_pembayaran || '',
        // Ubah number ke string untuk input
        nominal_pembayaran: String(pembayaranPinjaman.nominal_pembayaran) || '',
        keterangan: pembayaranPinjaman.keterangan || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Ganti route
        put(route('pembayaranPinjamans.update', pembayaranPinjaman.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {/* Ganti title */}
            <Head title="Edit Data Pembayaran Pinjaman" />

            <div className="mx-5 py-5">
                <Card>
                    <CardHeader>
                        {/* Ganti card title */}
                        <CardTitle>Edit Data Pembayaran Pinjaman</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Pengajuan Pinjaman (Karyawan) */}
                                <div className="space-y-2">
                                    <Label htmlFor="id_pengajuan_pinjaman">Pinjaman (Karyawan) *</Label>
                                    <SearchableSelect
                                        items={pengajuanPinjamans.map((p) => ({
                                            key: String(p.id),
                                            value: String(p.id),
                                            label: `${p.karyawan?.nama}`,
                                        }))}
                                        value={String(data.id_pengajuan_pinjaman)}
                                        placeholder="Pilih Pinjaman"
                                        onChange={(value) => setData('id_pengajuan_pinjaman', value)}
                                    />
                                    {errors.id_pengajuan_pinjaman && <p className="text-sm text-red-500">{errors.id_pengajuan_pinjaman}</p>}
                                </div>

                                {/* tahap cicilan */}
                                <div className="space-y-2">
                                    <Label htmlFor="tahap_cicilan">Tahap Cicilan *</Label>
                                    <Input
                                        id="tahap_cicilan"
                                        value={data.tahap_cicilan}
                                        onChange={(e) => setData('tahap_cicilan', e.target.value)}
                                        className={errors.tahap_cicilan ? 'border-red-500' : ''}
                                    />
                                    {errors.tahap_cicilan && <p className="text-sm text-red-500">{errors.tahap_cicilan}</p>}
                                </div>

                                {/* Tanggal Pembayaran */}
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_pembayaran">Tanggal Pembayaran *</Label>
                                    <DatePicker
                                        value={data.tanggal_pembayaran}
                                        onChange={(date) => {
                                            if (date) {
                                                const formatted = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                                                    .toISOString()
                                                    .split('T')[0];
                                                setData('tanggal_pembayaran', formatted);
                                            } else {
                                                setData('tanggal_pembayaran', '');
                                            }
                                        }}
                                    />
                                    {errors.tanggal_pembayaran && <p className="text-sm text-red-500">{errors.tanggal_pembayaran}</p>}
                                </div>

                                {/* Nominal Pembayaran */}
                                <div className="space-y-2">
                                    <Label htmlFor="nominal_pembayaran">Nominal Pembayaran *</Label>
                                    <Input
                                        id="nominal_pembayaran"
                                        type="number" // Ganti tipe
                                        value={data.nominal_pembayaran}
                                        onChange={(e) => setData('nominal_pembayaran', e.target.value)}
                                        className={errors.nominal_pembayaran ? 'border-red-500' : ''}
                                    />
                                    {errors.nominal_pembayaran && <p className="text-sm text-red-500">{errors.nominal_pembayaran}</p>}
                                </div>

                                {/* Keterangan */}
                                <div className="space-y-2">
                                    <Label htmlFor="keterangan">Keterangan</Label>
                                    <Input id="keterangan" value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)} />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
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
