/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Blokir } from '@/types/blokir';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

// Function untuk generate PDF blokir
const generateBlokirPdf = (blokir: Blokir, download = false): void => {
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
    doc.text('Dsn. Blimbing RT 02 RW 11, Ds. Bulusari, Kec. Gempol, Pasuruan,', 15, 23);
    doc.text('Jawa Timur 67155', 15, 28);
    doc.text('Email: indigama.khatulistiwa01@gmail.com', 15, 33);
    doc.text('Telp: 081703101012', 15, 38);

    // Judul
    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('BLOKIR PRODUKSI', pageWidth - 15, 18, { align: 'right' });

    // Informasi blokir
    doc.setLineWidth(0.5);
    doc.rect(10, 45, pageWidth - 20, 50);

    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.text('No. Blokir', 15, 52);
    doc.text(':', 65, 52);
    doc.setFont('helvetica', 'normal');
    doc.text(blokir.no_blokir || '', 70, 52);

    doc.setFont('helvetica', 'bold');
    doc.text('No. SPK/SPK', pageWidth - 85, 52);
    doc.text(':', pageWidth - 50, 52);
    doc.setFont('helvetica', 'normal');
    doc.text(blokir.kartu_instruksi_kerja?.no_kartu_instruksi_kerja || '', pageWidth - 45, 52);

    doc.setFont('helvetica', 'bold');
    doc.text('Tanggal Blokir', 15, 59);
    doc.text(':', 65, 59);
    doc.setFont('helvetica', 'normal');
    const formattedDate = blokir.tgl_blokir ? format(new Date(blokir.tgl_blokir), 'dd-MM-yyyy HH:mm:ss') : '';
    doc.text(formattedDate, 70, 59);

    doc.setFont('helvetica', 'bold');
    doc.text('No. SO', pageWidth - 85, 59);
    doc.text(':', pageWidth - 50, 59);
    doc.setFont('helvetica', 'normal');
    doc.text(blokir.kartu_instruksi_kerja?.sales_order?.no_bon_pesanan || '', pageWidth - 45, 59);

    doc.setFont('helvetica', 'bold');
    doc.text('Operator', 15, 66);
    doc.text(':', 65, 66);
    doc.setFont('helvetica', 'normal');
    doc.text(blokir.operator || '', 70, 66);

    doc.setFont('helvetica', 'bold');
    doc.text('Customer', pageWidth - 85, 66);
    doc.text(':', pageWidth - 50, 66);
    doc.setFont('helvetica', 'normal');
    doc.text(blokir.kartu_instruksi_kerja?.sales_order?.customer_address?.nama_customer || '', pageWidth - 45, 66);

    doc.setFont('helvetica', 'bold');
    doc.text('Qty Blokir', 15, 73);
    doc.text(':', 65, 73);
    doc.setFont('helvetica', 'normal');
    doc.text(blokir.qty_blokir?.toLocaleString() || '0', 70, 73);

    doc.setFont('helvetica', 'bold');
    doc.text('Nama Barang', pageWidth - 85, 73);
    doc.text(':', pageWidth - 50, 73);
    doc.setFont('helvetica', 'normal');
    const namaBarang = blokir.kartu_instruksi_kerja?.sales_order?.finish_good_item?.nama_barang || '';
    doc.text(namaBarang.substring(0, 30) + (namaBarang.length > 30 ? '...' : ''), pageWidth - 45, 73);

    doc.setFont('helvetica', 'bold');
    doc.text('Keterangan', 15, 80);
    doc.text(':', 65, 80);
    doc.setFont('helvetica', 'normal');
    const keterangan = blokir.keterangan_blokir || '-';
    // Split keterangan jika terlalu panjang
    const lines = doc.splitTextToSize(keterangan, pageWidth - 85);
    doc.text(lines, 70, 80);

    // Detail Produk
    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.rect(10, 100, pageWidth - 20, 10);
    doc.text('DETAIL PRODUK', pageWidth / 2, 106, { align: 'center' });

    // Tabel detail produk
    const tableColumns = [
        { header: 'Keterangan', dataKey: 'keterangan' },
        { header: 'Detail', dataKey: 'detail' },
    ];

    const finishGoodItem = blokir.kartu_instruksi_kerja?.sales_order?.finish_good_item;
    const tableRows = [
        {
            keterangan: 'Nama Barang',
            detail: finishGoodItem?.nama_barang || '-',
        },
        {
            keterangan: 'Deskripsi',
            detail: finishGoodItem?.deskripsi || '-',
        },
        {
            keterangan: 'Ukuran Potong',
            detail: finishGoodItem?.ukuran_potong || '-',
        },
        {
            keterangan: 'Ukuran Cetak',
            detail: finishGoodItem?.ukuran_cetak || '-',
        },
        {
            keterangan: 'Spesifikasi Kertas',
            detail: finishGoodItem?.spesifikasi_kertas || '-',
        },
        {
            keterangan: 'Jumlah Up',
            detail: `UP 1: ${finishGoodItem?.up_satu || 0} | UP 2: ${finishGoodItem?.up_dua || 0} | UP 3: ${finishGoodItem?.up_tiga || 0}`,
        },
        {
            keterangan: 'Jumlah Pesanan',
            detail: blokir.kartu_instruksi_kerja?.sales_order?.jumlah_pesanan?.toLocaleString() || '-',
        },
    ];

    autoTable(doc, {
        columns: tableColumns,
        body: tableRows,
        startY: 110,
        margin: { left: 10, right: 10 },
        styles: { fontSize: 9 },
        headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            lineColor: [0, 0, 0],
            lineWidth: 0.5,
        },
        bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineColor: [0, 0, 0],
            lineWidth: 0.5,
        },
        columnStyles: {
            keterangan: { cellWidth: 50 },
            detail: { cellWidth: 'auto' },
        },
    });

    // Ambil posisi Y setelah tabel
    const tableEndY = (doc as any).lastAutoTable.finalY + 20;

    // Tanda tangan
    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text('Dibuat Oleh,', 50, tableEndY, { align: 'center' });
    doc.text('Disetujui Oleh,', pageWidth - 50, tableEndY, { align: 'center' });

    // Tempat tanda tangan
    doc.text('( ..................................... )', 50, tableEndY + 30, { align: 'center' });
    doc.text('( ..................................... )', pageWidth - 50, tableEndY + 30, { align: 'center' });

    // Output PDF
    if (download) {
        doc.save(`${blokir.no_blokir}.pdf`);
    } else {
        window.open(doc.output('bloburl'), '_blank');
    }
};

