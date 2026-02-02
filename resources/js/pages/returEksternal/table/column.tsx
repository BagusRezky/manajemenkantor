/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { ReturEksternal } from '@/types/externalReturn';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, FileText, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

// Helper function untuk mendapatkan nama satuan
const getSatuanName = (item: any) => {
    return (
        item.penerimaan_barang_item?.purchase_order_item?.master_konversi?.nama_satuan ||
        item.penerimaan_barang_item?.purchase_order_item?.satuan?.nama_satuan ||
        'PIECES'
    );
};

// Function untuk generate PDF retur eksternal
const generateReturEksternalPdf = (returEksternal: ReturEksternal, download = false): void => {
    // Inisialisasi dokumen PDF
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    const logo = new Image();
    logo.src = '/images/logo-kantor.png';
    doc.addImage(logo, 'PNG', 14, 17, 17, 17);

    // Tambahkan header dengan border
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, pageWidth - 20, 30);

    // Company Info
    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('CV. Indigama Khatulistiwa', 34, 18);

    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text('Dsn. Blimbing RT 02 RW 11, Ds. Bulusari, Kec. Gempol,', 34, 23);
    doc.text('Pasuruan, Jawa Timur 67155', 34, 28);
    doc.text('Email: indigama.khatulistiwa01@gmail.com', 34, 33);
    doc.text('Telp: 081703101012', 34, 38);

    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('NOTA RETUR EKSTERNAL', pageWidth - 15, 18, { align: 'right' });

    // Informasi retur
    doc.setLineWidth(0.5);
    doc.rect(10, 45, pageWidth - 20, 45);

    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.text('No.Laporan Penerimaan Barang', 15, 52);
    doc.text(':', 75, 52);
    doc.setFont('helvetica', 'normal');
    doc.text(returEksternal.penerimaan_barang?.no_laporan_barang || '', 80, 52);

    doc.setFont('helvetica', 'bold');
    doc.text('Tgl Retur Barang', pageWidth - 85, 52);
    doc.text(':', pageWidth - 50, 52);
    doc.setFont('helvetica', 'normal');
    const formattedDate = returEksternal.tgl_retur_barang ? new Date(returEksternal.tgl_retur_barang).toLocaleDateString('id-ID') : '';
    doc.text(formattedDate, pageWidth - 45, 52);

    doc.setFont('helvetica', 'bold');
    doc.text('Catatan Retur', 15, 59);
    doc.text(':', 75, 59);
    doc.setFont('helvetica', 'normal');
    doc.text(returEksternal.catatan_retur || '-', 80, 59);

    doc.setFont('helvetica', 'bold');
    doc.text('Nama Retur', 15, 66);
    doc.text(':', 75, 66);
    doc.setFont('helvetica', 'normal');
    doc.text(returEksternal.nama_retur || '', 80, 66);

    doc.setFont('helvetica', 'bold');
    doc.text('Tgl Penerimaan Barang', 15, 73);
    doc.text(':', 75, 73);
    doc.setFont('helvetica', 'normal');
    const formattedPenerimaanDate = returEksternal.penerimaan_barang?.tgl_terima_barang
        ? new Date(returEksternal.penerimaan_barang.tgl_terima_barang).toLocaleDateString('id-ID')
        : '';
    doc.text(formattedPenerimaanDate, 80, 73);

    doc.setFont('helvetica', 'bold');
    doc.text('No.Surat Jalan Pengiriman', 15, 80);
    doc.text(':', 75, 80);
    doc.setFont('helvetica', 'normal');
    doc.text(returEksternal.penerimaan_barang?.no_surat_jalan || '', 80, 80);

    doc.setFont('helvetica', 'bold');
    doc.text('Supplier', 15, 87);
    doc.text(':', 75, 87);
    doc.setFont('helvetica', 'normal');
    doc.text(returEksternal.penerimaan_barang?.purchase_order?.supplier?.nama_suplier || '', 80, 87);

    // Header tabel "DATA ITEM PENERIMAAN BARANG"
    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.rect(10, 90, pageWidth - 20, 10);
    doc.text('DATA ITEM PENERIMAAN BARANG', pageWidth / 2, 96, { align: 'center' });

    // Isi tabel item menggunakan autoTable
    const tableColumns = [
        { header: 'No', dataKey: 'no' },
        { header: 'Nama Item', dataKey: 'item' },
        { header: 'Qty | Satuan Penerimaan', dataKey: 'qty_penerimaan' },
        { header: 'Catatan Penerimaan', dataKey: 'catatan_penerimaan' },
        { header: 'Qty | Satuan Return', dataKey: 'qty_return' },
        { header: 'Catatan Retur', dataKey: 'catatan_retur' },
    ];

    const tableRows =
        returEksternal.items?.map((item, index) => {
            return {
                no: (index + 1).toString(),
                item: `${item.penerimaan_barang_item?.purchase_order_item?.master_item?.kode_master_item || ''} - ${item.penerimaan_barang_item?.purchase_order_item?.master_item?.nama_master_item || ''}`,
                qty_penerimaan: `${item.penerimaan_barang_item?.qty_penerimaan || 0} | ${getSatuanName(item)}`,
                catatan_penerimaan: item.penerimaan_barang_item?.catatan_item || '-',
                qty_return: `${item.qty_retur} | ${getSatuanName(item)}`,
                catatan_retur: item.catatan_retur_item || '-',
            };
        }) || [];

    autoTable(doc, {
        columns: tableColumns,
        body: tableRows,
        startY: 100,
        margin: { left: 10, right: 10 },
        styles: { fontSize: 9 },
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.5 },
        bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.5 },
        columnStyles: {
            no: { cellWidth: 10 },
            item: { cellWidth: 45 },
            qty_penerimaan: { cellWidth: 30 },
            catatan_penerimaan: { cellWidth: 30 },
            qty_return: { cellWidth: 30 },
            catatan_retur: { cellWidth: 'auto' },
        },
    });

    // Ambil posisi Y setelah tabel
    const tableEndY = (doc as any).lastAutoTable.finalY + 20;

    // Tanda tangan
    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text('Supplier,', 50, tableEndY, { align: 'center' });
    doc.text('Penerima,', pageWidth - 50, tableEndY, { align: 'center' });

    // Tempat tanda tangan
    doc.text('( ..................................... )', 50, tableEndY + 30, { align: 'center' });
    doc.text('( ..................................... )', pageWidth - 50, tableEndY + 30, { align: 'center' });

    // Output PDF
    if (download) {
        doc.save(`${returEksternal.no_retur}.pdf`);
    } else {
        window.open(doc.output('bloburl'), '_blank');
    }
};

