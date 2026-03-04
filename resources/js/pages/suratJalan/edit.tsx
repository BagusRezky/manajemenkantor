/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { SuratJalan, SuratJalanFormData } from '@/types/suratJalan';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Info, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface EditProps {
    suratJalan: SuratJalan;
    salesOrders: (SalesOrder & { material_onhand: number })[];
    allKartuInstruksiKerjas: KartuInstruksiKerja[];
}

export default function Edit({ suratJalan, salesOrders, allKartuInstruksiKerjas }: EditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Surat Jalan', href: '/suratJalans' },
        { title: 'Edit', href: '#' },
    ];

    const [selectedSO, setSelectedSO] = useState<(SalesOrder & { material_onhand: number }) | null>(null);
    const [selectedKIK, setSelectedKIK] = useState<KartuInstruksiKerja | null>(null);
    const [selectedAlamatKey, setSelectedAlamatKey] = useState<string>('');
    const [onHandStock, setOnHandStock] = useState<number>(0);

    const { data, setData, put, processing, errors } = useForm<SuratJalanFormData>({
        id_sales_order: String(suratJalan.id_sales_order || ''),
        id_kartu_instruksi_kerja: String(suratJalan.id_kartu_instruksi_kerja || ''),
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

    // --- LOGIC STOK (Sama dengan Create tapi abaikan Qty SJ ini) ---
    const calculateStock = (so: any, kik: KartuInstruksiKerja | null): number => {
        if (kik) {
            const packagings = kik.packagings || [];
            // Hitung SJ lain, tapi abaikan SJ yang sedang kita edit sekarang
            const sjLain = (kik.surat_jalans || []).filter((s: any) => String(s.id) !== String(suratJalan.id));
            const blokirs = kik.blokirs || [];

            const totalStokBarangJadi = packagings.reduce(
                (t, p) => t + p.jumlah_satuan_penuh * p.qty_persatuan_penuh + p.jumlah_satuan_sisa * p.qty_persatuan_sisa,
                0,
            );

            const totalPengirimanLain = sjLain.reduce((t, sj) => t + (sj.qty_pengiriman || 0), 0);
            const totalBlokir = blokirs.reduce((t, b) => t + (b.qty_blokir || 0), 0);

            return totalStokBarangJadi - totalBlokir - totalPengirimanLain;
        } else {
            // Untuk Case SO Langsung, kita asumsikan material_onhand dari controller
            // sudah termasuk qty dari SJ ini (karena pengiriman material tidak tercatat di tabel material_request secara otomatis)
            // Jadi kita kembalikan nilai qty SJ ini ke perhitungan stoknya.
            return (so?.material_onhand || 0) + (String(so?.id) === String(suratJalan.id_sales_order) ? suratJalan.qty_pengiriman : 0);
        }
    };

    // --- INITIAL LOAD DATA ---
    useEffect(() => {
        const initialSo = salesOrders.find((s) => String(s.id) === data.id_sales_order);
        const initialKik = allKartuInstruksiKerjas.find((k) => String(k.id) === data.id_kartu_instruksi_kerja);

        setSelectedSO(initialSo || null);
        setSelectedKIK(initialKik || null);
        setOnHandStock(calculateStock(initialSo, initialKik || null));
    }, []);

    // --- HANDLE CHANGES ---
    const handleSOChange = (soId: string) => {
        const so = salesOrders.find((s) => s.id.toString() === soId);
        setSelectedSO(so || null);
        setSelectedKIK(null);
        setSelectedAlamatKey('');

        const stock = calculateStock(so, null);
        setOnHandStock(stock);

        setData((prev) => ({
            ...prev,
            id_sales_order: soId,
            id_kartu_instruksi_kerja: '',
            alamat_tujuan: '',
        }));
    };

    const handleKIKChange = (kikId: string) => {
        if (!kikId) {
            setSelectedKIK(null);
            setOnHandStock(calculateStock(selectedSO, null));
            setData('id_kartu_instruksi_kerja', '');
            return;
        }

        const kik = allKartuInstruksiKerjas.find((k) => k.id.toString() === kikId);
        setSelectedKIK(kik || null);
        setOnHandStock(calculateStock(selectedSO, kik || null));
        setData('id_kartu_instruksi_kerja', kikId);
    };

    const handleAlamatChange = (alamatType: string) => {
        if (!selectedSO?.customer_address) return;
        const addr = selectedSO.customer_address;
        let val = '';
        if (alamatType === 'alamat_lengkap') val = addr.alamat_lengkap || '';
        else if (alamatType === 'alamat_kedua') val = addr.alamat_kedua || '';
        else if (alamatType === 'alamat_ketiga') val = addr.alamat_ketiga || '';

        setSelectedAlamatKey(alamatType);
        setData('alamat_tujuan', val);
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

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (parseInt(data.qty_pengiriman) > onHandStock) {
            toast.error(`Stok tidak mencukupi! Maksimal: ${onHandStock}`);
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
                        <CardHeader className="flex flex-row items-center justify-between border-b bg-white">
                            <div>
                                <CardTitle>Edit Surat Jalan</CardTitle>
                                <p className="font-mono text-sm text-gray-500">{suratJalan.no_surat_jalan}</p>
                            </div>
                            <Link href={route('suratJalans.index')}>
                                <Button variant="outline" size="sm">
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Batal
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* PILIH SALES ORDER */}
                                    <div className="space-y-2">
                                        <Label>
                                            Sales Order <span className="text-red-500">*</span>
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
                                    </div>

                                    {/* PILIH SPK */}
                                    <div className="space-y-2">
                                        <Label>No. SPK (Opsional)</Label>
                                        <SearchableSelect
                                            items={allKartuInstruksiKerjas.map((kik) => ({
                                                key: String(kik.id),
                                                value: String(kik.id),
                                                label: `${kik.no_kartu_instruksi_kerja} ${String(kik.id_sales_order) === data.id_sales_order ? '(Milik SO ini)' : ''}`,
                                            }))}
                                            value={data.id_kartu_instruksi_kerja}
                                            onChange={handleKIKChange}
                                        />
                                    </div>
                                </div>

                                {/* INFO PANEL */}
                                {selectedSO && (
                                    <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
                                        <Info className="mt-0.5 h-5 w-5 text-blue-500" />
                                        <div className="grid w-full grid-cols-1 gap-2 text-sm md:grid-cols-2">
                                            <div>
                                                <p className="font-bold text-blue-900">Sumber: {selectedKIK ? 'Produksi (SPK)' : 'Material (SO)'}</p>
                                                <p className="text-blue-700">Customer: {selectedSO.customer_address?.nama_customer}</p>
                                            </div>
                                            <div className="md:text-right">
                                                <p className="text-gray-500">Stok On Hand (Tersedia):</p>
                                                <p className="text-xl font-bold text-blue-800">
                                                    {onHandStock.toLocaleString()} {selectedSO.master_item?.unit?.nama_satuan || 'pcs'}
                                                </p>
                                            </div>
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
                                        {errors.qty_pengiriman && <p className="text-xs text-red-500">{errors.qty_pengiriman}</p>}
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

                                <div className="space-y-4">
                                    <Label>Alamat Tujuan Pengiriman *</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {alamatItems.map((item) => (
                                            <Button
                                                key={item.key}
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => handleAlamatChange(item.key)}
                                            >
                                                {item.label.split(':')[0]}
                                            </Button>
                                        ))}
                                    </div>
                                    <Textarea value={data.alamat_tujuan} onChange={(e) => setData('alamat_tujuan', e.target.value)} rows={3} />
                                </div>

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
                                    <Label>Keterangan</Label>
                                    <Textarea value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)} />
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
