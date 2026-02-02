/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PurchaseOrder } from '@/types/purchaseOrder';
import { formatRupiah } from '@/utils/formatter/currency';
import { formatToPercent } from '@/utils/formatter/percent';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, FileText, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

// Function untuk generate PDF penerimaan barang
const generatePurchaseOrderPdf = (purchaseOrder: PurchaseOrder, download = false): void => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const bottomMargin = 20;

    // --- Helper Function untuk Handle Halaman Baru ---
    const checkPageBreak = (currentY: number, neededHeight: number): number => {
        if (currentY + neededHeight > pageHeight - bottomMargin) {
            doc.addPage();
            return 20; // Margin atas di halaman baru
        }
        return currentY;
    };

    // --- Header Section ---
    const logo = new Image();
    logo.src = '/images/logo-kantor.png';
    doc.addImage(logo, 'PNG', 14, 17, 17, 17);

    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('PURCHASE ORDER', pageWidth - 15, 18, { align: 'right' });
    doc.text(purchaseOrder.no_po || '', pageWidth - 15, 25, { align: 'right' });

    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, pageWidth - 20, 30);

    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('CV. Indigama Khatulistiwa', 34, 18);
    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text('Dsn. Blimbing RT 02 RW 11, Ds. Bulusari, Kec. Gempol,', 34, 23);
    doc.text('Pasuruan, Jawa Timur 67155', 34, 28);
    doc.text('Email: indigama.khatulistiwa01@gmail.com', 34, 33);
    doc.text('Telp: 081703101012', 34, 38);

    // --- Informasi Supplier & PO ---
    const supplierAddress = purchaseOrder.supplier?.alamat_lengkap || '';
    const maxAddressWidth = pageWidth - 85;
    const wrappedAddress = doc.splitTextToSize(supplierAddress, maxAddressWidth);
    const addressLineHeight = 5;
    const extraHeight = (wrappedAddress.length - 1) * addressLineHeight;

    doc.rect(10, 45, pageWidth - 20, 35 + extraHeight);

    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.text('Tanggal PO', 15, 52);
    doc.text(':', 65, 52);
    doc.setFont('helvetica', 'normal');
    const formattedPODate = purchaseOrder.tanggal_po ? format(new Date(purchaseOrder.tanggal_po), 'dd-MM-yyyy') : '';
    doc.text(formattedPODate, 70, 52);

    doc.setFont('helvetica', 'bold');
    doc.text('Supplier', 15, 59);
    doc.text(':', 65, 59);
    doc.setFont('helvetica', 'normal');
    doc.text(purchaseOrder.supplier?.nama_suplier || '', 70, 59);

    doc.setFont('helvetica', 'bold');
    doc.text('Alamat Supplier', 15, 66);
    doc.text(':', 65, 66);
    doc.setFont('helvetica', 'normal');
    doc.text(wrappedAddress, 70, 66);

    const currencyY = 73 + extraHeight;
    doc.setFont('helvetica', 'bold');
    doc.text('Mata Uang', 15, currencyY);
    doc.text(':', 65, currencyY);
    doc.setFont('helvetica', 'normal');
    doc.text(purchaseOrder.mata_uang || '', 70, currencyY);

    // --- Table Section ---
    const tableHeaderY = 95 + extraHeight;
    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.rect(10, tableHeaderY, pageWidth - 20, 10);
    doc.text('DATA ITEM', pageWidth / 2, tableHeaderY + 6, { align: 'center' });

    const tableColumns = [
        { header: 'No', dataKey: 'no' },
        { header: 'Deskripsi', dataKey: 'item' },
        { header: 'Qty', dataKey: 'qty' },
        { header: 'Satuan', dataKey: 'satuan' },
        { header: 'Tonase', dataKey: 'tonase' },
        { header: 'Harga', dataKey: 'hsatuan' },
        { header: 'Disc', dataKey: 'diskon' },
        { header: 'Total', dataKey: 'jumlah' },
    ];

    const tableRows =
        purchaseOrder.items?.map((item, index) => {
            let tonase = 0;
            const satuanName = item.satuan?.nama_satuan || '';
            if (satuanName === 'SHEET' || satuanName === 'RIM') {
                const panjang = parseFloat(item.master_item?.panjang || '0');
                const lebar = parseFloat(item.master_item?.lebar || '0');
                const berat = parseFloat(item.master_item?.berat || '0');
                if (panjang && lebar && berat) {
                    tonase = (panjang * lebar * berat) / 20000000;
                }
            }
            return {
                no: (index + 1).toString(),
                item: `${item.master_item?.nama_master_item || ''}`,
                qty: item.qty_po || 0,
                satuan: item.satuan?.nama_satuan || '-',
                tonase: tonase.toFixed(4),
                hsatuan: formatRupiah(item.harga_satuan || 0),
                diskon: formatToPercent(item.diskon_satuan),
                jumlah: formatRupiah(item.jumlah || 0),
            };
        }) || [];

    autoTable(doc, {
        columns: tableColumns,
        body: tableRows,
        startY: tableHeaderY + 10,
        margin: { left: 10, right: 10 },
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [40, 88, 247], textColor: [255, 255, 255], fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.2 },
        bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.2 },
        columnStyles: {
            no: { cellWidth: 10, halign: 'center' },
            item: { cellWidth: 45 },
            qty: { cellWidth: 15, halign: 'center' },
            satuan: { cellWidth: 15, halign: 'center' },
            tonase: { cellWidth: 20, halign: 'center' },
            hsatuan: { cellWidth: 30, halign: 'right' },
            diskon: { cellWidth: 15, halign: 'right' },
            jumlah: { cellWidth: 40, halign: 'right' },
        },
    });

    // --- Footer Content Logic (Note, Total, Terms, Signs) ---
    let currentY = (doc as any).lastAutoTable.finalY + 10;

    // 1. Note Section
    const remarks =
        purchaseOrder.items
            ?.map((item, idx) => {
                const remark = item.remark_item_po?.trim() || item.purchase_request_items?.catatan?.trim() || '';
                return remark ? `${idx + 1}. ${remark}` : '';
            })
            .filter((r) => r !== '') || [];

    if (remarks.length > 0) {
        currentY = checkPageBreak(currentY, 15);
        doc.setFontSize(10).setFont('helvetica', 'bold');
        doc.text('Note:', 10, currentY);
        currentY += 6;
        doc.setFont('helvetica', 'normal');
        remarks.forEach((remark) => {
            const wrappedRemark = doc.splitTextToSize(remark, pageWidth / 2 - 20);
            const neededHeight = wrappedRemark.length * 5;
            currentY = checkPageBreak(currentY, neededHeight);
            doc.text(wrappedRemark, 15, currentY);
            currentY += neededHeight + 2;
        });
    }

    // 2. Total Section
    const totalBruto = Number(purchaseOrder.items?.reduce((sum, item) => sum + (Number(item.jumlah) || 0), 0) || 0);
    const ppnAmount = (totalBruto * Number(purchaseOrder.ppn || 0)) / 100;
    const totalAkhir = totalBruto + ppnAmount + Number(purchaseOrder.ongkir || 0);
    const sisa = totalAkhir - Number(purchaseOrder.dp || 0);

    currentY = checkPageBreak(currentY, 50); // Estimasi tinggi blok total
    const totalStartX = pageWidth - 90;
    const totalWidth = 80;

    const drawTotalLine = (label: string, value: number | string, y: number, isBold = false) => {
        doc.setFont('helvetica', isBold ? 'bold' : 'normal').setFontSize(isBold ? 10 : 9);
        doc.text(label, totalStartX + 2, y);
        const valStr = typeof value === 'number' ? formatRupiah(value) : value;
        doc.text(valStr, pageWidth - 15, y, { align: 'right' });
        doc.line(totalStartX, y + 2, totalStartX + totalWidth, y + 2);
        return y + 7;
    };

    currentY = drawTotalLine('Total', totalBruto, currentY);
    currentY = drawTotalLine('PPN', ppnAmount, currentY);
    currentY = drawTotalLine('ONGKIR', Number(purchaseOrder.ongkir || 0), currentY);
    currentY = drawTotalLine('Total Akhir', totalAkhir, currentY, true);
    currentY = drawTotalLine('DP', Number(purchaseOrder.dp || 0), currentY);
    currentY = drawTotalLine('Sisa', sisa, currentY, true);

    // 3. Syarat dan Ketentuan
    currentY += 5;
    const terms = [
        '1. Seluruh proses pengiriman barang harus disertai dengan surat jalan, nota, atau kwitansi.',
        '2. Proses pelunasan pembayaran dilakukan selambat-lambatnya 30 hari setelah barang diterima.',
        '3. Waktu pengiriman dilakukan sesuai kesepakatan oleh Purchasing.',
        '4. Jika ada ketidakcocokan kualitas/jumlah, customer berhak mengembalikan barang.',
    ];

    currentY = checkPageBreak(currentY, 40);
    doc.setFont('helvetica', 'bold').setFontSize(10);
    doc.text('Penting !', 10, currentY);
    currentY += 6;
    doc.text('Syarat dan Ketentuan Pengiriman Barang:', 10, currentY);
    currentY += 6;
    doc.setFont('helvetica', 'normal').setFontSize(9);
    terms.forEach((t) => {
        const wrappedT = doc.splitTextToSize(t, pageWidth - 25);
        currentY = checkPageBreak(currentY, wrappedT.length * 5);
        doc.text(wrappedT, 12, currentY);
        currentY += wrappedT.length * 5 + 1;
    });

    // 4. Tanda Tangan
    currentY = checkPageBreak(currentY, 45);
    const signY = currentY + 15;
    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text('Dibuat Oleh,', 50, signY, { align: 'center' });
    doc.text('Disetujui Oleh,', pageWidth - 50, signY, { align: 'center' });
    doc.text('( ..................................... )', 50, signY + 25, { align: 'center' });
    doc.text('( ..................................... )', pageWidth - 50, signY + 25, { align: 'center' });

    // Output
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
