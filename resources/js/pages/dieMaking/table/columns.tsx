/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DieMaking } from '@/types/dieMaking';

import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

// Function untuk generate PDF laporan die making
const generateDieMakingPdf = (diemaking: DieMaking, download = false): void => {
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
    doc.text('Jurangpelem Satu, Bulusari, Kec. Gempol, Pasuruan,', 15, 23);
    doc.text('Jawa Timur 67155', 15, 28);
    doc.text('Email: indigama.khatulistiwa01@gmail.com', 15, 33);

    // Title
    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('LAPORAN DATA DIE MAKING', pageWidth - 15, 18, { align: 'right' });

    // Informasi die making
    doc.setLineWidth(0.5);
    doc.rect(10, 45, pageWidth - 20, 55);

    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.text('Kode Die Making', 15, 52);
    doc.text(':', 65, 52);
    doc.setFont('helvetica', 'normal');
    doc.text(diemaking.kode_diemaking || '', 70, 52);

    doc.setFont('helvetica', 'bold');
    doc.text('Tanggal Entri', 15, 59);
    doc.text(':', 65, 59);
    doc.setFont('helvetica', 'normal');
    const formattedDate = diemaking.tanggal_entri ? format(new Date(diemaking.tanggal_entri), 'dd-MM-yyyy') : '';
    doc.text(formattedDate, 70, 59);

    doc.setFont('helvetica', 'bold');
    doc.text('Surat Perintah Kerja', 15, 66);
    doc.text(':', 65, 66);
    doc.setFont('helvetica', 'normal');
    doc.text(diemaking.kartu_instruksi_kerja?.no_kartu_instruksi_kerja || '', 70, 66);

    doc.setFont('helvetica', 'bold');
    doc.text('Mesin', 15, 73);
    doc.text(':', 65, 73);
    doc.setFont('helvetica', 'normal');
    doc.text(diemaking.mesin_diemaking?.nama_mesin_diemaking || '', 70, 73);

    doc.setFont('helvetica', 'bold');
    doc.text('Operator', 15, 80);
    doc.text(':', 65, 80);
    doc.setFont('helvetica', 'normal');
    doc.text(diemaking.operator_diemaking?.nama_operator_diemaking || '', 70, 80);

    doc.setFont('helvetica', 'bold');
    doc.text('Proses Die Making', 15, 87);
    doc.text(':', 65, 87);
    doc.setFont('helvetica', 'normal');
    doc.text(diemaking.proses_diemaking || '', 70, 87);

    doc.setFont('helvetica', 'bold');
    doc.text('Tahap Die Making', 15, 94);
    doc.text(':', 65, 94);
    doc.setFont('helvetica', 'normal');
    doc.text(diemaking.tahap_diemaking || '', 70, 94);

    // Header tabel "HASIL PRODUKSI"
    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.rect(10, 105, pageWidth - 20, 10);
    doc.text('HASIL PRODUKSI', pageWidth / 2, 111, { align: 'center' });

    // Isi tabel hasil produksi menggunakan autoTable
    const tableColumns = [
        { header: 'Kategori', dataKey: 'kategori' },
        { header: 'Jumlah', dataKey: 'jumlah' },
        { header: 'Satuan', dataKey: 'satuan' },
    ];

    const tableRows = [
        {
            kategori: 'Hasil Baik',
            jumlah: diemaking.hasil_baik_diemaking.toString(),
            satuan: 'Pcs',
        },
        {
            kategori: 'Hasil Rusak',
            jumlah: diemaking.hasil_rusak_diemaking.toString(),
            satuan: 'Pcs',
        },
        {
            kategori: 'Semi Waste',
            jumlah: diemaking.semi_waste_diemaking.toString(),
            satuan: 'Pcs',
        },
    ];

    autoTable(doc, {
        columns: tableColumns,
        body: tableRows,
        startY: 115,
        margin: { left: 10, right: 10 },
        styles: { fontSize: 9 },
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.5 },
        bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.5 },
        columnStyles: {
            kategori: { cellWidth: 60 },
            jumlah: { cellWidth: 30, halign: 'right' },
            satuan: { cellWidth: 30 },
        },
    });

    // Ambil posisi Y setelah tabel
    const tableEndY = (doc as any).lastAutoTable.finalY + 15;

    // Keterangan
    if (diemaking.keterangan_diemaking) {
        doc.setFontSize(10).setFont('helvetica', 'bold');
        doc.text('Keterangan:', 15, tableEndY);
        doc.setFont('helvetica', 'normal');
        doc.text(diemaking.keterangan_diemaking, 15, tableEndY + 7);
    }

    // Output PDF
    if (download) {
        doc.save(`${diemaking.kode_diemaking}.pdf`);
    } else {
        window.open(doc.output('bloburl'), '_blank');
    }
};

