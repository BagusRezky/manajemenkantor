/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchableSelect } from '@/components/search-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { BillOfMaterial } from '@/types/billOfMaterial';
import { KartuInstruksiKerja } from '@/types/kartuInstruksiKerja';
import { SalesOrder } from '@/types/salesOrder';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Surat Perintah Kerja',
        href: '/kartuInstruksiKerja',
    },
    {
        title: 'Edit',
        href: '#',
    },
];

interface EditProps {
    kartuInstruksiKerja: KartuInstruksiKerja;
    salesOrders: SalesOrder[];
}

export default function Edit({ kartuInstruksiKerja, salesOrders }: EditProps) {
    const { data, setData, put, processing, errors } = useForm<{
        id_sales_order: string;
        no_kartu_instruksi_kerja: string;
        production_plan: string;
        tgl_estimasi_selesai: string;
        bill_of_materials: Array<{
            id: any;
            waste: any;
            total_kebutuhan: any;
            jumlah_sheet_cetak: any | null;
            jumlah_total_sheet_cetak: any | null;
            jumlah_produksi: any | null;
        }>;
    }>({
        id_sales_order: kartuInstruksiKerja.id_sales_order?.toString() || '',
        no_kartu_instruksi_kerja: kartuInstruksiKerja.no_kartu_instruksi_kerja || '',
        production_plan: kartuInstruksiKerja.production_plan || '',
        tgl_estimasi_selesai: kartuInstruksiKerja.tgl_estimasi_selesai || '',
        bill_of_materials: [],
    });

    // State untuk menyimpan Sales Order yang dipilih
    const [selectedSalesOrder, setSelectedSalesOrder] = useState<any>(null);

    // State untuk draft KIK (tidak disimpan ke database sampai user klik Simpan)
    const [isDraft, setIsDraft] = useState(false);

    // State untuk menyimpan BOM items dengan perhitungan
    const [bomItems, setBomItems] = useState<any[]>([]);

    // Initialize selected sales order pada saat component mount
    useEffect(() => {
        if (data.id_sales_order) {
            const selected = salesOrders.find((so) => so.id.toString() === data.id_sales_order);
            if (selected) {
                setSelectedSalesOrder(selected);
            }
        }
    }, [data.id_sales_order, salesOrders]);

    // Load existing BOM data jika ada
    useEffect(() => {
        if (kartuInstruksiKerja.kartuInstruksiKerjaBoms && kartuInstruksiKerja.kartuInstruksiKerjaBoms.length > 0) {
            const existingBomItems = kartuInstruksiKerja.kartuInstruksiKerjaBoms.map((kikBom: any) => ({
                ...kikBom.billOfMaterials,
                waste: kikBom.waste,
                total_kebutuhan: kikBom.total_kebutuhan,
                jumlah_sheet_cetak: kikBom.jumlah_sheet_cetak,
                jumlah_total_sheet_cetak: kikBom.jumlah_total_sheet_cetak,
                jumlah_produksi: kikBom.jumlah_produksi,
                editable_waste: kikBom.billOfMaterials?.master_item?.unit?.nama_satuan === 'SHEET',
            }));
            setBomItems(existingBomItems);
            setIsDraft(true);
        }
    }, [kartuInstruksiKerja]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handler untuk perubahan sales order
    const handleSalesOrderChange = (value: string) => {
        setData('id_sales_order', value);
        setIsDraft(false); // Reset draft state
        setBomItems([]); // Clear existing BOM items

        // Cari sales order yang dipilih
        const selected = salesOrders.find((so) => so.id.toString() === value);
        if (selected) {
            setSelectedSalesOrder(selected);
        } else {
            setSelectedSalesOrder(null);
        }
    };

    const calculateTotalKebutuhan = (salesOrder: SalesOrder, bom: BillOfMaterial): number => {
        const jumlahPesanan = parseInt(salesOrder.jumlah_pesanan || '0');
        const toleransi = parseFloat(salesOrder.toleransi_pengiriman || '0') / 100;
        const qty = parseFloat(bom.qty || '0');

        // Cek apakah master item adalah SHEET
        const isSheet = bom.master_item?.unit?.nama_satuan === 'SHEET';

        if (isSheet && salesOrder.finish_good_item) {
            const finishGoodItem = salesOrder.finish_good_item;
            const totalUp =
                parseInt(finishGoodItem.up_satu || '0') + parseInt(finishGoodItem.up_dua || '0') + parseInt(finishGoodItem.up_tiga || '0');
            const ukuranPotong = parseFloat(finishGoodItem.ukuran_potong || '0');
            const ukuranCetak = parseFloat(finishGoodItem.ukuran_cetak || '0');

            if (totalUp > 0 && ukuranPotong > 0 && ukuranCetak > 0) {
                const kebutuhanDasar = jumlahPesanan / totalUp / (ukuranPotong * ukuranCetak);
                const waste = parseFloat(bom.waste || '0') / 100;
                return Math.round(kebutuhanDasar * (1 + waste));
            }

            return 0;
        } else {
            const kebutuhanRaw = jumlahPesanan * qty * (1 + toleransi);
            const totalKebutuhan = Math.round(kebutuhanRaw);
            return totalKebutuhan;
        }
    };

    const handleShowDraft = () => {
        if (!selectedSalesOrder) return;

        // Hitung total kebutuhan untuk setiap BOM item
        const calculatedBomItems =
            selectedSalesOrder.finish_good_item?.bill_of_materials.map((bom: BillOfMaterial) => {
                // Cek apakah master item adalah SHEET
                const isSheet = bom.master_item?.unit?.nama_satuan === 'SHEET';

                if (isSheet && selectedSalesOrder.finish_good_item) {
                    const finishGoodItem = selectedSalesOrder.finish_good_item;
                    const totalUp =
                        parseInt(finishGoodItem.up_satu || '0') + parseInt(finishGoodItem.up_dua || '0') + parseInt(finishGoodItem.up_tiga || '0');
                    const ukuranPotong = parseFloat(finishGoodItem.ukuran_potong || '0');
                    const ukuranCetak = parseFloat(finishGoodItem.ukuran_cetak || '0');
                    const jumlahPesanan = parseInt(selectedSalesOrder.jumlah_pesanan || '0');

                    // Rumus 1: Jumlah Sheet Cetak (tanpa waste)
                    const jumlahSheetCetak = Math.round(jumlahPesanan / totalUp / (ukuranPotong * ukuranCetak));

                    // Total kebutuhan adalah jumlah sheet cetak + waste (waste sebagai nilai integer, bukan persen)
                    const wasteValue = parseInt(bom.waste || '0'); // waste sebagai angka utuh, bukan persen
                    const totalKebutuhan = jumlahSheetCetak + wasteValue;

                    // Jumlah Total Sheet adalah total kebutuhan x ukuran potong x ukuran cetak
                    const jumlahTotalSheetCetak = Math.round(totalKebutuhan * ukuranPotong * ukuranCetak);

                    // Jumlah Produksi
                    const jumlahProduksi = Math.round(jumlahTotalSheetCetak * totalUp);

                    return {
                        ...bom,
                        total_kebutuhan: totalKebutuhan,
                        jumlah_sheet_cetak: jumlahSheetCetak,
                        jumlah_total_sheet_cetak: jumlahTotalSheetCetak,
                        jumlah_produksi: jumlahProduksi,
                        editable_waste: true,
                    };
                } else {
                    // Untuk item non-SHEET
                    const jumlahPesanan = parseInt(selectedSalesOrder.jumlah_pesanan || '0');
                    const toleransi = parseFloat(selectedSalesOrder.toleransi_pengiriman || '0') / 100;
                    const qty = parseFloat(bom.qty || '0');

                    const kebutuhanRaw = jumlahPesanan * qty * (1 + toleransi);
                    const totalKebutuhan = Math.round(kebutuhanRaw);

                    return {
                        ...bom,
                        total_kebutuhan: totalKebutuhan,
                        jumlah_sheet_cetak: null,
                        jumlah_total_sheet_cetak: null,
                        jumlah_produksi: null,
                        editable_waste: false,
                    };
                }
            }) || [];

        setBomItems(calculatedBomItems);
        setIsDraft(true);
    };

    const handleWasteChange = (index: number, newWaste: string) => {
        if (!selectedSalesOrder || !selectedSalesOrder.finish_good_item) return;

        const updatedItems = [...bomItems];
        // Pastikan waste disimpan sebagai string (karena akan dikonversi sesuai kebutuhan)
        updatedItems[index].waste = newWaste;

        // Jika item adalah sheet, hitung ulang nilai-nilai terkait
        if (updatedItems[index].editable_waste) {
            const finishGoodItem = selectedSalesOrder.finish_good_item;
            const totalUp =
                parseInt(finishGoodItem.up_satu || '0') + parseInt(finishGoodItem.up_dua || '0') + parseInt(finishGoodItem.up_tiga || '0');
            const ukuranPotong = parseFloat(finishGoodItem.ukuran_potong || '0');
            const ukuranCetak = parseFloat(finishGoodItem.ukuran_cetak || '0');

            // Jumlah sheet cetak tetap sama (tidak dipengaruhi waste)
            const jumlahSheetCetak = updatedItems[index].jumlah_sheet_cetak;

            // Waste sebagai nilai integer, bukan persentase
            const wasteValue = parseInt(newWaste || '0');

            // Total kebutuhan adalah jumlah sheet cetak + waste
            const totalKebutuhan = jumlahSheetCetak + wasteValue;

            // Jumlah Total Sheet adalah total kebutuhan x ukuran potong x ukuran cetak
            const jumlahTotalSheetCetak = Math.round(totalKebutuhan * ukuranPotong * ukuranCetak);

            // Jumlah Produksi
            const jumlahProduksi = Math.round(jumlahTotalSheetCetak * totalUp);

            // Update nilai-nilai di item
            updatedItems[index].total_kebutuhan = totalKebutuhan;
            updatedItems[index].jumlah_total_sheet_cetak = jumlahTotalSheetCetak;
            updatedItems[index].jumlah_produksi = jumlahProduksi;
        }

        setBomItems(updatedItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isDraft && bomItems.length > 0) {
            // Sederhanakan struktur BOM
            const simpleBomItems = bomItems.map((item) => ({
                id: item.id,
                waste: item.waste,
                total_kebutuhan: item.total_kebutuhan,
                jumlah_sheet_cetak: item.jumlah_sheet_cetak || null,
                jumlah_total_sheet_cetak: item.jumlah_total_sheet_cetak || null,
                jumlah_produksi: item.jumlah_produksi || null,
            }));

            // Update data form dengan BOM
            setData((prev) => ({
                ...prev,
                bill_of_materials: simpleBomItems,
            }));

            // Submit form menggunakan Inertia dengan data yang sudah diupdate
            put(route('kartuInstruksiKerja.update', kartuInstruksiKerja.id), {
                onSuccess: () => {
                    toast.success('Surat Perintah Kerja berhasil diperbarui!');
                },
                onError: () => {
                    toast.error('Terjadi kesalahan saat memperbarui data');
                },
            });
        } else {
            // Jika tidak ada draft baru, update data dasar saja
            put(route('kartuInstruksiKerja.update', kartuInstruksiKerja.id), {
                onSuccess: () => {
                    toast.success('Surat Perintah Kerja berhasil diperbarui!');
                },
                onError: () => {
                    toast.error('Terjadi kesalahan saat memperbarui data');
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Surat Perintah Kerja" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Edit Surat Perintah Kerja</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                        {/* No Surat Perintah Kerja - READONLY */}
                                        <div className="space-y-2">
                                            <Label htmlFor="no_kartu_instruksi_kerja">No. Surat Perintah Kerja</Label>
                                            <Input
                                                id="no_kartu_instruksi_kerja"
                                                name="no_kartu_instruksi_kerja"
                                                value={data.no_kartu_instruksi_kerja}
                                                readOnly
                                            />
                                        </div>

                                        {/* Sales Order */}
                                        <div className="space-y-2">
                                            <Label htmlFor="id_sales_order">No. Sales Order</Label>
                                            <SearchableSelect
                                                items={salesOrders.map((item) => ({
                                                    key: String(item.id),
                                                    value: String(item.id),
                                                    label: item.no_bon_pesanan,
                                                }))}
                                                value={data.id_sales_order || ''}
                                                placeholder="Pilih No. Sales Order"
                                                onChange={(value) => handleSalesOrderChange(value)}
                                            />
                                            {errors.id_sales_order && <p className="text-sm text-red-500">{errors.id_sales_order}</p>}
                                        </div>

                                        {/* Production Plan */}
                                        <div className="space-y-2">
                                            <Label htmlFor="production_plan">Production Plan</Label>
                                            <Input id="production_plan" name="production_plan" value={data.production_plan} onChange={handleChange} />
                                            {errors.production_plan && <p className="text-sm text-red-500">{errors.production_plan}</p>}
                                        </div>

                                        {/* Tanggal Estimasi Selesai */}
                                        <div className="space-y-2">
                                            <Label htmlFor="tgl_estimasi_selesai">Tanggal Estimasi Selesai</Label>
                                            <Input value={data.tgl_estimasi_selesai} type="date" onChange={handleChange} />
                                            {errors.tgl_estimasi_selesai && <p className="text-sm text-red-500">{errors.tgl_estimasi_selesai}</p>}
                                        </div>

                                        {/* ETA Marketing */}
                                        <div className="space-y-2">
                                            <Label htmlFor="eta_marketing">Tanggal PO</Label>
                                            <Input value={selectedSalesOrder?.eta_marketing || ''} readOnly />
                                        </div>
                                    </div>

                                    {selectedSalesOrder && (
                                        <div className="rounded-md border p-4">
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                                {/* Up Satu */}
                                                <div className="space-y-2">
                                                    <Label>Up Satu</Label>
                                                    <Input value={selectedSalesOrder.finish_good_item?.up_satu || ''} readOnly />
                                                </div>

                                                {/* Up Dua */}
                                                <div className="space-y-2">
                                                    <Label>Up Dua</Label>
                                                    <Input value={selectedSalesOrder.finish_good_item?.up_dua || ''} readOnly />
                                                </div>

                                                {/* Up Tiga */}
                                                <div className="space-y-2">
                                                    <Label>Up Tiga</Label>
                                                    <Input value={selectedSalesOrder.finish_good_item?.up_tiga || ''} readOnly />
                                                </div>

                                                {/* Ukuran Potong */}
                                                <div className="space-y-2">
                                                    <Label>Ukuran Potong</Label>
                                                    <Input value={selectedSalesOrder.finish_good_item?.ukuran_potong || ''} readOnly />
                                                </div>

                                                {/* Ukuran Cetak */}
                                                <div className="space-y-2">
                                                    <Label>Ukuran Cetak</Label>
                                                    <Input value={selectedSalesOrder.finish_good_item?.ukuran_cetak || ''} readOnly />
                                                </div>

                                                {/* Spesifikasi Kertas */}
                                                <div className="space-y-2">
                                                    <Label>Spesifikasi Kertas</Label>
                                                    <Input value={selectedSalesOrder.finish_good_item?.spesifikasi_kertas || ''} readOnly />
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <Button type="button" variant="outline" onClick={handleShowDraft}>
                                                    {bomItems.length > 0 ? 'Refresh Draft SPK' : 'Draft SPK'}
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {isDraft && (
                                        <div className="mt-8">
                                            {/* Tampilkan data sales order */}
                                            <div className="mb-6 rounded-md border p-4">
                                                <h3 className="mb-4 text-lg font-medium">Detail Sales Order</h3>
                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    <div>
                                                        <p>
                                                            <span className="font-medium">No Sales Order:</span> {selectedSalesOrder?.no_bon_pesanan}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">No PO Customer:</span> {selectedSalesOrder?.no_po_customer}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">Customer:</span>{' '}
                                                            {selectedSalesOrder?.customer_address?.nama_customer}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">Harga pcs bp:</span> {selectedSalesOrder?.harga_pcs_bp}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">Nama Barang:</span>{' '}
                                                            {selectedSalesOrder?.finish_good_item?.nama_barang}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">Deskripsi:</span>{' '}
                                                            {selectedSalesOrder?.finish_good_item?.deskripsi}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p>
                                                            <span className="font-medium">Jumlah Pesanan:</span> {selectedSalesOrder?.jumlah_pesanan}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">Toleransi Pengiriman:</span>{' '}
                                                            {selectedSalesOrder?.toleransi_pengiriman}%
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">Tipe Pesanan:</span> {selectedSalesOrder?.tipe_pesanan}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">Mata Uang:</span> {selectedSalesOrder?.mata_uang}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">Syarat Pembayaran:</span>{' '}
                                                            {selectedSalesOrder?.syarat_pembayaran}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">Tanggal Pesanan:</span> {selectedSalesOrder?.eta_marketing}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Detail Perhitungan Sheet */}
                                            <div className="mb-6 rounded-md border p-4">
                                                <h3 className="mb-4 text-lg font-medium">Detail Perhitungan Sheet</h3>
                                                {bomItems.some((item) => item.master_item?.unit?.nama_satuan === 'SHEET') && (
                                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                        {bomItems
                                                            .filter((item) => item.master_item?.unit?.nama_satuan === 'SHEET')
                                                            .map((sheetItem, index) => (
                                                                <div key={index} className="rounded border p-3">
                                                                    <p>
                                                                        <span className="font-medium">Jumlah Sheet Cetak:</span>{' '}
                                                                        {sheetItem.jumlah_sheet_cetak || '-'}
                                                                    </p>
                                                                    <p>
                                                                        <span className="font-medium">Jumlah Total Sheet Cetak:</span>{' '}
                                                                        {sheetItem.jumlah_total_sheet_cetak || '-'}
                                                                    </p>
                                                                    <p>
                                                                        <span className="font-medium">Jumlah Produksi:</span>{' '}
                                                                        {sheetItem.jumlah_produksi || '-'}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Tampilkan tabel BOM */}
                                            <div>
                                                <h3 className="mb-4 text-lg font-medium">Bill of Materials</h3>
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Material</TableHead>
                                                            <TableHead>Departemen</TableHead>
                                                            <TableHead>Satuan</TableHead>
                                                            <TableHead>Qty</TableHead>
                                                            <TableHead>Waste</TableHead>
                                                            <TableHead>Total Kebutuhan</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {bomItems.map((bom, index) => (
                                                            <TableRow key={bom.id}>
                                                                <TableCell>{bom.master_item?.nama_master_item}</TableCell>
                                                                <TableCell>{bom.departemen?.nama_departemen}</TableCell>
                                                                <TableCell>{bom.master_item?.unit?.nama_satuan}</TableCell>
                                                                <TableCell>{bom.qty}</TableCell>
                                                                <TableCell>
                                                                    {bom.editable_waste ? (
                                                                        <Input
                                                                            type="number"
                                                                            value={bom.waste}
                                                                            onChange={(e) => handleWasteChange(index, e.target.value)}
                                                                            step="0.01"
                                                                            min="0"
                                                                            className="w-20"
                                                                        />
                                                                    ) : (
                                                                        bom.waste
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>{bom.total_kebutuhan}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-end space-x-4">
                                        <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                            Batal
                                        </Button>
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Menyimpan...' : 'Update'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <Toaster />
        </AppLayout>
    );
}