const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data blokir ini?')) {
        router.delete(`/blokirs/${id}`, {
            onSuccess: () => {
                toast.success('Blokir berhasil dihapus');
            },
            onError: () => {
                toast.error('Gagal menghapus blokir');
            },
        });
    }
};

export const columns = (): ColumnDef<Blokir>[] => [
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
        accessorKey: 'no_blokir',
        header: 'No. Blokir',
        cell: ({ row }) => {
            const data = row.original;
            return <div className="font-medium">{data.no_blokir}</div>;
        },
    },
    {
        accessorKey: 'kartu_instruksi_kerja.no_kartu_instruksi_kerja',
        header: 'No. SPK',
        cell: ({ row }) => {
            const data = row.original;
            return <span>{data.kartu_instruksi_kerja?.no_kartu_instruksi_kerja || '-'}</span>;
        },
    },
    {
        accessorKey: 'tgl_blokir',
        header: 'Tanggal Blokir',
        cell: ({ row }) => {
            const data = row.original;
            return data.tgl_blokir ? format(new Date(data.tgl_blokir), 'dd-MM-yyyy') : '-';
        },
    },
    {
        accessorKey: 'operator',
        header: 'Operator',
    },
    {
        accessorKey: 'qty_blokir',
        header: 'Qty Blokir',
        cell: ({ row }) => {
            const data = row.original;
            return (
                <Badge variant="secondary" className="font-mono">
                    {data.qty_blokir.toLocaleString()}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'kartu_instruksi_kerja.sales_order.customer_address.nama_customer',
        header: 'Customer',
        cell: ({ row }) => {
            const data = row.original;
            return <span>{data.kartu_instruksi_kerja?.sales_order?.customer_address?.nama_customer || '-'}</span>;
        },
    },
    {
        accessorKey: 'keterangan_blokir',
        header: 'Keterangan',
        cell: ({ row }) => {
            const data = row.original;
            return data.keterangan_blokir ? (
                <div className="max-w-xs truncate" title={data.keterangan_blokir}>
                    {data.keterangan_blokir}
                </div>
            ) : (
                <span className="text-gray-400">-</span>
            );
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const item = row.original;

            const handlePreviewPdf = async () => {
                try {
                    // Fetch data lengkap blokir beserta relasinya
                    const response = await fetch(`/blokirs/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    // Generate dan tampilkan PDF
                    generateBlokirPdf(data, false);
                } catch (error) {
                    console.error('Error generating PDF:', error);
                    toast.error('Gagal menghasilkan PDF. Silakan coba lagi.');
                }
            };

            const handleDownloadPdf = async () => {
                try {
                    // Fetch data lengkap blokir beserta relasinya
                    const response = await fetch(`/blokirs/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    // Generate dan download PDF
                    generateBlokirPdf(data, true);
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
                        {/* <DropdownMenuItem onClick={() => router.get(`/blokirs/${item.id}`)}>Detail</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.get(`/blokirs/${item.id}/edit`)}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator /> */}
                        <DropdownMenuItem onClick={() => handleDelete(item.id)}>Delete</DropdownMenuItem>
                        {/* <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handlePreviewPdf}>
                            <FileText className="mr-2 h-4 w-4" />
                            Preview PDF
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleDownloadPdf}>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                        </DropdownMenuItem> */}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
