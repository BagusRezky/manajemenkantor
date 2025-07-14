/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SuratJalan } from '@/types/suratJalan';
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
    doc.text('Telp: 081703101012', 15, 38);

    // Title
    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('SURAT JALAN', pageWidth - 15, 18, { align: 'right' });

    // Informasi surat jalan
    doc.setLineWidth(0.5);
    doc.rect(10, 45, pageWidth - 20, 60);

    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.text('No. Surat Jalan', 15, 52);
    doc.text(':', 65, 52);
    doc.setFont('helvetica', 'normal');
    doc.text(suratJalan.no_surat_jalan || '', 70, 52);

    doc.setFont('helvetica', 'bold');
    doc.text('No. KIK', pageWidth - 85, 52);
    doc.text(':', pageWidth - 50, 52);
    doc.setFont('helvetica', 'normal');
    doc.text(suratJalan.kartu_instruksi_kerja?.no_kartu_instruksi_kerja || '', pageWidth - 45, 52);

    doc.setFont('helvetica', 'bold');
    doc.text('Tanggal', 15, 59);
    doc.text(':', 65, 59);
    doc.setFont('helvetica', 'normal');
    const formattedDate = suratJalan.tgl_surat_jalan ? format(new Date(suratJalan.tgl_surat_jalan), 'dd-MM-yyyy') : '';
    doc.text(formattedDate, 70, 59);

    doc.setFont('helvetica', 'bold');
    doc.text('No. PO Customer', pageWidth - 85, 59);
    doc.text(':', pageWidth - 50, 59);
    doc.setFont('helvetica', 'normal');
    doc.text(suratJalan.kartu_instruksi_kerja?.sales_order?.no_po_customer || '', pageWidth - 45, 59);

    doc.setFont('helvetica', 'bold');
    doc.text('Transportasi', 15, 66);
    doc.text(':', 65, 66);
    doc.setFont('helvetica', 'normal');
    doc.text(suratJalan.transportasi || '', 70, 66);

    doc.setFont('helvetica', 'bold');
    doc.text('Driver', pageWidth - 85, 66);
    doc.text(':', pageWidth - 50, 66);
    doc.setFont('helvetica', 'normal');
    doc.text(suratJalan.driver || '', pageWidth - 45, 66);

    doc.setFont('helvetica', 'bold');
    doc.text('No. Polisi', 15, 73);
    doc.text(':', 65, 73);
    doc.setFont('helvetica', 'normal');
    doc.text(suratJalan.no_polisi || '', 70, 73);

    doc.setFont('helvetica', 'bold');
    doc.text('Pengirim', pageWidth - 85, 73);
    doc.text(':', pageWidth - 50, 73);
    doc.setFont('helvetica', 'normal');
    doc.text(suratJalan.pengirim || '', pageWidth - 45, 73);

    // Customer Info
    const customerAddress = suratJalan.kartu_instruksi_kerja?.sales_order?.customer_address;
    doc.setFont('helvetica', 'bold');
    doc.text('Kepada Yth:', 15, 85);
    doc.setFont('helvetica', 'normal');
    doc.text(customerAddress?.nama_customer || '', 15, 90);
    // Gunakan alamat tujuan yang dipilih, bukan alamat lengkap
    doc.text(suratJalan.alamat_tujuan || '', 15, 95);

    doc.setFont('helvetica', 'bold');
    doc.text('Keterangan', 15, 80);
    doc.text(':', 65, 80);
    doc.setFont('helvetica', 'normal');
    doc.text(suratJalan.keterangan || '-', 70, 80);

    // Header tabel "DATA BARANG"
    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.rect(10, 110, pageWidth - 20, 10);
    doc.text('DATA BARANG', pageWidth / 2, 116, { align: 'center' });

    // Isi tabel barang
    const finishGoodItem = suratJalan.kartu_instruksi_kerja?.sales_order?.finish_good_item;
    const salesOrder = suratJalan.kartu_instruksi_kerja?.sales_order;

    const tableColumns = [
        { header: 'No', dataKey: 'no' },
        { header: 'Nama Barang', dataKey: 'nama_barang' },
        { header: 'Deskripsi', dataKey: 'deskripsi' },
        { header: 'Jumlah', dataKey: 'jumlah' },
        { header: 'Keterangan', dataKey: 'keterangan' },
    ];

    const tableRows = [
        {
            no: '1',
            nama_barang: finishGoodItem?.nama_barang || '-',
            deskripsi: finishGoodItem?.deskripsi || '-',
            jumlah: salesOrder?.jumlah_pesanan?.toString() || '0',
            keterangan: '-',
        },
    ];

    autoTable(doc, {
        columns: tableColumns,
        body: tableRows,
        startY: 120,
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
    doc.text('Pengirim,', 50, tableEndY, { align: 'center' });
    doc.text('Penerima,', pageWidth - 50, tableEndY, { align: 'center' });

    // Tempat tanda tangan
    doc.text('( ..................................... )', 50, tableEndY + 30, { align: 'center' });
    doc.text('( ..................................... )', pageWidth - 50, tableEndY + 30, { align: 'center' });

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
                        {/* <DropdownMenuItem onClick={() => router.get(`/suratJalans/${item.id}`)}>Detail</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.get(`/suratJalans/${item.id}/edit`)}>Edit</DropdownMenuItem> */}
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
