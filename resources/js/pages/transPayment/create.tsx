/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchableSelect } from '@/components/search-select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Karyawan } from '@/types/karyawan';
import { MasterCoa } from '@/types/masterCoa';
import { MetodeBayar } from '@/types/metodeBayar';
import { PoBilling } from '@/types/poBilling';
import { TransPaymentDetail } from '@/types/transPayment';
import { Head, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowDown01Icon, CalendarIcon, CheckCircle2, Plus, Receipt, Trash2, Wallet2 } from 'lucide-react';
import { useState } from 'react';

interface TransPaymentForm {
    [key: string]: any;
    id_po_billing: string;
    id_karyawan: string;
    no_pembayaran: string;
    tanggal_header: string;
    gudang: string;
    periode: string;
    details: TransPaymentDetail[];
}

export default function Create({
    billings,
    karyawans,
    metodeBayars,
    coas,
}: {
    billings: PoBilling[];
    karyawans: Karyawan[];
    metodeBayars: MetodeBayar[];
    coas: MasterCoa[];
}) {
    const [selectedBilling, setSelectedBilling] = useState<PoBilling | null>(null);

    const { data, setData, post, processing, errors } = useForm<TransPaymentForm>({
        id_po_billing: '',
        id_karyawan: '',
        no_pembayaran: '',
        tanggal_header: new Date().toISOString().split('T')[0],
        gudang: '',
        periode: new Date().getFullYear().toString(),
        details: [],
    });

    const calculateBillingTotal = (billing: PoBilling) => {
        const isLegacy = !!billing.no_po_asal;
        if (isLegacy) {
            return billing.details?.reduce((sum, d) => sum + (Number(d.total_semua) || 0), 0) || 0;
        }
        return Number(billing.total_akhir) || 0;
    };

    const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    const totalInputNominal = data.details.reduce((sum, item) => sum + (Number(item.nominal) || 0), 0);

    const handleBillingChange = (val: string) => {
        const billing = billings.find((b) => String(b.id) === val);
        setSelectedBilling(billing || null);
        if (billing) {
            setData((prev) => ({
                ...prev,
                id_po_billing: val,
                gudang: billing.gudang || prev.gudang,
                periode: String(billing.periode) || prev.periode,
                id_karyawan: billing.id_karyawan ? String(billing.id_karyawan) : prev.id_karyawan,
            }));
        } else {
            setData('id_po_billing', val);
        }
    };

    const addDetail = () => {
        setData('details', [
            ...data.details,
            {
                id_metode_bayar: '',
                id_account_debit: '',
                id_account_kredit: '',
                tanggal_pembayaran: data.tanggal_header,
                nominal: 0,
                curs: 'RP',
                bank: '',
                an_rekening: '',
                no_rekening: '',
                keterangan: '',
            },
        ]);
    };

    const updateDetail = (index: number, field: keyof TransPaymentDetail, value: any) => {
        const updated = [...data.details];
        updated[index] = { ...updated[index], [field]: value };
        setData('details', updated);
    };

    const removeDetail = (index: number) => {
        const updated = [...data.details];
        updated.splice(index, 1);
        setData('details', updated);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Pembayaran', href: route('transPayments.index') },
                { title: 'Tambah Baru', href: '#' },
            ]}
        >
            <Head title="Tambah Pembayaran" />
            <div className="mx-auto max-w-5xl space-y-8 p-6">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(route('transPayments.store'));
                    }}
                >
                    {/* INFO BILLING HIGHLIGHT */}
                    {selectedBilling && (
                        <Card className="mb-8 overflow-hidden border-none bg-slate-900 text-white shadow-2xl">
                            <div className="grid grid-cols-1 items-center gap-8 p-6 md:grid-cols-2 md:p-8">
                                <div>
                                    <div className="mb-2 flex items-center gap-2 text-emerald-400">
                                        <Receipt className="h-5 w-5" />
                                        <span className="text-xs font-bold tracking-[0.2em] uppercase">Total Kewajiban</span>
                                    </div>
                                    <h2 className="text-4xl font-black tracking-tighter md:text-5xl">
                                        {formatIDR(calculateBillingTotal(selectedBilling))}
                                    </h2>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <Badge variant="outline" className="border-blue-300/30 bg-blue-500/10 text-blue-300">
                                            {selectedBilling.no_bukti_tagihan}
                                        </Badge>
                                        {selectedBilling.no_po_asal && (
                                            <Badge variant="outline" className="border-amber-300/30 bg-amber-500/10 text-amber-300">
                                                Legacy: {selectedBilling.no_po_asal}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-400">Invoice Vendor</span>
                                        <span className="font-bold text-slate-100">{selectedBilling.invoice_vendor || '-'}</span>
                                    </div>
                                    <Separator className="bg-white/10" />
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-400">Jatuh Tempo</span>
                                        <span className="flex items-center gap-2 font-mono font-bold text-rose-400">
                                            <CalendarIcon className="h-4 w-4" /> {selectedBilling.jatuh_tempo || '-'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* SECTION 1: HEADER */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="border-b py-4">
                            <CardTitle className="flex items-center gap-2 text-base font-bold">
                                <ArrowDown01Icon className="h-5 w-5 text-blue-600" />
                                Data Header Transaksi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    {/* <div className="grid gap-2">
                                        <Label className="text-xs font-bold tracking-wider text-slate-500 uppercase">Nomor Pembayaran</Label>
                                        <Input
                                            placeholder="PAY-202X-XXXX"
                                            className="h-11 shadow-sm"
                                            value={data.no_pembayaran}
                                            onChange={(e) => setData('no_pembayaran', e.target.value)}
                                        />
                                        {errors.no_pembayaran && <p className="text-xs text-red-500">{errors.no_pembayaran}</p>}
                                    </div> */}
                                    <div className="grid gap-2">
                                        <Label className="text-xs font-bold tracking-wider text-slate-500 uppercase">Tanggal Pembayaran</Label>
                                        <Input
                                            type="date"
                                            className="h-11 shadow-sm"
                                            value={data.tanggal_header}
                                            onChange={(e) => setData('tanggal_header', e.target.value)}
                                        />
                                        {errors.tanggal_header && <p className="text-xs text-red-500">{errors.tanggal_header}</p>}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label className="text-xs font-bold tracking-wider text-slate-500 uppercase">Billing Reference</Label>
                                        <SearchableSelect
                                            items={billings.map((b) => ({
                                                key: String(b.id),
                                                value: String(b.id),
                                                label: `${b.no_bukti_tagihan} [${b.invoice_vendor || 'N/A'}]`,
                                            }))}
                                            value={data.id_po_billing}
                                            onChange={handleBillingChange}
                                            placeholder="Cari data billing..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label className="text-xs font-bold tracking-wider text-slate-500 uppercase">Gudang</Label>
                                            <Input
                                                className="h-11 bg-slate-50 shadow-sm"
                                                value={data.gudang}
                                                onChange={(e) => setData('gudang', e.target.value)}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label className="text-xs font-bold tracking-wider text-slate-500 uppercase">Periode</Label>
                                            <Input
                                                className="h-11 bg-slate-50 shadow-sm"
                                                value={data.periode}
                                                onChange={(e) => setData('periode', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid gap-2 md:col-span-2">
                                    <Label className="text-xs font-bold tracking-wider text-slate-500 uppercase">PIC / Karyawan</Label>
                                    <SearchableSelect
                                        items={karyawans.map((k) => ({ key: String(k.id), value: String(k.id), label: k.nama ?? '' }))}
                                        value={data.id_karyawan}
                                        onChange={(val) => setData('id_karyawan', val)}
                                        placeholder="Pilih Penanggung Jawab"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SECTION 2: DETAILS (VERTICAL STACK) */}
                    <div className="mt-12 mb-6 flex items-end justify-between border-b pb-4">
                        <div>
                            <h2 className="flex items-center gap-3 text-2xl font-black text-slate-900">
                                <Wallet2 className="h-7 w-7 text-emerald-600" />
                                Rincian Pembayaran
                            </h2>
                            <p className="mt-1 text-sm font-medium text-slate-500 italic">Isi detail pembayaran satu per satu di bawah ini</p>
                        </div>
                        <Button type="button" onClick={addDetail} className="bg-emerald-600 shadow-lg shadow-emerald-200 hover:bg-emerald-700">
                            <Plus className="mr-2 h-4 w-4" /> Tambah Item Bayar
                        </Button>
                    </div>

                    <div className="space-y-8">
                        {data.details.map((detail, index) => (
                            <div key={index} className="group animate-in zoom-in-95 relative duration-200">
                                {/* Badge Number */}
                                <div className="absolute top-6 -left-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white shadow-xl ring-4 ring-white">
                                    {index + 1}
                                </div>

                                <Card className="overflow-hidden border-2 shadow-sm transition-all group-hover:border-emerald-500/50 group-hover:shadow-xl">
                                    <div className="flex items-center justify-between border-b bg-slate-50 px-6 py-3">
                                        <span className="text-xs font-black tracking-widest text-slate-400 uppercase italic">
                                            Item Detail Pembayaran
                                        </span>
                                        <Button
                                            type="button"
                                            onClick={() => removeDetail(index)}
                                            variant="ghost"
                                            size="sm"
                                            className="-mr-2 h-8 text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                                        >
                                            <Trash2 className="mr-2 h-4" /> Hapus Item
                                        </Button>
                                    </div>
                                    <CardContent className="p-8">
                                        <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
                                            {/* Baris 1: Akuntansi */}
                                            <div className="space-y-6">
                                                <div className="grid gap-2">
                                                    <Label className="text-xs font-black tracking-wider text-slate-600 uppercase">
                                                        Metode Pembayaran
                                                    </Label>
                                                    <SearchableSelect
                                                        items={metodeBayars.map((m) => ({
                                                            key: String(m.id),
                                                            value: String(m.id),
                                                            label: m.metode_bayar,
                                                        }))}
                                                        value={detail.id_metode_bayar}
                                                        onChange={(val) => updateDetail(index, 'id_metode_bayar', val)}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="grid gap-2">
                                                        <Label className="text-xs font-black tracking-wider text-blue-600 uppercase">
                                                            Akun Debit
                                                        </Label>
                                                        <SearchableSelect
                                                            items={coas.map((c) => ({
                                                                key: String(c.id),
                                                                value: String(c.id),
                                                                label: `${c.kode_akuntansi} - ${c.nama_akun}`,
                                                            }))}
                                                            value={detail.id_account_debit}
                                                            onChange={(val) => updateDetail(index, 'id_account_debit', val)}
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label className="text-xs font-black tracking-wider text-rose-600 uppercase">
                                                            Akun Kredit
                                                        </Label>
                                                        <SearchableSelect
                                                            items={coas.map((c) => ({
                                                                key: String(c.id),
                                                                value: String(c.id),
                                                                label: `${c.kode_akuntansi} - ${c.nama_akun}`,
                                                            }))}
                                                            value={detail.id_account_kredit}
                                                            onChange={(val) => updateDetail(index, 'id_account_kredit', val)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Baris 2: Nominal & Curs */}
                                            <div className="space-y-6">
                                                <div className="grid gap-2">
                                                    <Label className="text-xs font-black tracking-wider text-emerald-600 uppercase">
                                                        Nominal Pembayaran (IDR)
                                                    </Label>
                                                    <div className="relative">
                                                        <span className="absolute top-1/2 left-4 -translate-y-1/2 font-black text-emerald-600">
                                                            Rp
                                                        </span>
                                                        <Input
                                                            type="number"
                                                            className="h-14 border-emerald-200 bg-emerald-50 pl-12 text-xl font-black focus-visible:ring-emerald-500"
                                                            value={detail.nominal}
                                                            onChange={(e) => updateDetail(index, 'nominal', Number(e.target.value))}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label className="text-xs font-black tracking-wider text-slate-600 uppercase">
                                                        Mata Uang (Curs)
                                                    </Label>
                                                    <Input
                                                        className="h-11 font-mono uppercase"
                                                        value={detail.curs}
                                                        onChange={(e) => updateDetail(index, 'curs', e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <Separator className="opacity-60 md:col-span-2" />

                                            {/* Baris 3: Info Perbankan */}
                                            <div className="space-y-6">
                                                <div className="grid gap-2">
                                                    <Label className="text-xs font-black tracking-wider text-slate-600 uppercase">
                                                        Nama Bank Penerima
                                                    </Label>
                                                    <Input
                                                        placeholder="Contoh: BANK CENTRAL ASIA (BCA)"
                                                        className="h-11 shadow-sm"
                                                        value={detail.bank || ''}
                                                        onChange={(e) => updateDetail(index, 'bank', e.target.value)}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="grid gap-2">
                                                        <Label className="text-xs font-black tracking-wider text-slate-600 uppercase">
                                                            No. Rekening
                                                        </Label>
                                                        <Input
                                                            placeholder="001234xxx"
                                                            className="h-11 font-mono shadow-sm"
                                                            value={detail.no_rekening || ''}
                                                            onChange={(e) => updateDetail(index, 'no_rekening', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label className="text-xs font-black tracking-wider text-slate-600 uppercase">
                                                            Atas Nama
                                                        </Label>
                                                        <Input
                                                            placeholder="Nama Pemilik Rekening"
                                                            className="h-11 shadow-sm"
                                                            value={detail.an_rekening || ''}
                                                            onChange={(e) => updateDetail(index, 'an_rekening', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Baris 4: Keterangan */}
                                            <div className="space-y-6">
                                                <div className="grid gap-2">
                                                    <Label className="flex items-center gap-1 text-xs font-black tracking-wider text-slate-600 uppercase">
                                                        <AlertCircle className="h-3 w-3 text-amber-500" /> Memo / Keterangan Transaksi
                                                    </Label>
                                                    <textarea
                                                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[110px] w-full rounded-md border px-3 py-2 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                                        placeholder="Tuliskan catatan detail untuk item ini..."
                                                        value={detail.keterangan || ''}
                                                        onChange={(e) => updateDetail(index, 'keterangan', e.target.value)}
                                                    />
                                                    <p className="text-muted-foreground text-[10px] italic">* Apabila Pembayaran Lunas ketikan di keterangan LUNAS</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>

                    {/* STICKY ACTION BAR */}
                    {data.details.length > 0 && (
                        <div className="sticky bottom-6 z-50 mt-16">
                            <div className="animate-in fade-in slide-in-from-bottom-10 rounded-[2rem] border border-slate-700 bg-slate-900 p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] md:p-8">
                                <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                                    <div className="flex items-center gap-12">
                                        <div>
                                            <p className="mb-2 text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">Total Inputan</p>
                                            <p className="font-mono text-4xl font-black tracking-tighter text-emerald-400">
                                                {formatIDR(totalInputNominal)}
                                            </p>
                                        </div>
                                        {selectedBilling && (
                                            <>
                                                <Separator orientation="vertical" className="hidden h-14 bg-slate-700 md:block" />
                                                <div>
                                                    <p className="mb-2 text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">
                                                        Status Audit
                                                    </p>
                                                    {totalInputNominal === calculateBillingTotal(selectedBilling) ? (
                                                        <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 font-black text-emerald-400 italic">
                                                            <CheckCircle2 className="h-5 w-5" /> MATCHED
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-2 font-black text-rose-400 italic">
                                                            <AlertCircle className="h-5 w-5" /> UNBALANCED
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <Button
                                        size="lg"
                                        type="submit"
                                        disabled={processing}
                                        className="h-16 w-full rounded-2xl bg-blue-600 px-16 text-lg font-black shadow-xl shadow-blue-900/40 transition-all hover:scale-105 hover:bg-blue-500 active:scale-95 md:w-auto"
                                    >
                                        {processing ? 'SUBMITTING...' : 'SIMPAN DATA'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </AppLayout>
    );
}
