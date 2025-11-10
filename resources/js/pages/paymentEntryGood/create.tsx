import { DatePicker } from '@/components/date-picker';
import { SearchableSelect } from '@/components/search-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PenerimaanBarang } from '@/types/penerimaanBarang';

import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payment Entry Good',
        href: '/paymentEntryGoods',
    },
    {
        title: 'Tambah',
        href: '#',
    },
];

interface CreateProps {
    penerimaanBarangs: PenerimaanBarang[];
}

export default function Create({ penerimaanBarangs }: CreateProps) {
    const [selectedPenerimaanBarang, setSelectedPenerimaanBarang] = useState<PenerimaanBarang | null>(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        id_penerimaan_barang: '',
        no_tagihan: '',
        tanggal_transaksi: '',
        tanggal_jatuh_tempo: '',
        harga_per_qty: '',
        diskon: '',
        ppn: '',
        keterangan: '',
    });

    const handlePenerimaanBarangChange = (value: string) => {
        const penerimaanBarang = penerimaanBarangs.find((sj) => String(sj.id) === value);
        setSelectedPenerimaanBarang(penerimaanBarang || null);
        setData('id_penerimaan_barang', penerimaanBarang ? penerimaanBarang.id : '');

        if (penerimaanBarang) {
            const firstPOItem = penerimaanBarang.purchase_order?.items?.[0];
            const po = penerimaanBarang.purchase_order;

            setData((prevData) => ({
                ...prevData,
                harga_per_qty: firstPOItem?.harga_satuan?.toString() || '',
                diskon: firstPOItem?.diskon_satuan?.toString() || '',
                ppn: po?.ppn?.toString() || '',
                qty_penerimaan: penerimaanBarang.items?.[0]?.qty_penerimaan?.toString() || '',
            }));
        } else {
            setData((prevData) => ({
                ...prevData,
                harga_per_qty: '',
                diskon: '',
                ppn: '',
                qty_penerimaan: '',
            }));

        }

    };


    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('paymentEntryGoods.store'), {
            onSuccess: () => {
                toast.success('Payment Entry Good berhasil dibuat');
                reset();
            },
            onError: () => {
                toast.error('Gagal membuat Payment Entry Good');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Payment Entry Good" />
            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tambah Payment Entry Good </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                {/* No Penerimaan Barang */}
                                <div className="space-y-2">
                                    <Label htmlFor="id_penerimaan_barang">
                                        No Penerimaan Barang <span className="text-red-500">*</span>
                                    </Label>
                                    <SearchableSelect
                                        items={penerimaanBarangs.map((penerimaanBarang) => ({
                                            key: String(penerimaanBarang.id),
                                            value: String(penerimaanBarang.id),
                                            label: `${penerimaanBarang.no_laporan_barang} || '-'}`,
                                        }))}
                                        value={data.id_penerimaan_barang || ''} // fallback to empty string
                                        placeholder="Pilih No Penerimaan Barang"
                                        onChange={handlePenerimaanBarangChange}
                                    />
                                    {errors.id_penerimaan_barang && <div className="text-sm text-red-600">{errors.id_penerimaan_barang}</div>}
                                </div>

                                {selectedPenerimaanBarang && (
                                    <div className="rounded-md border bg-gray-50 p-4 dark:bg-gray-800">
                                        <h3 className="mb-3 font-medium">Detail No Penerimaan Barang Terpilih</h3>
                                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                            <div>
                                                <p>
                                                    <span className="font-medium">No. Penerimaan Barang:</span>{' '}
                                                    {selectedPenerimaanBarang.no_laporan_barang}
                                                </p>
                                                <p>
                                                    <span className="font-medium">No. PO:</span> {selectedPenerimaanBarang.purchase_order?.no_po}
                                                </p>
                                                <p>
                                                    <span className="font-medium">Tanggal No Penerimaan Barang:</span>{' '}
                                                    {selectedPenerimaanBarang.tgl_terima_barang || '-'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="no_tagihan">
                                            No Tagihan <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="no_tagihan"
                                            type="text"
                                            value={data.no_tagihan}
                                            onChange={(e) => setData('no_tagihan', e.target.value)}
                                        />
                                        {errors.no_tagihan && <p className="text-sm text-red-600">{errors.no_tagihan}</p>}
                                    </div>

                                    {/* Tanggal Payment Entry Good */}
                                    <div className="space-y-2">
                                        <Label htmlFor="tanggal_transaksi">
                                            Tanggal Payment Entry Good <span className="text-red-500">*</span>
                                        </Label>
                                        <DatePicker
                                            value={data.tanggal_transaksi}
                                            onChange={(date) => {
                                                if (date) {
                                                    const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                                                        .toISOString()
                                                        .split('T')[0];
                                                    setData('tanggal_transaksi', formattedDate);
                                                } else {
                                                    setData('tanggal_transaksi', '');
                                                }
                                            }}
                                        />
                                        {errors.tanggal_transaksi && <p className="text-sm text-red-600">{errors.tanggal_transaksi}</p>}
                                    </div>

                                    {/* Tanggal Jatuh Tempo */}
                                    <div className="space-y-2">
                                        <Label htmlFor="tanggal_jatuh_tempo">
                                            Tanggal Jatuh Tempo <span className="text-red-500">*</span>
                                        </Label>

                                        <DatePicker
                                            value={data.tanggal_jatuh_tempo}
                                            onChange={(date) => {
                                                if (date) {
                                                    const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                                                        .toISOString()
                                                        .split('T')[0];
                                                    setData('tanggal_jatuh_tempo', formattedDate);
                                                } else {
                                                    setData('tanggal_jatuh_tempo', '');
                                                }
                                            }}
                                        />
                                        {errors.tanggal_jatuh_tempo && <p className="text-sm text-red-600">{errors.tanggal_jatuh_tempo}</p>}
                                    </div>

                                    {/* Discount */}
                                    <div className="space-y-2">
                                        <Label htmlFor="diskon">
                                            Discount <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="diskon"
                                            type="number"
                                            min="0"
                                            value={data.diskon}
                                            onChange={(e) => setData('diskon', e.target.value)}
                                            placeholder="0"
                                        />
                                        {errors.diskon && <p className="text-sm text-red-600">{errors.diskon}</p>}
                                    </div>

                                    {/* Harga Per QTY */}
                                    <div className="space-y-2">
                                        <Label htmlFor="harga_per_qty">
                                            Harga Per QTY <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="harga_per_qty"
                                            type="number"
                                            min="0"
                                            value={data.harga_per_qty}
                                            onChange={(e) => setData('harga_per_qty', e.target.value)}
                                            placeholder="0"
                                        />
                                        {errors.harga_per_qty && <p className="text-sm text-red-600">{errors.harga_per_qty}</p>}
                                    </div>

                                    {/* PPN */}
                                    <div className="space-y-2">
                                        <Label htmlFor="ppn">
                                            PPN (%) <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="ppn"
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            value={data.ppn}
                                            onChange={(e) => setData('ppn', e.target.value)}
                                            placeholder="0"
                                        />
                                        {errors.ppn && <p className="text-sm text-red-600">{errors.ppn}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="qty_penerimaan">Qty Penerimaan</Label>
                                        <Input
                                            id="qty_penerimaan"
                                            type="number"
                                            min="0"
                                            value={
                                                selectedPenerimaanBarang?.items?.[0]?.qty_penerimaan
                                                    ? selectedPenerimaanBarang.items[0].qty_penerimaan.toString()
                                                    : ''
                                            }
                                            disabled
                                        />
                                    </div>
                                </div>

                                {/* Keterangan */}
                                <div className="space-y-2">
                                    <Label htmlFor="keterangan">Keterangan</Label>
                                    <Textarea
                                        id="keterangan"
                                        value={data.keterangan}
                                        onChange={(e) => setData('keterangan', e.target.value)}
                                        placeholder="Masukkan keterangan"
                                    />
                                    {errors.keterangan && <p className="text-sm text-red-600">{errors.keterangan}</p>}
                                </div>

                                {/* Summary Card */}
                                {(data.diskon || data.ppn || data.harga_per_qty) && (
                                    <Card className="bg-gray-50 dark:bg-gray-800">
                                        <CardHeader>
                                            <CardTitle className="text-lg">Ringkasan Payment Entry Good</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span>Subtotal:</span>
                                                    <span>
                                                        Rp{' '}
                                                        {(() => {
                                                            const diskon = Number(data.diskon || 0);
                                                            const hargaPerQty = Number(data.harga_per_qty || 0);
                                                            const qtyPenerimaan = Number(
                                                                // Mengakses elemen pertama dari array items
                                                                selectedPenerimaanBarang?.items?.[0]?.qty_penerimaan || 0,
                                                            );

                                                            console.log('hargaPerQty:', hargaPerQty);
                                                            console.log('qtyPenerimaan:', qtyPenerimaan);

                                                            // Subtotal
                                                            const subTotalQTY = qtyPenerimaan * hargaPerQty;

                                                            const subtotal = subTotalQTY - diskon;

                                                            return subtotal.toLocaleString('id-ID');
                                                        })()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>PPN ({data.ppn}%):</span>
                                                    <span>
                                                        Rp{' '}
                                                        {(() => {
                                                            const diskon = Number(data.diskon || 0);
                                                            const hargaPerQty = Number(data.harga_per_qty || 0);
                                                            const qtyPenerimaan = Number(
                                                                // Mengakses elemen pertama dari array items
                                                                selectedPenerimaanBarang?.items?.[0]?.qty_penerimaan || 0,
                                                            );
                                                            const ppnRate = Number(data.ppn || 0);

                                                            // Subtotal
                                                            const subTotalQTY = hargaPerQty * qtyPenerimaan;

                                                            const subtotal = subTotalQTY - diskon;

                                                            // PPN = subtotal * ppn_rate / 100
                                                            const ppnAmount = (subtotal * ppnRate) / 100;

                                                            return ppnAmount.toLocaleString('id-ID');
                                                        })()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Total:</span>
                                                    <span>
                                                        Rp{' '}
                                                        {(() => {
                                                            const diskon = Number(data.diskon || 0);
                                                            const hargaPerQty = Number(data.harga_per_qty || 0);
                                                            const qtyPenerimaan = Number(
                                                                // Mengakses elemen pertama dari array items
                                                                selectedPenerimaanBarang?.items?.[0]?.qty_penerimaan || 0,
                                                            );
                                                            const ppnRate = Number(data.ppn || 0);

                                                            // Subtotal
                                                            const subTotalQTY = hargaPerQty * qtyPenerimaan;

                                                            const subtotal = subTotalQTY - diskon;

                                                            // PPN = subtotal * ppn_rate / 100
                                                            const ppnAmount = (subtotal * ppnRate) / 100;

                                                            return (subtotal + ppnAmount).toLocaleString('id-ID');
                                                        })()}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                <div className="flex justify-end gap-4">
                                    <Link href={route('paymentEntryGoods.index')}>
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
        </AppLayout>
    );
}
