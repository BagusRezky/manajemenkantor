/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SalesOrder } from '@/types/salesOrder';

import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, FileText, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

const generateSalesOrderPdf = (salesOrder: SalesOrder, download = false): void => {
    // Inisialisasi dokumen PDF
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    // Background biru muda untuk header SALES ORDER
    doc.setFillColor(230, 240, 255);
    doc.roundedRect(pageWidth - 70, 12, 57, 20, 2, 2, 'F');

    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('SALES ORDER', pageWidth - 15, 18, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.text(salesOrder.no_bon_pesanan || '', pageWidth - 15, 25, { align: 'right' });

    // Tambahkan header dengan border
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

    // Informasi Sales Order
    doc.setLineWidth(0.5);
    doc.rect(10, 45, pageWidth - 20, 50);

    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.text('Customer', 15, 52);
    doc.text(':', 65, 52);
    doc.setFont('helvetica', 'normal');
    doc.text(salesOrder.customer_address?.nama_customer || '', 70, 52);

    doc.setFont('helvetica', 'bold');
    doc.text('No. PO Customer', 15, 59);
    doc.text(':', 65, 59);
    doc.setFont('helvetica', 'normal');
    doc.text(salesOrder.no_po_customer || '', 70, 59);

    doc.setFont('helvetica', 'bold');
    doc.text('Barang', 15, 66);
    doc.text(':', 65, 66);
    doc.setFont('helvetica', 'normal');
    doc.text(salesOrder.finish_good_item?.nama_barang || '', 70, 66);

    doc.setFont('helvetica', 'bold');
    doc.text('Mata Uang', 15, 73);
    doc.text(':', 65, 73);
    doc.setFont('helvetica', 'normal');
    doc.text(salesOrder.mata_uang || '', 70, 73);

    doc.setFont('helvetica', 'bold');
    doc.text('Syarat Pembayaran', 15, 80);
    doc.text(':', 65, 80);
    doc.setFont('helvetica', 'normal');
    doc.text(salesOrder.syarat_pembayaran || '', 70, 80);

    doc.setFont('helvetica', 'bold');
    doc.text('Tanggal PO', 15, 87);
    doc.text(':', 65, 87);
    doc.setFont('helvetica', 'normal');
    doc.text(salesOrder.eta_marketing || '', 70, 87);

    // Header tabel "DETAIL PESANAN"
    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.rect(10, 105, pageWidth - 20, 10);
    doc.text('BILL OF MATERIALS', pageWidth / 2, 111, { align: 'center' });

    // Isi tabel detail menggunakan Bill of Materials
    const tableColumns = [
        { header: 'No', dataKey: 'no' },
        { header: 'Material', dataKey: 'material' },
        { header: 'Departemen', dataKey: 'departemen' },
        { header: 'Qty', dataKey: 'qty' },
        { header: 'Satuan', dataKey: 'satuan' },
        { header: 'Waste', dataKey: 'waste' },
        { header: 'Keterangan', dataKey: 'keterangan' },
    ];

    // Generate table rows dari Bill of Materials
    const tableRows =
        salesOrder.finish_good_item?.bill_of_materials?.map((bom, index) => ({
            no: (index + 1).toString(),
            material: bom.master_item ? `${bom.master_item.nama_master_item}` : '-',
            departemen: bom.departemen?.nama_departemen || '-',
            qty: bom.qty || '0',
            satuan: bom.master_item?.unit?.nama_satuan || '-',
            waste: bom.waste || '0',
            keterangan: bom.keterangan || '-',
        })) || [];

    autoTable(doc, {
        columns: tableColumns,
        body: tableRows,
        startY: 115,
        margin: { left: 10, right: 10 },
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [40, 88, 247], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.5 },
        bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.5 },
        columnStyles: {
            no: { cellWidth: 10, halign: 'center' },
            material: { cellWidth: 50 },
            departemen: { cellWidth: 25 },
            qty: { cellWidth: 20, halign: 'center' },
            satuan: { cellWidth: 15, halign: 'center' },
            waste: { cellWidth: 20, halign: 'center' },
            keterangan: { cellWidth: 50 },
        },
    });

    // Ambil posisi Y setelah tabel
    const tableEndY = (doc as any).lastAutoTable.finalY;

    // // Informasi tambahan
    let currentY = tableEndY + 15;

    // Tanda tangan
    currentY += 20;
    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text('Sales,', 50, currentY, { align: 'center' });
    doc.text('Customer,', pageWidth - 50, currentY, { align: 'center' });

    // Tempat tanda tangan
    doc.text('( ..................................... )', 50, currentY + 30, { align: 'center' });
    doc.text('( ..................................... )', pageWidth - 50, currentY + 30, { align: 'center' });

    // Output PDF
    if (download) {
        doc.save(`SO_${salesOrder.no_bon_pesanan}.pdf`);
    } else {
        window.open(doc.output('bloburl'), '_blank');
    }
};

const handleDelete = (item: string) => {
    router.delete(`/salesOrders/${item}`, {
        onSuccess: () => {
            toast.success('Sales Order deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete Sales Order');
        },
    });
};

export const columns = (setSelectedItem: (item: SalesOrder | null) => void, openDetailModal: (item: SalesOrder) => void): ColumnDef<SalesOrder>[] => [
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
        accessorKey: 'no_bon_pesanan',
        header: 'No. Sales Order',
    },
    {
        accessorKey: 'customer_address.nama_customer',
        header: 'Customer',
        cell: ({ row }) => row.original.customer_address?.nama_customer || '-',
    },
    {
        accessorKey: 'id_finish_good_item.kode_material_produk',
        header: 'Kode Material',
        cell: ({ row }) => row.original.finish_good_item?.kode_material_produk || '-',
    },
    {
        accessorKey: 'id_finish_good_item.nama_barang',
        header: 'Nama Produk',
        cell: ({ row }) => row.original.finish_good_item?.nama_barang || row.original.master_item?.nama_master_item || '-',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const item = row.original;

            const handlePreviewPdf = async () => {
                try {
                    const response = await fetch(`/salesOrders/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    generateSalesOrderPdf(data, false);
                } catch (error) {
                    console.error('Error generating PDF:', error);
                    toast.error('Gagal menghasilkan PDF. Silakan coba lagi.');
                }
            };

            const handleDownloadPdf = async () => {
                try {
                    const response = await fetch(`/salesOrders/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    generateSalesOrderPdf(data, true);
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
                        <DropdownMenuItem onClick={() => router.get(`/salesOrders/${item.id}/edit`)}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openDetailModal(item)}>Detail</DropdownMenuItem>
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
