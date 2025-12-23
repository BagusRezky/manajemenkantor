/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SubcountOut } from '@/types/subcountOut';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, FileText, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

// Function untuk generate PDF subcount out
const generateSubcountOutPdf = (subcountOut: SubcountOut, download = false): void => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    const logo = new Image();
    logo.src = '/images/logo-kantor.png';
    doc.addImage(logo, 'PNG', 14, 17, 17, 17);

    // Header dengan border
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

    // Title
    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('SUBCOUNT OUT', pageWidth - 15, 18, { align: 'right' });

    // Informasi subcount out
    doc.setLineWidth(0.5);
    doc.rect(10, 45, pageWidth - 20, 45);

    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.text('No. Surat Jalan Subcont', 15, 52);
    doc.text(':', 65, 52);
    doc.setFont('helvetica', 'normal');
    doc.text(subcountOut.no_subcount_out || '', 70, 52);

    doc.setFont('helvetica', 'bold');
    doc.text('Tanggal', pageWidth - 85, 52);
    doc.text(':', pageWidth - 50, 52);
    doc.setFont('helvetica', 'normal');
    const formattedDate = subcountOut.tgl_subcount_out ? format(new Date(subcountOut.tgl_subcount_out), 'dd-MM-yyyy') : '';
    doc.text(formattedDate, pageWidth - 45, 52);

    doc.setFont('helvetica', 'bold');
    doc.text('Supplier', 15, 59);
    doc.text(':', 65, 59);
    doc.setFont('helvetica', 'normal');
    doc.text(subcountOut.supplier?.nama_suplier || '', 70, 59);

    doc.setFont('helvetica', 'bold');
    doc.text('Admin Produksi', 15, 66);
    doc.text(':', 65, 66);
    doc.setFont('helvetica', 'normal');
    doc.text(subcountOut.admin_produksi || '', 70, 66);

    doc.setFont('helvetica', 'bold');
    doc.text('Supervisor / Forman', 15, 73);
    doc.text(':', 65, 73);
    doc.setFont('helvetica', 'normal');
    doc.text(subcountOut.supervisor || '', 70, 73);

    doc.setFont('helvetica', 'bold');
    doc.text('Admin Mainstore', 15, 80);
    doc.text(':', 65, 80);
    doc.setFont('helvetica', 'normal');
    doc.text(subcountOut.admin_mainstore || '', 70, 80);

    doc.setFont('helvetica', 'bold');
    doc.text('Keterangan', 15, 87);
    doc.text(':', 65, 87);
    doc.setFont('helvetica', 'normal');
    doc.text(subcountOut.keterangan || '-', 70, 87);

    // Header tabel "DATA ITEMS SUBCONT OUT"
    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.rect(10, 90, pageWidth - 20, 10);
    doc.text('DATA ITEMS SUBCONT OUT', pageWidth / 2, 96, { align: 'center' });

    // Isi tabel item menggunakan autoTable
    const tableColumns = [
        { header: 'No', dataKey: 'no' },
        { header: 'No.SPK | Nama Produk', dataKey: 'product' },
        { header: 'Qty', dataKey: 'qty' },
        { header: 'Catatan Item', dataKey: 'catatan' },
    ];

    const tableRows =
        subcountOut.subcount_out_items?.map((item, index) => {
            return {
                no: (index + 1).toString(),
                product: `${item.kartu_instruksi_kerja?.no_kartu_instruksi_kerja || ''} - ${item.kartu_instruksi_kerja?.sales_order?.finish_good_item?.nama_barang || ''}`,
                qty: `${item.qty} ${item.unit?.nama_satuan || ''}`,
                catatan: item.keterangan || '-',
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
            product: { cellWidth: 80 },
            qty: { cellWidth: 30, halign: 'right' },
            catatan: { cellWidth: 'auto' },
        },
    });

    // Ambil posisi Y setelah tabel
    const tableEndY = (doc as any).lastAutoTable.finalY + 20;

    // Tanda tangan
    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text('Pengirim,', 50, tableEndY, { align: 'center' });
    doc.text('Penerima,', pageWidth - 50, tableEndY, { align: 'center' });

    // Tempat tanda tangan
    doc.text('( ..................................... )', 50, tableEndY + 30, { align: 'center' });
    doc.text('( ..................................... )', pageWidth - 50, tableEndY + 30, { align: 'center' });

    // Output PDF
    if (download) {
        doc.save(`${subcountOut.no_subcount_out}.pdf`);
    } else {
        window.open(doc.output('bloburl'), '_blank');
    }
};

const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus Subcount Out ini?')) {
        router.delete(`/subcountOuts/${id}`, {
            onSuccess: () => {
                toast.success('Subcount Out berhasil dihapus');
            },
            onError: () => {
                toast.error('Gagal menghapus Subcount Out');
            },
        });
    }
};

export const columns = (): ColumnDef<SubcountOut>[] => [
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
        accessorKey: 'no_subcount_out',
        header: 'No. Surat Jalan Subcont',
    },
    {
        accessorKey: 'tgl_subcount_out',
        header: 'Tanggal',
        cell: ({ row }) => {
            const data = row.original;
            return <span>{data.tgl_subcount_out ? format(new Date(data.tgl_subcount_out), 'dd-MM-yyyy') : '-'}</span>;
        },
    },
    {
        accessorKey: 'supplier.nama_suplier',
        header: 'Supplier',
        cell: ({ row }) => {
            const data = row.original;
            return <span>{data.supplier?.nama_suplier || '-'}</span>;
        },
    },
    {
        accessorKey: 'admin_produksi',
        header: 'Admin Produksi',
    },
    {
        id: 'total_items',
        header: 'Total Items Subcount Out',
        cell: ({ row }) => {
            const data = row.original;
            const totalItems = data.subcount_out_items?.length || 0;
            return <span>{totalItems}</span>;
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const item = row.original;

            const handlePreviewPdf = async () => {
                try {
                    const response = await fetch(`/subcountOuts/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    generateSubcountOutPdf(data, false);
                } catch (error) {
                    console.error('Error generating PDF:', error);
                    toast.error('Gagal menghasilkan PDF. Silakan coba lagi.');
                }
            };

            const handleDownloadPdf = async () => {
                try {
                    const response = await fetch(`/subcountOuts/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    generateSubcountOutPdf(data, true);
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
                        <DropdownMenuItem onClick={() => router.get(`/subcountOuts/${item.id}`)}>Detail</DropdownMenuItem>
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