const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus Retur Eksternal ini?')) {
        router.delete(`/returEksternals/${id}`, {
            onSuccess: () => {
                toast.success('Retur Eksternal berhasil dihapus');
            },
            onError: () => {
                toast.error('Gagal menghapus Retur Eksternal');
            },
        });
    }
};

export const columns = (): ColumnDef<ReturEksternal>[] => [
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
        accessorKey: 'no_retur',
        header: 'No. Retur',
    },
    {
        accessorKey: 'no_laporan_barang',
        header: 'No. Laporan Barang',
        cell: ({ row }) => {
            const data = row.original;
            return <span>{data.penerimaan_barang?.no_laporan_barang || '-'}</span>;
        },
    },
    {
        accessorKey: 'tgl_retur_barang',
        header: 'Tgl Retur Barang',
        cell: ({ row }) => {
            const data = row.original;
            return <span>{data.tgl_retur_barang ? new Date(data.tgl_retur_barang).toLocaleDateString('id-ID') : '-'}</span>;
        },
    },
    {
        accessorKey: 'nama_retur',
        header: 'Nama Retur',
    },
    {
        accessorKey: 'penerimaan_barang.purchase_order.supplier.nama_suplier',
        header: 'Supplier',
        cell: ({ row }) => {
            const data = row.original;
            return <span>{data.penerimaan_barang?.purchase_order?.supplier?.nama_suplier || '-'}</span>;
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const item = row.original;

            const handlePreviewPdf = async () => {
                try {
                    const response = await fetch(`/returEksternals/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    generateReturEksternalPdf(data, false);
                } catch (error) {
                    console.error('Error generating PDF:', error);
                    toast.error('Gagal menghasilkan PDF. Silakan coba lagi.');
                }
            };

            const handleDownloadPdf = async () => {
                try {
                    const response = await fetch(`/returEksternals/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    generateReturEksternalPdf(data, true);
                } catch (error) {
                    console.error('Error downloading PDF:', error);
                    toast.error('Gagal mengunduh PDF. Silakan coba lagi.');
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
                        <DropdownMenuItem onClick={() => router.get(`/returEksternals/${item.id}`)}>Detail</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.get(`/returEksternals/${item.id}/edit`)}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(item.id)}>Delete</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handlePreviewPdf}>
                            <FileText className="mr-2 h-4 w-4" />
                            Preview PDF
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
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