const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data die making ini?')) {
        router.delete(`/dieMakings/${id}`, {
            onSuccess: () => {
                toast.success('Data die making berhasil dihapus');
            },
            onError: () => {
                toast.error('Gagal menghapus data die making');
            },
        });
    }
};

export const columns = (): ColumnDef<DieMaking>[] => [
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
        accessorKey: 'kode_diemaking',
        header: 'Kode Die Making',
    },
    {
        accessorKey: 'tanggal_entri',
        header: 'Tanggal Entri',
        cell: ({ row }) => {
            const data = row.original;
            return <span>{data.tanggal_entri ? format(new Date(data.tanggal_entri), 'dd-MM-yyyy') : '-'}</span>;
        },
    },
    // {
    //     accessorKey: 'kartu_instruksi_kerja.no_kartu_instruksi_kerja',
    //     header: 'SPK',
    //     cell: ({ row }) => {
    //         const data = row.original;
    //         return <span>{data.kartu_instruksi_kerja?.no_kartu_instruksi_kerja || '-'}</span>;
    //     },
    // },
    {
        accessorKey: 'mesin_diemaking.nama_mesin_diemaking',
        header: 'Mesin',
        cell: ({ row }) => {
            const data = row.original;
            return <span>{data.mesin_diemaking?.nama_mesin_diemaking || '-'}</span>;
        },
    },
    {
        accessorKey: 'operator_diemaking.nama_operator_diemaking',
        header: 'Operator',
        cell: ({ row }) => {
            const data = row.original;
            return <span>{data.operator_diemaking?.nama_operator_diemaking || '-'}</span>;
        },
    },
    {
        accessorKey: 'proses_diemaking',
        header: 'Proses',
    },
    {
        accessorKey: 'tahap_diemaking',
        header: 'Tahap',
    },
    {
        accessorKey: 'hasil_baik_diemaking',
        header: 'Hasil Baik',
        cell: ({ row }) => {
            const data = row.original;
            return <span className="font-semibold text-green-600">{data.hasil_baik_diemaking}</span>;
        },
    },
    {
        accessorKey: 'hasil_rusak_diemaking',
        header: 'Hasil Rusak',
        cell: ({ row }) => {
            const data = row.original;
            return <span className="font-semibold text-red-600">{data.hasil_rusak_diemaking}</span>;
        },
    },
    // {
    //     accessorKey: 'keterangan_diemaking',
    //     header: 'Keterangan',
    //     cell: ({ row }) => {
    //         const data = row.original;
    //         return (
    //             <span
    //                 className={`rounded px-2 py-1 text-xs font-medium ${
    //                     data.keterangan_diemaking === 'Reguler'
    //                         ? 'bg-blue-100 text-blue-800'
    //                         : data.keterangan_diemaking === 'Subcount'
    //                           ? 'bg-purple-100 text-purple-800'
    //                           : 'bg-gray-100 text-gray-800'
    //                 }`}
    //             >
    //                 {data.keterangan_diemaking || '-'}
    //             </span>
    //         );
    //     },
    // },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const item = row.original;

            const handlePreviewPdf = async () => {
                try {
                    // Fetch data lengkap die making beserta relasinya
                    const response = await fetch(`/dieMakings/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    // Generate dan tampilkan PDF
                    generateDieMakingPdf(data, false);
                } catch (error) {
                    console.error('Error generating PDF:', error);
                    toast.error('Gagal menghasilkan PDF. Silakan coba lagi.');
                }
            };

            const handleDownloadPdf = async () => {
                try {
                    // Fetch data lengkap die making beserta relasinya
                    const response = await fetch(`/dieMakings/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    // Generate dan download PDF
                    generateDieMakingPdf(data, true);
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
                        {/* <DropdownMenuItem onClick={() => router.get(`/dieMakings/${item.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Detail
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.get(`/dieMakings/${item.id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator /> */}
                        <DropdownMenuItem onClick={() => handleDelete(item.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
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
