import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { SuratJalan } from '@/types/suratJalan';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, MapPin, Package, Truck } from 'lucide-react';

interface Props {
    suratJalan: SuratJalan;
}

export default function ShowSuratJalan({ suratJalan }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Surat Jalan', href: '/suratJalans' },
        { title: 'Detail', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Surat Jalan - ${suratJalan.no_surat_jalan}`} />

            <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="no-print mb-6 flex items-center justify-between">
                    <Link href={route('suratJalans.index')}>
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                        </Button>
                    </Link>
                </div>

                <Card className="border-t-4 border-t-blue-600 shadow-lg">
                    <CardHeader className="border-b bg-white">
                        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">SURAT JALAN</h1>
                                <p className="font-mono font-semibold text-blue-600">{suratJalan.no_surat_jalan}</p>
                            </div>
                            <div className="w-full text-right md:w-auto md:text-right">
                                <p className="text-sm font-bold text-gray-500 uppercase">Tanggal Kirim</p>
                                <p className="text-lg font-semibold">
                                    {new Date(suratJalan.tgl_surat_jalan).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-8 p-6">
                        {/* Alamat & Pengiriman */}
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 border-b pb-2 text-xs font-bold tracking-widest text-blue-600 uppercase">
                                    <MapPin className="h-4 w-4" /> Tujuan Pengiriman
                                </div>
                                <div className="rounded-lg border bg-gray-50 p-4">
                                    <p className="mb-1 font-bold text-gray-900">
                                        {suratJalan.kartuInstruksiKerja?.sales_order?.customer_address?.nama_customer || 'Customer'}
                                    </p>
                                    <p className="text-sm leading-relaxed whitespace-pre-line text-gray-600">{suratJalan.alamat_tujuan}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 border-b pb-2 text-xs font-bold tracking-widest text-blue-600 uppercase">
                                    <Truck className="h-4 w-4" /> Informasi Kendaraan
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Transportasi</p>
                                        <p className="font-semibold">{suratJalan.transportasi}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">No. Polisi</p>
                                        <p className="font-mono font-semibold uppercase">{suratJalan.no_polisi}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Driver</p>
                                        <p className="font-semibold">{suratJalan.driver}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Petugas Pengirim</p>
                                        <p className="font-semibold">{suratJalan.pengirim}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detail Barang */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b pb-2 text-xs font-bold tracking-widest text-blue-600 uppercase">
                                <Package className="h-4 w-4" /> Rincian Barang
                            </div>
                            <div className="overflow-hidden rounded-lg border">
                                <table className="w-full text-sm">
                                    <thead className="border-b bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left">Deskripsi Barang</th>
                                            <th className="px-4 py-3 text-left">No. KIK / SPK</th>
                                            <th className="px-4 py-3 text-right">Jumlah Dikirim</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        <tr>
                                            <td className="px-4 py-4">
                                                <p className="font-bold text-gray-900">
                                                    {suratJalan.kartu_instruksi_kerja?.sales_order?.finish_good_item?.nama_barang || '-'}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    PO Customer: {suratJalan.kartu_instruksi_kerja?.sales_order?.no_po_customer || '-'}
                                                </p>
                                            </td>
                                            <td className="px-4 py-4 font-mono text-xs">
                                                {suratJalan.kartu_instruksi_kerja?.no_kartu_instruksi_kerja || '-'}
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <span className="text-lg font-bold">{suratJalan.qty_pengiriman?.toLocaleString()}</span>
                                                <span className="ml-1 text-xs text-gray-500">PCS</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Keterangan */}
                        {suratJalan.keterangan && (
                            <div className="rounded-lg border border-yellow-100 bg-yellow-50 p-4 text-sm">
                                <span className="mb-1 block font-bold text-yellow-800">Catatan Tambahan:</span>
                                <p className="text-yellow-700">{suratJalan.keterangan}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
