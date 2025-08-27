/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PaymentEntryGood } from '@/types/paymentEntryGood';

import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import { Download, FileText, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

// Function untuk generate PDF paymentEntryGood
const generatePaymentEntryGoodPdf = (paymentEntryGood: PaymentEntryGood, download = false): void => {
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
    doc.text('Payment Entry Good', pageWidth - 15, 18, { align: 'right' });

    // Informasi surat jalan
    doc.setLineWidth(0.5);
    doc.rect(10, 45, pageWidth - 20, 60);

    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.text('No. Penerimaan Barang', 15, 52);
    doc.text(':', 65, 52);
    doc.setFont('helvetica', 'normal');
    doc.text(paymentEntryGood.penerimaan_barang?.no_surat_jalan || '-', 70, 52);

    doc.setFont('helvetica', 'bold');
    doc.text('No. Tagihan', pageWidth - 85, 52);
    doc.text(':', pageWidth - 50, 52);
    doc.setFont('helvetica', 'normal');
    doc.text(paymentEntryGood.no_tagihan || '', pageWidth - 45, 52);

    doc.setFont('helvetica', 'bold');
    doc.text('Tanggal Transaksi', 15, 59);
    doc.text(':', 65, 59);
    doc.setFont('helvetica', 'normal');
    const formattedDate = paymentEntryGood.tanggal_transaksi ? format(new Date(paymentEntryGood.tanggal_transaksi), 'dd-MM-yyyy') : '';
    doc.text(formattedDate, 70, 59);

    doc.setFont('helvetica', 'bold');
    doc.text('Tanggal Jatuh Tempo', pageWidth - 85, 59);
    doc.text(':', pageWidth - 50, 59);
    doc.setFont('helvetica', 'normal');
    doc.text(paymentEntryGood.tanggal_jatuh_tempo ? format(new Date(paymentEntryGood.tanggal_jatuh_tempo), 'dd-MM-yyyy') : '', pageWidth - 45, 59);

    doc.setFont('helvetica', 'bold');
    doc.text('harga per Qty', 15, 66);
    doc.text(':', 65, 66);
    doc.setFont('helvetica', 'normal');
    doc.text(paymentEntryGood.harga_per_qty.toString() || '', 70, 66);

    doc.setFont('helvetica', 'bold');
    doc.text('Diskon', pageWidth - 85, 66);
    doc.text(':', pageWidth - 50, 66);
    doc.setFont('helvetica', 'normal');
    doc.text(paymentEntryGood.diskon.toString() + '%' || '', pageWidth - 45, 66);

    doc.setFont('helvetica', 'bold');
    doc.text('PPN', 15, 73);
    doc.text(':', 65, 73);
    doc.setFont('helvetica', 'normal');
    doc.text(paymentEntryGood.ppn.toString() + '%' || '', 70, 73);

    doc.setFont('helvetica', 'bold');
    doc.text('Keterangan', 15, 80);
    doc.text(':', 65, 80);
    doc.setFont('helvetica', 'normal');
    doc.text(paymentEntryGood.keterangan || '-', 70, 80);

    // // Header tabel "DATA BARANG"
    // doc.setFontSize(10).setFont('helvetica', 'bold');
    // doc.rect(10, 110, pageWidth - 20, 10);
    // doc.text('DATA BARANG', pageWidth / 2, 116, { align: 'center' });

    // // Isi tabel barang
    // const finishGoodItem = paymentEntryGood.kartu_instruksi_kerja?.sales_order?.finish_good_item;

    // const tableColumns = [
    //     { header: 'No', dataKey: 'no' },
    //     { header: 'Nama Barang', dataKey: 'nama_barang' },
    //     { header: 'Deskripsi', dataKey: 'deskripsi' },
    //     { header: 'Jumlah', dataKey: 'jumlah' },
    //     { header: 'Keterangan', dataKey: 'keterangan' },
    // ];

    // const tableRows = [
    //     {
    //         no: '1',
    //         nama_barang: finishGoodItem?.nama_barang || '-',
    //         deskripsi: finishGoodItem?.deskripsi || '-',
    //         jumlah: paymentEntryGood.qty_pengiriman || '0',
    //         keterangan: '-',
    //     },
    // ];

    // autoTable(doc, {
    //     columns: tableColumns,
    //     body: tableRows,
    //     startY: 120,
    //     margin: { left: 10, right: 10 },
    //     styles: { fontSize: 9 },
    //     headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.5 },
    //     bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.5 },
    //     columnStyles: {
    //         no: { cellWidth: 10 },
    //         nama_barang: { cellWidth: 60 },
    //         deskripsi: { cellWidth: 60 },
    //         jumlah: { cellWidth: 25, halign: 'right' },
    //         keterangan: { cellWidth: 'auto' },
    //     },
    // });

    // Ambil posisi Y setelah tabel
    const tableEndY = 120;

    // Tanda tangan
    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text('Pengirim,', 50, tableEndY, { align: 'center' });
    doc.text('Penerima,', pageWidth - 50, tableEndY, { align: 'center' });

    // Tempat tanda tangan
    doc.text('( ..................................... )', 50, tableEndY + 30, { align: 'center' });
    doc.text('( ..................................... )', pageWidth - 50, tableEndY + 30, { align: 'center' });

    // Output PDF
    if (download) {
        doc.save(`${paymentEntryGood.no_tagihan}.pdf`);
    } else {
        // ... di dalam bagian `else` dari kode Anda
        const blob = doc.output('blob');
        const blobUrl = URL.createObjectURL(blob); // Cukup satu argumen, tanpa opsi.

        // Buat nama file yang Anda inginkan
        const fileName = `${paymentEntryGood.no_tagihan?.replace(/\//g, '_')}.pdf`;

        // Tambahkan "download" di URL untuk memberi petunjuk ke browser
        const finalUrl = `${blobUrl}#filename=${encodeURIComponent(fileName)}`;

        window.open(finalUrl, '_blank');

        // Jangan lupa untuk membersihkan URL object setelah beberapa waktu atau saat tidak dibutuhkan lagi
        // setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    }
};

const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus PaymentEntryGood ini?')) {
        router.delete(`/paymentEntryGoods/${id}`, {
            onSuccess: () => {
                toast.success('PaymentEntryGood berhasil dihapus');
            },
            onError: () => {
                toast.error('Gagal menghapus PaymentEntryGood');
            },
        });
    }
};

