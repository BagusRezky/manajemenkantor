/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/pengajuanPinjaman/table/columns.tsx

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PengajuanPinjaman } from '@/types/pengajuanPinjaman';

import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, FileText, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

const generatePengajuanPdf = (pinjaman: PengajuanPinjaman, download = false): void => {
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
    doc.text('PENGAJUAN PINJAMAN', pageWidth - 15, 18, { align: 'right' });

    // --- 2. INFORMASI KARYAWAN ---
    const karyawan = pinjaman.karyawan;
    let currentY = 52; // Titik mulai baris pertama data

    // Baris 1: No Bukti & Nama
    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.text('No. Bukti', 15, currentY);
    doc.text(':', 45, currentY);
    doc.setFont('helvetica', 'normal').text(pinjaman.nomor_bukti_pengajuan || '', 50, currentY);

    doc.setFont('helvetica', 'bold').text('Nama Karyawan', pageWidth - 90, currentY);
    doc.text(':', pageWidth - 55, currentY);
    doc.setFont('helvetica', 'normal').text(karyawan?.nama || '-', pageWidth - 50, currentY);

    // Baris 2: Tanggal & NIK
    currentY += 7;
    doc.setFont('helvetica', 'bold').text('Tgl Pengajuan', 15, currentY);
    doc.text(':', 45, currentY);
    doc.setFont('helvetica', 'normal').text(
        pinjaman.tanggal_pengajuan ? format(new Date(pinjaman.tanggal_pengajuan), 'dd-MM-yyyy') : '-',
        50,
        currentY,
    );

    doc.setFont('helvetica', 'bold').text('NIK', pageWidth - 90, currentY);
    doc.text(':', pageWidth - 55, currentY);
    doc.setFont('helvetica', 'normal').text(karyawan?.nik || '-', pageWidth - 50, currentY);

    // Baris 3: Jabatan & Departemen
    currentY += 7;
    doc.setFont('helvetica', 'bold').text('Jabatan', 15, currentY);
    doc.text(':', 45, currentY);
    doc.setFont('helvetica', 'normal').text(karyawan?.jabatan || '-', 50, currentY);

    doc.setFont('helvetica', 'bold').text('Departemen', pageWidth - 90, currentY);
    doc.text(':', pageWidth - 55, currentY);
    doc.setFont('helvetica', 'normal').text(karyawan?.departemen || '-', pageWidth - 50, currentY);

    // Baris 4: No KTP
    currentY += 7;
    doc.setFont('helvetica', 'bold').text('No. KTP', 15, currentY);
    doc.text(':', 45, currentY);
    doc.setFont('helvetica', 'normal').text(karyawan?.no_ktp || '-', 50, currentY);

    // Baris 5: Alamat KTP (Multi-line)
    currentY += 7;
    doc.setFont('helvetica', 'bold').text('Alamat KTP', 15, currentY);
    doc.text(':', 45, currentY);
    doc.setFont('helvetica', 'normal');
    const alamatKtp = karyawan?.alamat_ktp || '-';
    const splitAlamat = doc.splitTextToSize(alamatKtp, pageWidth - 65);
    doc.text(splitAlamat, 50, currentY);

    // Hitung sisa tinggi Alamat untuk menentukan posisi Keperluan
    const alamatHeight = (splitAlamat.length - 1) * 5;
    currentY += 7 + alamatHeight;

    // Baris 6: Keperluan (Multi-line)
    doc.setFont('helvetica', 'bold').text('Keperluan', 15, currentY);
    doc.text(':', 45, currentY);
    doc.setFont('helvetica', 'normal');
    const keperluan = pinjaman.keperluan_pinjaman || '-';
    const splitKeperluan = doc.splitTextToSize(keperluan, pageWidth - 65);
    doc.text(splitKeperluan, 50, currentY);

    const keperluanHeight = (splitKeperluan.length - 1) * 5;

    // Gambar Border untuk bagian Informasi (tingginya dinamis)
    const boxHeight = currentY + keperluanHeight + 5 - 45;
    doc.setLineWidth(0.5);
    doc.rect(10, 45, pageWidth - 20, boxHeight);

    // --- 3. TABEL RINCIAN PINJAMAN ---
    currentY += keperluanHeight + 10;
    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.rect(10, currentY, pageWidth - 20, 10);
    doc.text('RINCIAN PINJAMAN', pageWidth / 2, currentY + 6, { align: 'center' });

    const tableRows = [
        { label: 'Nilai Pinjaman', value: `Rp ${pinjaman.nilai_pinjaman?.toLocaleString('id-ID')}` },
        { label: 'Jangka Waktu', value: `${pinjaman.jangka_waktu_pinjaman} Bulan` },
        { label: 'Cicilan Per Bulan', value: `Rp ${pinjaman.cicilan_per_bulan?.toLocaleString('id-ID')}` },
        { label: 'Kode Gudang', value: pinjaman.kode_gudang },
        { label: 'No. Telepon', value: karyawan?.no_telp || '-' },
    ];

    autoTable(doc, {
        body: tableRows,
        startY: currentY + 10,
        margin: { left: 10, right: 10 },
        styles: { fontSize: 9, cellPadding: 3 },
        bodyStyles: { lineColor: [0, 0, 0], lineWidth: 0.2 },
        columnStyles: {
            0: { cellWidth: 50, fontStyle: 'bold' },
            1: { cellWidth: 'auto' },
        },
    });

    // --- 4. TANDA TANGAN ---
    const tableEndY = (doc as any).lastAutoTable.finalY + 20;
    const signArea = pageWidth / 3;
    doc.setFontSize(9).setFont('helvetica', 'normal');

    doc.text('Diajukan Oleh,', 10 + signArea / 2, tableEndY, { align: 'center' });
    doc.text('Diketahui Oleh,', pageWidth / 2, tableEndY, { align: 'center' });
    doc.text('Disetujui Oleh,', pageWidth - 10 - signArea / 2, tableEndY, { align: 'center' });

    doc.text(`( ${karyawan?.nama || '......................'} )`, 10 + signArea / 2, tableEndY + 25, { align: 'center' });
    doc.text('( ..................................... )', pageWidth / 2, tableEndY + 25, { align: 'center' });
    doc.text('( ..................................... )', pageWidth - 10 - signArea / 2, tableEndY + 25, { align: 'center' });

    // doc.text('Karyawan', 10 + signArea / 2, tableEndY + 30, { align: 'center' });
    // doc.text('HRD / Personalia', pageWidth / 2, tableEndY + 30, { align: 'center' });
    // doc.text('Pimpinan / Direktur', pageWidth - 10 - signArea / 2, tableEndY + 30, { align: 'center' });

    // --- 5. OUTPUT ---
    if (download) {
        doc.save(`Pinjaman_${pinjaman.nomor_bukti_pengajuan.replace(/\//g, '-')}.pdf`);
    } else {
        window.open(doc.output('bloburl'), '_blank');
    }
};

