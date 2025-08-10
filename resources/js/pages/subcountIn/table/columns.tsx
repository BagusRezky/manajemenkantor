/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SubcountIn } from '@/types/subcountIn';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, FileText, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

// Function untuk generate PDF subcount in
const generateSubcountInPdf = (subcountIn: SubcountIn, download = false): void => {
    // Inisialisasi dokumen PDF
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
    doc.text('Jurangpelem Satu, Bulusari, Kec. Gempol, Pasuruan,', 15, 23);
    doc.text('Jawa Timur 67155', 15, 28);
    doc.text('Email: indigama.khatulistiwa01@gmail.com', 15, 33);
    doc.text('Telp: 081703101012', 15, 38);

    // Title
    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('LAPORAN SUBCOUNT IN', pageWidth - 15, 18, { align: 'right' });

    // Informasi subcount in
    doc.setLineWidth(0.5);
    doc.rect(10, 45, pageWidth - 20, 45);

    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.text('No. Subcount In', 15, 52);
    doc.text(':', 65, 52);
    doc.setFont('helvetica', 'normal');
    doc.text(subcountIn.no_subcount_in || '', 70, 52);

    doc.setFont('helvetica', 'bold');
    doc.text('Tanggal', pageWidth - 85, 52);
    doc.text(':', pageWidth - 50, 52);
    doc.setFont('helvetica', 'normal');
    const formattedDate = subcountIn.tgl_subcount_in ? format(new Date(subcountIn.tgl_subcount_in), 'dd-MM-yyyy') : '';
    doc.text(formattedDate, pageWidth - 45, 52);

    doc.setFont('helvetica', 'bold');
    doc.text('No. Surat Jalan', 15, 59);
    doc.text(':', 65, 59);
    doc.setFont('helvetica', 'normal');
    doc.text(subcountIn.no_surat_jalan_pengiriman || '', 70, 59);

    doc.setFont('helvetica', 'bold');
    doc.text('Admin Produksi', 15, 66);
    doc.text(':', 65, 66);
    doc.setFont('helvetica', 'normal');
    doc.text(subcountIn.admin_produksi || '', 70, 66);

    doc.setFont('helvetica', 'bold');
    doc.text('Supervisor', 15, 73);
    doc.text(':', 65, 73);
    doc.setFont('helvetica', 'normal');
    doc.text(subcountIn.supervisor || '', 70, 73);

    doc.setFont('helvetica', 'bold');
    doc.text('Admin Mainstore', 15, 80);
    doc.text(':', 65, 80);
    doc.setFont('helvetica', 'normal');
    doc.text(subcountIn.admin_mainstore || '', 70, 80);

    doc.setFont('helvetica', 'bold');
    doc.text('Keterangan', 15, 87);
    doc.text(':', 65, 87);
    doc.setFont('helvetica', 'normal');
    doc.text(subcountIn.keterangan || '-', 70, 87);

    // Header tabel "DATA ITEM"
    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.rect(10, 90, pageWidth - 20, 10);
    doc.text('DATA ITEM', pageWidth / 2, 96, { align: 'center' });

    // Isi tabel item menggunakan autoTable
    const tableColumns = [
        { header: 'No', dataKey: 'no' },
        { header: 'No. Subcount Out', dataKey: 'no_subcount_out' },
        { header: 'No. SPK', dataKey: 'no_spk' },
        { header: 'Qty', dataKey: 'qty' },
        { header: 'Keterangan', dataKey: 'keterangan' },
    ];

    const tableRows =
        subcountIn.subcount_in_items?.map((item, index) => {
            return {
                no: (index + 1).toString(),
                no_subcount_out: item.subcount_out?.no_subcount_out || '-',
                no_spk:
                    item.subcount_out?.subcount_out_items?.map((outItem) => outItem.kartu_instruksi_kerja?.no_kartu_instruksi_kerja).join(', ') ||
                    '-',
                qty: item.qty.toString(),
                keterangan: item.keterangan || '-',
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
            no_subcount_out: { cellWidth: 35 },
            no_spk: { cellWidth: 40 },
            qty: { cellWidth: 20, halign: 'right' },
            keterangan: { cellWidth: 'auto' },
        },
    });

    // Ambil posisi Y setelah tabel
    const tableEndY = (doc as any).lastAutoTable.finalY + 20;

    // Tanda tangan
    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text('Admin Produksi,', 40, tableEndY, { align: 'center' });
    doc.text('Supervisor,', 100, tableEndY, { align: 'center' });
    doc.text('Admin Mainstore,', pageWidth - 40, tableEndY, { align: 'center' });

    // Tempat tanda tangan
    doc.text('( ............................. )', 40, tableEndY + 30, { align: 'center' });
    doc.text('( ............................. )', 100, tableEndY + 30, { align: 'center' });
    doc.text('( ............................. )', pageWidth - 40, tableEndY + 30, { align: 'center' });

    // Output PDF
    if (download) {
        doc.save(`${subcountIn.no_subcount_in}.pdf`);
    } else {
        window.open(doc.output('bloburl'), '_blank');
    }
};

const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus Subcount In ini?')) {
        router.delete(`/subcountIns/${id}`, {
            onSuccess: () => {
                toast.success('Subcount In berhasil dihapus');
            },
            onError: () => {
                toast.error('Gagal menghapus Subcount In');
            },
        });
    }
};

export const columns = (): ColumnDef<SubcountIn>[] => [
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
        accessorKey: 'no_subcount_in',
        header: 'No. Subcount In',
    },
    {
        accessorKey: 'tgl_subcount_in',
        header: 'Tanggal',
        cell: ({ row }) => {
            const data = row.original;
            return <span>{format(new Date(data.tgl_subcount_in), 'dd-MM-yyyy')}</span>;
        },
    },
    {
        accessorKey: 'no_surat_jalan_pengiriman',
        header: 'No. Surat Jalan',
    },
    {
        accessorKey: 'admin_produksi',
        header: 'Admin Produksi',
    },
    {
        accessorKey: 'supervisor',
        header: 'Supervisor',
    },
    {
        accessorKey: 'admin_mainstore',
        header: 'Admin Mainstore',
    },
    {
        id: 'total_items',
        header: 'Total Items',
        cell: ({ row }) => {
            const data = row.original;
            return <span>{data.subcount_in_items?.length || 0} items</span>;
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const item = row.original;

            const handlePreviewPdf = async () => {
                try {
                    // Fetch data lengkap subcount in beserta relasinya
                    const response = await fetch(`/subcountIns/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    // Generate dan tampilkan PDF
                    generateSubcountInPdf(data, false);
                } catch (error) {
                    console.error('Error generating PDF:', error);
                    toast.error('Gagal menghasilkan PDF. Silakan coba lagi.');
                }
            };

            const handleDownloadPdf = async () => {
                try {
                    // Fetch data lengkap subcount in beserta relasinya
                    const response = await fetch(`/subcountIns/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    // Generate dan download PDF
                    generateSubcountInPdf(data, true);
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
                        <DropdownMenuItem onClick={() => router.get(`/subcountIns/${item.id}`)}>Detail</DropdownMenuItem>
                        {/* <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.get(`/subcountIns/${item.id}/edit`)}>Edit</DropdownMenuItem> */}
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
