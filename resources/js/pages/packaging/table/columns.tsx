/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Packaging } from '@/types/packaging';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, Edit, Eye, FileText, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

// Function untuk generate PDF packaging
const generatePackagingPdf = (packaging: Packaging, download = false): void => {
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
    doc.text('LAPORAN PACKAGING', pageWidth - 15, 18, { align: 'right' });

    // Informasi packaging
    doc.setLineWidth(0.5);
    doc.rect(10, 45, pageWidth - 20, 60);

    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.text('Kode Packaging', 15, 52);
    doc.text(':', 65, 52);
    doc.setFont('helvetica', 'normal');
    doc.text(packaging.kode_packaging || '', 70, 52);

    doc.setFont('helvetica', 'bold');
    doc.text('Kartu Instruksi Kerja', 15, 59);
    doc.text(':', 65, 59);
    doc.setFont('helvetica', 'normal');
    doc.text(packaging.kartu_instruksi_kerja?.no_kartu_instruksi_kerja || '', 70, 59);

    doc.setFont('helvetica', 'bold');
    doc.text('Satuan Transfer', 15, 66);
    doc.text(':', 65, 66);
    doc.setFont('helvetica', 'normal');
    doc.text(packaging.satuan_transfer || '', 70, 66);

    doc.setFont('helvetica', 'bold');
    doc.text('Jenis Transfer', 15, 73);
    doc.text(':', 65, 73);
    doc.setFont('helvetica', 'normal');
    doc.text(packaging.jenis_transfer || '', 70, 73);

    doc.setFont('helvetica', 'bold');
    doc.text('Tanggal Transfer', 15, 80);
    doc.text(':', 65, 80);
    doc.setFont('helvetica', 'normal');
    const formattedDate = packaging.tgl_transfer ? format(new Date(packaging.tgl_transfer), 'dd-MM-yyyy') : '';
    doc.text(formattedDate, 70, 80);

    // Ringkasan
    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.rect(10, 110, pageWidth - 20, 10);
    doc.text('RINGKASAN', pageWidth / 2, 116, { align: 'center' });

    // Tabel ringkasan
    const tableColumns = [
        { header: 'Keterangan', dataKey: 'keterangan' },
        { header: 'Jumlah', dataKey: 'jumlah' },
        { header: 'Qty', dataKey: 'qty' },
        { header: 'Total', dataKey: 'total' },
    ];

    const totalPenuh = packaging.jumlah_satuan_penuh * packaging.qty_persatuan_penuh;
    const totalSisa = packaging.jumlah_satuan_sisa * packaging.qty_persatuan_sisa;
    const grandTotal = totalPenuh + totalSisa;

    const tableRows = [
        {
            keterangan: 'Satuan Penuh',
            jumlah: packaging.jumlah_satuan_penuh.toString(),
            qty: packaging.qty_persatuan_penuh.toString(),
            total: totalPenuh.toString(),
        },
        {
            keterangan: 'Satuan Sisa',
            jumlah: packaging.jumlah_satuan_sisa.toString(),
            qty: packaging.qty_persatuan_sisa.toString(),
            total: totalSisa.toString(),
        },
        {
            keterangan: 'TOTAL',
            jumlah: '',
            qty: '',
            total: grandTotal.toString(),
        },
    ];

    autoTable(doc, {
        columns: tableColumns,
        body: tableRows,
        startY: 120,
        margin: { left: 10, right: 10 },
        styles: { fontSize: 9 },
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.5 },
        bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.5 },
        columnStyles: {
            keterangan: { cellWidth: 60 },
            jumlah: { cellWidth: 40, halign: 'right' },
            qty: { cellWidth: 40, halign: 'right' },
            total: { cellWidth: 40, halign: 'right' },
        },
    });

    // Ambil posisi Y setelah tabel
    const tableEndY = (doc as any).lastAutoTable.finalY + 20;

    // Tanda tangan
    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text('Dibuat oleh,', 50, tableEndY, { align: 'center' });
    doc.text('Disetujui oleh,', pageWidth - 50, tableEndY, { align: 'center' });

    // Tempat tanda tangan
    doc.text('( ..................................... )', 50, tableEndY + 30, { align: 'center' });
    doc.text('( ..................................... )', pageWidth - 50, tableEndY + 30, { align: 'center' });

    // Output PDF
    if (download) {
        doc.save(`${packaging.kode_packaging}.pdf`);
    } else {
        window.open(doc.output('bloburl'), '_blank');
    }
};

const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus Packaging ini?')) {
        router.delete(`/packagings/${id}`, {
            onSuccess: () => {
                toast.success('Packaging berhasil dihapus');
            },
            onError: () => {
                toast.error('Gagal menghapus Packaging');
            },
        });
    }
};

export const columns = (): ColumnDef<Packaging>[] => [
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
        accessorKey: 'kode_packaging',
        header: 'Kode Packaging',
    },
    {
        accessorKey: 'kartu_instruksi_kerja.nama_kartu',
        header: 'Kartu Instruksi Kerja',
        cell: ({ row }) => {
            const data = row.original;
            return <span>{data.kartu_instruksi_kerja?.no_kartu_instruksi_kerja || '-'}</span>;
        },
    },
    {
        accessorKey: 'satuan_transfer',
        header: 'Satuan Transfer',
    },
    {
        accessorKey: 'jenis_transfer',
        header: 'Jenis Transfer',
    },
    {
        accessorKey: 'tgl_transfer',
        header: 'Tanggal Transfer',
        cell: ({ row }) => {
            const data = row.original;
            return <span>{data.tgl_transfer ? format(new Date(data.tgl_transfer), 'dd-MM-yyyy') : '-'}</span>;
        },
    },
    {
        accessorKey: 'jumlah_satuan_penuh',
        header: 'Jml Satuan Penuh',
        cell: ({ row }) => {
            const data = row.original;
            return <span className="text-right">{data.jumlah_satuan_penuh}</span>;
        },
    },
    {
        accessorKey: 'qty_persatuan_penuh',
        header: 'Qty Per Satuan Penuh',
        cell: ({ row }) => {
            const data = row.original;
            return <span className="text-right">{data.qty_persatuan_penuh}</span>;
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const item = row.original;

            const handlePreviewPdf = async () => {
                try {
                    // Fetch data lengkap packaging beserta relasinya
                    const response = await fetch(`/packagings/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    // Generate dan tampilkan PDF
                    generatePackagingPdf(data, false);
                } catch (error) {
                    console.error('Error generating PDF:', error);
                    toast.error('Gagal menghasilkan PDF. Silakan coba lagi.');
                }
            };

            const handleDownloadPdf = async () => {
                try {
                    // Fetch data lengkap packaging beserta relasinya
                    const response = await fetch(`/packagings/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    // Generate dan download PDF
                    generatePackagingPdf(data, true);
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
                        <DropdownMenuItem onClick={() => router.get(`/packagings/${item.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Detail
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.get(`/packagings/${item.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
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
