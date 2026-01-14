/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SuratJalan } from '@/types/suratJalan';
import { formatWithThousandSeparator } from '@/utils/formatter/decimaltoint';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, FileText, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

// Function untuk generate PDF surat jalan ukuran NCR (9.5 x 11 inc)
const generateSuratJalanPdf = (suratJalan: SuratJalan, download = false): void => {
    // Inisialisasi dokumen PDF dengan ukuran kustom 9.5 x 11 inci
    // Lebar: 241.3mm, Tinggi: 279.4mm
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [241.3, 279.4]
    });

    const pageWidth = doc.internal.pageSize.getWidth(); // 241.3 mm
    const topMargin = 5;

    // Logo
    const logo = new Image();
    logo.src = '/images/logo-kantor.png';
    doc.addImage(logo, 'PNG', 15, topMargin + 4, 18, 18);

    // Header dengan border (menyesuaikan lebar pageWidth)
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(10, topMargin, pageWidth - 20, 30);

    // Company Info
    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('CV. Indigama Khatulistiwa', 38, topMargin + 8);
    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text('Dsn. Blimbing RT 02 RW 11, Ds. Bulusari, Kec. Gempol,', 38, topMargin + 13);
    doc.text('Pasuruan, Jawa Timur 67155', 38, topMargin + 18);
    doc.text('Email: indigama.khatulistiwa01@gmail.com', 38, topMargin + 23);
    doc.text('Telp: 081703101012', 38, topMargin + 28);

    // Title (Kanan Atas)
    doc.setFontSize(16).setFont('helvetica', 'bold');
    doc.text('SURAT JALAN', pageWidth - 15, topMargin + 10, { align: 'right' });

    // Kotak Informasi Surat Jalan
    doc.setLineWidth(0.5);
    doc.rect(10, 45, pageWidth - 20, 45);

    // ===== Informasi Surat Jalan (Pengaturan Kolom) =====
    const leftLabelX = 15;
    const leftColonX = 50;
    const leftValueX = 53;

    // Menggeser kolom kanan lebih ke kanan karena kertas lebih lebar dari A4
    const rightLabelX = pageWidth - 100;
    const rightColonX = pageWidth - 70;
    const rightValueX = pageWidth - 67;

    doc.setFontSize(10);

    // Row 1
    doc.setFont('helvetica', 'bold');
    doc.text('No. Surat Jalan', leftLabelX, 52);
    doc.text(':', leftColonX, 52);
    doc.setFont('helvetica', 'normal');
    doc.text(suratJalan.no_surat_jalan || '', leftValueX, 52);

    doc.setFont('helvetica', 'bold');
    doc.text('Transportasi', rightLabelX, 52);
    doc.text(':', rightColonX, 52);
    doc.setFont('helvetica', 'normal');
    doc.text(suratJalan.transportasi || '', rightValueX, 52);

    // Row 2
    doc.setFont('helvetica', 'bold');
    doc.text('No. PO Customer', leftLabelX, 59);
    doc.text(':', leftColonX, 59);
    doc.setFont('helvetica', 'normal');
    doc.text(suratJalan.kartu_instruksi_kerja?.sales_order?.no_po_customer || '', leftValueX, 59);

    doc.setFont('helvetica', 'bold');
    doc.text('No. Polisi', rightLabelX, 59);
    doc.text(':', rightColonX, 59);
    doc.setFont('helvetica', 'normal');
    doc.text(suratJalan.no_polisi || '', rightValueX, 59);

    // Row 3
    doc.setFont('helvetica', 'bold');
    doc.text('Customer', leftLabelX, 66);
    doc.text(':', leftColonX, 66);
    doc.setFont('helvetica', 'normal');
    doc.text(suratJalan.kartu_instruksi_kerja?.sales_order?.customer_address?.nama_customer || '', leftValueX, 66);

    doc.setFont('helvetica', 'bold');
    doc.text('Driver', rightLabelX, 66);
    doc.text(':', rightColonX, 66);
    doc.setFont('helvetica', 'normal');
    doc.text(suratJalan.driver || '', rightValueX, 66);

    // Row 4
    doc.setFont('helvetica', 'bold');
    doc.text('Tanggal', leftLabelX, 73);
    doc.text(':', leftColonX, 73);
    doc.setFont('helvetica', 'normal');
    const formattedDate = suratJalan.tgl_surat_jalan ? format(new Date(suratJalan.tgl_surat_jalan), 'dd-MM-yyyy') : '';
    doc.text(formattedDate, leftValueX, 73);

    doc.setFont('helvetica', 'bold');
    doc.text('Keterangan', rightLabelX, 73);
    doc.text(':', rightColonX, 73);
    doc.setFont('helvetica', 'normal');
    doc.text(suratJalan.keterangan || '-', rightValueX, 73);

    // Row 5: Alamat Tujuan (Wrap Text)
    doc.setFont('helvetica', 'bold');
    doc.text('Alamat Tujuan', leftLabelX, 80);
    doc.text(':', leftColonX, 80);
    doc.setFont('helvetica', 'normal');
    const alamat = suratJalan.alamat_tujuan || '';
    // Lebar alamat disesuaikan dengan kertas yang lebih lebar
    const splitAlamat = doc.splitTextToSize(alamat, pageWidth - 70);
    doc.text(splitAlamat, leftValueX, 80);

    // Judul Tabel
    const tableHeaderY = 100;
    doc.setFontSize(11).setFont('helvetica', 'bold');
    doc.rect(10, tableHeaderY, pageWidth - 20, 10);
    doc.text('DATA BARANG', pageWidth / 2, tableHeaderY + 7, { align: 'center' });

    // Data Processing
    const packagings = suratJalan.kartu_instruksi_kerja?.packagings || [];
    const totalBox = packagings.reduce((acc, pkg) => {
        return acc + (Number(pkg.jumlah_satuan_penuh) || 0) + (Number(pkg.jumlah_satuan_sisa) || 0);
    }, 0);
    const finishGoodItem = suratJalan.kartu_instruksi_kerja?.sales_order?.finish_good_item;

    autoTable(doc, {
        columns: [
            { header: 'No', dataKey: 'no' },
            { header: 'Nama Barang', dataKey: 'nama_barang' },
            { header: 'Box', dataKey: 'box' },
            { header: 'Jumlah (Pcs)', dataKey: 'jumlah' },
            { header: 'Keterangan', dataKey: 'keterangan' },
        ],
        body: [{
            no: '1',
            nama_barang: finishGoodItem?.nama_barang || '-',
            box: totalBox > 0 ? `${totalBox} BOX` : '-',
            jumlah: formatWithThousandSeparator(suratJalan.qty_pengiriman) || '0',
            keterangan: '-',
        }],
        startY: tableHeaderY + 10,
        margin: { left: 10, right: 10 },
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            lineColor: [0, 0, 0],
            lineWidth: 0.4
        },
        bodyStyles: {
            lineColor: [0, 0, 0],
            lineWidth: 0.4
        },
        columnStyles: {
            no: { cellWidth: 12, halign: 'center' },
            nama_barang: { cellWidth: 'auto' },
            box: { cellWidth: 30, halign: 'center' },
            jumlah: { cellWidth: 35, halign: 'right' },
            keterangan: { cellWidth: 40 },
        },
    });

    // Tanda Tangan (Diposisikan di bagian bawah kertas)
    // Tinggi kertas NCR adalah 279.4, kita letakkan area tanda tangan sekitar 40-50mm dari bawah
    const footerY = (doc as any).lastAutoTable.finalY + 25;

    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text('Pengirim,', 40, footerY, { align: 'center' });
    doc.text('Mengetahui,', pageWidth / 2, footerY, { align: 'center' });
    doc.text('Penerima,', pageWidth - 40, footerY, { align: 'center' });

    doc.text('( ..................................... )', 40, footerY + 25, { align: 'center' });
    doc.text('( ..................................... )', pageWidth / 2, footerY + 25, { align: 'center' });
    doc.text('( ..................................... )', pageWidth - 40, footerY + 25, { align: 'center' });

    // Output PDF
    if (download) {
        doc.save(`SJ_${suratJalan.no_surat_jalan?.replace(/\//g, '_')}.pdf`);
    } else {
        window.open(doc.output('bloburl'), '_blank');
    }
};

