/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TransKasBank } from '@/types/transKasBank';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ArrowDownCircle, ArrowDownLeft, ArrowUpRight, Edit, Eye, MoreHorizontal, Trash } from 'lucide-react';
import { toast } from 'sonner';


const generateTransKasBankPdf = (data: TransKasBank, download = false): void => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;

    // --- Header Kiri (Identitas Perusahaan) ---
    const logo = new Image();
    logo.src = '/images/logo-kantor.png'; 
    doc.addImage(logo, 'PNG', margin, 10, 15, 15);

    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.text('CV. Indigama Khatulistiwa', 32, 14);
    doc.setFontSize(8).setFont('helvetica', 'normal');
    doc.text('Jurangpelem Satu, Bulusari, Kec. Gempol, Pasuruan,', 32, 18);
    doc.text('Jawa Timur 67155', 32, 22);
    doc.text('Email : indigama.khatulistiwa01@gmail.com', 32, 26);
    doc.text('Telp. 08131361056', 32, 30);

    // --- Header Kanan (Info Bukti) ---
    const isMasuk = data.transaksi === 21;
    const title = isMasuk ? 'BUKTI BANK MASUK' : 'BUKTI BANK KELUAR';

    doc.setFontSize(12).setFont('helvetica', 'bold');
    doc.text(title, (pageWidth - 20) - margin, 14, { align: 'right' });

    doc.setFontSize(9).setFont('helvetica', 'normal');
    const infoX = pageWidth - 85;


    const labelHeader = ['Bukti', 'Gudang', 'Tanggal', 'COA', ''];
    const valueHeader = [`: ${data.no_bukti}`, `: ${data.gudang}`, `: ${data.tanggal_transaksi}`, `: ${data.account_bank?.kode_akuntansi || ''}`, `  ${data.account_bank?.nama_akun || ''}`];

    labelHeader.forEach((label, i) => {
        doc.text(label, infoX, 22 + i * 5);
        doc.text(valueHeader[i], infoX + 15, 22 + i * 5);
    });

    if (!isMasuk && data.karyawan) {
        doc.text(`Karyawan  : ${data.karyawan.nama}`, margin, 45);
    }

    // --- Tabel Transaksi ---
    autoTable(doc, {
        startY: isMasuk ? 45 : 50,
        margin: { left: margin, right: margin },
        theme: 'plain',
        head: [['Account', 'Keterangan', 'Nilai']],
        body: [
            [
                `${data.account_bank_lain?.kode_akuntansi || ''} - ${data.account_bank_lain?.nama_akun || ''}`,
                data.keterangan || '-',
                new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.nominal),
            ],
        ],
        styles: { fontSize: 9, cellPadding: 3, lineColor: [0, 0, 0], lineWidth: 0.1 },
        headStyles: { fontStyle: 'bold', halign: 'center' },
        columnStyles: {
            0: { cellWidth: 50 },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 40, halign: 'right' },
        },
    });

    const finalY = (doc as any).lastAutoTable.finalY;

    // --- Terbilang & Total ---
    doc.setLineWidth(0.1);
    doc.rect(margin, finalY, pageWidth - margin * 2, 10);
    doc.setFontSize(9).setFont('helvetica', 'italic');
    doc.text(`Terbilang : ${terbilang(data.nominal)} Rupiah `, margin + 2, finalY + 6);

    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.text('Total  Rp.', pageWidth - 55, finalY + 6);
    doc.text(new Intl.NumberFormat('id-ID').format(data.nominal), pageWidth - margin - 2, finalY + 6, { align: 'right' });

    // --- Tanda Tangan ---
    const signY = finalY + 20;
    const colWidth = (pageWidth - margin * 2) / 4;
    const labels = ['Dibuat Oleh,', 'Diperiksa Oleh,', 'Disetujui Oleh,', 'Diterima Oleh,'];

    labels.forEach((label, i) => {
        const xPos = margin + i * colWidth + colWidth / 2;
        doc.setFontSize(9).setFont('helvetica', 'normal');
        doc.text(label, xPos, signY, { align: 'center' });
        doc.text('________________', xPos, signY + 20, { align: 'center' });
    });

    // --- Footer Tanggal Cetak ---
    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(today, margin, 285);
    doc.text('Page 1 of 1', pageWidth - margin, 285, { align: 'right' });

    if (download) {
        doc.save(`${data.no_bukti}.pdf`);
    } else {
        window.open(doc.output('bloburl'), '_blank');
    }
};

