/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { OperasionalPay } from '@/types/operasionalPay';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ArrowDownCircle, Edit, Eye, MoreHorizontal, Trash } from 'lucide-react';
import { toast } from 'sonner';

const generateOperasionalPayPdf = (data: OperasionalPay, download = false): void => {
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
    doc.setFontSize(12).setFont('helvetica', 'bold');
    doc.text('BUKTI OPERASIONAL KELUAR', pageWidth - margin, 14, { align: 'right' });

    doc.setFontSize(9).setFont('helvetica', 'normal');
    const infoX = pageWidth - 65;

    // Menampilkan No Bukti, Gudang, Tanggal, dan Akun Kas (Kode + Nama)
    const labelHeader = ['No. Bukti', 'Gudang', 'Tanggal', 'Akun Kas', ''];
    const valueHeader = [
        `: ${data.no_bukti}`,
        `: ${data.gudang}`,
        `: ${data.tanggal_transaksi}`,
        `: ${data.account_kas?.kode_akuntansi || ''}`,
        `  ${data.account_kas?.nama_akun || ''}`, // Nama akun di bawah kode
    ];

    labelHeader.forEach((label, i) => {
        doc.text(label, infoX, 22 + i * 5);
        doc.text(valueHeader[i], infoX + 20, 22 + i * 5);
    });

    // --- Info Karyawan & Kendaraan (Kiri Bawah Header) ---
    doc.setFontSize(9).setFont('helvetica', 'normal');
    let currentY = 45;
    if (data.karyawan) {
        doc.text(`Karyawan : ${data.karyawan.nama}`, margin, currentY);
        currentY += 5;
    }
    // Nopol dipindah ke sini sesuai permintaan
    const infoKendaraan = `Unit/Nopol : ${data.mesin || '-'} / ${data.nopol || '-'}`;
    doc.text(infoKendaraan, margin, currentY);

    // --- Tabel Transaksi ---
    autoTable(doc, {
        startY: currentY + 5,
        margin: { left: margin, right: margin },
        theme: 'plain',
        head: [['Akun Beban / Keterangan', 'Nilai']],
        body: [
            [
                {
                    content: `${data.account_beban?.kode_akuntansi || ''} - ${data.account_beban?.nama_akun || ''}\nKet: ${data.keterangan || '-'}`,
                    styles: { halign: 'left' },
                },
                new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.nominal),
            ],
        ],
        styles: { fontSize: 9, cellPadding: 3, lineColor: [0, 0, 0], lineWidth: 0.1 },
        headStyles: { fontStyle: 'bold', halign: 'center' },
        columnStyles: {
            0: { cellWidth: 'auto' },
            1: { cellWidth: 50, halign: 'right' },
        },
    });

    const finalY = (doc as any).lastAutoTable.finalY;

    // --- Terbilang & Total ---
    doc.setLineWidth(0.1);
    doc.rect(margin, finalY, pageWidth - margin * 2, 10);
    doc.setFontSize(9).setFont('helvetica', 'italic');
    doc.text(`Terbilang : ${terbilang(data.nominal)} Rupiah `, margin + 2, finalY + 6);

    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.text('Total  Rp.', pageWidth - 65, finalY + 6);
    doc.text(new Intl.NumberFormat('id-ID').format(data.nominal), pageWidth - margin - 2, finalY + 6, { align: 'right' });

    // --- Tanda Tangan (3 Kolom) ---
    const signY = finalY + 20;
    const colWidth = (pageWidth - margin * 2) / 3; // Menyesuaikan jadi 3 kolom
    const labels = ['Dibuat Oleh,', 'Diperiksa Oleh,', 'Disetujui Oleh,'];

    labels.forEach((label, i) => {
        const xPos = margin + i * colWidth + colWidth / 2;
        doc.setFontSize(9).setFont('helvetica', 'normal');
        doc.text(label, xPos, signY, { align: 'center' });
        doc.text('________________', xPos, signY + 25, { align: 'center' });
    });

    // --- Footer ---
    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Dicetak pada: ${today}`, margin, 285);
    doc.text('Halaman 1 dari 1', pageWidth - margin, 285, { align: 'right' });

    if (download) {
        doc.save(`${data.no_bukti}.pdf`);
    } else {
        window.open(doc.output('bloburl'), '_blank');
    }
};

// --- Helper Fungsi Terbilang ---
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

export const columns = (): ColumnDef<OperasionalPay>[] => [
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
    { accessorKey: 'no_bukti', header: 'No. Bukti' },

    {
        accessorKey: 'account_kas',
        header: 'Akun Kas',
        accessorFn: (row) => row.account_kas?.kode_akuntansi + ' - ' + row.account_kas?.nama_akun,
    },
    {
        accessorKey: 'account_beban',
        header: 'Akun Beban',
        accessorFn: (row) => row.account_beban?.kode_akuntansi + ' - ' + row.account_beban?.nama_akun,
    },
    {
        accessorKey: 'nominal',
        header: 'Nominal',
        cell: ({ row }) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.original.nominal),
    },
    {
        accessorKey: 'tanggal_transaksi',
        header: 'Tanggal Transaksi',
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

            const handlePdf = async (download = false) => {
                try {
                    const response = await fetch(`/operasionalPays/${item.id}/pdf`);
                    if (!response.ok) throw new Error('Network response was not ok');
                    const data = await response.json();
                    generateOperasionalPayPdf(data, download);
                } catch (error) {
                    console.error('Error:', error);
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
                        <DropdownMenuItem onClick={() => router.get(route('operasionalPays.show', item.id))}>
                            <Eye className="mr-2 h-4 w-4" /> Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.get(route('operasionalPays.edit', item.id))}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handlePdf(false)}>
                            <Eye className="mr-2 h-4 w-4" /> Preview PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePdf(true)}>
                            <ArrowDownCircle className="mr-2 h-4 w-4" /> Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                                if (confirm('Hapus data ini?')) router.delete(route('operasionalPays.destroy', item.id));
                            }}
                        >
                            <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
