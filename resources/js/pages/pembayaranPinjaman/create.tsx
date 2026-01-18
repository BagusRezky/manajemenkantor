import { Textarea } from '@/components/ui/textarea';
import { Head, useForm } from '@inertiajs/react';
import { DatePicker } from '../../components/date-picker';
import { SearchableSelect } from '../../components/search-select';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import AppLayout from '../../layouts/app-layout';
import { BreadcrumbItem } from '../../types';
import { PengajuanPinjaman } from '../../types/pengajuanPinjaman'; // Ganti

// Ganti breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pembayaran Pinjaman',
        href: route('pembayaranPinjamans.index'),
    },
    {
        title: 'Tambah Data',
        href: route('pembayaranPinjamans.create'),
    },
];

interface Props {
    // Ganti prop
    pengajuanPinjamans: PengajuanPinjaman[];
}

export default function CreatePembayaranPinjaman({ pengajuanPinjamans }: Props) {
    // Ganti field form
    const { data, setData, post, processing, errors } = useForm({
        id_pengajuan_pinjaman: '',
        no_bukti_pembayaran: '',
        tanggal_pembayaran: '',
        nominal_pembayaran: '', // Input number bisa dimulai dengan string kosong
        keterangan: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Ganti route
        post(route('pembayaranPinjamans.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {/* Ganti title */}
            <Head title="Tambah Data Pembayaran Pinjaman" />
            <div className="mx-5 py-5">
                <Card>
                    <CardHeader>
                        {/* Ganti card title */}
                        <CardTitle>Tambah Data Pembayaran Pinjaman</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* No Bukti Pembayaran */}
                                <div className="space-y-2">
                                    <Label htmlFor="no_bukti_pembayaran">No Bukti Pembayaran *</Label>
                                    <Input
                                        id="no_bukti_pembayaran"
                                        value={data.no_bukti_pembayaran}
                                        onChange={(e) => setData('no_bukti_pembayaran', e.target.value)}
                                        className={errors.no_bukti_pembayaran ? 'border-red-500' : ''}
                                    />
                                    {errors.no_bukti_pembayaran && <p className="text-sm text-red-500">{errors.no_bukti_pembayaran}</p>}
                                </div>

                                {/* Pengajuan Pinjaman (Karyawan) */}
                                <div className="space-y-2">
                                    <Label htmlFor="id_pengajuan_pinjaman">Pinjaman (Karyawan) *</Label>
                                    <SearchableSelect
                                        items={pengajuanPinjamans.map((p) => ({
                                            key: String(p.id),
                                            value: String(p.id),
                                            // Buat label yang deskriptif
                                            label: `${p.karyawan?.nama || 'Nama tidak tersedia'} | No Bukti: ${p.nomor_bukti_pengajuan} | Nilai Pinjaman: ${p.nilai_pinjaman}`,
                                        }))}
                                        value={data.id_pengajuan_pinjaman || ''}
                                        placeholder="Pilih Pinjaman"
                                        onChange={(value) => setData('id_pengajuan_pinjaman', value)}
                                    />
                                    {errors.id_pengajuan_pinjaman && <p className="text-sm text-red-500">{errors.id_pengajuan_pinjaman}</p>}
                                </div>

                                {/* Tanggal Pembayaran */}
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_pembayaran">Tanggal Pembayaran *</Label>
                                    <DatePicker
                                        value={data.tanggal_pembayaran}
                                        onChange={(date) => {
                                            if (date) {
                                                const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                                                    .toISOString()
                                                    .split('T')[0];
                                                setData('tanggal_pembayaran', formattedDate);
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
                            </div>
                            {/* Keterangan */}
                            <div className="space-y-2">
                                <Label htmlFor="keterangan">Keterangan</Label>
                                <Textarea id="keterangan" value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)} />
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan'}
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
