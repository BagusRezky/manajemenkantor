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
import { TransPayment, TransPaymentDetail } from '@/types/transPayment';
import { Head, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowDown01, Plus, Receipt, Save, Trash2, Wallet2 } from 'lucide-react';
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

export default function Edit({
    item,
    billings,
    karyawans,
    metodeBayars,
    coas,
}: {
    item: TransPayment; // Data yang diedit
    billings: PoBilling[];
    karyawans: Karyawan[];
    metodeBayars: MetodeBayar[];
    coas: MasterCoa[];
}) {
    // Inisialisasi state billing terpilih berdasarkan data item yang diedit
    const [selectedBilling, setSelectedBilling] = useState<PoBilling | null>(billings.find((b) => b.id === Number(item.id_po_billing)) || null);

    const { data, setData, put, processing, errors } = useForm<TransPaymentForm>({
        id_po_billing: String(item.id_po_billing),
        id_karyawan: item.id_karyawan ? String(item.id_karyawan) : '',
        no_pembayaran: item.no_pembayaran,
        tanggal_header: item.tanggal_header || '',
        gudang: item.gudang,
        periode: item.periode,
        // Mapping details dari item ke form
        details:
            item.details?.map((d) => ({
                id: d.id,
                id_trans_payment: d.id_trans_payment,
                id_metode_bayar: String(d.id_metode_bayar),
                id_account_debit: String(d.id_account_debit),
                id_account_kredit: String(d.id_account_kredit),
                tanggal_pembayaran: d.tanggal_pembayaran,
                nominal: Number(d.nominal),
                curs: d.curs,
                bank: d.bank,
                an_rekening: d.an_rekening,
                no_rekening: d.no_rekening,
                keterangan: d.keterangan,
            })) || [],
    });

    const calculateBillingTotal = (billing: PoBilling) => {
        const isLegacy = !!billing.no_po_asal;
        if (isLegacy) {
            return billing.details?.reduce((sum, d) => sum + (Number(d.total_semua) || 0), 0) || 0;
        }
        return Number(billing.total_akhir) || 0;
    };

    const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    const totalInputNominal = data.details.reduce((sum, d) => sum + (Number(d.nominal) || 0), 0);

    const handleBillingChange = (val: string) => {
        const billing = billings.find((b) => String(b.id) === val);
        setSelectedBilling(billing || null);
        setData('id_po_billing', val);
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
                curs: 'IDR',
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
                { title: 'Edit Transaksi', href: '#' },
            ]}
        >
            <Head title={`Edit Pembayaran - ${item.no_pembayaran}`} />
            <div className="mx-auto max-w-5xl space-y-8 p-6">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        put(route('transPayments.update', item.id));
                    }}
                >
                    {/* INFO BILLING HIGHLIGHT (Sama seperti Create) */}
                    {selectedBilling && (
                        <Card className="mb-8 overflow-hidden border-none bg-slate-900 text-white shadow-2xl">
                            <div className="grid grid-cols-1 items-center gap-8 p-6 md:grid-cols-2 md:p-8">
                                <div>
                                    <div className="mb-2 flex items-center gap-2 text-emerald-400">
                                        <Receipt className="h-5 w-5" />
                                        <span className="text-xs font-bold tracking-[0.2em] uppercase">Acuan Tagihan Billing</span>
                                    </div>
                                    <h2 className="text-4xl font-black tracking-tighter md:text-5xl">
                                        {formatIDR(calculateBillingTotal(selectedBilling))}
                                    </h2>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <Badge variant="outline" className="border-blue-300/30 bg-blue-500/10 text-blue-300">
                                            Ref: {selectedBilling.no_bukti_tagihan}
                                        </Badge>
                                        {selectedBilling.no_po_asal && (
                                            <Badge variant="outline" className="border-amber-300/30 bg-amber-500/10 text-amber-300">
                                                Legacy: {selectedBilling.no_po_asal}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-400">Total Input Saat Ini</span>
                                        <span
                                            className={`font-black ${totalInputNominal > calculateBillingTotal(selectedBilling) ? 'text-rose-400' : 'text-emerald-400'}`}
                                        >
                                            {formatIDR(totalInputNominal)}
                                        </span>
                                    </div>
                                    <Separator className="bg-white/10" />
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-xs text-slate-400">Selisih</span>
                                        <span className="font-mono">{formatIDR(totalInputNominal - calculateBillingTotal(selectedBilling))}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* SECTION 1: HEADER */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="border-b py-4">
                            <CardTitle className="flex items-center gap-2 text-base font-bold text-blue-600">
                                <ArrowDown01 className="h-5 w-5" />
                                Edit Header Transaksi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase">Nomor Pembayaran</Label>
                                        <Input disabled className="h-11 bg-slate-100 font-bold opacity-70" value={data.no_pembayaran} />
                                        <p className="text-muted-foreground text-[10px] italic">* Nomor pembayaran tidak dapat diubah</p>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase">Tanggal Pembayaran</Label>
                                        <Input
                                            type="date"
                                            className="h-11 shadow-sm"
                                            value={data.tanggal_header}
                                            onChange={(e) => setData('tanggal_header', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase">Billing Reference</Label>
                                        <SearchableSelect
                                            items={billings.map((b) => ({
                                                key: String(b.id),
                                                value: String(b.id),
                                                label: `${b.no_bukti_tagihan} [${b.invoice_vendor || 'N/A'}]`,
                                            }))}
                                            value={data.id_po_billing}
                                            onChange={handleBillingChange}
                                        />
                                        <p className="text-muted-foreground text-[10px] italic">* Billing Reference tidak dapat diubah</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label className="text-xs font-bold text-slate-500 uppercase">Gudang</Label>
                                            <Input className="h-11" value={data.gudang} onChange={(e) => setData('gudang', e.target.value)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label className="text-xs font-bold text-slate-500 uppercase">Periode</Label>
                                            <Input className="h-11" value={data.periode} onChange={(e) => setData('periode', e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid gap-2 md:col-span-2">
                                    <Label className="text-xs font-bold text-slate-500 uppercase">PIC / Karyawan</Label>
                                    <SearchableSelect
                                        items={karyawans.map((k) => ({ key: String(k.id), value: String(k.id), label: k.nama ?? '' }))}
                                        value={data.id_karyawan}
                                        onChange={(val) => setData('id_karyawan', val)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SECTION 2: DETAILS (Vertical Stack) */}
                    <div className="mt-12 mb-6 flex items-end justify-between border-b pb-4">
                        <div>
                            <h2 className="flex items-center gap-3 text-2xl font-black text-slate-900">
                                <Wallet2 className="h-7 w-7 text-emerald-600" />
                                Rincian Item Bayar
                            </h2>
                            <p className="mt-1 text-sm font-medium text-slate-500 italic underline decoration-emerald-200">
                                Mode Edit: Anda dapat menambah atau menghapus rincian.
                            </p>
                        </div>
                        <Button
                            type="button"
                            onClick={addDetail}
                            variant="outline"
                            className="border-emerald-600 text-emerald-600 shadow-sm hover:bg-emerald-50"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Tambah Baris Baru
                        </Button>
                    </div>

                    <div className="space-y-8">
                        {data.details.map((detail, index) => (
                            <div key={index} className="group animate-in slide-in-from-right-5 relative duration-300">
                                <div className="absolute top-6 -left-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-xl ring-4 ring-white">
                                    {index + 1}
                                </div>

                                <Card className="overflow-hidden border-2 shadow-sm transition-all hover:border-blue-400">
                                    <div className="flex items-center justify-between border-b bg-slate-50 px-6 py-2">
                                        <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase italic">
                                            Data Pembayaran #{index + 1}
                                        </span>
                                        <Button
                                            type="button"
                                            onClick={() => removeDetail(index)}
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 text-rose-400 hover:text-rose-600"
                                        >
                                            <Trash2 className="mr-1 h-4 w-4" /> Hapus
                                        </Button>
                                    </div>
                                    <CardContent className="p-8">
                                        <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
                                            <div className="space-y-6">
                                                <div className="grid gap-2">
                                                    <Label className="text-xs font-black text-slate-600 uppercase">Metode Bayar</Label>
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
                                                        <Label className="text-xs font-black text-blue-600 uppercase underline">Akun Debit</Label>
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
                                                        <Label className="text-xs font-black text-rose-600 uppercase underline">Akun Kredit</Label>
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

                                            <div className="space-y-6">
                                                <div className="grid gap-2">
                                                    <Label className="text-xs font-black text-emerald-600 uppercase">Nominal Perubahan</Label>
                                                    <div className="relative">
                                                        <span className="absolute top-1/2 left-4 -translate-y-1/2 font-black text-emerald-600">
                                                            Rp
                                                        </span>
                                                        <Input
                                                            type="number"
                                                            className="h-14 border-emerald-200 bg-emerald-50 pl-12 text-xl font-black"
                                                            value={detail.nominal}
                                                            onChange={(e) => updateDetail(index, 'nominal', Number(e.target.value))}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label className="text-xs font-black text-slate-600 uppercase">Curs</Label>
                                                    <Input
                                                        className="h-11 font-mono uppercase"
                                                        value={detail.curs}
                                                        onChange={(e) => updateDetail(index, 'curs', e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <Separator className="opacity-60 md:col-span-2" />

                                            <div className="space-y-6">
                                                <div className="grid gap-2">
                                                    <Label className="text-xs font-black text-slate-600 uppercase italic">Nama Bank</Label>
                                                    <Input
                                                        className="h-11"
                                                        value={detail.bank || ''}
                                                        onChange={(e) => updateDetail(index, 'bank', e.target.value)}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="grid gap-2">
                                                        <Label className="text-xs font-black text-slate-600 uppercase italic">No. Rekening</Label>
                                                        <Input
                                                            className="h-11 font-mono"
                                                            value={detail.no_rekening || ''}
                                                            onChange={(e) => updateDetail(index, 'no_rekening', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label className="text-xs font-black text-slate-600 uppercase italic">Atas Nama</Label>
                                                        <Input
                                                            className="h-11"
                                                            value={detail.an_rekening || ''}
                                                            onChange={(e) => updateDetail(index, 'an_rekening', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="grid gap-2">
                                                    <Label className="flex items-center gap-1 text-xs font-black text-slate-600 uppercase">
                                                        <AlertCircle className="h-3 w-3 text-amber-500" /> Keterangan Detail
                                                    </Label>
                                                    <textarea
                                                        className="border-input bg-background focus-visible:ring-ring flex min-h-[110px] w-full rounded-md border px-3 py-2 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                                                        value={detail.keterangan || ''}
                                                        onChange={(e) => updateDetail(index, 'keterangan', e.target.value)}
                                                    />
                                                    <p className="text-muted-foreground text-[10px] italic">* Apabila Pembayaran Lunas ketikan di keterangan LUNAS apabila pembayaran untuk pelunasan ketikan PELUNASAN</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>

                    {/* STICKY FOOTER (Updated for Edit) */}
                    <div className="sticky bottom-6 z-50 mt-16">
                        <div className="rounded-[2rem] border border-slate-700 bg-slate-900 p-6 shadow-2xl md:p-8">
                            <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                                <div className="flex items-center gap-12">
                                    <div>
                                        <p className="mb-2 text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase underline decoration-emerald-500">
                                            Total Akhir Baru
                                        </p>
                                        <p className="font-mono text-4xl font-black tracking-tighter text-emerald-400">
                                            {formatIDR(totalInputNominal)}
                                        </p>
                                    </div>
                                    <div className="hidden md:block">
                                        <p className="mb-2 text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">Validasi</p>
                                        {totalInputNominal === (selectedBilling ? calculateBillingTotal(selectedBilling) : 0) ? (
                                            <Badge className="border-emerald-500/50 bg-emerald-500/20 px-4 py-1 text-emerald-400">MATCHED</Badge>
                                        ) : (
                                            <Badge className="border-rose-500/50 bg-rose-500/20 px-4 py-1 text-rose-400">UNBALANCED</Badge>
                                        )}
                                    </div>
                                </div>
                                <div className="flex w-full gap-4 md:w-auto">
                                    <Button
                                        size="lg"
                                        type="submit"
                                        disabled={processing}
                                        className="h-16 w-full gap-2 rounded-2xl bg-emerald-600 text-lg font-black shadow-xl shadow-emerald-900/40 hover:bg-emerald-500 md:w-72"
                                    >
                                        <Save className="h-6 w-6" /> {processing ? 'SAVING...' : 'SIMPAN PERUBAHAN'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
