/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PurchaseOrder } from '@/types/purchaseOrder';
import { formatRupiah } from '@/utils/formatter/currency';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, FileText, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

// Function untuk generate PDF penerimaan barang
const generatePurchaseOrderPdf = (purchaseOrder: PurchaseOrder, download = false): void => {
    // Inisialisasi dokumen PDF
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('PURCHASE ORDER', pageWidth - 15, 18, { align: 'right' });
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

    // Informasi Purchase Order
    doc.setLineWidth(0.5);
    doc.rect(10, 45, pageWidth - 20, 45);

    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.text('Supplier', 15, 52);
    doc.text(':', 65, 52);
    doc.setFont('helvetica', 'normal');
    doc.text(purchaseOrder.supplier?.nama_suplier || '', 70, 52);

    doc.setFont('helvetica', 'bold');
    doc.text('Alamat', 15, 59);
    doc.text(':', 65, 59);
    doc.setFont('helvetica', 'normal');
    doc.text(purchaseOrder.supplier?.alamat_lengkap || '', 70, 59);

    doc.setFont('helvetica', 'bold');
    doc.text('No. PO', 15, 66);
    doc.text(':', 65, 66);
    doc.setFont('helvetica', 'normal');
    doc.text(purchaseOrder.no_po || '', 70, 66);

    doc.setFont('helvetica', 'bold');
    doc.text('Tanggal PO', 15, 73);
    doc.text(':', 65, 73);
    doc.setFont('helvetica', 'normal');
    const formattedPODate = purchaseOrder.tanggal_po ? format(new Date(purchaseOrder.tanggal_po), 'dd-MM-yyyy') : '';
    doc.text(formattedPODate, 70, 73);

    doc.setFont('helvetica', 'bold');
    doc.text('Mata Uang', 15, 80);
    doc.text(':', 65, 80);
    doc.setFont('helvetica', 'normal');
    doc.text(purchaseOrder.mata_uang || '', 70, 80);

    // Header tabel "DATA ITEM"
    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.rect(10, 95, pageWidth - 20, 10);
    doc.text('DATA ITEM', pageWidth / 2, 101, { align: 'center' });

    // Isi tabel item menggunakan autoTable
    const tableColumns = [
        { header: 'No', dataKey: 'no' },
        { header: 'Deskripsi', dataKey: 'item' },
        { header: 'Qty', dataKey: 'qty' },
        { header: 'Satuan', dataKey: 'satuan' },
        { header: 'Harga', dataKey: 'hsatuan' },
        { header: 'Disc', dataKey: 'diskon' },
        { header: 'Total', dataKey: 'jumlah' },
    ];

    const tableRows =
        purchaseOrder.items?.map((item, index) => {
            return {
                no: (index + 1).toString(),
                item: `${item.master_item?.nama_master_item || ''}`,
                qty: item.qty_po || 0,
                satuan: item.satuan?.nama_satuan || '-',
                hsatuan: formatRupiah(item.harga_satuan || 0),
                diskon: item.diskon_satuan,
                jumlah: formatRupiah(item.jumlah || 0),
            };
        }) || [];

    // Hitung total bruto (sum dari semua jumlah item)
    const totalBruto = purchaseOrder.items?.reduce((sum, item) => sum + (item.jumlah || 0), 0) || 0;

    // Hitung PPN (total bruto × nilai ppn)
    const ppnRate = purchaseOrder.ppn || 0;
    const ppnAmount = (totalBruto * ppnRate) / 100;

    // Hitung total bayar (total bruto + ppn)
    const totalBayar = totalBruto + ppnAmount;

    autoTable(doc, {
        columns: tableColumns,
        body: tableRows,
        startY: 105,
        margin: { left: 10, right: 10 },
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.5 },
        bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.5 },
        columnStyles: {
            no: { cellWidth: 10, halign: 'center' },
            item: { cellWidth: 50 },
            qty: { cellWidth: 15, halign: 'center' },
            satuan: { cellWidth: 25, halign: 'center' },
            hsatuan: { cellWidth: 30, halign: 'right' },
            diskon: { cellWidth: 25, halign: 'right' },
            jumlah: { cellWidth: 25, halign: 'right' },
        },
    });

    // Ambil posisi Y setelah tabel
    const tableEndY = (doc as any).lastAutoTable.finalY;

    // Tambahkan total section di kanan bawah
    const totalWidth = 80;
    const totalStartX = pageWidth - 10 - totalWidth;
    let currentY = tableEndY + 10;

    // Total Bruto
    doc.setFontSize(9).setFont('helvetica', 'bold');
    doc.text('Total', totalStartX + 5, currentY);
    doc.text(formatRupiah(totalBruto), pageWidth - 15, currentY, { align: 'right' });
    doc.setLineWidth(0.1);
    doc.line(totalStartX, currentY + 2, totalStartX + totalWidth, currentY + 2);
    currentY += 7;

    // PPN
    doc.text('PPN', totalStartX + 5, currentY);
    doc.text(formatRupiah(ppnAmount), pageWidth - 15, currentY, { align: 'right' });
    doc.line(totalStartX, currentY + 2, totalStartX + totalWidth, currentY + 2);
    currentY += 7;

    // Total Bayar
    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.text('Total Bayar', totalStartX + 5, currentY);
    doc.text(formatRupiah(totalBayar), pageWidth - 15, currentY, { align: 'right' });
    doc.line(totalStartX, currentY + 2, totalStartX + totalWidth, currentY + 2);

    // Tanda tangan
    currentY = tableEndY + 35;
    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text('Dibuat Oleh,', 50, currentY, { align: 'center' });
    doc.text('Disetujui Oleh,', pageWidth - 50, currentY, { align: 'center' });

    // Tempat tanda tangan
    doc.text('( ..................................... )', 50, currentY + 30, { align: 'center' });
    doc.text('( ..................................... )', pageWidth - 50, currentY + 30, { align: 'center' });

    // Output PDF
    if (download) {
        doc.save(`PO_${purchaseOrder.no_po}.pdf`);
    } else {
        window.open(doc.output('bloburl'), '_blank');
    }
};

