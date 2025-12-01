/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { ImrDiemaking } from '@/types/imrDiemaking';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CheckCircle, Download, FileText, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

// Function untuk generate PDF IMR
const generateImrPdf = (imr: ImrDiemaking, download = false): void => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header dengan border
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, pageWidth - 20, 30);

    // Company Info
    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('CV. Indigama Khatulistiwa', 15, 18);
    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text('Dsn. Blimbing RT 02 RW 11, Ds. Bulusari, Kec. Gempol, Pasuruan,', 15, 23);
    doc.text('Jawa Timur 67155', 15, 28);
    doc.text('Email: indigama.khatulistiwa01@gmail.com', 15, 33);
    doc.text('Telp: 081703101012', 15, 38);

    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('INTERNAL MATERIAL REQUEST', pageWidth - 15, 18, { align: 'right' });

    // Informasi IMR
    doc.setLineWidth(0.5);
    doc.rect(10, 45, pageWidth - 20, 40);

    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.text('No. IMR', 15, 52);
    doc.text(':', 60, 52);
    doc.setFont('helvetica', 'normal');
    doc.text(imr.no_imr_diemaking || '', 65, 52);

    doc.setFont('helvetica', 'bold');
    doc.text('No. SPK', pageWidth - 85, 52);
    doc.text(':', pageWidth - 50, 52);
    doc.setFont('helvetica', 'normal');
    doc.text(imr.kartu_instruksi_kerja?.no_kartu_instruksi_kerja || '', pageWidth - 45, 52);

    doc.setFont('helvetica', 'bold');
    doc.text('Tgl Request', 15, 59);
    doc.text(':', 60, 59);
    doc.setFont('helvetica', 'normal');
    const formattedDate = imr.tgl_request ? new Date(imr.tgl_request).toLocaleDateString('id-ID') : '';
    doc.text(formattedDate, 65, 59);

    doc.setFont('helvetica', 'bold');
    doc.text('Status', 15, 66);
    doc.text(':', 60, 66);
    doc.setFont('helvetica', 'normal');
    doc.text(imr.status.toUpperCase(), 65, 66);

    doc.setFont('helvetica', 'bold');
    doc.text('Sales Order', 15, 73);
    doc.text(':', 60, 73);
    doc.setFont('helvetica', 'normal');
    doc.text(imr.kartu_instruksi_kerja?.sales_order?.no_bon_pesanan || '', 65, 73);

    doc.setFont('helvetica', 'bold');
    doc.text('Production Plan', 15, 80);
    doc.text(':', 60, 80);
    doc.setFont('helvetica', 'normal');
    doc.text(imr.kartu_instruksi_kerja?.production_plan || '', 65, 80);

    // Header tabel items
    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.rect(10, 85, pageWidth - 20, 10);
    doc.text('MATERIAL ITEMS', pageWidth / 2, 91, { align: 'center' });

    // Isi tabel item menggunakan autoTable
    const tableColumns = [
        { header: 'No', dataKey: 'no' },
        { header: 'Material Item', dataKey: 'item' },
        { header: 'Total Kebutuhan', dataKey: 'total_kebutuhan' },
        { header: 'Qty Request', dataKey: 'qty_request' },
        { header: 'Qty Approved', dataKey: 'qty_approved' },
    ];

    const tableRows =
        imr.items?.map((item, index) => {
            return {
                no: (index + 1).toString(),
                item: `${item.kartu_instruksi_kerja_bom?.bill_of_materials?.master_item?.kode_master_item || ''} - ${item.kartu_instruksi_kerja_bom?.bill_of_materials?.master_item?.nama_master_item || ''}`,
                total_kebutuhan: item.kartu_instruksi_kerja_bom?.total_kebutuhan?.toString() || '0',
                qty_request: item.qty_request.toString(),
                qty_approved: item.qty_approved.toString(),
            };
        }) || [];

    autoTable(doc, {
        columns: tableColumns,
        body: tableRows,
        startY: 95,
        margin: { left: 10, right: 10 },
        styles: { fontSize: 9 },
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.5 },
        bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.5 },
        columnStyles: {
            no: { cellWidth: 10 },
            item: { cellWidth: 70 },
            total_kebutuhan: { cellWidth: 30, halign: 'right' },
            qty_request: { cellWidth: 25, halign: 'right' },
            qty_approved: { cellWidth: 25, halign: 'right' },
        },
    });

    // Ambil posisi Y setelah tabel
    const tableEndY = (doc as any).lastAutoTable.finalY + 20;

    // Tanda tangan
    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text('Diminta oleh,', 50, tableEndY, { align: 'center' });
    doc.text('Disetujui oleh,', pageWidth - 50, tableEndY, { align: 'center' });

    // Tempat tanda tangan
    doc.text('( ..................................... )', 50, tableEndY + 30, { align: 'center' });
    doc.text('( ..................................... )', pageWidth - 50, tableEndY + 30, { align: 'center' });

    // Output PDF
    if (download) {
        doc.save(`${imr.no_imr_diemaking}.pdf`);
    } else {
        window.open(doc.output('bloburl'), '_blank');
    }
};