export const columns = (): ColumnDef<PaymentEntryGood>[] => [
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
    // {
    //     accessorKey: 'no_invoice',
    //     header: 'No. PaymentEntryGood',
    // },
    {
        accessorKey: 'no_tagihan',
        header: 'No. Tagihan',
        cell: ({ row }) => {
            const data = row.original;
            return <span>{data.no_tagihan || '-'}</span>;
        },
    },
    {
        accessorKey: 'tanggal_transaksi',
        header: 'Tgl. Transaksi',
        cell: ({ row }) => {
            const data = row.original;
            return data.tanggal_transaksi ? format(new Date(data.tanggal_transaksi), 'dd-MM-yyyy') : '-';
        },
    },
    {
        accessorKey: 'tgl_jatuh_tempo',
        header: 'Tanggal Jatuh Tempo',
        cell: ({ row }) => {
            const data = row.original;
            return data.tanggal_jatuh_tempo ? format(new Date(data.tanggal_jatuh_tempo), 'dd-MM-yyyy') : '-';
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const item = row.original;

            const handlePreviewPdf = async () => {
                try {
                    // Fetch data lengkap paymentEntryGood beserta relasinya
                    const response = await fetch(`/paymentEntryGoods/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    // Generate dan tampilkan PDF
                    generatePaymentEntryGoodPdf(data, false);
                } catch (error) {
                    console.error('Error generating PDF:', error);
                    toast.error('Gagal menghasilkan PDF. Silakan coba lagi.');
                }
            };

            const handleDownloadPdf = async () => {
                try {
                    // Fetch data lengkap paymentEntryGood beserta relasinya
                    const response = await fetch(`/paymentEntryGoods/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    // Generate dan download PDF
                    generatePaymentEntryGoodPdf(data, true);
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
                        <DropdownMenuItem onClick={() => router.get(`/paymentEntryGoods/${item.id}`)}>Detail</DropdownMenuItem>
                        {/* <DropdownMenuItem onClick={() => router.get(`/paymentEntryGoods/${item.id}/edit`)}>Edit</DropdownMenuItem> */}
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
