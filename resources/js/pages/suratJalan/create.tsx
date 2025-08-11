import { DatePicker } from '@/components/date-picker';
import { SearchableSelect } from '@/components/search-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { KartuInstruksiKerja } from '@/types/kartuInstruksiKerja';
import { SuratJalanFormData } from '@/types/suratJalan';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Surat Jalan',
        href: '/suratJalans',
    },
    {
        title: 'Tambah',
        href: '#',
    },
];

interface CreateProps {
    kartuInstruksiKerjas: KartuInstruksiKerja[];
}

export default function Create({ kartuInstruksiKerjas }: CreateProps) {
    const [selectedKIK, setSelectedKIK] = useState<KartuInstruksiKerja | null>(null);
    const [selectedAlamat, setSelectedAlamat] = useState<string>('');
    const [onHandStock, setOnHandStock] = useState<number>(0);

    const { data, setData, post, processing, errors, reset } = useForm<SuratJalanFormData>({
        id_kartu_instruksi_kerja: '',
        no_surat_jalan: '',
        tgl_surat_jalan: new Date().toISOString().split('T')[0],
        transportasi: '',
        no_polisi: '',
        driver: '',
        pengirim: '',
        keterangan: '',
        alamat_tujuan: '',
        qty_pengiriman: '',
    });

    const handleKIKChange = (kikId: string) => {
        const selectedKartuInstruksiKerja = kartuInstruksiKerjas.find((k) => k.id.toString() === kikId);
        setSelectedKIK(selectedKartuInstruksiKerja || null);
        setSelectedAlamat('');

        // Hitung onhand stock
        const stock = selectedKartuInstruksiKerja ? calculateOnHandStock(selectedKartuInstruksiKerja) : 0;
        setOnHandStock(stock);

        setData((prev) => ({
            ...prev,
            id_kartu_instruksi_kerja: kikId,
            alamat_tujuan: '',
            qty_pengiriman: '',
        }));
    };

    const handleAlamatChange = (alamatType: string) => {
        if (!selectedKIK?.sales_order?.customer_address) {
            return;
        }

        const customerAddress = selectedKIK.sales_order.customer_address;
        let alamat = '';

        switch (alamatType) {
            case 'alamat_lengkap':
                alamat = customerAddress.alamat_lengkap || '';
                break;
            case 'alamat_kedua':
                alamat = customerAddress.alamat_kedua || '';
                break;
            case 'alamat_ketiga':
                alamat = customerAddress.alamat_ketiga || '';
                break;
            default:
                alamat = '';
        }

        setSelectedAlamat(alamatType);
        setData('alamat_tujuan', alamat);
    };

    const alamatItems: { key: string; value: string; label: string }[] = [];

    const customerAddress = selectedKIK?.sales_order?.customer_address;

    if (customerAddress?.alamat_lengkap) {
        alamatItems.push({
            key: 'alamat_lengkap',
            value: 'alamat_lengkap',
            label: `Alamat Utama - ${customerAddress.alamat_lengkap}`,
        });
    }
    if (customerAddress?.alamat_kedua) {
        alamatItems.push({
            key: 'alamat_kedua',
            value: 'alamat_kedua',
            label: `Alamat Kedua - ${customerAddress.alamat_kedua}`,
        });
    }
    if (customerAddress?.alamat_ketiga) {
        alamatItems.push({
            key: 'alamat_ketiga',
            value: 'alamat_ketiga',
            label: `Alamat Ketiga - ${customerAddress.alamat_ketiga}`,
        });
    }

    const calculateOnHandStock = (kik: KartuInstruksiKerja): number => {
        const packagings = kik.packagings || [];
        const suratJalans = kik.surat_jalans || [];
        const blokirs = kik.blokirs || [];

        const totalStokBarangJadi = packagings.reduce((total, packaging) => {
            const totalPenuh = packaging.jumlah_satuan_penuh * packaging.qty_persatuan_penuh;
            const totalSisa = packaging.jumlah_satuan_sisa * packaging.qty_persatuan_sisa;
            return total + totalPenuh + totalSisa;
        }, 0);

        const totalPengiriman = suratJalans.reduce((total, suratJalan) => {
            return total + (suratJalan.qty_pengiriman || 0);
        }, 0);

        const transferBlokir = blokirs.reduce((total, blokir) => {
            return total + (blokir.qty_blokir || 0);
        }, 0);

        return totalStokBarangJadi - transferBlokir - totalPengiriman;
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.id_kartu_instruksi_kerja) {
            toast.error('Pilih SPK terlebih dahulu');
            return;
        }

        post(route('suratJalans.store'), {
            onSuccess: () => {
                toast.success('Surat Jalan berhasil dibuat');
                reset();
            },
            onError: () => {
                toast.error('Gagal membuat Surat Jalan');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Surat Jalan" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Tambah Surat Jalan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submit} className="space-y-6">
                                    {/* Pilih SPK */}
                                    <div className="space-y-2">
                                        <Label htmlFor="id_kartu_instruksi_kerja">
                                            Pilih Surat Perintah Kerja <span className="text-red-500">*</span>
                                        </Label>
                                        <SearchableSelect
                                            items={kartuInstruksiKerjas.map((kik) => ({
                                                key: String(kik.id),
                                                value: String(kik.id),
                                                label: `${kik.no_kartu_instruksi_kerja} | ${kik.sales_order?.no_bon_pesanan ?? '-'} - ${kik.sales_order?.customer_address?.nama_customer ?? '-'}`,
                                            }))}
                                            value={data.id_kartu_instruksi_kerja || ''}
                                            placeholder="Pilih SPK..."
                                            onChange={handleKIKChange}
                                        />
                                        {errors.id_kartu_instruksi_kerja && <p className="text-sm text-red-600">{errors.id_kartu_instruksi_kerja}</p>}
                                    </div>

                                    {/* Detail SPK yang dipilih */}
                                    {selectedKIK && (
                                        <div className="rounded-md border bg-gray-50 p-4 dark:bg-gray-800">
                                            <h3 className="mb-3 font-medium">Detail SPK Terpilih</h3>
                                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                                <div>
                                                    <p>
                                                        <span className="font-medium">No. SPK:</span> {selectedKIK.no_kartu_instruksi_kerja}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">No. Sales Order:</span>{' '}
                                                        {selectedKIK.sales_order?.no_bon_pesanan || '-'}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">Customer:</span>{' '}
                                                        {selectedKIK.sales_order?.customer_address?.nama_customer || '-'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p>
                                                        <span className="font-medium">No. PO Customer:</span>{' '}
                                                        {selectedKIK.sales_order?.no_po_customer || '-'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p>
                                                        <span className="font-medium">On Hand Stock:</span>{' '}
                                                        <span className={`font-bold ${onHandStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {onHandStock.toLocaleString()} pcs
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        {/* Tanggal Surat Jalan */}
                                        <div className="space-y-2">
                                            <Label htmlFor="tgl_surat_jalan">
                                                Tanggal Surat Jalan <span className="text-red-500">*</span>
                                            </Label>
                                            <DatePicker
                                                id="tgl_surat_jalan"
                                                value={data.tgl_surat_jalan}
                                                onChange={(e) => setData('tgl_surat_jalan', e.target.value ? e.target.value : '')}
                                                className={errors.tgl_surat_jalan ? 'border-red-500' : ''}
                                            />
                                            {errors.tgl_surat_jalan && <p className="text-sm text-red-600">{errors.tgl_surat_jalan}</p>}
                                        </div>

                                        {/* Transportasi */}
                                        <div className="space-y-2">
                                            <Label htmlFor="transportasi">
                                                Transportasi <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="transportasi"
                                                type="text"
                                                value={data.transportasi}
                                                onChange={(e) => setData('transportasi', e.target.value)}
                                                placeholder="Contoh: Mobil Box, Motor, Truk"
                                                className={errors.transportasi ? 'border-red-500' : ''}
                                            />
                                            {errors.transportasi && <p className="text-sm text-red-600">{errors.transportasi}</p>}
                                        </div>

                                        {/* No Polisi */}
                                        <div className="space-y-2">
                                            <Label htmlFor="no_polisi">
                                                No. Polisi <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="no_polisi"
                                                type="text"
                                                value={data.no_polisi}
                                                onChange={(e) => setData('no_polisi', e.target.value)}
                                                placeholder="Contoh: B 1234 ABC"
                                                className={errors.no_polisi ? 'border-red-500' : ''}
                                            />
                                            {errors.no_polisi && <p className="text-sm text-red-600">{errors.no_polisi}</p>}
                                        </div>

                                        {/* Driver */}
                                        <div className="space-y-2">
                                            <Label htmlFor="driver">
                                                Driver <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="driver"
                                                type="text"
                                                value={data.driver}
                                                onChange={(e) => setData('driver', e.target.value)}
                                                placeholder="Nama driver"
                                                className={errors.driver ? 'border-red-500' : ''}
                                            />
                                            {errors.driver && <p className="text-sm text-red-600">{errors.driver}</p>}
                                        </div>

                                        {/* Pengirim */}
                                        <div className="space-y-2">
                                            <Label htmlFor="pengirim">
                                                Pengirim <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="pengirim"
                                                type="text"
                                                value={data.pengirim}
                                                onChange={(e) => setData('pengirim', e.target.value)}
                                                placeholder="Nama pengirim"
                                                className={errors.pengirim ? 'border-red-500' : ''}
                                            />
                                            {errors.pengirim && <p className="text-sm text-red-600">{errors.pengirim}</p>}
                                        </div>

                                        {/* Qty Pengiriman */}
                                        <div className="space-y-2">
                                            <Label htmlFor="qty_pengiriman">
                                                Qty Pengiriman <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="qty_pengiriman"
                                                type="number"
                                                min="1"
                                                max={onHandStock}
                                                value={data.qty_pengiriman}
                                                onChange={(e) => {
                                                    const value = parseInt(e.target.value) || 0;
                                                    if (value <= onHandStock) {
                                                        setData('qty_pengiriman', e.target.value);
                                                    } else {
                                                        toast.error(
                                                            `Qty pengiriman tidak boleh melebihi stok yang tersedia (${onHandStock.toLocaleString()} pcs)`,
                                                        );
                                                    }
                                                }}
                                                placeholder="Masukkan jumlah pengiriman"
                                                className={errors.qty_pengiriman ? 'border-red-500' : ''}
                                                disabled={!selectedKIK || onHandStock <= 0}
                                            />
                                            {onHandStock <= 0 && selectedKIK && (
                                                <p className="text-sm text-red-600">Stok tidak tersedia untuk pengiriman</p>
                                            )}
                                            {errors.qty_pengiriman && <p className="text-sm text-red-600">{errors.qty_pengiriman}</p>}
                                        </div>

                                        {/* Keterangan */}
                                        <div className="space-y-2">
                                            <Label htmlFor="keterangan">
                                                Keterangan <span className="text-red-500">*</span>
                                            </Label>
                                            <Textarea
                                                id="keterangan"
                                                value={data.keterangan}
                                                onChange={(e) => setData('keterangan', e.target.value)}
                                                placeholder="Keterangan tambahan"
                                                className="min-h-[80px]"
                                                rows={3}
                                            />
                                            {errors.keterangan && <p className="text-sm text-red-600">{errors.keterangan}</p>}
                                        </div>
                                    </div>

                                    {/* Pilih Alamat Tujuan */}
                                    {selectedKIK?.sales_order?.customer_address && (
                                        <div className="space-y-2">
                                            <Label htmlFor="alamat_dropdown">
                                                Pilih Alamat Tujuan <span className="text-red-500">*</span>
                                            </Label>
                                            <SearchableSelect
                                                items={alamatItems}
                                                value={selectedAlamat || ''}
                                                placeholder="Pilih alamat tujuan..."
                                                onChange={handleAlamatChange}
                                            />
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex justify-end space-x-2">
                                        <Link href={route('suratJalans.index')}>
                                            <Button type="button" variant="outline">
                                                Batal
                                            </Button>
                                        </Link>
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Menyimpan...' : 'Simpan'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