const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus Internal Material Request ini?')) {
        router.delete(`/imrDiemakings/${id}`, {
            onSuccess: () => {
                toast.success('Internal Material Request berhasil dihapus');
            },
            onError: () => {
                toast.error('Gagal menghapus Internal Material Request');
            },
        });
    }
};

const handleApprove = (id: string) => {
    router.get(
        `/imrDiemakings/${id}/approve`,
        {},
        {
            onSuccess: () => {
                toast.success('Halaman approval berhasil dibuka');
            },
            onError: () => {
                toast.error('Gagal membuka halaman approval');
            },
        },
    );
};

export const columns = (): ColumnDef<ImrDiemaking>[] => [
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
        accessorKey: 'no_imr_diemaking',
        header: 'No. IMR',
    },
    {
        accessorKey: 'kartu_instruksi_kerja.no_kartu_instruksi_kerja',
        header: 'No. SPK',
        cell: ({ row }) => {
            const data = row.original;
            return <span>{data.kartu_instruksi_kerja?.no_kartu_instruksi_kerja || '-'}</span>;
        },
    },
    {
        accessorKey: 'tgl_request',
        header: 'Tgl Request',
        cell: ({ row }) => {
            const data = row.original;
            return <span>{data.tgl_request ? new Date(data.tgl_request).toLocaleDateString('id-ID') : '-'}</span>;
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            const getStatusColor = (status: string) => {
                switch (status) {
                    case 'pending':
                        return 'bg-yellow-100 text-yellow-800';
                    case 'approved':
                        return 'bg-green-100 text-green-800';
                    case 'rejected':
                        return 'bg-red-100 text-red-800';
                    default:
                        return 'bg-gray-100 text-gray-800';
                }
            };
            return <Badge className={getStatusColor(status)}>{status.toUpperCase()}</Badge>;
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const item = row.original;

            const handlePreviewPdf = async () => {
                try {
                    const response = await fetch(`/imrDiemakings/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    generateImrPdf(data, false);
                } catch (error) {
                    console.error('Error generating PDF:', error);
                    toast.error('Gagal menghasilkan PDF. Silakan coba lagi.');
                }
            };

            const handleDownloadPdf = async () => {
                try {
                    const response = await fetch(`/imrDiemakings/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    generateImrPdf(data, true);
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
                        <DropdownMenuItem onClick={() => router.get(`/imrDiemakings/${item.id}`)}>Detail</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {/* <DropdownMenuItem onClick={() => router.get(`/imrDiemakings/${item.id}/edit`)}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator /> */}
                        {item.status === 'pending' && (
                            <>
                                <DropdownMenuItem onClick={() => handleApprove(item.id)}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Approval
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                            </>
                        )}
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