const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus Purchase Order ini?')) {
        router.delete(`/purchaseOrders/${id}`, {
            onSuccess: () => {
                toast.success('Purchase Order berhasil dihapus');
            },
            onError: () => {
                toast.error('Gagal menghapus Purchase Order');
            },
        });
    }
};

export const columns = (): ColumnDef<PurchaseOrder>[] => [
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
        accessorKey: 'no_po',
        header: 'NO. PO',
    },
    {
        accessorKey: 'purchase_request.no_pr',
        header: 'No. PR',
    },
    {
        accessorKey: 'tanggal_po',
        header: 'Tanggal PO',
        cell: ({ row }) => {
            const purchaseOrder = row.original;
            return <span>{new Date(purchaseOrder.tanggal_po).toLocaleDateString() || purchaseOrder.tanggal_po || '-'}</span>;
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const purchaseOrder = row.original;
            const handlePreviewPdf = async () => {
                try {
                    // Fetch data lengkap penerimaan barang beserta relasinya
                    const response = await fetch(`/purchaseOrders/${purchaseOrder.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    // Generate dan tampilkan PDF
                    generatePurchaseOrderPdf(data, false);
                } catch (error) {
                    console.error('Error generating PDF:', error);
                    toast.error('Gagal menghasilkan PDF. Silakan coba lagi.');
                }
            };

            const handleDownloadPdf = async () => {
                try {
                    // Fetch data lengkap penerimaan barang beserta relasinya
                    const response = await fetch(`/purchaseOrders/${purchaseOrder.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    // Generate dan download PDF
                    generatePurchaseOrderPdf(data, true);
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
                        <DropdownMenuItem onClick={() => router.get(`/purchaseOrders/${purchaseOrder.id}`)}>Detail</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.get(`/purchaseOrders/${purchaseOrder.id}/edit`)}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(purchaseOrder.id)}>Delete</DropdownMenuItem>
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
