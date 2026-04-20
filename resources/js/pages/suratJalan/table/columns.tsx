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
    // Ukuran 1/2 folio continuous form: 9.5" x 5.5" = 241.3mm x 139.7mm
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [241.3, 139.7],
    });

    const pageWidth = doc.internal.pageSize.getWidth(); // 241.3 mm
    const topMargin = 3;

    // Logo (dikecilkan)
    const logo = new Image();
    logo.src = '/images/logo-kantor.png';
    doc.addImage(logo, 'PNG', 12, topMargin + 2, 13, 13);

    // Header border (dikompres tingginya dari 30 → 20)
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(10, topMargin, pageWidth - 20, 20);

    // Company Info (font lebih kecil, jarak baris lebih rapat)
    doc.setFontSize(11).setFont('helvetica', 'bold');
    doc.text('CV. Indigama Khatulistiwa', 28, topMargin + 5);
    doc.setFontSize(7.5).setFont('helvetica', 'normal');
    doc.text('Dsn. Blimbing RT 02 RW 11, Ds. Bulusari, Kec. Gempol, Pasuruan, Jawa Timur 67155', 28, topMargin + 9);
    doc.text('Email: indigama.khatulistiwa01@gmail.com  |  Telp: 081703101012', 28, topMargin + 13);

    // Title kanan atas
    doc.setFontSize(13).setFont('helvetica', 'bold');
    doc.text('SURAT JALAN', pageWidth - 15, topMargin + 8, { align: 'right' });
    doc.setFontSize(7.5).setFont('helvetica', 'normal');
    doc.text(suratJalan.no_surat_jalan || '', pageWidth - 15, topMargin + 14, { align: 'right' });

    // ===== Kotak Info Surat Jalan (tinggi dikompres dari 45 → 28) =====
    const infoBoxY = topMargin + 23;
    doc.setLineWidth(0.5);
    doc.rect(10, infoBoxY, pageWidth - 20, 28);

    const leftLabelX = 13;
    const leftColonX = 43;
    const leftValueX = 45;
    const rightLabelX = pageWidth / 2 + 5;
    const rightColonX = pageWidth / 2 + 35;
    const rightValueX = pageWidth / 2 + 37;

    doc.setFontSize(8);

    // Row 1
    const r1Y = infoBoxY + 5;
    doc.setFont('helvetica', 'bold');
    doc.text('No. Surat Jalan', leftLabelX, r1Y);
    doc.text(':', leftColonX, r1Y);
    doc.setFont('helvetica', 'normal');
    doc.text(suratJalan.no_surat_jalan || '', leftValueX, r1Y);
    doc.setFont('helvetica', 'bold');
    doc.text('Transportasi', rightLabelX, r1Y);
    doc.text(':', rightColonX, r1Y);
    doc.setFont('helvetica', 'normal');
    doc.text(suratJalan.transportasi || '', rightValueX, r1Y);

    // Row 2
    const r2Y = infoBoxY + 11;
    const poCustomer = suratJalan.kartu_instruksi_kerja?.sales_order?.no_po_customer || suratJalan.sales_order?.no_po_customer || '-';
    doc.setFont('helvetica', 'bold');
    doc.text('No. PO Customer', leftLabelX, r2Y);
    doc.text(':', leftColonX, r2Y);
    doc.setFont('helvetica', 'normal');
    doc.text(poCustomer, leftValueX, r2Y);
    doc.setFont('helvetica', 'bold');
    doc.text('No. Polisi', rightLabelX, r2Y);
    doc.text(':', rightColonX, r2Y);
    doc.setFont('helvetica', 'normal');
    doc.text(suratJalan.no_polisi || '', rightValueX, r2Y);

    // Row 3
    const r3Y = infoBoxY + 17;
    const customerName =
        suratJalan.kartu_instruksi_kerja?.sales_order?.customer_address?.nama_customer ||
        suratJalan.sales_order?.customer_address?.nama_customer ||
        '-';
    doc.setFont('helvetica', 'bold');
    doc.text('Customer', leftLabelX, r3Y);
    doc.text(':', leftColonX, r3Y);
    doc.setFont('helvetica', 'normal');
    doc.text(customerName, leftValueX, r3Y);
    doc.setFont('helvetica', 'bold');
    doc.text('Driver', rightLabelX, r3Y);
    doc.text(':', rightColonX, r3Y);
    doc.setFont('helvetica', 'normal');
    doc.text(suratJalan.driver || '', rightValueX, r3Y);

    // Row 4 — Tanggal + Keterangan
    const r4Y = infoBoxY + 23;
    const formattedDate = suratJalan.tgl_surat_jalan ? format(new Date(suratJalan.tgl_surat_jalan), 'dd-MM-yyyy') : '';
    doc.setFont('helvetica', 'bold');
    doc.text('Tanggal', leftLabelX, r4Y);
    doc.text(':', leftColonX, r4Y);
    doc.setFont('helvetica', 'normal');
    doc.text(formattedDate, leftValueX, r4Y);
    doc.setFont('helvetica', 'bold');
    doc.text('Keterangan', rightLabelX, r4Y);
    doc.text(':', rightColonX, r4Y);
    doc.setFont('helvetica', 'normal');
    doc.text(suratJalan.keterangan || '-', rightValueX, r4Y);

    // ===== Tabel Data Barang =====
    const tableHeaderY = infoBoxY + 31;
    doc.setFontSize(8.5).setFont('helvetica', 'bold');
    doc.rect(10, tableHeaderY, pageWidth - 20, 7);
    doc.text('DATA BARANG', pageWidth / 2, tableHeaderY + 5, { align: 'center' });

    const isFromKik = !!suratJalan.id_kartu_instruksi_kerja;
    const namaBarang = isFromKik
        ? suratJalan.kartu_instruksi_kerja?.sales_order?.finish_good_item?.nama_barang || '-'
        : suratJalan.sales_order?.master_item?.nama_master_item || '-';

    const packagings = suratJalan.kartu_instruksi_kerja?.packagings || [];
    const totalBox = packagings.reduce((acc, pkg) => {
        return acc + (Number(pkg.jumlah_satuan_penuh) || 0) + (Number(pkg.jumlah_satuan_sisa) || 0);
    }, 0);

    const tableColumns = [
        { header: 'No', dataKey: 'no' },
        { header: 'Nama Barang', dataKey: 'nama_barang' },
    ];
    if (isFromKik) tableColumns.push({ header: 'Box', dataKey: 'box' });
    tableColumns.push({ header: isFromKik ? 'Jumlah (Pcs)' : 'Jumlah', dataKey: 'jumlah' });
    tableColumns.push({ header: 'Keterangan', dataKey: 'keterangan' });

    autoTable(doc, {
        columns: tableColumns,
        body: [
            {
                no: '1',
                nama_barang: namaBarang,
                box: isFromKik ? (totalBox > 0 ? `${totalBox} BOX` : '-') : null,
                jumlah: isFromKik
                    ? suratJalan.qty_pengiriman
                        ? `${formatWithThousandSeparator(suratJalan.qty_pengiriman)} PCS`
                        : '-'
                    : suratJalan.qty_pengiriman
                      ? `${formatWithThousandSeparator(suratJalan.qty_pengiriman)} ${suratJalan.sales_order?.master_item?.unit?.nama_satuan}`
                      : '-',
                keterangan: '-',
            },
        ],
        startY: tableHeaderY + 7,
        margin: { left: 10, right: 10 },
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            lineColor: [0, 0, 0],
            lineWidth: 0.4,
        },
        bodyStyles: {
            lineColor: [0, 0, 0],
            lineWidth: 0.4,
        },
        columnStyles: {
            no: { cellWidth: 10, halign: 'center' },
            nama_barang: { cellWidth: 'auto' },
            box: { cellWidth: 25, halign: 'center' },
            jumlah: { cellWidth: 32, halign: 'right' },
            keterangan: { cellWidth: 35 },
        },
    });

    // ===== Footer Tanda Tangan (lebih rapat, jarak dikompres) =====
    const footerY = (doc as any).lastAutoTable.finalY + 5;

    doc.setFontSize(8).setFont('helvetica', 'normal');
    doc.text('Pengirim,', 40, footerY, { align: 'center' });
    doc.text('Mengetahui,', pageWidth / 2, footerY, { align: 'center' });
    doc.text('Penerima,', pageWidth - 40, footerY, { align: 'center' });

    doc.text('( .......................... )', 40, footerY + 16, { align: 'center' });
    doc.text('( .......................... )', pageWidth / 2, footerY + 16, { align: 'center' });
    doc.text('( .......................... )', pageWidth - 40, footerY + 16, { align: 'center' });

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
        accessorKey: 'sales_order.no_bon_pesanan',
        header: 'No. SO',
        cell: ({ row }) => {
            const data = row.original;
            return <span>{data.sales_order?.no_bon_pesanan || data.kartu_instruksi_kerja?.sales_order?.no_bon_pesanan || '-'}</span>;
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
        accessorKey: 'customer',
        header: 'Customer',
        cell: ({ row }) => {
            const data = row.original;
            const customerName =
                data.kartu_instruksi_kerja?.sales_order?.customer_address?.nama_customer || data.sales_order?.customer_address?.nama_customer || '-';
            return <span>{customerName}</span>;
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
