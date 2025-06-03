/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox } from "@/components/ui/checkbox";
import { router } from "@inertiajs/react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { Download, FileText, MoreHorizontal } from "lucide-react";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PurchaseRequest } from "@/types/purchaseRequest";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { format } from "date-fns";

const generatePurchaseRequestPdf = (purchaseRequest: PurchaseRequest, download = false): void => {
    // Inisialisasi dokumen PDF
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(230, 240, 255);
    doc.roundedRect(pageWidth - 73, 12, 61, 16, 2, 2, 'F');

    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('PURCHASE REQUEST', pageWidth - 15, 18, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.text(purchaseRequest.no_pr || '', pageWidth - 15, 25, { align: 'right' });

    // Tambahkan header dengan border
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

    // Informasi Purchase Request
    doc.setLineWidth(0.5);
    doc.rect(10, 45, pageWidth - 20, 25);

    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.text('Tanggal PR', 15, 52);
    doc.text(':', 65, 52);
    doc.setFont('helvetica', 'normal');
    const formattedPRDate = purchaseRequest.tgl_pr ? format(new Date(purchaseRequest.tgl_pr), 'dd-MM-yyyy') : '';
    doc.text(formattedPRDate, 70, 52);

    doc.setFont('helvetica', 'bold');
    doc.text('Departemen', 15, 59);
    doc.text(':', 65, 59);
    doc.setFont('helvetica', 'normal');
    doc.text(purchaseRequest.departemen?.nama_departemen || '', 70, 59);

    doc.setFont('helvetica', 'bold');
    doc.text('Status', 15, 66);
    doc.text(':', 65, 66);
    doc.setFont('helvetica', 'normal');
    doc.text(purchaseRequest.status || '', 70, 66);

    // Header tabel "DATA ITEM"
    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.rect(10, 75, pageWidth - 20, 10);
    doc.text('DATA ITEM', pageWidth / 2, 81, { align: 'center' });

    // Isi tabel item menggunakan autoTable
    const tableColumns = [
        { header: 'No', dataKey: 'no' },
        { header: 'Item', dataKey: 'item' },
        { header: 'Qty', dataKey: 'qty' },
        { header: 'Satuan', dataKey: 'satuan' },
        { header: 'ETA', dataKey: 'eta' },
        { header: 'Catatan', dataKey: 'catatan' },
    ];

    const tableRows =
        purchaseRequest.purchase_request_items?.map((item, index) => {
            return {
                no: (index + 1).toString(),
                item: item.master_item ? `(${item.master_item.kode_master_item}) ${item.master_item.nama_master_item}` : '',
                qty: item.qty || 0,
                satuan: item.master_item?.unit?.nama_satuan || '-',
                eta: item.eta ? format(new Date(item.eta), 'dd-MM-yyyy') : '-',
                catatan: item.catatan || '-',
            };
        }) || [];

    autoTable(doc, {
        columns: tableColumns,
        body: tableRows,
        startY: 84,
        margin: { left: 10, right: 10 },
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [40, 88, 247], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.5 },
        bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.5 },
        columnStyles: {
            no: { cellWidth: 10, halign: 'center' },
            item: { cellWidth: 65 },
            qty: { cellWidth: 20, halign: 'center' },
            satuan: { cellWidth: 25, halign: 'center' },
            eta: { cellWidth: 25, halign: 'center' },
            catatan: { cellWidth: 45 },
        },
    });

    // Ambil posisi Y setelah tabel
    const tableEndY = (doc as any).lastAutoTable.finalY;

    // Tanda tangan
    const currentY = tableEndY + 35;
    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text('Dibuat Oleh,', 50, currentY, { align: 'center' });
    doc.text('Disetujui Oleh,', pageWidth - 50, currentY, { align: 'center' });

    // Tempat tanda tangan
    doc.text('( ..................................... )', 50, currentY + 30, { align: 'center' });
    doc.text('( ..................................... )', pageWidth - 50, currentY + 30, { align: 'center' });

    // Output PDF
    if (download) {
        doc.save(`PR_${purchaseRequest.no_pr}.pdf`);
    } else {
        window.open(doc.output('bloburl'), '_blank');
    }
};

const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus Purchase Request ini?')) {
        router.delete(`/purchaseRequest/${id}`, {
            onSuccess: () => {
                toast.success('Purchase Request berhasil dihapus');
            },
            onError: () => {
                toast.error('Gagal menghapus Purchase Request');
            },
        });
    }
};

const handleAuthorize = (id: string) => {
    if (confirm('Apakah Anda yakin ingin mengotorisasi Purchase Request ini?')) {
        router.post(
            `/purchaseRequest/${id}/authorize`,
            {},
            {
                onSuccess: () => {
                    toast.success('Purchase Request berhasil diotorisasi');
                },
                onError: () => {
                    toast.error('Gagal mengotorisasi Purchase Request');
                },
            },
        );
    }
};

export const columns = (): ColumnDef<PurchaseRequest>[] => [
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
        accessorKey: 'no_pr',
        header: 'No. PR',
    },
    {
        accessorKey: 'departemen.nama_departemen',
        header: 'Departemen',
        cell: ({ row }) => row.original.departemen?.nama_departemen || '-',
    },
    {
        accessorKey: 'tgl_pr',
        header: 'Tanggal PR',
        cell: ({ row }) => {
            const date = row.original.tgl_pr;
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
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.original.status;

            // Apply styling based on status
            if (status === 'Otorisasi') {
                return <span className="rounded-md bg-green-100 px-2 py-1 text-green-800">{status}</span>;
            } else {
                return <span className="rounded-md bg-red-200 px-2 py-1 text-red-800">{status}</span>;
            }
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const item = row.original;

            const handlePreviewPdf = async () => {
                try {
                    // Fetch data lengkap purchase request beserta relasinya
                    const response = await fetch(`/purchaseRequest/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    // Generate dan tampilkan PDF
                    generatePurchaseRequestPdf(data, false);
                } catch (error) {
                    console.error('Error generating PDF:', error);
                    toast.error('Gagal menghasilkan PDF. Silakan coba lagi.');
                }
            };

            const handleDownloadPdf = async () => {
                try {
                    // Fetch data lengkap purchase request beserta relasinya
                    const response = await fetch(`/purchaseRequest/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    // Generate dan download PDF
                    generatePurchaseRequestPdf(data, true);
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
                        <DropdownMenuItem onClick={() => handleDelete(item.id)}>Delete</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.get(`/purchaseRequest/${item.id}/edit`)}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.get(`/purchaseRequest/${item.id}/detail`)}>Detail</DropdownMenuItem>
                        {item.status === 'Deotorisasi' && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleAuthorize(item.id)}>Otorisasi</DropdownMenuItem>
                            </>
                        )}
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
