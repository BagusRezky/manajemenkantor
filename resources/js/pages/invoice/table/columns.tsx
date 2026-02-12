/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Invoice } from '@/types/invoice';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, FileText, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

// Function untuk generate PDF invoice
const generateInvoicePdf = (invoice: Invoice, download = false): void => {
    const isLegacy = invoice.is_legacy;

    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [241.3, 279.4],
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const topOffset = 8;

    const logo = new Image();
    logo.src = '/images/logo-kantor.png';
    doc.addImage(logo, 'PNG', 15, topOffset + 5, 18, 18);

    doc.setLineWidth(0.5);
    doc.rect(10, topOffset, pageWidth - 20, 30);

    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('CV. Indigama Khatulistiwa', 40, 8 + topOffset);
    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text('Dsn. Blimbing RT 02 RW 11, Ds. Bulusari, Kec. Gempol,', 40, 13 + topOffset);
    doc.text('Pasuruan, Jawa Timur 67155', 40, 18 + topOffset);
    doc.text('Email: indigama.khatulistiwa01@gmail.com', 40, 23 + topOffset);
    doc.text('Telp: 081703101012', 40, 28 + topOffset);

    doc.setFontSize(16).setFont('helvetica', 'bold');
    doc.text(isLegacy ? 'INVOICE (LEGACY)' : 'INVOICE', pageWidth - 15, 10 + topOffset, { align: 'right' });

    doc.setFontSize(10).setFont('helvetica', 'normal');
    const invoiceDate = invoice.tgl_invoice ? format(new Date(invoice.tgl_invoice), 'dd-MM-yyyy') : '-';
    const dueDate = invoice.tgl_jatuh_tempo ? format(new Date(invoice.tgl_jatuh_tempo), 'dd-MM-yyyy') : '-';
    doc.text(`Tanggal Invoice : ${invoiceDate}`, pageWidth - 15, 16 + topOffset, { align: 'right' });
    doc.text(`Jatuh Tempo     : ${dueDate}`, pageWidth - 15, 21 + topOffset, { align: 'right' });

    doc.rect(10, 35 + topOffset, pageWidth - 20, 30);
    doc.setFont('helvetica', 'bold');
    doc.text('Kepada:', 15, 42 + topOffset);
    doc.setFont('helvetica', 'normal');

    const customerName = isLegacy ? 'DATA LEGACY' : invoice.surat_jalan?.kartu_instruksi_kerja?.sales_order?.customer_address?.nama_customer || '-';
    doc.text(customerName, 15, 48 + topOffset);

    const customerAddress = invoice.surat_jalan?.alamat_tujuan || '-';
    const addressLines = doc.splitTextToSize(customerAddress, 120);
    let addrY = 54 + topOffset;
    addressLines.forEach((line: string) => {
        doc.text(line, 15, addrY);
        addrY += 5;
    });

    const rightInfoX = pageWidth - 95;
    const colonX = rightInfoX + 35;
    const valueX = rightInfoX + 38;

    const infoRows = [
        { label: 'No. Invoice', val: invoice.no_invoice },
        { label: 'No. Surat Jalan', val: isLegacy ? invoice.no_surat_jalan_lama : invoice.surat_jalan?.no_surat_jalan },
        {
            label: 'No. PO Cust / SO',
            val: isLegacy ? invoice.no_so_lama || '-' : invoice.surat_jalan?.kartu_instruksi_kerja?.sales_order?.no_po_customer || '-',
        },
    ];

    infoRows.forEach((row, i) => {
        doc.setFont('helvetica', 'bold');
        doc.text(row.label, rightInfoX, 42 + i * 7 + topOffset);
        doc.text(':', colonX, 42 + i * 7 + topOffset);
        doc.setFont('helvetica', 'normal');
        doc.text(row.val || '-', valueX, 42 + i * 7 + topOffset);
    });

    const tableStartY = 70 + topOffset;

    // PERBAIKAN: Pastikan semua field memiliki fallback string agar tidak undefined
    let tableBody: any[] = [];
    if (isLegacy && invoice.details) {
        tableBody = invoice.details.map((item) => ({
            desc: item.nama_produk || '-',
            qty: `${Number(item.jumlah || 0).toLocaleString('id-ID')} ${item.unit || ''}`,
            harga: `Rp ${Number(item.harga || 0).toLocaleString('id-ID')}`,
            jumlah: `Rp ${Number(item.total || 0).toLocaleString('id-ID')}`,
        }));
    } else {
        const qtySistem = Number(invoice.surat_jalan?.qty_pengiriman || 0);
        const hargaSistem = Number(invoice.surat_jalan?.kartu_instruksi_kerja?.sales_order?.harga_pcs_bp || 0);
        tableBody = [
            {
                desc: invoice.surat_jalan?.kartu_instruksi_kerja?.sales_order?.finish_good_item?.nama_barang || '-',
                qty: `${qtySistem.toLocaleString('id-ID')} PCS`,
                harga: `Rp ${hargaSistem.toLocaleString('id-ID')}`,
                jumlah: `Rp ${(qtySistem * hargaSistem).toLocaleString('id-ID')}`,
            },
        ];
    }

    autoTable(doc, {
        startY: tableStartY,
        margin: { left: 10, right: 10 },
        theme: 'plain',
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: {
            fillColor: [240, 240, 240],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            lineWidth: 0.1,
            lineColor: [0, 0, 0],
        },
        bodyStyles: {
            lineWidth: 0.1,
            lineColor: [0, 0, 0],
        },
        columns: [
            { header: 'Deskripsi Barang', dataKey: 'desc' },
            { header: 'Quantity', dataKey: 'qty' },
            { header: 'Harga Satuan', dataKey: 'harga' },
            { header: 'Total Harga', dataKey: 'jumlah' },
        ],
        body: tableBody,
        columnStyles: {
            desc: { cellWidth: 'auto' },
            qty: { cellWidth: 30, halign: 'center' },
            harga: { cellWidth: 45, halign: 'right' },
            jumlah: { cellWidth: 45, halign: 'right' },
        },
    });

    const afterTableY = (doc as any).lastAutoTable.finalY + 10;

    const summaryWidth = 85;
    const summaryX = pageWidth - summaryWidth - 10;

    const subtotal = isLegacy
        ? Number(invoice.total_sub)
        : Number(invoice.surat_jalan?.qty_pengiriman || 0) * Number(invoice.surat_jalan?.kartu_instruksi_kerja?.sales_order?.harga_pcs_bp || 0);
    const disc = Number(invoice.discount || 0);
    const ppnNominal = isLegacy ? Number(invoice.ppn_nominal) : ((subtotal - disc) * Number(invoice.ppn)) / 100;
    const ongkir = Number(invoice.ongkos_kirim || 0);
    const totalFull = isLegacy ? Number(invoice.total) : subtotal - disc + ppnNominal + ongkir;
    const bayar = isLegacy ? Number(invoice.bayar) : Number(invoice.uang_muka);
    const sisa = isLegacy ? Number(invoice.kembali) : totalFull - bayar;

    // PENYEDERHANAAN: Label diringkas sesuai permintaan
    const summaryRows = [
        { label: 'Subtotal', val: subtotal },
        { label: `Diskon`, val: -disc },
        { label: `PPN (${invoice.ppn}%)`, val: ppnNominal },
        { label: 'Ongkos Kirim', val: ongkir },
        { label: 'Total Tagihan', val: totalFull, bold: true },
        { label: isLegacy ? 'SUDAH DIBAYAR' : 'UANG MUKA (DP)', val: -bayar },
        { label: 'SISA', val: sisa, bold: true },
    ];

    let currentSumY = afterTableY;
    summaryRows.forEach((row) => {
        doc.setFont('helvetica', row.bold ? 'bold' : 'normal');
        doc.text(row.label, summaryX + 2, currentSumY);
        doc.text(`Rp ${Math.abs(row.val).toLocaleString('id-ID')}`, pageWidth - 15, currentSumY, { align: 'right' });
        currentSumY += 6;
    });
    doc.rect(summaryX, afterTableY - 4, summaryWidth, currentSumY - afterTableY + 2);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold').text('Pembayaran Transfer Ke:', 15, afterTableY);
    doc.setFont('helvetica', 'normal')
        .text('Bank BRI', 15, afterTableY + 5)
        .text('A/N : CV. INDIGAMA KHATULISTIWA', 15, afterTableY + 10)
        .text('No. Rek : 0583 0110 0100 565', 15, afterTableY + 15);

    const centerX = pageWidth / 2;
    doc.text('Hormat Kami,', centerX, afterTableY + 5, { align: 'center' });
    doc.text('( ......................................... )', centerX, afterTableY + 25, { align: 'center' });

    const fileName = `Invoice_${invoice.no_invoice.replace(/\//g, '_')}.pdf`;
    if (download) {
        doc.save(fileName);
    } else {
        window.open(doc.output('bloburl'), '_blank');
    }
};