// Helper Fungsi Terbilang Sederhana
function terbilang(nominal: number): string {
    const bilangan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
    if (nominal < 12) return bilangan[nominal];
    if (nominal < 20) return terbilang(nominal - 10) + ' Belas';
    if (nominal < 100) return terbilang(Math.floor(nominal / 10)) + ' Puluh ' + terbilang(nominal % 10);
    if (nominal < 200) return ' Seratus ' + terbilang(nominal - 100);
    if (nominal < 1000) return terbilang(Math.floor(nominal / 100)) + ' Ratus ' + terbilang(nominal % 100);
    if (nominal < 2000) return ' Seribu ' + terbilang(nominal - 1000);
    if (nominal < 1000000) return terbilang(Math.floor(nominal / 1000)) + ' Ribu ' + terbilang(nominal % 1000);
    if (nominal < 1000000000) return terbilang(Math.floor(nominal / 1000000)) + ' Juta ' + terbilang(nominal % 1000000);
    return '';
}

export const columns = (): ColumnDef<TransKasBank>[] => [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            />
        ),
        cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />,
    },
    {
        accessorKey: 'transaksi',
        header: 'Tipe',
        cell: ({ row }) => {
            const isMasuk = row.original.transaksi === 21;
            return (
                <div className={`flex items-center gap-2 font-medium ${isMasuk ? 'text-blue-600' : 'text-orange-600'}`}>
                    {isMasuk ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                    {isMasuk ? 'Bank Masuk' : 'Bank Keluar'}
                </div>
            );
        },
    },
    { accessorKey: 'no_bukti', header: 'No. Bukti' },
    {
        accessorKey: 'account_bank',
        header: 'Account Bank',
        accessorFn: (row) => row.account_bank?.kode_akuntansi + ' - ' + row.account_bank?.nama_akun || '',
    },
    {
        accessorKey: 'account_bank_lain',
        header: 'Account Bank Lain',
        accessorFn: (row) => row.account_bank_lain?.kode_akuntansi + ' - ' + row.account_bank_lain?.nama_akun || '',
    },
    {
        accessorKey: 'nominal',
        header: 'Nominal',
        cell: ({ row }) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.original.nominal),
    },
    {
        accessorKey: 'tanggal_transaksi',
        header: 'Tanggal Transaksi',
        cell: ({ row }) => row.getValue('tanggal_transaksi'),
    },
    {
        accessorKey: 'keterangan',
        header: 'Keterangan',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
                const item = row.original;
            const handlePreviewPdf = async () => {
                try {
                    // Fetch data lengkap transKasBank beserta relasinya
                    const response = await fetch(`/trans-kas-banks/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    // Generate dan tampilkan PDF
                    generateTransKasBankPdf(data, false);
                } catch (error) {
                    console.error('Error generating PDF:', error);
                    toast.error('Gagal menghasilkan PDF. Silakan coba lagi.');
                }
            };

            const handleDownloadPdf = async () => {
                try {
                    // Fetch data lengkap transKasBank beserta relasinya
                    const response = await fetch(`/trans-kas-banks/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    // Generate dan download PDF
                    generateTransKasBankPdf(data, true);
                } catch (error) {
                    console.error('Error downloading PDF:', error);
                    toast.error('Gagal mengunduh PDF. Silakan coba lagi.');
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
                    <DropdownMenuItem onClick={() => router.get(route('trans-kas-banks.show', row.original.id))}>
                        <Eye className="mr-2 h-4 w-4" /> Detail
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.get(route('trans-kas-banks.edit', row.original.id))}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={() => router.delete(route('trans-kas-banks.destroy', row.original.id))}>
                        <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handlePreviewPdf}>
                        <Eye className="mr-2 h-4 w-4" /> Preview PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDownloadPdf}>
                        <ArrowDownCircle className="mr-2 h-4 w-4" /> Download PDF
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            );
        },
    },
];
