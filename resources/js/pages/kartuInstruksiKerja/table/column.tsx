/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';

import { KartuInstruksiKerja, KartuInstruksiKerjaBom } from '@/types/kartuInstruksiKerja';

import { formatToInteger } from '@/utils/formatter/decimaltoint';
import { Download, FileText, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

export const generateKikPdf = (kartuInstruksiKerja: KartuInstruksiKerja, download = false): void => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const topOffset = 10;
    const formatDate = (dateString?: string): string => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };
    const logo = new Image();
    logo.src = '/images/logo-kantor.png';
    doc.addImage(logo, 'PNG', 14, 17 + topOffset, 17, 17);

    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(10, 10 + topOffset, pageWidth - 20, 30);

    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('CV. Indigama Khatulistiwa', 34, 18 + topOffset);

    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text('Dsn. Blimbing RT 02 RW 11, Ds. Bulusari, Kec. Gempol,', 34, 23 + topOffset);
    doc.text('Pasuruan, Jawa Timur 67155', 34, 28 + topOffset);
    doc.text('Email: indigama.khatulistiwa01@gmail.com', 34, 33 + topOffset);
    doc.text('Telp: 081703101012', 34, 38 + topOffset);

    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('SURAT PERINTAH KERJA', pageWidth - 15, 18 + topOffset, {
        align: 'right',
    });

    const kikNumber = kartuInstruksiKerja?.no_kartu_instruksi_kerja || '-';
    const currentDate = formatDate(new Date().toISOString());

    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.text(kikNumber, pageWidth - 15, 25 + topOffset, { align: 'right' });
    doc.text(`Tanggal: ${currentDate}`, pageWidth - 15, 30 + topOffset, {
        align: 'right',
    });
    let y = 55 + topOffset;

    doc.setFontSize(11).setFont('helvetica', 'bold');
    doc.text('Informasi Pesanan', 15, y);
    doc.text('Informasi Pelanggan', pageWidth / 2 + 5, y);
    y += 6;

    doc.setFontSize(9).setFont('helvetica', 'normal');

    // No SO
    doc.text('No Sales Order', 15, y);
    doc.text(':', 50, y);
    doc.text(kartuInstruksiKerja.sales_order?.no_bon_pesanan || '-', 55, y);

    doc.text('Nama', pageWidth / 2 + 5, y);
    doc.text(':', pageWidth / 2 + 28, y);
    doc.text(kartuInstruksiKerja.sales_order?.customer_address?.nama_customer || '-', pageWidth / 2 + 32, y);
    y += 6;

    // No PO
    doc.text('No PO', 15, y);
    doc.text(':', 50, y);
    doc.text(kartuInstruksiKerja.sales_order?.no_po_customer || '-', 55, y);
    y += 6;

    // Tgl PO + Alamat
    doc.text('Tgl PO', 15, y);
    doc.text(':', 50, y);
    doc.text(formatDate(kartuInstruksiKerja.sales_order?.eta_marketing), 55, y);

    doc.text('Alamat', pageWidth / 2 + 5, y);
    doc.text(':', pageWidth / 2 + 28, y);

    const alamat = kartuInstruksiKerja.sales_order?.customer_address?.alamat_lengkap || '-';
    const alamatWrap = doc.splitTextToSize(alamat, 65);
    doc.text(alamatWrap, pageWidth / 2 + 32, y);
    y += alamatWrap.length * 4;

    y += 4;
    doc.line(10, y, pageWidth - 10, y);
    y += 6;

    /* ================= DETAIL PRODUKSI ================= */
    doc.setFontSize(11).setFont('helvetica', 'bold');
    doc.text('Detail Produksi', 15, y);
    y += 6;

    doc.setFontSize(9).setFont('helvetica', 'normal');

    // Produk (wrap ke bawah)
    doc.text('Produk', 15, y);
    doc.text(':', 50, y);
    const produkText = kartuInstruksiKerja.sales_order?.finish_good_item?.nama_barang || '-';
    const produkWrap = doc.splitTextToSize(produkText, 60);
    doc.text(produkWrap, 55, y);
    y += produkWrap.length * 4;

    // Kode Produk
    doc.text('Kode Produk', 15, y);
    doc.text(':', 50, y);
    doc.text(kartuInstruksiKerja.sales_order?.finish_good_item?.kode_material_produk || '-', 55, y);

    doc.text('Tgl Estimasi Selesai', pageWidth / 2 + 5, y);
    doc.text(':', pageWidth / 2 + 50, y);
    doc.text(formatDate(kartuInstruksiKerja.tgl_estimasi_selesai), pageWidth / 2 + 55, y);
    y += 6;

    // Jumlah
    doc.text('Jumlah Pesanan', 15, y);
    doc.text(':', 50, y);
    doc.text(
        `${new Intl.NumberFormat('id-ID').format(Number(kartuInstruksiKerja.sales_order?.jumlah_pesanan || 0))} ${
            kartuInstruksiKerja.sales_order?.finish_good_item?.unit?.nama_satuan || ''
        }`,
        55,
        y,
    );

    doc.text('Production Plan', pageWidth / 2 + 5, y);
    doc.text(':', pageWidth / 2 + 50, y);
    doc.text(kartuInstruksiKerja.production_plan || '-', pageWidth / 2 + 55, y);
    y += 6;

    y += 4;
    doc.line(10, y, pageWidth - 10, y);
    y += 6;

    /* ================= BOM TABLE ================= */
    doc.setFontSize(11).setFont('helvetica', 'bold');
    doc.text('Bill of Materials', 15, y);
    y += 5;

    const boms = kartuInstruksiKerja.kartuInstruksiKerjaBoms || kartuInstruksiKerja.kartu_instruksi_kerja_boms || [];

    const tableRows = boms.map((bom: any, index: number) => ({
        no: index + 1,
        departemen: bom.bill_of_materials?.departemen?.nama_departemen || '-',
        kode: bom.bill_of_materials?.master_item?.kode_master_item || '-',
        nama: bom.bill_of_materials?.master_item?.nama_master_item || '-',
        qty: bom.bill_of_materials?.qty || 0,
        satuan: bom.bill_of_materials?.master_item?.unit?.nama_satuan || '-',
        waste: formatToInteger(bom.waste || 0),
        total: bom.total_kebutuhan || 0,
    }));

    autoTable(doc, {
        startY: y,
        head: [['No', 'Departemen', 'Kode Item', 'Nama Item', 'Qty', 'Satuan', 'Waste', 'Total']],
        body: tableRows.map((r: any) => [r.no, r.departemen, r.kode, r.nama, r.qty, r.satuan, r.waste, r.total]),
        styles: {
            fontSize: 8,
            lineWidth: 0.5,
            lineColor: [0, 0, 0],
        },
        headStyles: {
            fillColor: [230, 240, 255],
            textColor: [0, 0, 0],
        },
    });

    /* ================= OUTPUT ================= */
    if (download) {
        doc.save(`SPK_${kikNumber}.pdf`);
    } else {
        window.open(doc.output('bloburl'), '_blank');
    }
};

