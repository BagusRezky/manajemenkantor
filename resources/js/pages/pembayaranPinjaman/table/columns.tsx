/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PembayaranPinjaman } from '@/types/pembayaranPinjaman'; // Ganti

import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { Download, FileText, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

const generatePembayaranPdf = (pembayaran: PembayaranPinjaman, download = false): void => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    // --- 1. HEADER (KOP) ---
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, pageWidth - 20, 30);

    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('CV. Indigama Khatulistiwa', 15, 18);
    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text('Dsn. Blimbing RT 02 RW 11, Ds. Bulusari, Kec. Gempol, Pasuruan,', 15, 23);
    doc.text('Jawa Timur 67155', 15, 28);
    doc.text('Email: indigama.khatulistiwa01@gmail.com | Telp: 081703101012', 15, 33);

    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('BUKTI PEMBAYARAN', pageWidth - 15, 18, { align: 'right' });
    doc.setFontSize(11);
    doc.text('CICILAN PINJAMAN', pageWidth - 15, 24, { align: 'right' });

    // --- 2. INFORMASI PEMBAYARAN ---
    const pinjaman = pembayaran.pengajuan_pinjaman;
    const karyawan = pinjaman?.karyawan;
    let currentY = 52;

    doc.setLineWidth(0.5);
    doc.rect(10, 45, pageWidth - 20, 40); // Box Informasi Utama

    // Baris 1: Tahap Cicilan & Nama Karyawan
    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.text('Tahap Cicilan', 15, currentY);
    doc.text(':', 45, currentY);
    doc.setFont('helvetica', 'normal').text(pembayaran.tahap_cicilan || '-', 50, currentY);

    doc.setFont('helvetica', 'bold').text('Nama Karyawan', pageWidth - 90, currentY);
    doc.text(':', pageWidth - 55, currentY);
    doc.setFont('helvetica', 'normal').text(karyawan?.nama || '-', pageWidth - 50, currentY);

    // Baris 2: Tanggal Bayar & NIK
    currentY += 7;
    doc.setFont('helvetica', 'bold').text('Tgl. Pembayaran', 15, currentY);
    doc.text(':', 45, currentY);
    doc.setFont('helvetica', 'normal').text(
        pembayaran.tanggal_pembayaran ? format(new Date(pembayaran.tanggal_pembayaran), 'dd-MM-yyyy') : '-',
        50,
        currentY,
    );

    doc.setFont('helvetica', 'bold').text('NIK', pageWidth - 90, currentY);
    doc.text(':', pageWidth - 55, currentY);
    doc.setFont('helvetica', 'normal').text(karyawan?.nik || '-', pageWidth - 50, currentY);

    // Baris 3: No. Bukti Pengajuan & Departemen
    currentY += 7;
    doc.setFont('helvetica', 'bold').text('Ref. Pengajuan', 15, currentY);
    doc.text(':', 45, currentY);
    doc.setFont('helvetica', 'normal').text(pinjaman?.nomor_bukti_pengajuan || '-', 50, currentY);

    doc.setFont('helvetica', 'bold').text('Departemen', pageWidth - 90, currentY);
    doc.text(':', pageWidth - 55, currentY);
    doc.setFont('helvetica', 'normal').text(karyawan?.departemen || '-', pageWidth - 50, currentY);

    // Baris 4: Keterangan
    currentY += 7;
    doc.setFont('helvetica', 'bold').text('Keterangan', 15, currentY);
    doc.text(':', 45, currentY);
    doc.setFont('helvetica', 'normal').text(pembayaran.keterangan || '-', 50, currentY);

    // --- 3. TABEL RINCIAN NOMINAL ---
    currentY = 95;
    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.rect(10, currentY, pageWidth - 20, 10);
    doc.text('DETAIL TRANSAKSI', pageWidth / 2, currentY + 7, { align: 'center' });

    const tableRows = [
        { label: 'Total Pinjaman Awal', value: `Rp ${pinjaman?.nilai_pinjaman?.toLocaleString('id-ID') || '0'}` },
        { label: 'Cicilan Per Bulan', value: `Rp ${pinjaman?.cicilan_per_bulan?.toLocaleString('id-ID') || '0'}` },
        { label: 'NOMINAL DIBAYAR', value: `Rp ${pembayaran.nominal_pembayaran?.toLocaleString('id-ID') || '0'}` },
    ];

    autoTable(doc, {
        body: tableRows,
        startY: currentY + 10,
        margin: { left: 10, right: 10 },
        styles: { fontSize: 10, cellPadding: 4 },
        bodyStyles: { lineColor: [0, 0, 0], lineWidth: 0.2 },
        columnStyles: {
            0: { cellWidth: 60, fontStyle: 'bold' },
            1: { cellWidth: 'auto', halign: 'right' },
        },
        didParseCell: (data) => {
            // Memberi highlight tebal khusus untuk baris Nominal Dibayar
            if (data.row.index === 2) {
                data.cell.styles.fontStyle = 'bold';
                data.cell.styles.fillColor = [240, 240, 240];
            }
        },
    });

    // --- 4. TANDA TANGAN ---
    const tableEndY = (doc as any).lastAutoTable.finalY + 25;
    doc.setFontSize(9).setFont('helvetica', 'normal');

    doc.text('Diterima Oleh,', 40, tableEndY, { align: 'center' });
    doc.text('Pembayar,', pageWidth - 40, tableEndY, { align: 'center' });

    doc.text('( ..................................... )', 40, tableEndY + 25, { align: 'center' });
    doc.text(`( ${karyawan?.nama || '......................'} )`, pageWidth - 40, tableEndY + 25, { align: 'center' });

    // doc.text('Kasir / HRD', 40, tableEndY + 30, { align: 'center' });
    // doc.text('Karyawan', pageWidth - 40, tableEndY + 30, { align: 'center' });

    // --- 5. FOOTER ---
    doc.setFontSize(8).setFont('helvetica', 'italic');
    // doc.text(`Dicetak pada: ${format(new Date(), 'dd/MM/yyyy HH:mm:ss')}`, 10, doc.internal.pageSize.getHeight() - 10);

    // --- 6. OUTPUT ---
    if (download) {
        doc.save(`Bayar_Cicilan_${pembayaran.tahap_cicilan.replace(/\s+/g, '_')}.pdf`);
    } else {
        window.open(doc.output('bloburl'), '_blank');
    }
};

