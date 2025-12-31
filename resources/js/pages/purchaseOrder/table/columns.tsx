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
    // Inisialisasi dokumen PDF
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    const logo = new Image();
    logo.src = '/images/logo-kantor.png';
    doc.addImage(logo, 'PNG', 14, 17, 17, 17);

    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('PURCHASE ORDER', pageWidth - 15, 18, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.text(purchaseOrder.no_po || '', pageWidth - 15, 25, { align: 'right' });

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

    // Informasi Purchase Order
    doc.setLineWidth(0.5);
    doc.rect(10, 45, pageWidth - 20, 35);

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
    doc.text(purchaseOrder.supplier?.alamat_lengkap || '', 70, 66);

    doc.setFont('helvetica', 'bold');
    doc.text('Mata Uang', 15, 73);
    doc.text(':', 65, 73);
    doc.setFont('helvetica', 'normal');
    doc.text(purchaseOrder.mata_uang || '', 70, 73);

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
        { header: 'Tonase', dataKey: 'tonase' }, // Tambahkan kolom Tonase
        { header: 'Harga', dataKey: 'hsatuan' },
        { header: 'Disc', dataKey: 'diskon' },
        { header: 'Total', dataKey: 'jumlah' },
    ];

    const tableRows =
        purchaseOrder.items?.map((item, index) => {
            // Kalkulasi tonase berdasarkan rumus dan kondisi
            let tonase = 0;
            const satuanName = item.satuan?.nama_satuan || '';

            // Terapkan rumus hanya untuk satuan SHEET atau RIM
            if (satuanName === 'SHEET' || satuanName === 'RIM') {
                const panjang = parseFloat(item.master_item?.panjang || '0');
                const lebar = parseFloat(item.master_item?.lebar || '0');
                const berat = parseFloat(item.master_item?.berat || '0');

                // Rumus tonase: (PANJANG X LEBAR X BERAT) / 20,000,000
                if (panjang && lebar && berat) {
                    tonase = (panjang * lebar * berat) / 20000000;
                }
            }

            return {
                no: (index + 1).toString(),
                item: `${item.master_item?.nama_master_item || ''}`,
                qty: item.qty_po || 0,
                satuan: item.satuan?.nama_satuan || '-',
                tonase: tonase.toFixed(4), // Format ke 4 angka desimal
                hsatuan: formatRupiah(item.harga_satuan || 0),
                diskon: formatToPercent(item.diskon_satuan),
                jumlah: formatRupiah(item.jumlah || 0),
            };
        }) || [];

    // Hitung total bruto (sum dari semua jumlah item)
    const totalBruto = Number(purchaseOrder.items?.reduce((sum, item) => sum + (Number(item.jumlah) || 0), 0) || 0);

    // Hitung PPN (total bruto × nilai ppn)
    const ppnRate = Number(purchaseOrder.ppn || 0);
    const ppnAmount = (totalBruto * ppnRate) / 100;

    // Ambil nilai ONGKIR dan DP
    const ongkir = Number(purchaseOrder.ongkir || 0);
    const dp = Number(purchaseOrder.dp || 0);

    // Hitung total akhir (total bruto + ppn + ongkir)
    const totalAkhir = Number(totalBruto) + Number(ppnAmount) + Number(ongkir);

    // Hitung sisa (total akhir - dp)
    const sisa = Number(totalAkhir) - Number(dp);

    autoTable(doc, {
        columns: tableColumns,
        body: tableRows,
        startY: 105,
        margin: { left: 10, right: 10 },
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [40, 88, 247], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.5 },
        bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.5 },
        columnStyles: {
            no: { cellWidth: 10, halign: 'center' },
            item: { cellWidth: 45 },
            qty: { cellWidth: 20, halign: 'center' },
            satuan: { cellWidth: 20, halign: 'center' },
            tonase: { cellWidth: 20, halign: 'center' },
            hsatuan: { cellWidth: 25, halign: 'right' },
            diskon: { cellWidth: 20, halign: 'right' },
            jumlah: { cellWidth: 30, halign: 'right' },
        },
    });

    // Ambil posisi Y setelah tabel
    const tableEndY = (doc as any).lastAutoTable.finalY;

    const noteStartX = 10;
    const totalWidth = 80;
    const totalStartX = pageWidth - 10 - totalWidth;
    const baseY = tableEndY + 10;

    const remarks =
        purchaseOrder.items
            ?.map((item, idx) => {
                const remark =
                    item.remark_item_po && item.remark_item_po.trim() !== ''
                        ? item.remark_item_po
                        : item.purchase_request_items?.catatan && item.purchase_request_items.catatan.trim() !== ''
                          ? item.purchase_request_items.catatan
                          : '';

                return remark ? `${idx + 1}. ${remark}` : '';
            })
            .filter((r) => r !== '') || [];

    // --- Note Section ---
    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.text('Note:', noteStartX, baseY);

    doc.setFont('helvetica', 'normal');
    const lineHeight = 6;
    remarks.forEach((remark, i) => {
        doc.text(remark, noteStartX + 10, baseY + lineHeight * (i + 1), {
            maxWidth: pageWidth / 2 - 20,
        });
    });

    // --- Total Section ---
    doc.setFontSize(9).setFont('helvetica', 'bold');
    let totalY = baseY;

    // Total Bruto
    doc.text('Total', totalStartX + 5, totalY);
    doc.text(formatRupiah(totalBruto), pageWidth - 15, totalY, { align: 'right' });
    doc.line(totalStartX, totalY + 2, totalStartX + totalWidth, totalY + 2);
    totalY += 7;

    // PPN
    doc.text('PPN', totalStartX + 5, totalY);
    doc.text(formatRupiah(ppnAmount), pageWidth - 15, totalY, { align: 'right' });
    doc.line(totalStartX, totalY + 2, totalStartX + totalWidth, totalY + 2);
    totalY += 7;

    // ONGKIR
    doc.text('ONGKIR', totalStartX + 5, totalY);
    doc.text(formatRupiah(ongkir), pageWidth - 15, totalY, { align: 'right' });
    doc.line(totalStartX, totalY + 2, totalStartX + totalWidth, totalY + 2);
    totalY += 7;

    // Total Akhir
    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.text('Total Akhir', totalStartX + 5, totalY);
    doc.text(formatRupiah(totalAkhir), pageWidth - 15, totalY, { align: 'right' });
    doc.line(totalStartX, totalY + 2, totalStartX + totalWidth, totalY + 2);
    totalY += 7;

    // DP
    doc.setFontSize(9).setFont('helvetica', 'bold');
    doc.text('DP', totalStartX + 5, totalY);
    doc.text(formatRupiah(dp), pageWidth - 15, totalY, { align: 'right' });
    doc.line(totalStartX, totalY + 2, totalStartX + totalWidth, totalY + 2);
    totalY += 7;

    // Sisa
    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.text('Sisa', totalStartX + 5, totalY);
    doc.text(formatRupiah(sisa), pageWidth - 15, totalY, { align: 'right' });
    doc.line(totalStartX, totalY + 2, totalStartX + totalWidth, totalY + 2);

    // --- Syarat dan Ketentuan ---
    let termsY = totalY + 6;

    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.text('Penting !', 10, termsY);
    termsY += 6;

    doc.setFontSize(9).setFont('helvetica', 'bold');
    doc.text('Syarat dan Ketentuan Pengiriman Barang:', 10, termsY);
    termsY += 6;

    doc.setFont('helvetica', 'normal');

    // List poin syarat
    const termsList = [
        '1. Seluruh proses pengiriman barang harus disertai dengan surat jalan, nota, atau kwitansi.',
        '2. Proses pelunasan pembayaran dilakukan selambat-lambatnya 30 hari setelah barang diterima. (Atau sesuai dengan kesepakatan diawal).',
        '3. Waktu pengiriman dilakukan sesuai kesepakatan oleh Purchasing. (Jika ada perubahan jadwal pengiriman, harus segera menginformasi hal tersebut).',
        '4. Jika ada ketidakcocokan atau ketidaksesuaian jumlah atau kualitas dengan barang yang dipesan, customer berhak mengembalikan barang tersebut kepada rekanan.',
    ];

    termsList.forEach((t) => {
        doc.text(t, 12, termsY, { maxWidth: pageWidth - 25 });
        termsY += 8;
    });

    // Geser posisi tanda tangan agar tidak bertabrakan
    const adjustedSignY = termsY + 15;

    // --- Tanda Tangan ---
    // const noteEndY = baseY + lineHeight * (remarks.length + 2);
    const signY = adjustedSignY;

    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text('Dibuat Oleh,', 50, signY, { align: 'center' });
    doc.text('Disetujui Oleh,', pageWidth - 50, signY, { align: 'center' });
    doc.text('( ..................................... )', 50, signY + 30, { align: 'center' });
    doc.text('( ..................................... )', pageWidth - 50, signY + 30, { align: 'center' });

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
