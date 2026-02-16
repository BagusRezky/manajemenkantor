/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { MetodeBayar } from '@/types/metodeBayar';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs = [
    { title: 'Inv. Payment', href: '/bonPays' },
    { title: 'Tambah', href: '#' },
];

interface Props {
    invoices: Invoice[];
    metodeBayars: MetodeBayar[];
    karyawans: Karyawan[];
    accounts: MasterCoa[];
}

export default function Create({ invoices, metodeBayars, karyawans, accounts }: Props) {
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [summary, setSummary] = useState({
        grandTotal: 0,
        totalTerbayar: 0,
        sisaPiutang: 0,
    });

    const { data, setData, post, processing, errors, reset } = useForm({
        id_invoice: '',
        id_metode_bayar: '',
        id_account: '',
        id_karyawan: '',
        nominal_pembayaran: 0,
        tanggal_pembayaran: new Date().toISOString().split('T')[0],
        gudang: '',
        keterangan: '',
    });

    // Logic Hitung Piutang saat Invoice dipilih
    useEffect(() => {
        if (data.id_invoice) {
            const inv = invoices.find((i) => String(i.id) === String(data.id_invoice));
            if (inv) {
                setSelectedInvoice(inv);

                let gTotal = 0;
                if (inv.is_legacy) {
                    // Jika Legacy, ambil total yang sudah jadi di database
                    gTotal = Number(inv.total || 0);
                } else {
                    // Jika Sistem Baru, hitung manual berdasarkan rumus yang kamu inginkan
                    const qty = Number(inv.surat_jalan?.qty_pengiriman || 0);
                    const harga = Number(inv.surat_jalan?.kartu_instruksi_kerja?.sales_order?.harga_pcs_bp || 0);
                    const discount = Number(inv.discount || 0);
                    const ppnRate = Number(inv.ppn || 0);
                    const ongkir = Number(inv.ongkos_kirim || 0);

                    const subtotal = qty * harga - discount;
                    const ppnNominal = (subtotal * ppnRate) / 100;
                    gTotal = subtotal + ppnNominal + ongkir;
                }

                // Hitung riwayat pembayaran (cicilan-cicilan sebelumnya)
                // Kita gunakan 'as any' jika type definition belum diupdate untuk menghindari merah sementara
                const riwayatBayar = (inv as any).bon_pays?.reduce((acc: number, curr: any) => acc + Number(curr.nominal_pembayaran), 0) || 0;

                // DP hanya ada di sistem baru (biasanya legacy sudah masuk ke total)
                const uangMuka = inv.is_legacy ? 0 : Number(inv.uang_muka || 0);
                const totalTerbayar = uangMuka + riwayatBayar;

                setSummary({
                    grandTotal: gTotal,
                    totalTerbayar: totalTerbayar,
                    sisaPiutang: gTotal - totalTerbayar,
                });

                // Set default nominal ke sisa piutang
                setData('nominal_pembayaran', gTotal - totalTerbayar);
            }
        } else {
            setSelectedInvoice(null);
            setSummary({ grandTotal: 0, totalTerbayar: 0, sisaPiutang: 0 });
        }
    }, [data.id_invoice]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('bonPays.store'), {
            onSuccess: () => {
                toast.success('Pembayaran berhasil disimpan');
                reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Inv. Payment" />
            <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Kolom Kiri: Form Input */}
                    <div className="lg:col-span-2">
                        <Card className="border-t-4 border-t-purple-500">
                            <CardHeader>
                                <CardTitle>Detail Pembayaran</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label>
                                                Pilih Invoice <span className="text-red-500">*</span>
                                            </Label>
                                            <SearchableSelect
                                                items={invoices.map((inv) => ({
                                                    key: String(inv.id),
                                                    value: String(inv.id),
                                                    label: `${inv.no_invoice} - ${inv.surat_jalan?.kartu_instruksi_kerja?.sales_order?.customer_address?.nama_customer }`,
                                                }))}
                                                value={data.id_invoice}
                                                onChange={(val) => setData('id_invoice', val)}
                                                placeholder="Cari Nomor Invoice..."
                                            />
                                            {errors.id_invoice && <p className="text-xs text-red-500">{errors.id_invoice}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Tanggal Bayar</Label>
                                            <Input
                                                type="date"
                                                value={data.tanggal_pembayaran}
                                                onChange={(e) => setData('tanggal_pembayaran', e.target.value)}
                                            />
                                            {errors.tanggal_pembayaran && <p className="text-xs text-red-500">{errors.tanggal_pembayaran}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>
                                                Metode Bayar <span className="text-red-500">*</span>
                                            </Label>
                                            <SearchableSelect
                                                items={metodeBayars.map((m) => ({ key: String(m.id), value: String(m.id), label: m.metode_bayar }))}
                                                value={data.id_metode_bayar}
                                                onChange={(val) => setData('id_metode_bayar', val)}
                                            />
                                            {errors.id_metode_bayar && <p className="text-xs text-red-500">{errors.id_metode_bayar}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Kas/Bank (COA)</Label>
                                            <SearchableSelect
                                                items={accounts.map((a) => ({
                                                    key: String(a.id),
                                                    value: String(a.id),
                                                    label: `${a.kode_akuntansi} - ${a.nama_akun}`,
                                                }))}
                                                value={data.id_account}
                                                onChange={(val) => setData('id_account', val)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>
                                                Nominal Bayar Sekarang <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                type="number"
                                                value={data.nominal_pembayaran}
                                                onChange={(e) => setData('nominal_pembayaran', Number(e.target.value))}
                                            />
                                            {errors.nominal_pembayaran && <p className="text-xs text-red-500">{errors.nominal_pembayaran}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Penerima / Karyawan</Label>
                                            <SearchableSelect
                                                items={karyawans.map((k) => ({ key: String(k.id), value: String(k.id), label: k.nama ?? '' }))}
                                                value={data.id_karyawan}
                                                onChange={(val) => setData('id_karyawan', val)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Keterangan</Label>
                                        <Textarea
                                            value={data.keterangan}
                                            onChange={(e) => setData('keterangan', e.target.value)}
                                            placeholder="Contoh: Pelunasan tahap 2"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3">
                                        <Link href={route('bonPays.index')}>
                                            <Button type="button" variant="outline">
                                                Batal
                                            </Button>
                                        </Link>
                                        <Button type="submit" disabled={processing} className="bg-purple-600 text-white hover:bg-purple-700">
                                            {processing ? 'Menyimpan...' : 'Simpan Pembayaran'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Kolom Kanan: Summary Informasi */}
                    <div className="space-y-4">
                        {selectedInvoice ? (
                            <Card className="border-l-4 border-l-blue-500 bg-slate-50 dark:bg-slate-900">
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold tracking-wider text-blue-600 uppercase">Informasi Tagihan</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Tipe Data:</span>
                                            <span className="font-semibold">{selectedInvoice.is_legacy ? 'LEGACY (IMPORT)' : 'SISTEM BARU'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Total Tagihan:</span>
                                            <span className="font-semibold">Rp {summary.grandTotal.toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Total Terbayar:</span>
                                            <span className="font-semibold text-green-600">Rp {summary.totalTerbayar.toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
                                        <div className="flex items-center justify-between">
                                            <span className="text-base font-bold">Sisa Piutang:</span>
                                            <span className="text-lg font-bold text-red-600">Rp {summary.sisaPiutang.toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>

                                    {selectedInvoice.is_legacy && (
                                        <div className="rounded bg-yellow-100 p-2 text-[10px] text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
                                            * Data ini berasal dari sistem lama. Total diambil langsung dari field 'total' database.
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-dashed">
                                <CardContent className="text-muted-foreground py-10 text-center">
                                    Pilih invoice untuk melihat rincian sisa piutang.
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
