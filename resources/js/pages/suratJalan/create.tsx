import { SearchableSelect } from '@/components/search-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { KartuInstruksiKerja } from '@/types/kartuInstruksiKerja';
import { SalesOrder } from '@/types/salesOrder';
import { SuratJalanFormData } from '@/types/suratJalan';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Surat Jalan', href: '/suratJalans' },
    { title: 'Tambah', href: '#' },
];

interface CreateProps {
    salesOrders: (SalesOrder & { material_onhand: number })[];
    allKartuInstruksiKerjas: KartuInstruksiKerja[]; // Data semua SPK dari controller
}

export default function Create({ salesOrders, allKartuInstruksiKerjas }: CreateProps) {
    const [selectedSO, setSelectedSO] = useState<(SalesOrder & { material_onhand: number }) | null>(null);
    const [selectedKIK, setSelectedKIK] = useState<KartuInstruksiKerja | null>(null);
    const [selectedAlamatKey, setSelectedAlamatKey] = useState<string>('');
    const [onHandStock, setOnHandStock] = useState<number>(0);

    const { data, setData, post, processing, errors, reset } = useForm<SuratJalanFormData>({
        id_sales_order: '',
        id_kartu_instruksi_kerja: '',
        no_surat_jalan: '',
        tgl_surat_jalan: new Date().toISOString().split('T')[0],
        transportasi: '',
        no_polisi: '',
        driver: '',
        pengirim: '',
        keterangan: '-',
        alamat_tujuan: '',
        qty_pengiriman: '',
    });

    // --- LOGIC ALAMAT (Sesuai Permintaanmu) ---
    const handleAlamatChange = (alamatType: string) => {
        if (!selectedSO?.customer_address) return;

        const addr = selectedSO.customer_address;
        let alamatValue = '';

        if (alamatType === 'alamat_lengkap') alamatValue = addr.alamat_lengkap || '';
        else if (alamatType === 'alamat_kedua') alamatValue = addr.alamat_kedua || '';
        else if (alamatType === 'alamat_ketiga') alamatValue = addr.alamat_ketiga || '';

        setSelectedAlamatKey(alamatType);
        setData('alamat_tujuan', alamatValue);
    };

    const alamatItems = selectedSO?.customer_address
        ? [
              { key: 'alamat_lengkap', value: 'alamat_lengkap', label: `Utama: ${selectedSO.customer_address.alamat_lengkap}` },
              ...(selectedSO.customer_address.alamat_kedua
                  ? [{ key: 'alamat_kedua', value: 'alamat_kedua', label: `Kedua: ${selectedSO.customer_address.alamat_kedua}` }]
                  : []),
              ...(selectedSO.customer_address.alamat_ketiga
                  ? [{ key: 'alamat_ketiga', value: 'alamat_ketiga', label: `Ketiga: ${selectedSO.customer_address.alamat_ketiga}` }]
                  : []),
          ]
        : [];

    // --- LOGIC STOK KIK (Rumus Kamu) ---
    const calculateKikStock = (kik: KartuInstruksiKerja): number => {
        const packagings = kik.packagings || [];
        const suratJalans = kik.surat_jalans || [];
        const blokirs = kik.blokirs || [];

        const totalStokBarangJadi = packagings.reduce(
            (total, p) => total + p.jumlah_satuan_penuh * p.qty_persatuan_penuh + p.jumlah_satuan_sisa * p.qty_persatuan_sisa,
            0,
        );

        const totalPengiriman = suratJalans.reduce((total, sj) => total + (sj.qty_pengiriman || 0), 0);
        const transferBlokir = blokirs.reduce((total, b) => total + (b.qty_blokir || 0), 0);

        return totalStokBarangJadi - transferBlokir - totalPengiriman;
    };

    // --- HANDLE CHANGES ---
    const handleSOChange = (soId: string) => {
        const so = salesOrders.find((s) => s.id.toString() === soId);
        setSelectedSO(so || null);
        setSelectedKIK(null);
        setSelectedAlamatKey('');

        // Default: OnHand Stock ambil dari Material Stock SO (Case 2)
        setOnHandStock(so ? so.material_onhand : 0);

        setData((prev) => ({
            ...prev,
            id_sales_order: soId,
            id_kartu_instruksi_kerja: '',
            alamat_tujuan: '',
            qty_pengiriman: '',
        }));
    };

    const handleKIKChange = (kikId: string) => {
        if (!kikId) {
            setSelectedKIK(null);
            setOnHandStock(selectedSO?.material_onhand || 0);
            setData('id_kartu_instruksi_kerja', '');
            return;
        }

        const kik = allKartuInstruksiKerjas.find((k) => k.id.toString() === kikId);
        setSelectedKIK(kik || null);

        // Jika pilih KIK, gunakan rumus Case 1 (Barang Jadi)
        const stock = kik ? calculateKikStock(kik) : selectedSO?.material_onhand || 0;
        setOnHandStock(stock);
        setData('id_kartu_instruksi_kerja', kikId);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.id_sales_order) return toast.error('Pilih Sales Order!');
        post(route('suratJalans.store'), {
            onSuccess: () => {
                toast.success('Berhasil!');
                reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Surat Jalan" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tambah Surat Jalan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* PILIH SALES ORDER */}
                                    <div className="space-y-2">
                                        <Label>
                                            Pilih Sales Order <span className="text-red-500">*</span>
                                        </Label>
                                        <SearchableSelect
                                            items={salesOrders.map((so) => ({
                                                key: String(so.id),
                                                value: String(so.id),
                                                label: `${so.no_bon_pesanan} | ${so.customer_address?.nama_customer || 'N/A'}`,
                                            }))}
                                            value={data.id_sales_order}
                                            onChange={handleSOChange}
                                        />
                                        {errors.id_sales_order && <p className="text-sm text-red-600">{errors.id_sales_order}</p>}
                                    </div>

                                    {/* PILIH SPK */}
                                    <div className="space-y-2">
                                        <Label>Pilih SPK (Opsional)</Label>
                                        <SearchableSelect
                                            items={allKartuInstruksiKerjas.map((kik) => ({
                                                key: String(kik.id),
                                                value: String(kik.id),
                                                label: `${kik.no_kartu_instruksi_kerja} ${String(kik.id_sales_order) === data.id_sales_order ? '(Milik SO ini)' : ''}`,
                                            }))}
                                            value={data.id_kartu_instruksi_kerja}
                                            onChange={handleKIKChange}
                                            placeholder="Pilih SPK..."
                                        />
                                        {errors.id_kartu_instruksi_kerja && <p className="text-sm text-red-600">{errors.id_kartu_instruksi_kerja}</p>}
                                    </div>
                                </div>

                                {/* INFO STOK PANEL */}
                                {selectedSO && (
                                    <div className="grid grid-cols-2 gap-4 rounded-md border bg-gray-50 p-4">
                                        <div>
                                            <Label className="text-gray-500">Sumber Pengiriman</Label>
                                            <p className="font-bold text-blue-600">
                                                {selectedKIK ? `SPK: ${selectedKIK.no_kartu_instruksi_kerja}` : 'Langsung via SO (Stok Material)'}
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="text-gray-500">Stok On Hand</Label>
                                            <p className="text-xl font-bold text-green-600">
                                                {onHandStock.toLocaleString()} {selectedSO?.master_item?.unit?.nama_satuan || '-'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>
                                            Qty Pengiriman <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            type="number"
                                            max={onHandStock}
                                            value={data.qty_pengiriman}
                                            onChange={(e) => setData('qty_pengiriman', e.target.value)}
                                        />
                                        {errors.qty_pengiriman && <p className="text-sm text-red-600">{errors.qty_pengiriman}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tanggal Surat Jalan<span className="text-red-500">*</span></Label>
                                        <Input
                                            type="date"
                                            value={data.tgl_surat_jalan}
                                            onChange={(e) => setData('tgl_surat_jalan', e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* DROP DOWN ALAMAT (Sesuai Logika Kamu) */}
                                {(selectedSO?.customer_address && (
                                    <div className="space-y-2">
                                        <Label>
                                            Pilih Alamat Tujuan <span className="text-red-500">*</span>
                                        </Label>
                                        <SearchableSelect
                                            items={alamatItems}
                                            value={selectedAlamatKey}
                                            onChange={handleAlamatChange}
                                            placeholder="-- Pilih Alamat --"
                                        />
                                        <Textarea
                                            className="mt-2"
                                            value={data.alamat_tujuan}
                                            onChange={(e) => setData('alamat_tujuan', e.target.value)}
                                            placeholder="Atau isi alamat manual di sini..."
                                        />
                                    </div>
                                )) || (
                                    <div className="space-y-2">
                                        <Label>Alamat Tujuan<span className="text-red-500">*</span></Label>
                                        <Textarea value={data.alamat_tujuan} onChange={(e) => setData('alamat_tujuan', e.target.value)} />
                                    </div>
                                )}

                                {/* Driver, No Polisi, dll */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Transportasi<span className="text-red-500">*</span></Label>
                                        <Input value={data.transportasi} onChange={(e) => setData('transportasi', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>No. Polisi<span className="text-red-500">*</span></Label>
                                        <Input value={data.no_polisi} onChange={(e) => setData('no_polisi', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Driver<span className="text-red-500">*</span></Label>
                                        <Input value={data.driver} onChange={(e) => setData('driver', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Pengirim<span className="text-red-500">*</span></Label>
                                        <Input value={data.pengirim} onChange={(e) => setData('pengirim', e.target.value)} />
                                    </div>
                                    <div>
                                        <Label>Keterangan<span className="text-red-500">*</span></Label>
                                        <Textarea value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)} />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Link href={route('suratJalans.index')}>
                                        <Button variant="outline">Batal</Button>
                                    </Link>
                                    <Button type="submit" disabled={processing || onHandStock <= 0}>
                                        Simpan Surat Jalan
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
