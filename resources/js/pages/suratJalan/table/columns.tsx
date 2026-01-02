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

// Function untuk generate PDF surat jalan
const generateSuratJalanPdf = (suratJalan: SuratJalan, download = false): void => {
    // Inisialisasi dokumen PDF
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    const logo = new Image();
    logo.src = '/images/logo-kantor.png';
    doc.addImage(logo, 'PNG', 15, 14, 18, 18);

    // Header dengan border
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

    // Title
    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('SURAT JALAN', pageWidth - 15, 18, { align: 'right' });

    // Informasi surat jalan
    doc.setLineWidth(0.5);
    doc.rect(10, 45, pageWidth - 20, 45);

    // ===== Informasi Surat Jalan =====
    const leftLabelX = 15;
    const leftColonX = 45; // Diperpendek dari 65 ke 45 agar lebih rapat
    const leftValueX = 48; // Nilai dimulai tepat setelah titik dua

    const rightLabelX = pageWidth - 95;
    const rightColonX = pageWidth - 70; // Diperpendek juga untuk sisi kanan
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

    // --- Alamat Tujuan dengan Wrap Text ---
    doc.setFont('helvetica', 'bold');
    doc.text('Alamat Tujuan', leftLabelX, 80);
    doc.text(':', leftColonX, 80);

    doc.setFont('helvetica', 'normal');
    const alamat = suratJalan.alamat_tujuan || '';
    // Membatasi lebar teks alamat (misal: 120mm) agar pindah baris jika kepanjangan
    const splitAlamat = doc.splitTextToSize(alamat, 120);
    doc.text(splitAlamat, leftValueX, 80);

    // Header tabel "DATA BARANG"
    // Posisi Y disesuaikan sedikit ke bawah jika alamat sangat panjang
    const tableHeaderY = 100;
    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.rect(10, tableHeaderY, pageWidth - 20, 10);
    doc.text('DATA BARANG', pageWidth / 2, tableHeaderY + 6, { align: 'center' });

    // 1. Hitung Total Box dari data packaging
    const packagings = suratJalan.kartu_instruksi_kerja?.packagings || [];
    const totalBox = packagings.reduce((acc, pkg) => {
        return acc + (Number(pkg.jumlah_satuan_penuh) || 0) + (Number(pkg.jumlah_satuan_sisa) || 0);
    }, 0);

    // Isi tabel barang
    const finishGoodItem = suratJalan.kartu_instruksi_kerja?.sales_order?.finish_good_item;

    const tableColumns = [
        { header: 'No', dataKey: 'no' },
        { header: 'Nama Barang', dataKey: 'nama_barang' },
        { header: 'Box', dataKey: 'box' },
        { header: 'Jumlah', dataKey: 'jumlah' },
        { header: 'Keterangan', dataKey: 'keterangan' },
    ];

    const tableRows = [
        {
            no: '1',
            nama_barang: finishGoodItem?.nama_barang || '-',
            box: totalBox > 0 ? `${totalBox} BOX` : '-',
            jumlah: formatWithThousandSeparator(suratJalan.qty_pengiriman) || '0',
            keterangan: '-',
        },
    ];

    autoTable(doc, {
        columns: tableColumns,
        body: tableRows,
        startY: tableHeaderY + 10,
        margin: { left: 10, right: 10 },
        styles: { fontSize: 9 },
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.5 },
        bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.5 },
        columnStyles: {
            no: { cellWidth: 10 },
            nama_barang: { cellWidth: 60 },
            deskripsi: { cellWidth: 60 },
            jumlah: { cellWidth: 25, halign: 'right' },
            keterangan: { cellWidth: 'auto' },
        },
    });

    // Ambil posisi Y setelah tabel
    const tableEndY = (doc as any).lastAutoTable.finalY + 20;

    // Tanda tangan
    doc.setFontSize(10).setFont('helvetica', 'normal');

    doc.text('Pengirim,', 40, tableEndY, { align: 'center' });
    doc.text('Mengetahui,', pageWidth / 2, tableEndY, { align: 'center' });
    doc.text('Penerima,', pageWidth - 40, tableEndY, { align: 'center' });

    // Garis tanda tangan
    doc.text('( ..................................... )', 40, tableEndY + 30, { align: 'center' });
    doc.text('( ..................................... )', pageWidth / 2, tableEndY + 30, { align: 'center' });
    doc.text('( ..................................... )', pageWidth - 40, tableEndY + 30, { align: 'center' });

    // Output PDF
    if (download) {
        doc.save(`${suratJalan.no_surat_jalan}.pdf`);
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