const handleDelete = (id: string) => {
    router.delete(`/pengajuanPinjamans/${id}`, {
        onSuccess: () => toast.success('Data Pengajuan Pinjaman berhasil dihapus'),
        onError: () => toast.error('Gagal menghapus data'),
    });
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

export const columns = (): ColumnDef<PengajuanPinjaman>[] => [
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
        accessorKey: 'nomor_bukti_pengajuan',
        header: 'Nomor Bukti',
    },
    {
        accessorKey: 'karyawan.nama',
        header: 'Karyawan',
        cell: ({ row }) => row.original.karyawan?.nama || 'N/A',
    },
    {
        accessorKey: 'tanggal_pengajuan',
        header: 'Tanggal',
    },
    {
        accessorKey: 'nilai_pinjaman',
        header: 'Nilai Pinjaman',
        cell: ({ row }) => formatCurrency(row.getValue('nilai_pinjaman')),
    },
    {
        accessorKey: 'jangka_waktu_pinjaman',
        header: 'Jangka Waktu',
        cell: ({ row }) => `${row.getValue('jangka_waktu_pinjaman')} Bulan`,
    },
    {
        accessorKey: 'cicilan_per_bulan',
        header: 'Cicilan / Bulan',
        cell: ({ row }) => formatCurrency(row.getValue('cicilan_per_bulan')),
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const pengajuanPinjaman = row.original;

            const handlePdfAction = async (download: boolean) => {
                try {
                    const response = await fetch(`/pengajuanPinjamans/${pengajuanPinjaman.id}/pdf`);
                    if (!response.ok) throw new Error();
                    const data = await response.json();
                    generatePengajuanPdf(data, download);
                } catch (error) {
                    console.error('PDF generation error:', error);
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
                        <DropdownMenuItem onClick={() => router.get(`/pengajuanPinjamans/${pengajuanPinjaman.id}/edit`)}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(pengajuanPinjaman.id)}>Delete</DropdownMenuItem>
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
