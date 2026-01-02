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
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    const topOffset = 15;
    const logo = new Image();
    logo.src = '/images/logo-kantor.png';
    doc.addImage(logo, 'PNG', 15, 15 + topOffset, 18, 18);

    doc.setLineWidth(0.5);
    doc.rect(10, 10 + topOffset, pageWidth - 20, 30);

    // =============================
    // COMPANY INFO
    // =============================
    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('CV. Indigama Khatulistiwa', 40, 18 + topOffset);

    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text('Dsn. Blimbing RT 02 RW 11, Ds. Bulusari, Kec. Gempol,', 40, 23 + topOffset);
    doc.text('Pasuruan, Jawa Timur 67155', 40, 28 + topOffset);
    doc.text('Email: indigama.khatulistiwa01@gmail.com', 40, 33 + topOffset);
    doc.text('Telp: 081703101012', 40, 38 + topOffset);

    // =============================
    // INVOICE TITLE
    // =============================
    doc.setFontSize(16).setFont('helvetica', 'bold');
    doc.text('INVOICE', pageWidth - 15, 20 + topOffset, { align: 'right' });

    doc.setFontSize(10).setFont('helvetica', 'normal');
    const invoiceDate = invoice.tgl_invoice ? format(new Date(invoice.tgl_invoice), 'dd-MM-yyyy') : '';
    const dueDate = invoice.tgl_jatuh_tempo ? format(new Date(invoice.tgl_jatuh_tempo), 'dd-MM-yyyy') : '';

    doc.text(`Tanggal Invoice : ${invoiceDate}`, pageWidth - 15, 26 + topOffset, {
        align: 'right',
    });
    doc.text(`Jatuh Tempo     : ${dueDate}`, pageWidth - 15, 31 + topOffset, {
        align: 'right',
    });
    doc.rect(10, 45 + topOffset, pageWidth - 20, 30);
    // Customer
    doc.setFont('helvetica', 'bold');
    doc.text('Kepada:', 15, 52 + topOffset);
    doc.setFont('helvetica', 'normal');

    const customerName = invoice.surat_jalan?.kartu_instruksi_kerja?.sales_order?.customer_address?.nama_customer || '';
    doc.text(customerName, 15, 58 + topOffset);

    const customerAddress = invoice.surat_jalan?.alamat_tujuan || '';
    const addressLines = doc.splitTextToSize(customerAddress, 80);
    let addrY = 64 + topOffset;
    addressLines.forEach((line: string) => {
        doc.text(line, 15, addrY);
        addrY += 5;
    });

    // Right info
    const rightX = pageWidth - 85;
    doc.setFont('helvetica', 'bold');
    doc.text('No. Invoice', rightX, 52 + topOffset);
    doc.text(':', rightX + 25, 52 + topOffset);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.no_invoice || '', rightX + 30, 52 + topOffset);

    doc.setFont('helvetica', 'bold');
    doc.text('No.Surat Jalan', rightX, 59 + topOffset);
    doc.text(':', rightX + 25, 59 + topOffset);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.surat_jalan?.no_surat_jalan || '', rightX + 30, 59 + topOffset);
    const tableStartY = 80 + topOffset;

    doc.setFont('helvetica', 'bold');
    doc.rect(10, tableStartY, pageWidth - 20, 10);
    doc.text('DETAIL INVOICE', pageWidth / 2, tableStartY + 6, {
        align: 'center',
    });

    const discount = Number(invoice.discount || 0);
    const qty = Number(invoice.surat_jalan?.qty_pengiriman || 0);
    const harga = Number(invoice.surat_jalan?.kartu_instruksi_kerja?.sales_order?.harga_pcs_bp || 0);

    const ppnRate = Number(invoice.ppn || 0);
    const ongkir = Number(invoice.ongkos_kirim || 0);
    const dp = Number(invoice.uang_muka || 0);

    const subtotalAwal = harga * qty;
    const subtotal = subtotalAwal - discount;
    const ppn = (subtotal * ppnRate) / 100;
    const total = subtotal + ppn + ongkir;
    const grandTotal = total - dp;

    const namaBarang = invoice.surat_jalan?.kartu_instruksi_kerja?.sales_order?.finish_good_item?.nama_barang || '';

    autoTable(doc, {
        startY: tableStartY + 10,
        margin: { left: 10, right: 10 },
        styles: { fontSize: 9 },
        headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineWidth: 0.5,
            lineColor: [0, 0, 0],
        },
        bodyStyles: {
            lineWidth: 0.5,
            lineColor: [0, 0, 0],
        },
        columns: [
            { header: 'Nama Barang', dataKey: 'desc' },
            { header: 'Qty', dataKey: 'qty' },
            { header: 'Harga Satuan', dataKey: 'harga' },
            { header: 'Jumlah', dataKey: 'jumlah' },
        ],
        body: [
            {
                desc: namaBarang,
                qty: qty.toLocaleString('id-ID'),
                harga: `Rp ${harga.toLocaleString('id-ID')}`,
                jumlah: `Rp ${subtotalAwal.toLocaleString('id-ID')}`,
            },
            ...(discount > 0
                ? [
                      {
                          desc: 'Diskon',
                          qty: '',
                          harga: '',
                          jumlah: `- Rp ${discount.toLocaleString('id-ID')}`,
                      },
                  ]
                : []),
        ],
        columnStyles: {
            desc: { cellWidth: 80 },
            qty: { cellWidth: 25, halign: 'center' },
            harga: { cellWidth: 40, halign: 'right' },
            jumlah: { cellWidth: 45, halign: 'right' },
        },
    });

    const afterTableY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFont('helvetica', 'bold');
    doc.text('Rekening Pembayaran :', 15, afterTableY);

    doc.setFont('helvetica', 'normal');
    doc.text('BRI', 15, afterTableY + 6);
    doc.text('CV. INDIGAMA KHATULISTIWA', 15, afterTableY + 11);
    doc.text('0583 0110 0100 565', 15, afterTableY + 16);

    // =============================
    // SUMMARY (KANAN)
    // =============================
    doc.rect(pageWidth - 80, afterTableY - 5, 70, 43);

    let y = afterTableY + 3;
    const labelX = pageWidth - 75;
    const valueX = pageWidth - 15;

    doc.text('Subtotal', labelX, y);
    doc.text(`Rp ${subtotal.toLocaleString('id-ID')}`, valueX, y, { align: 'right' });

    y += 6;
    doc.text(`PPN (${ppnRate}%)`, labelX, y);
    doc.text(`Rp ${ppn.toLocaleString('id-ID')}`, valueX, y, { align: 'right' });

    y += 6;
    doc.text('Ongkos Kirim', labelX, y);
    doc.text(`Rp ${ongkir.toLocaleString('id-ID')}`, valueX, y, { align: 'right' });

    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Total', labelX, y);
    doc.text(`Rp ${total.toLocaleString('id-ID')}`, valueX, y, { align: 'right' });

    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.text('DP', labelX, y);
    doc.text(`Rp ${dp.toLocaleString('id-ID')}`, valueX, y, { align: 'right' });

    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Grand Total', labelX, y);
    doc.text(`Rp ${grandTotal.toLocaleString('id-ID')}`, valueX, y, {
        align: 'right',
    });

    // Output PDF
    if (download) {
        doc.save(`Invoice_${invoice.no_invoice?.replace(/\//g, '_')}.pdf`);
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
        accessorKey: 'surat_jalan.no_surat_jalan',
        header: 'No. Surat Jalan',
        cell: ({ row }) => {
            const data = row.original;
            return <span>{data.surat_jalan?.no_surat_jalan || '-'}</span>;
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
            const discount = Number(data.discount || 0);
            const qtyPengiriman = Number(data.surat_jalan?.qty_pengiriman || 0);
            const hargaSO = Number(data.surat_jalan?.kartu_instruksi_kerja?.sales_order?.harga_pcs_bp || 0);
            const ppnRate = Number(data.ppn || 0);
            const ongkosKirim = Number(data.ongkos_kirim || 0);

            // Hitung subtotal
            const subtotalSebelumToleransi = hargaSO * qtyPengiriman;

            const subtotal = subtotalSebelumToleransi - discount;

            // Hitung PPN dan total
            const ppnAmount = (subtotal * ppnRate) / 100;
            const total = subtotal + ppnAmount + ongkosKirim;

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