const handleDelete = (item: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus kartu instruksi kerja ini?')) {
        router.delete(`/kartuInstruksiKerja/${item}`, {
            onSuccess: () => {
                toast.success('Surat Perintah Kerja berhasil dihapus');
            },
            onError: () => {
                toast.error('Gagal menghapus Surat Perintah Kerja');
            },
        });
    }
};

export const columns = (): ColumnDef<KartuInstruksiKerja>[] => [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'no_kartu_instruksi_kerja',
        header: 'No. SPK',
    },
    {
        accessorKey: 'sales_order.no_bon_pesanan',
        header: 'No. Sales Order',
        cell: ({ row }) => row.original.sales_order?.no_bon_pesanan || '-',
    },
    {
        accessorKey: 'sales_order.jumlah_pesanan',
        header: 'Jumlah Order',
    },
    {
        accessorKey: 'kartu_instruksi_kerja_boms',
        header: 'Jumlah Produksi',
        cell: ({ getValue }) => {
            const boms = getValue() as KartuInstruksiKerjaBom[];
            if (!boms || boms.length === 0) return '-';

            return boms.map((bom) => bom.jumlah_produksi);
        },
    },
    {
        header: 'On Hand Stock',
        cell: ({ row }) => {
            const packagings = row.original.packagings || [];
            const suratJalans = row.original.surat_jalans || [];
            const blokirs = row.original.blokirs || [];

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

            const onHandStock = totalStokBarangJadi - transferBlokir - totalPengiriman;
            return onHandStock.toLocaleString();
        },
    },

    {
        accessorKey: 'surat_jalans',
        header: 'Total Pengiriman',
        cell: ({ row }) => {
            const suratJalans = row.original.surat_jalans || [];
            const totalPengiriman = suratJalans.reduce((total, suratJalan) => {
                return total + (suratJalan.qty_pengiriman || 0);
            }, 0);
            return totalPengiriman.toLocaleString();
        },
    },

    {
        accessorKey: 'tgl_estimasi_selesai',
        header: 'Tanggal ETA',
        cell: ({ row }) => {
            const date = row.original.tgl_estimasi_selesai;
            if (!date) return '-';

            // Assuming date is in a compatible format
            try {
                const formattedDate = new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD format
                return formattedDate;
            } catch {
                return date; // Return original if formatting fails
            }
        },
    },
    {
        accessorKey: 'sales_order.finish_good_item.nama_barang',
        header: 'Nama Produk',
        cell: ({ row }) => row.original.sales_order?.finish_good_item?.nama_barang || row.original.sales_order?.master_item?.nama_master_item || '-',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const item = row.original;
            const handlePreviewPdf = async () => {
                try {
                    // Fetch data lengkap kartuInstruksiKerja beserta relasinya
                    const response = await fetch(`/kartuInstruksiKerja/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    // Generate dan tampilkan PDF
                    generateKikPdf(data, false);
                } catch (error) {
                    console.error('Error generating PDF:', error);
                    alert('Gagal menghasilkan PDF. Silakan coba lagi.');
                }
            };

            const handleDownloadPdf = async () => {
                try {
                    // Fetch data lengkap kartuInstruksiKerja beserta relasinya
                    const response = await fetch(`/kartuInstruksiKerja/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    // Generate dan download PDF
                    generateKikPdf(data, true);
                } catch (error) {
                    console.error('Error downloading PDF:', error);
                    alert('Gagal mengunduh PDF. Silakan coba lagi.');
                }
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDelete(item.id)}>Delete</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.get(`/kartuInstruksiKerja/${item.id}/edit`)}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.get(`/kartuInstruksiKerja/${item.id}`)}>Detail</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handlePreviewPdf}>
                            <FileText className="mr-2 h-4 w-4" />
                            Preview PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDownloadPdf}>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