const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus Surat Jalan ini?')) {
        router.delete(`/suratJalans/${id}`, {
            onSuccess: () => {
                toast.success('Surat Jalan berhasil dihapus');
            },
            onError: () => {
                toast.error('Gagal menghapus Surat Jalan');
            },
        });
    }
};

export const columns = (): ColumnDef<SuratJalan>[] => [
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
        accessorKey: 'no_surat_jalan',
        header: 'No. Surat Jalan',
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
        accessorKey: 'tgl_surat_jalan',
        header: 'Tanggal',
        cell: ({ row }) => {
            const date = row.getValue('tgl_surat_jalan') as string;
            return date ? format(new Date(date), 'dd-MM-yyyy') : '-';
        },
    },
    {
        accessorKey: 'kartu_instruksi_kerja.salesOrder.customerAddress.nama_customer',
        header: 'Customer',
        cell: ({ row }) => {
            const data = row.original;
            return <span>{data.kartu_instruksi_kerja?.sales_order?.customer_address?.nama_customer || '-'}</span>;
        },
    },

    {
        accessorKey: 'qty_pengiriman',
        header: 'Qty Pengiriman',
    },

    {
        accessorKey: 'alamat_tujuan',
        header: 'Alamat Tujuan',
        cell: ({ row }) => {
            const alamat = row.getValue('alamat_tujuan') as string;
            return (
                <div className="max-w-xs">
                    <p className="truncate" title={alamat}>
                        {alamat || '-'}
                    </p>
                </div>
            );
        },
    },
    {
        accessorKey: 'driver',
        header: 'Driver',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const item = row.original;

            const handlePreviewPdf = async () => {
                try {
                    // Fetch data lengkap surat jalan beserta relasinya
                    const response = await fetch(`/suratJalans/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    // Generate dan tampilkan PDF
                    generateSuratJalanPdf(data, false);
                } catch (error) {
                    console.error('Error generating PDF:', error);
                    toast.error('Gagal menghasilkan PDF. Silakan coba lagi.');
                }
            };

            const handleDownloadPdf = async () => {
                try {
                    // Fetch data lengkap surat jalan beserta relasinya
                    const response = await fetch(`/suratJalans/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    // Generate dan download PDF
                    generateSuratJalanPdf(data, true);
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
                        <DropdownMenuItem onClick={() => router.get(`/suratJalans/${item.id}`)}>Detail</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.get(`/suratJalans/${item.id}/edit`)}>Edit</DropdownMenuItem>
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
