/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { KartuInstruksiKerja } from '@/types/kartuInstruksiKerja';
import { SuratJalan, SuratJalanFormData } from '@/types/suratJalan';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Info, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface EditProps {
    suratJalan: SuratJalan;
    kartuInstruksiKerjas: KartuInstruksiKerja[];
}

export default function Edit({ suratJalan, kartuInstruksiKerjas }: EditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Surat Jalan', href: '/suratJalans' },
        { title: 'Edit', href: '#' },
    ];

    const [selectedKIK, setSelectedKIK] = useState<KartuInstruksiKerja | null>(null);
    const [onHandStock, setOnHandStock] = useState<number>(0);

    const { data, setData, put, processing, errors } = useForm<SuratJalanFormData>({
        id_kartu_instruksi_kerja: String(suratJalan.id_kartu_instruksi_kerja),
        no_surat_jalan: suratJalan.no_surat_jalan,
        tgl_surat_jalan: suratJalan.tgl_surat_jalan,
        transportasi: suratJalan.transportasi,
        no_polisi: suratJalan.no_polisi,
        driver: suratJalan.driver,
        pengirim: suratJalan.pengirim,
        keterangan: suratJalan.keterangan || '',
        alamat_tujuan: suratJalan.alamat_tujuan,
        qty_pengiriman: String(suratJalan.qty_pengiriman),
    });

    const calculateOnHandStock = (kik: any): number => {
        const packagings = kik.packagings || [];
        const sjLain = (kik.surat_jalans || []).filter((s: any) => s.id !== suratJalan.id);
        const blokirs = kik.blokirs || [];

        const totalStok = packagings.reduce(
            (t: number, p: any) => t + p.jumlah_satuan_penuh * p.qty_persatuan_penuh + p.jumlah_satuan_sisa * p.qty_persatuan_sisa,
            0,
        );

        const totalSjLain = sjLain.reduce((t: number, s: any) => t + (s.qty_pengiriman || 0), 0);
        const totalBlokir = blokirs.reduce((t: number, b: any) => t + (b.qty_blokir || 0), 0);

        return totalStok - totalBlokir - totalSjLain;
    };

    useEffect(() => {
        const currentKik = kartuInstruksiKerjas.find((k) => String(k.id) === data.id_kartu_instruksi_kerja);
        if (currentKik) {
            setSelectedKIK(currentKik);
            setOnHandStock(calculateOnHandStock(currentKik));
        }
    }, [data.id_kartu_instruksi_kerja]);

    const handleAlamatChange = (type: string) => {
        const addr = selectedKIK?.sales_order?.customer_address;
        if (!addr) return;

        let selected = '';
        if (type === 'utama') selected = addr.alamat_lengkap || '';
        else if (type === 'kedua') selected = addr.alamat_kedua || '';
        else if (type === 'ketiga') selected = addr.alamat_ketiga || '';

        setData('alamat_tujuan', selected);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const qty = parseInt(data.qty_pengiriman);

        if (qty > onHandStock) {
            toast.error(`Stok tidak mencukupi! Tersedia: ${onHandStock}`);
            return;
        }

        put(route('suratJalans.update', suratJalan.id), {
            onSuccess: () => toast.success('Surat Jalan diperbarui'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Surat Jalan" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Edit Surat Jalan: {suratJalan.no_surat_jalan}</CardTitle>
                            <Link href={route('suratJalans.index')}>
                                <Button variant="outline" size="sm">
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Batal
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Pilih SPK (KIK) *</Label>
                                        <Input value={selectedKIK?.no_kartu_instruksi_kerja || ''} readOnly />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tanggal Surat Jalan *</Label>
                                        <Input
                                            type="date"
                                            value={data.tgl_surat_jalan}
                                            onChange={(e) => setData('tgl_surat_jalan', e.target.value)}
                                        />
                                    </div>
                                </div>

                                {selectedKIK && (
                                    <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
                                        <Info className="mt-0.5 h-5 w-5 text-blue-500" />
                                        <div className="text-sm">
                                            <p className="font-bold text-blue-900">Informasi KIK & Stok</p>
                                            <p className="text-blue-700">Customer: {selectedKIK.sales_order?.customer_address?.nama_customer}</p>
                                            <p className="mt-1 font-mono font-bold text-blue-800">
                                                Stok Tersedia (On Hand): {onHandStock.toLocaleString()} pcs
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label>Transportasi</Label>
                                        <Input value={data.transportasi} onChange={(e) => setData('transportasi', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>No. Polisi</Label>
                                        <Input value={data.no_polisi} onChange={(e) => setData('no_polisi', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Driver</Label>
                                        <Input value={data.driver} onChange={(e) => setData('driver', e.target.value)} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Qty Pengiriman (Tersedia: {onHandStock}) *</Label>
                                    <Input
                                        type="number"
                                        value={data.qty_pengiriman}
                                        onChange={(e) => setData('qty_pengiriman', e.target.value)}
                                        className={errors.qty_pengiriman ? 'border-red-500' : ''}
                                    />
                                    {errors.qty_pengiriman && <p className="text-xs text-red-500">{errors.qty_pengiriman}</p>}
                                </div>

                                <div className="space-y-4">
                                    <Label>Alamat Tujuan Pengiriman *</Label>
                                    <div className="mb-2 flex flex-wrap gap-2">
                                        <Button type="button" variant="secondary" onClick={() => handleAlamatChange('utama')}>
                                            Gunakan Alamat Utama
                                        </Button>
                                        <Button type="button" variant="secondary" onClick={() => handleAlamatChange('kedua')}>
                                            Gunakan Alamat 2
                                        </Button>
                                    </div>
                                    <Textarea value={data.alamat_tujuan} onChange={(e) => setData('alamat_tujuan', e.target.value)} rows={4} />
                                </div>

                                <div className="flex justify-end gap-3 border-t pt-6">
                                    <Button type="submit" disabled={processing} className="bg-green-600 text-white hover:bg-green-700">
                                        <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
