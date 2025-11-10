// pages/pengajuanPinjaman/edit.tsx

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
import { Karyawan } from '../../types/karyawan';
import { PengajuanPinjaman } from '../../types/pengajuanPinjaman';

interface Props {
    pengajuanPinjaman: PengajuanPinjaman;
    karyawans: Karyawan[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pengajuan Pinjaman', href: route('pengajuanPinjamans.index') },
    { title: 'Edit Data', href: '#' },
];

export default function EditPengajuanPinjaman({ pengajuanPinjaman, karyawans }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        id_karyawan: pengajuanPinjaman.id_karyawan || '',
        kode_gudang: pengajuanPinjaman.kode_gudang || '',
        nomor_bukti_pengajuan: pengajuanPinjaman.nomor_bukti_pengajuan || '',
        tanggal_pengajuan: pengajuanPinjaman.tanggal_pengajuan || '',
        nilai_pinjaman: pengajuanPinjaman.nilai_pinjaman || 0,
        jangka_waktu_pinjaman: pengajuanPinjaman.jangka_waktu_pinjaman || 0,
        cicilan_per_bulan: pengajuanPinjaman.cicilan_per_bulan || 0,
        keperluan_pinjaman: pengajuanPinjaman.keperluan_pinjaman || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('pengajuanPinjamans.update', pengajuanPinjaman.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Data Pengajuan Pinjaman" />

            <div className="mx-5 py-5">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Data Pengajuan Pinjaman</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {/* Karyawan */}
                                <div className="space-y-2">
                                    <Label htmlFor="id_karyawan">Karyawan *</Label>
                                    <SearchableSelect
                                        items={karyawans.map((karyawan) => ({
                                            key: String(karyawan.id),
                                            value: String(karyawan.id),
                                            label: karyawan.nama ?? '',
                                        }))}
                                        value={String(data.id_karyawan)}
                                        placeholder="Pilih Karyawan"
                                        onChange={(value) => setData('id_karyawan', value)}
                                    />
                                    {errors.id_karyawan && <p className="text-sm text-red-500">{errors.id_karyawan}</p>}
                                </div>

                                {/* Kode Gudang */}
                                <div className="space-y-2">
                                    <Label htmlFor="kode_gudang">Kode Gudang *</Label>
                                    <Input id="kode_gudang" value={data.kode_gudang} onChange={(e) => setData('kode_gudang', e.target.value)} />
                                    {errors.kode_gudang && <p className="text-sm text-red-500">{errors.kode_gudang}</p>}
                                </div>

                                {/* Nomor Bukti Pengajuan */}
                                <div className="space-y-2">
                                    <Label htmlFor="nomor_bukti_pengajuan">Nomor Bukti *</Label>
                                    <Input
                                        id="nomor_bukti_pengajuan"
                                        value={data.nomor_bukti_pengajuan}
                                        onChange={(e) => setData('nomor_bukti_pengajuan', e.target.value)}
                                    />
                                    {errors.nomor_bukti_pengajuan && <p className="text-sm text-red-500">{errors.nomor_bukti_pengajuan}</p>}
                                </div>

                                {/* Tanggal Pengajuan */}
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_pengajuan">Tanggal Pengajuan *</Label>
                                    <DatePicker
                                        value={data.tanggal_pengajuan}
                                        onChange={(date) => {
                                            if (date) {
                                                const formatted = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                                                    .toISOString()
                                                    .split('T')[0];
                                                setData('tanggal_pengajuan', formatted);
                                            } else {
                                                setData('tanggal_pengajuan', '');
                                            }
                                        }}
                                    />
                                    {errors.tanggal_pengajuan && <p className="text-sm text-red-500">{errors.tanggal_pengajuan}</p>}
                                </div>

                                {/* Nilai Pinjaman */}
                                <div className="space-y-2">
                                    <Label htmlFor="nilai_pinjaman">Nilai Pinjaman (Rp) *</Label>
                                    <Input
                                        id="nilai_pinjaman"
                                        type="number"
                                        value={data.nilai_pinjaman}
                                        onChange={(e) => setData('nilai_pinjaman', parseInt(e.target.value, 10))}
                                    />
                                    {errors.nilai_pinjaman && <p className="text-sm text-red-500">{errors.nilai_pinjaman}</p>}
                                </div>

                                {/* Jangka Waktu Pinjaman */}
                                <div className="space-y-2">
                                    <Label htmlFor="jangka_waktu_pinjaman">Jangka Waktu (Bulan) *</Label>
                                    <Input
                                        id="jangka_waktu_pinjaman"
                                        type="number"
                                        value={data.jangka_waktu_pinjaman}
                                        onChange={(e) => setData('jangka_waktu_pinjaman', parseInt(e.target.value, 10))}
                                    />
                                    {errors.jangka_waktu_pinjaman && <p className="text-sm text-red-500">{errors.jangka_waktu_pinjaman}</p>}
                                </div>

                                {/* Cicilan Per Bulan */}
                                <div className="space-y-2">
                                    <Label htmlFor="cicilan_per_bulan">Cicilan Per Bulan (Rp) *</Label>
                                    <Input
                                        id="cicilan_per_bulan"
                                        type="number"
                                        value={data.cicilan_per_bulan}
                                        onChange={(e) => setData('cicilan_per_bulan', parseInt(e.target.value, 10))}
                                    />
                                    {errors.cicilan_per_bulan && <p className="text-sm text-red-500">{errors.cicilan_per_bulan}</p>}
                                </div>

                                {/* Keperluan Pinjaman */}
                                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                                    <Label htmlFor="keperluan_pinjaman">Keperluan Pinjaman</Label>
                                    <Textarea
                                        id="keperluan_pinjaman"
                                        value={data.keperluan_pinjaman}
                                        onChange={(e) => setData('keperluan_pinjaman', e.target.value)}
                                    />
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
