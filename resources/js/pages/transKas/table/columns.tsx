/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TransKas } from '@/types/transKas';

import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ArrowDownCircle, ArrowUpCircle, Edit, Eye, MoreHorizontal, Trash } from 'lucide-react';
import { toast } from 'sonner';

const generateTransKasPdf = (data: TransKas, download = false): void => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;

    // --- Header Kiri (Identitas Perusahaan) ---
    const logo = new Image();
    logo.src = '/images/logo-kantor.png'; // Pastikan path benar
    doc.addImage(logo, 'PNG', margin, 10, 15, 15);

    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.text('CV. Indigama Khatulistiwa', 32, 14);
    doc.setFontSize(8).setFont('helvetica', 'normal');
    doc.text('Jurangpelem Satu, Bulusari, Kec. Gempol, Pasuruan,', 32, 18);
    doc.text('Jawa Timur 67155', 32, 22);
    doc.text('Email : indigama.khatulistiwa01@gmail.com', 32, 26);
    doc.text('Telp. 08131361056', 32, 30);

    // --- Header Kanan (Info Bukti) ---
    const isMasuk = data.transaksi === 1;
    const title = isMasuk ? 'BUKTI KAS MASUK' : 'BUKTI KAS KELUAR';

    doc.setFontSize(12).setFont('helvetica', 'bold');
    doc.text(title, pageWidth - margin, 14, { align: 'right' });

    doc.setFontSize(9).setFont('helvetica', 'normal');
    const infoX = pageWidth - 60;

    const labelHeader = ['Bukti', 'Gudang', 'Tanggal', 'COA', ''];
    const valueHeader = [`: ${data.no_bukti}`, `: ${data.gudang}`, `: ${data.tanggal_transaksi}`, `: ${data.account_kas?.kode_akuntansi || ''}`, `  ${data.account_kas?.nama_akun || ''}`];

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
                `${data.account_kas_lain?.kode_akuntansi || ''} - ${data.account_kas_lain?.nama_akun || ''}`,
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

const handleDelete = (id: number) => {
    if (confirm('Hapus transaksi ini? Saldo COA terkait mungkin perlu disesuaikan manual.')) {
        router.delete(route('trans-kas.destroy', id), {
            onSuccess: () => toast.success('Transaksi berhasil dihapus'),
        });
    }
};

export const columns = (): ColumnDef<TransKas>[] => [
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
            const isMasuk = row.original.transaksi === 1;
            return (
                <div className="flex items-center gap-2">
                    {isMasuk ? <ArrowUpCircle className="h-4 w-4 text-green-500" /> : <ArrowDownCircle className="h-4 w-4 text-red-500" />}
                    <span className={isMasuk ? 'font-medium text-green-600' : 'font-medium text-red-600'}>{isMasuk ? 'Masuk' : 'Keluar'}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'no_bukti',
        header: 'No. Bukti',
    },
    {
        accessorKey: 'account_kas',
        header: 'Account Kas',
        accessorFn: (row) => row.account_kas?.kode_akuntansi + ' - ' + row.account_kas?.nama_akun || '',
    },

    {
        accessorKey: 'account_kas_lain',
        header: 'Account Kas Lain',
        accessorFn: (row) => row.account_kas_lain?.kode_akuntansi + ' - ' + row.account_kas_lain?.nama_akun || '',
    },
    {
        accessorKey: 'nominal',
        header: 'Nominal',
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('nominal'));
            const formatted = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
            }).format(amount);
            return <div className="font-mono font-bold">{formatted}</div>;
        },
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
                    // Fetch data lengkap transKas beserta relasinya
                    const response = await fetch(`/trans-kas/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    // Generate dan tampilkan PDF
                    generateTransKasPdf(data, false);
                } catch (error) {
                    console.error('Error generating PDF:', error);
                    toast.error('Gagal menghasilkan PDF. Silakan coba lagi.');
                }
            };

            const handleDownloadPdf = async () => {
                try {
                    // Fetch data lengkap transKas beserta relasinya
                    const response = await fetch(`/trans-kas/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    // Generate dan download PDF
                    generateTransKasPdf(data, true);
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
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => router.get(route('trans-kas.show', item.id))}>
                            <Eye className="mr-2 h-4 w-4" /> Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.get(route('trans-kas.edit', item.id))}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDelete(item.id)}>
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
