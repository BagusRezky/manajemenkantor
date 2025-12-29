/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PenerimaanBarang } from '@/types/penerimaanBarang';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, FileText, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

// Helper function untuk mendapatkan nama satuan
const getSatuanName = (item: any) => {
    return item.purchase_order_item?.master_konversi?.nama_satuan || item.purchase_order_item?.satuan?.nama_satuan || 'PIECES';
};

// Function untuk generate PDF penerimaan barang
const generatePenerimaanBarangPdf = (penerimaanBarang: PenerimaanBarang, download = false): void => {
    // Inisialisasi dokumen PDF
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

     const logo = new Image();
     logo.src = '/images/logo-kantor.png';
     doc.addImage(logo, 'PNG', 14, 17, 17, 17);


    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('PENERIMAAN BARANG', pageWidth - 15, 18, { align: 'right' });
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

    // Informasi penerimaan
    doc.setLineWidth(0.5);
    doc.rect(10, 45, pageWidth - 20, 45);

    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.text('No.Penerimaan Barang', 15, 52);
    doc.text(':', 65, 52);
    doc.setFont('helvetica', 'normal');
    doc.text(penerimaanBarang.no_laporan_barang || '', 70, 52);

    doc.setFont('helvetica', 'bold');
    doc.text('Referensi (No.PO)', pageWidth - 85, 52);
    doc.text(':', pageWidth - 50, 52);
    doc.setFont('helvetica', 'normal');
    doc.text(penerimaanBarang.purchase_order?.no_po || '', pageWidth - 45, 52);

    doc.setFont('helvetica', 'bold');
    doc.text('Tgl.Penerimaan', 15, 59);
    doc.text(':', 65, 59);
    doc.setFont('helvetica', 'normal');
    const formattedDate = penerimaanBarang.tgl_terima_barang ? format(new Date(penerimaanBarang.tgl_terima_barang), 'dd-MM-yyyy HH:mm:ss') : '';
    doc.text(formattedDate, 70, 59);

    doc.setFont('helvetica', 'bold');
    doc.text('Supplier', 15, 66);
    doc.text(':', 65, 66);
    doc.setFont('helvetica', 'normal');
    doc.text(penerimaanBarang.purchase_order?.supplier?.nama_suplier || '', 70, 66);

    doc.setFont('helvetica', 'bold');
    doc.text('No.Surat Jalan', 15, 73);
    doc.text(':', 65, 73);
    doc.setFont('helvetica', 'normal');
    doc.text(penerimaanBarang.no_surat_jalan || '', 70, 73);

    doc.setFont('helvetica', 'bold');
    doc.text('No.Pol / Nama Pengirim', 15, 80);
    doc.text(':', 65, 80);
    doc.setFont('helvetica', 'normal');
    doc.text(`${penerimaanBarang.nopol_kendaraan || ''} / ${penerimaanBarang.nama_pengirim || ''}`, 70, 80);

    doc.setFont('helvetica', 'bold');
    doc.text('Keterangan', 15, 87);
    doc.text(':', 65, 87);
    doc.setFont('helvetica', 'normal');
    doc.text(penerimaanBarang.catatan_pengirim || '-', 70, 87);

    // Header tabel "DATA ITEM"
    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.rect(10, 90, pageWidth - 20, 10);
    doc.text('DATA ITEM', pageWidth / 2, 96, { align: 'center' });

    // Isi tabel item menggunakan autoTable
    const tableColumns = [
        { header: 'No', dataKey: 'no' },
        { header: 'Kode - Nama Item', dataKey: 'item' },
        { header: 'Qty', dataKey: 'qty' },
        { header: 'Satuan', dataKey: 'satuan' },
        { header: 'Catatan Item', dataKey: 'catatan' },
    ];

    const tableRows =
        penerimaanBarang.items?.map((item, index) => {
            return {
                no: (index + 1).toString(),
                item: `${item.purchase_order_item?.master_item?.kode_master_item || ''} - ${item.purchase_order_item?.master_item?.nama_master_item || ''}`,
                qty: item.qty_penerimaan.toString(),
                satuan: getSatuanName(item),
                catatan: item.catatan_item || '-',
            };
        }) || [];

    autoTable(doc, {
        columns: tableColumns,
        body: tableRows,
        startY: 100,
        margin: { left: 10, right: 10 },
        styles: { fontSize: 9 },
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.5 },
        bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.5 },
        columnStyles: {
            no: { cellWidth: 10 },
            item: { cellWidth: 70 },
            qty: { cellWidth: 25, halign: 'right' },
            satuan: { cellWidth: 25 },
            catatan: { cellWidth: 'auto' },
        },
    });

    // Ambil posisi Y setelah tabel
    const tableEndY = (doc as any).lastAutoTable.finalY + 20;

    // Tanda tangan
    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text('Pengirim,', 50, tableEndY, { align: 'center' });
    doc.text('Penerima,', pageWidth - 50, tableEndY, { align: 'center' });

    // Tempat tanda tangan
    doc.text('( ..................................... )', 50, tableEndY + 30, { align: 'center' });
    doc.text('( ..................................... )', pageWidth - 50, tableEndY + 30, { align: 'center' });

    // Output PDF
    if (download) {
        doc.save(`${penerimaanBarang.no_laporan_barang}.pdf`);
    } else {
        window.open(doc.output('bloburl'), '_blank');
    }
};

const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus Penerimaan Barang ini?')) {
        router.delete(`/penerimaanBarangs/${id}`, {
            onSuccess: () => {
                toast.success('Penerimaan Barang berhasil dihapus');
            },
            onError: () => {
                toast.error('Gagal menghapus Penerimaan Barang');
            },
        });
    }
};

export const columns = (): ColumnDef<PenerimaanBarang>[] => [
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
        accessorKey: 'no_laporan_barang',
        header: 'No. Laporan Barang',
    },
    {
        accessorKey: 'purchase_order.no_po',
        header: 'No. PO',
        cell: ({ row }) => {
            const data = row.original;
            return <span>{data.purchase_order?.no_po || '-'}</span>;
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const item = row.original;

            const handlePreviewPdf = async () => {
                try {
                    // Fetch data lengkap penerimaan barang beserta relasinya
                    const response = await fetch(`/penerimaanBarangs/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    // Generate dan tampilkan PDF
                    generatePenerimaanBarangPdf(data, false);
                } catch (error) {
                    console.error('Error generating PDF:', error);
                    toast.error('Gagal menghasilkan PDF. Silakan coba lagi.');
                }
            };

            const handleDownloadPdf = async () => {
                try {
                    // Fetch data lengkap penerimaan barang beserta relasinya
                    const response = await fetch(`/penerimaanBarangs/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    // Generate dan download PDF
                    generatePenerimaanBarangPdf(data, true);
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
                        <DropdownMenuItem onClick={() => router.get(`/penerimaanBarangs/${item.id}`)}>Detail</DropdownMenuItem>
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
