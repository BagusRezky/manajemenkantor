/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { TransFaktur } from '@/types/transFaktur';
import { Head } from '@inertiajs/react';
import { Calendar, CheckCircle2, Clock, CreditCard, FileText, Info, Package, Tag, User, Warehouse } from 'lucide-react';

export default function Show({ item }: { item: TransFaktur }) {
    const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Faktur', href: route('transFakturs.index') },
                { title: 'Detail Faktur', href: '#' },
            ]}
        >
            <Head title={`Faktur - ${item.no_faktur}`} />

            <div className="mx-auto max-w-5xl space-y-8 p-6 pb-20">
                {/* HEADER SECTION: NOMOR FAKTUR & STATUS */}
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-blue-600 uppercase">
                            <FileText className="h-4 w-4" /> Faktur Pajak
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter text-slate-900">{item.no_faktur}</h1>
                        <p className="font-medium text-slate-500 italic">Ref Invoice: {item.no_invoice || '-'}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        {item.no_po_asal && (
                            <Badge className="border-amber-200 bg-amber-100 px-4 py-1 text-amber-700 hover:bg-amber-100">
                                <Clock className="mr-1 h-3 w-3" /> Legacy Data: {item.no_po_asal}
                            </Badge>
                        )}
                        <div className="text-right">
                            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Grand Total</p>
                            <p className="font-mono text-3xl font-black text-blue-600">{formatIDR(item.grand_total)}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* INFO TRANSAKSI */}
                    <Card className="border-none bg-slate-50/50 shadow-sm lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-wider text-slate-600 uppercase">
                                <Info className="h-4 w-4" /> Detail Transaksi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-x-12 gap-y-6">
                            <div>
                                <LabelDetail
                                    label="Purchase Order"
                                    value={item.purchase_order?.no_po || item.no_po_asal || '-'}
                                    icon={<Tag className="h-3 w-3" />}
                                />
                            </div>
                            <div>
                                <LabelDetail
                                    label="Tanggal Transaksi"
                                    value={item.tanggal_transaksi || '-'}
                                    icon={<Calendar className="h-3 w-3" />}
                                />
                            </div>
                            <div>
                                <LabelDetail label="Gudang" value={item.gudang || '-'} icon={<Warehouse className="h-3 w-3" />} />
                            </div>
                            <div>
                                <LabelDetail label="Karyawan (PIC)" value={item.karyawan?.nama || '-'} icon={<User className="h-3 w-3" />} />
                            </div>
                            <div className="col-span-2 rounded border border-dashed bg-white p-3 text-sm text-slate-500 italic">
                                " {item.keterangan || 'Tidak ada keterangan tambahan.'} "
                            </div>
                        </CardContent>
                    </Card>

                    {/* DATA SUPPLIER */}
                    <Card className="border-none bg-emerald-50/50 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-wider text-emerald-700 uppercase">
                                <User className="h-4 w-4" /> Informasi Supplier
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <p className="mb-1 text-[10px] font-bold tracking-widest text-emerald-600 uppercase">Nama Customer / Vendor</p>
                                <p className="leading-tight font-black text-slate-800">{item.kode_customer || '-'}</p>
                            </div>
                            <div>
                                <p className="mb-1 text-[10px] font-bold tracking-widest text-emerald-600 uppercase">NPWP</p>
                                <p className="inline-block rounded border border-emerald-100 bg-white px-2 py-1 font-mono text-sm font-bold">
                                    {item.npwp || 'BELUM DIISI'}
                                </p>
                            </div>
                            <div>
                                <p className="mb-1 text-[10px] font-bold tracking-widest text-emerald-600 uppercase">Alamat Lengkap</p>
                                <p className="text-xs leading-relaxed text-slate-600">{item.alamat || '-'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* RINCIAN ITEM */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-2">
                        <Package className="h-5 w-5 text-blue-600" />
                        <h2 className="text-xl font-black text-slate-800">Rincian Barang & Perpajakan</h2>
                    </div>

                    <div className="grid gap-4">
                        {item.details?.map((detail, index) => (
                            <Card key={detail.id} className="group overflow-hidden border-none shadow-sm transition-shadow hover:shadow-md">
                                <div className="flex flex-col md:flex-row">
                                    {/* Kolom Nomor & Item */}
                                    <div className="flex flex-col justify-between bg-slate-900 p-6 text-white md:w-1/3">
                                        <div>
                                            <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">Item #{index + 1}</span>
                                            <h3 className="mt-1 text-lg font-bold transition-colors group-hover:text-blue-400">
                                                {detail.master_item}
                                            </h3>
                                        </div>
                                        <div className="mt-4 flex items-center gap-2">
                                            <Badge className="border-none bg-white/10 text-[10px] text-white">
                                                {detail.qty} {detail.unit}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Kolom Rincian Harga */}
                                    <div className="grid flex-1 grid-cols-2 items-center gap-6 bg-white p-6 md:grid-cols-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Harga Satuan</p>
                                            <p className="font-semibold text-slate-700">{formatIDR(detail.harga_per_qty)}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-rose-500 uppercase">Subtotal (Net)</p>
                                            <p className="font-semibold text-slate-700">{formatIDR(detail.subtotal)}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold tracking-widest text-emerald-600 uppercase">
                                                PPN {detail.ppn_persen}%
                                            </p>
                                            <p className="font-semibold text-emerald-600">+{formatIDR(detail.ppn_nilai)}</p>
                                        </div>
                                        <div className="space-y-1 text-right">
                                            <p className="text-[10px] font-bold text-blue-600 uppercase">Total Baris</p>
                                            <p className="font-mono text-lg font-black text-slate-900">{formatIDR(detail.total_item)}</p>
                                        </div>
                                    </div>
                                </div>
                                {detail.keterangan && (
                                    <div className="border-t bg-slate-50 px-6 py-2 text-[10px] text-slate-400 italic">
                                        Catatan: {detail.keterangan}
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                </div>

                {/* SUMMARY FOOTER */}
                <div className="flex justify-end pt-10">
                    <Card className="relative w-full overflow-hidden rounded-[2rem] border-none bg-slate-900 text-white shadow-2xl md:w-1/2">
                        <div className="absolute -right-6 -bottom-6 opacity-10">
                            <CreditCard className="h-40 w-40" />
                        </div>
                        <CardContent className="space-y-6 p-10">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm text-slate-400">
                                    <span>Total DPP (Dasar Pengenaan Pajak)</span>
                                    <span className="font-mono font-bold text-white">{formatIDR(item.total_dpp)}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-slate-400">
                                    <span className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Pajak Pertambahan Nilai (PPN)
                                    </span>
                                    <span className="font-mono font-bold text-emerald-400">+{formatIDR(item.total_ppn)}</span>
                                </div>
                            </div>

                            <Separator className="bg-slate-700" />

                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="mb-2 text-[10px] font-bold tracking-[0.3em] text-blue-400 uppercase">Grand Total Akhir</p>
                                    <h2 className="font-mono text-4xl font-black tracking-tighter text-white">{formatIDR(item.grand_total)}</h2>
                                </div>
                                <div className="text-right font-mono text-[10px] text-slate-500">
                                    Dibuat: {new Date(item.created_at || '').toLocaleDateString('id-ID')}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

// Komponen Helper untuk tampilan label
function LabelDetail({ label, value, icon }: { label: string; value: any; icon: React.ReactNode }) {
    return (
        <div className="space-y-1">
            <p className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                {icon} {label}
            </p>
            <p className="font-bold text-slate-700">{value}</p>
        </div>
    );
}
