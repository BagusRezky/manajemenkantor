/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Gaji } from '@/types/gaji';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { Download, FileText, MoreHorizontal, Send } from 'lucide-react';

const generateSlipGajiPdf = (data: Gaji, filters: { start_date: string; end_date: string }, download = false): void => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('CV. INDIGAMA KHATULISTIWA', pageWidth / 2, 15, { align: 'center' });
    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text('SLIP GAJI KARYAWAN', pageWidth / 2, 20, { align: 'center' });

    const periode = `${format(new Date(filters.start_date), 'dd MMMM yyyy', )} - ${format(new Date(filters.end_date), 'dd MMMM yyyy', )}`;
    doc.text(`Periode: ${periode}`, pageWidth / 2, 25, { align: 'center' });

    doc.setLineWidth(0.5);
    doc.line(10, 28, pageWidth - 10, 28);

    // Informasi Karyawan
    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.text('Nama Karyawan', 15, 35);
    doc.text(':', 50, 35);
    doc.setFont('helvetica', 'normal').text(data.nama, 55, 35);

    doc.setFont('helvetica', 'bold').text('Total Hadir', 15, 40);
    doc.text(':', 50, 40);
    doc.setFont('helvetica', 'normal').text(`${data.hadir} Hari`, 55, 40);

    doc.setFont('helvetica', 'bold').text('Lembur / Izin', pageWidth - 80, 35);
    doc.text(':', pageWidth - 45, 35);
    doc.setFont('helvetica', 'normal').text(`${data.total_lembur} / ${data.total_izin} Hari`, pageWidth - 40, 35);

    // Tabel Rincian (Pendapatan & Potongan)
    const pendapatan = [
        ['Gaji Pokok (Proporsional)', `Rp ${data.gaji_pokok.toLocaleString('id-ID')}`],
        ['Tunjangan Kompetensi', `Rp ${data.tunjangan_kompetensi.toLocaleString('id-ID')}`],
        ['Tunjangan Jabatan', `Rp ${data.tunjangan_jabatan.toLocaleString('id-ID')}`],
        ['Tunjangan Intensif', `Rp ${data.tunjangan_intensif.toLocaleString('id-ID')}`],
        ['Bonus', `Rp ${data.bonus.toLocaleString('id-ID')}`],
    ];

    const potongan = [
        ['Potongan Kompetensi', `Rp ${data.potongan_kompetensi.toLocaleString('id-ID')}`],
        ['Potongan Jabatan', `Rp ${data.potongan_jabatan.toLocaleString('id-ID')}`],
        ['Potongan Intensif', `Rp ${data.potongan_intensif.toLocaleString('id-ID')}`],
        ['Potongan Alpha', `(Total Alpha: ${data.total_alpha})`],
    ];

    autoTable(doc, {
        startY: 45,
        head: [['Keterangan Pendapatan', 'Jumlah']],
        body: pendapatan,
        theme: 'striped',
        headStyles: { fillColor: [74, 108, 247] },
    });

    autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 5,
        head: [['Keterangan Potongan', 'Jumlah']],
        body: potongan,
        theme: 'striped',
        headStyles: { fillColor: [239, 68, 68] },
    });

    // Total Gaji Terima
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setDrawColor(0);
    doc.setFillColor(240, 240, 240);
    doc.rect(10, finalY, pageWidth - 20, 12, 'F');

    doc.setFontSize(12).setFont('helvetica', 'bold');
    doc.text('TOTAL GAJI BERSIH (TAKE HOME PAY)', 15, finalY + 8);
    doc.text(`Rp ${data.total_gaji.toLocaleString('id-ID')}`, pageWidth - 15, finalY + 8, { align: 'right' });

    // Tanda Tangan
    const signY = finalY + 30;
    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text('Penerima,', 30, signY);
    doc.text('Manajemen,', pageWidth - 50, signY);

    doc.text(`( ${data.nama} )`, 20, signY + 25);
    doc.text('( ........................... )', pageWidth - 60, signY + 25);

    if (download) {
        doc.save(`Slip_Gaji_${data.nama}_${filters.start_date}.pdf`);
    } else {
        window.open(doc.output('bloburl'), '_blank');
    }
};

export const columns: ColumnDef<Gaji>[] = [
    {
        accessorKey: 'nama',
        header: 'Nama Karyawan',
    },
    {
        accessorKey: 'hadir',
        header: 'Hadir',
    },
    {
        accessorKey: 'total_izin',
        header: 'Total Izin',
    },
    {
        accessorKey: 'total_cuti_semua',
        header: 'Total Cuti',
    },
    {
        accessorKey: 'total_alpha',
        header: 'Total Alpha',
    },
    {
        accessorKey: 'total_lembur',
        header: 'Total Lembur',
    },
    {
        accessorKey: 'gaji_pokok',
        header: 'Gaji Pokok',
        cell: ({ row }) => `Rp ${row.original.gaji_pokok.toLocaleString('id-ID')}`,
    },
    {
        accessorKey: 'tunjangan_kompetensi',
        header: 'Tunj. Kompetensi',
        cell: ({ row }) => `Rp ${row.original.tunjangan_kompetensi.toLocaleString('id-ID')}`,
    },
    {
        accessorKey: 'tunjangan_jabatan',
        header: 'Tunj. Jabatan',
        cell: ({ row }) => `Rp ${row.original.tunjangan_jabatan.toLocaleString('id-ID')}`,
    },
    {
        accessorKey: 'tunjangan_intensif',
        header: 'Tunj. Intensif',
        cell: ({ row }) => `Rp ${row.original.tunjangan_intensif.toLocaleString('id-ID')}`,
    },
    {
        accessorKey: 'potongan_kompetensi',
        header: 'Pot. Kompetensi',
        cell: ({ row }) => `Rp ${row.original.potongan_kompetensi.toLocaleString('id-ID')}`,
    },

    {
        accessorKey: 'potongan_jabatan',
        header: 'Pot. Jabatan',
        cell: ({ row }) => `Rp ${row.original.potongan_jabatan.toLocaleString('id-ID')}`,
    },

    {
        accessorKey: 'potongan_intensif',
        header: 'Pot. Intensif',
        cell: ({ row }) => `Rp ${row.original.potongan_intensif.toLocaleString('id-ID')}`,
    },
    {
        accessorKey: 'bonus',
        header: 'Bonus',
        cell: ({ row }) => `Rp ${row.original.bonus.toLocaleString('id-ID')}`,
    },
    {
        accessorKey: 'total_gaji',
        header: 'Gaji Terima',
        cell: ({ row }) => <span className="font-bold text-green-600">Rp {row.original.total_gaji.toLocaleString('id-ID')}</span>,
    },
    {
        accessorKey: 'actions',
        header: 'Actions',
        cell: ({ row, table }) => {
            const item = row.original;

            const meta: any = table.options.meta;
            const filters = meta?.filters || { start_date: '', end_date: '' };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => {
                                const start = prompt('Masukkan Tanggal Mulai (YYYY-MM-DD)');
                                const end = prompt('Masukkan Tanggal Selesai (YYYY-MM-DD)');
                                if (start && end) {
                                    router.post(route('gajis.sendSlip'), {
                                        id_karyawan: item.id,
                                        start_date: start,
                                        end_date: end,
                                    });
                                }
                            }}
                        >
                            <Send className="mr-2 h-4 w-4" /> Kirim Slip Gaji
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => generateSlipGajiPdf(item, filters, false)}>
                            <FileText className="mr-2 h-4 w-4" /> Preview PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => generateSlipGajiPdf(item, filters, true)}>
                            <Download className="mr-2 h-4 w-4" /> Download PDF
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
