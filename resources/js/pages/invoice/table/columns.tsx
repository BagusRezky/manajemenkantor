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

    // Invoice title
    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('INVOICE', pageWidth - 15, 18, { align: 'right' });

    // Customer Info dan Invoice Info
    doc.setLineWidth(0.5);
    doc.rect(10, 45, pageWidth - 20, 50);

    // Customer Info (Left Side)
    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.text('Kepada:', 15, 52);
    doc.setFont('helvetica', 'normal');
    const customerName = invoice.surat_jalan?.kartu_instruksi_kerja?.sales_order?.customer_address?.nama_customer || '';
    doc.text(customerName, 15, 59);

    const customerAddress = invoice.surat_jalan?.alamat_tujuan || '';
    // Split address into multiple lines if too long
    const addressLines = doc.splitTextToSize(customerAddress, 80);
    let currentY = 66;
    addressLines.forEach((line: string) => {
        doc.text(line, 15, currentY);
        currentY += 7;
    });

    // Invoice Info (Right Side)
    const rightStartX = pageWidth - 85;
    doc.setFont('helvetica', 'bold');
    doc.text('No. Invoice', rightStartX, 52);
    doc.text(':', rightStartX + 25, 52);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.no_invoice || '', rightStartX + 30, 52);

    doc.setFont('helvetica', 'bold');
    doc.text('Tgl. Invoice', rightStartX, 59);
    doc.text(':', rightStartX + 25, 59);
    doc.setFont('helvetica', 'normal');
    const formattedInvoiceDate = invoice.tgl_invoice ? format(new Date(invoice.tgl_invoice), 'dd-MM-yyyy') : '';
    doc.text(formattedInvoiceDate, rightStartX + 30, 59);

    doc.setFont('helvetica', 'bold');
    doc.text('Jatuh Tempo', rightStartX, 66);
    doc.text(':', rightStartX + 25, 66);
    doc.setFont('helvetica', 'normal');
    const formattedDueDate = invoice.tgl_jatuh_tempo ? format(new Date(invoice.tgl_jatuh_tempo), 'dd-MM-yyyy') : '';
    doc.text(formattedDueDate, rightStartX + 30, 66);

    doc.setFont('helvetica', 'bold');
    doc.text('No. Surat Jalan', rightStartX, 73);
    doc.text(':', rightStartX + 25, 73);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.surat_jalan?.no_surat_jalan || '', rightStartX + 30, 73);

    doc.setFont('helvetica', 'bold');
    doc.text('No. SPK', rightStartX, 80);
    doc.text(':', rightStartX + 25, 80);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.surat_jalan?.kartu_instruksi_kerja?.no_kartu_instruksi_kerja || '', rightStartX + 30, 80);

    doc.setFont('helvetica', 'bold');
    doc.text('No. SO', rightStartX, 87);
    doc.text(':', rightStartX + 25, 87);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.surat_jalan?.kartu_instruksi_kerja?.sales_order?.no_bon_pesanan || '', rightStartX + 30, 87);

    // Detail Item Table
    const tableStartY = 100;

    // Header tabel "DETAIL INVOICE"
    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.rect(10, tableStartY, pageWidth - 20, 10);
    doc.text('DETAIL INVOICE', pageWidth / 2, tableStartY + 6, { align: 'center' });

    // Hitung nilai-nilai invoice
    const discount = Number(invoice.discount || 0);
    const qtyPengiriman = Number(invoice.surat_jalan?.qty_pengiriman || 0);
    const hargaSO = Number(invoice.surat_jalan?.kartu_instruksi_kerja?.sales_order?.harga_pcs_bp || 0);

    const ppnRate = Number(invoice.ppn || 0);
    const ongkosKirim = Number(invoice.ongkos_kirim || 0);
    const uangMuka = Number(invoice.uang_muka || 0);

    // Hitung subtotal
    const subtotalSebelumToleransi = hargaSO * qtyPengiriman;

    const subtotal = subtotalSebelumToleransi - discount;

    // Hitung PPN
    const ppnAmount = (subtotal * ppnRate) / 100;

    // Hitung total
    const total = subtotal + ppnAmount + ongkosKirim;
    const sisaTagihan = total - uangMuka;

    // Isi tabel detail menggunakan autoTable
    const tableColumns = [
        { header: 'Deskripsi', dataKey: 'deskripsi' },
        { header: 'Qty', dataKey: 'qty' },
        { header: 'Harga Satuan', dataKey: 'harga_satuan' },
        { header: 'Jumlah', dataKey: 'jumlah' },
    ];

    const namaBarang = invoice.surat_jalan?.kartu_instruksi_kerja?.sales_order?.finish_good_item?.nama_barang || 'Barang';
    const deskripsiBarang = invoice.surat_jalan?.kartu_instruksi_kerja?.sales_order?.finish_good_item?.deskripsi || '';

    const tableRows = [
        {
            deskripsi: `${namaBarang}\n${deskripsiBarang}`,
            qty: qtyPengiriman.toLocaleString('id-ID'),
            harga_satuan: `Rp ${hargaSO.toLocaleString('id-ID')}`,
            jumlah: `Rp ${subtotalSebelumToleransi.toLocaleString('id-ID')}`,
        },
    ];

    if (discount > 0) {
        tableRows.push({
            deskripsi: `Diskon`,
            qty: '',
            harga_satuan: '',
            jumlah: `- Rp ${discount.toLocaleString('id-ID')}`,
        });
    }

    autoTable(doc, {
        columns: tableColumns,
        body: tableRows,
        startY: tableStartY + 10,
        margin: { left: 10, right: 10 },
        styles: { fontSize: 9 },
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.5 },
        bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.5 },
        columnStyles: {
            deskripsi: { cellWidth: 80 },
            qty: { cellWidth: 30, halign: 'center' },
            harga_satuan: { cellWidth: 40, halign: 'right' },
            jumlah: { cellWidth: 40, halign: 'right' },
        },
    });

    // Summary calculations
    const summaryStartY = (doc as any).lastAutoTable.finalY + 10;

    // Summary box
    doc.setLineWidth(0.5);
    doc.rect(pageWidth - 80, summaryStartY, 70, 60);

    doc.setFontSize(10).setFont('helvetica', 'normal');
    let summaryY = summaryStartY + 8;

    doc.text('Subtotal:', pageWidth - 75, summaryY);
    doc.text(`Rp ${subtotal.toLocaleString('id-ID')}`, pageWidth - 15, summaryY, { align: 'right' });

    summaryY += 7;
    doc.text(`PPN (${ppnRate}%):`, pageWidth - 75, summaryY);
    doc.text(`Rp ${ppnAmount.toLocaleString('id-ID')}`, pageWidth - 15, summaryY, { align: 'right' });

    if (ongkosKirim > 0) {
        summaryY += 7;
        doc.text('Ongkos Kirim:', pageWidth - 75, summaryY);
        doc.text(`Rp ${ongkosKirim.toLocaleString('id-ID')}`, pageWidth - 15, summaryY, { align: 'right' });
    }

    summaryY += 7;
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', pageWidth - 75, summaryY);
    doc.text(`Rp ${total.toLocaleString('id-ID')}`, pageWidth - 15, summaryY, { align: 'right' });

    if (uangMuka > 0) {
        summaryY += 7;
        doc.setFont('helvetica', 'normal');
        doc.text('Uang Muka:', pageWidth - 75, summaryY);
        doc.text(`Rp ${uangMuka.toLocaleString('id-ID')}`, pageWidth - 15, summaryY, { align: 'right' });

        summaryY += 7;
        doc.setFont('helvetica', 'bold');
        doc.text('Sisa Tagihan:', pageWidth - 75, summaryY);
        doc.text(`Rp ${sisaTagihan.toLocaleString('id-ID')}`, pageWidth - 15, summaryY, { align: 'right' });
    }

    // // Payment info
    // const paymentInfoY = summaryStartY + 70;
    // doc.setFontSize(10).setFont('helvetica', 'bold');
    // doc.text('Informasi Pembayaran:', 15, paymentInfoY);
    // doc.setFont('helvetica', 'normal');
    // doc.text('Bank BCA: 1234567890', 15, paymentInfoY + 7);
    // doc.text('a.n. CV. Indigama Khatulistiwa', 15, paymentInfoY + 14);

    // // Terms and conditions
    // doc.text('Catatan:', 15, paymentInfoY + 28);
    // doc.text('- Pembayaran harap dilakukan sesuai dengan tanggal jatuh tempo', 15, paymentInfoY + 35);
    // doc.text('- Invoice ini sah tanpa tanda tangan dan stempel', 15, paymentInfoY + 42);

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
                        {/* <DropdownMenuItem onClick={() => router.get(`/invoices/${item.id}/edit`)}>Edit</DropdownMenuItem> */}
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