const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus Invoice ini?')) {
        router.delete(`/invoices/${id}`, {
            onSuccess: () => {
                toast.success('Invoice berhasil dihapus');
            },
            onError: () => {
                toast.error('Gagal menghapus Invoice');
            },
        });
    }
};

export const columns = (): ColumnDef<Invoice>[] => [
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
        accessorKey: 'no_invoice',
        header: 'No. Invoice',
    },
    {
        header: 'No. Surat Jalan',
        cell: ({ row }) => {
            const data = row.original;
            // Jika legacy pakai no_surat_jalan_lama, jika bukan pakai relasi
            return <span>{data.is_legacy ? data.no_surat_jalan_lama : data.surat_jalan?.no_surat_jalan || '-'}</span>;
        },
    },
    {
        accessorKey: 'tgl_invoice',
        header: 'Tgl. Invoice',
        cell: ({ row }) => {
            const data = row.original;
            return data.tgl_invoice ? format(new Date(data.tgl_invoice), 'dd-MM-yyyy') : '-';
        },
    },
    {
        accessorKey: 'tgl_jatuh_tempo',
        header: 'Jatuh Tempo',
        cell: ({ row }) => {
            const data = row.original;
            return data.tgl_jatuh_tempo ? format(new Date(data.tgl_jatuh_tempo), 'dd-MM-yyyy') : '-';
        },
    },
    {
        id: 'customer',
        header: 'Customer',
        cell: ({ row }) => {
            const data = row.original;
            return <span>{data.surat_jalan?.kartu_instruksi_kerja?.sales_order?.customer_address?.nama_customer || '-'}</span>;
        },
    },
    {
        id: 'total_invoice',
        header: 'Total Invoice',
        cell: ({ row }) => {
            const data = row.original;
            // Untuk legacy, kita sudah punya kolom 'total' di database hasil import
            if (data.is_legacy) {
                return <span className="font-semibold text-blue-600">Rp {Number(data.total).toLocaleString('id-ID')}</span>;
            }

            // Kalkulasi otomatis untuk data sistem baru
            const discount = Number(data.discount || 0);
            const qty = Number(data.surat_jalan?.qty_pengiriman || 0);
            const harga = Number(data.surat_jalan?.kartu_instruksi_kerja?.sales_order?.harga_pcs_bp || 0);
            const ppnRate = Number(data.ppn || 0);
            const ongkir = Number(data.ongkos_kirim || 0);

            const subtotal = harga * qty - discount;
            const total = subtotal + (subtotal * ppnRate) / 100 + ongkir;

            return <span className="font-semibold">Rp {total.toLocaleString('id-ID')}</span>;
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const item = row.original;

            const handlePreviewPdf = async () => {
                try {
                    // Fetch data lengkap invoice beserta relasinya
                    const response = await fetch(`/invoices/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    // Generate dan tampilkan PDF
                    generateInvoicePdf(data, false);
                } catch (error) {
                    console.error('Error generating PDF:', error);
                    toast.error('Gagal menghasilkan PDF. Silakan coba lagi.');
                }
            };

            const handleDownloadPdf = async () => {
                try {
                    // Fetch data lengkap invoice beserta relasinya
                    const response = await fetch(`/invoices/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    // Generate dan download PDF
                    generateInvoicePdf(data, true);
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
                        <DropdownMenuItem onClick={() => router.get(`/invoices/${item.id}`)}>Detail</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.get(`/invoices/${item.id}/edit`)}>Edit</DropdownMenuItem>
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