const handleDelete = (id: string) => {
    // Ganti URL
    router.delete(`/pembayaranPinjamans/${id}`, {
        onSuccess: () => toast.success('Pembayaran Pinjaman deleted successfully'),
        onError: () => toast.error('Failed to delete Pembayaran Pinjaman'),
    });
};

// Format Rupiah
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

export const columns = (): ColumnDef<PembayaranPinjaman>[] => [
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
        accessorKey: 'no_bukti',
        header: 'No Bukti',
        cell: ({ row }) => {
            const no_bukti = row.original.pengajuan_pinjaman?.nomor_bukti_pengajuan;
            return <div>{no_bukti || '-'}</div>;
        },
    },
    {
        // Tampilkan nama karyawan dari relasi
        accessorKey: 'pengajuanPinjaman',
        header: 'Karyawan',
        cell: ({ row }) => {
            const nama = row.original.pengajuan_pinjaman?.karyawan?.nama;
            return <div>{nama || '-'}</div>;
        },
    },
    {
        accessorKey: 'tanggal_pembayaran',
        header: 'Tgl. Pembayaran',
    },
    {
        accessorKey: 'nominal_pembayaran',
        header: 'Nominal',
        cell: ({ row }) => {
            // Format sebagai mata uang
            return <div>{formatCurrency(row.original.nominal_pembayaran)}</div>;
        },
    },
    {
        accessorKey: 'keterangan',
        header: 'Keterangan',
    },
    {
        accessorKey: 'tahap_cicilan',
        header: 'Tahapan Cicilan',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const pembayaranPinjaman = row.original;

            const handlePdfAction = async (download: boolean) => {
                try {
                    const response = await fetch(`/pembayaranPinjamans/${pembayaranPinjaman.id}/pdf`);
                    if (!response.ok) throw new Error();
                    const data = await response.json();
                    generatePembayaranPdf(data, download);
                } catch (error) {
                    console.error('Error fetching PDF data:', error);
                    toast.error('Gagal memproses PDF');
                }
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDelete(pembayaranPinjaman.id)}>Delete</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {/* Ganti URL edit */}
                        <DropdownMenuItem onClick={() => router.get(`/pembayaranPinjamans/${pembayaranPinjaman.id}/edit`)}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handlePdfAction(false)}>
                            <FileText className="mr-2 h-4 w-4" /> Preview PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePdfAction(true)}>
                            <Download className="mr-2 h-4 w-4" /> Download PDF
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
