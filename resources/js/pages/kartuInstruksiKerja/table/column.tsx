/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';

import { KartuInstruksiKerja } from '@/types/kartuInstruksiKerja';
import { Download, FileText, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { formatToInteger } from '@/utils/formatter/decimaltoint';

export const generateKikPdf = (kartuInstruksiKerja: KartuInstruksiKerja, download = false): void => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    const formatDate = (dateString?: string): string => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    // Debug logging - remove this after fixing
    console.log('KIK Data received:', kartuInstruksiKerja);
    console.log('BOMs Data (camelCase):', kartuInstruksiKerja.kartuInstruksiKerjaBoms);
    console.log('BOMs Data (snake_case):', kartuInstruksiKerja.kartu_instruksi_kerja_boms);

    // Header Border Box
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, pageWidth - 20, 30);

    // Company Info (Left)
    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('CV. Indigama Khatulistiwa', 15, 18);
    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text('Jurangpelem Satu, Bulusari, Kec. Gempol, Pasuruan,', 15, 23);
    doc.text('Jawa Timur 67155', 15, 28);
    doc.text('Email: indigama.khatulistiwa01@gmail.com', 15, 33);
    doc.text('Telp: 081703101012', 15, 38);

    // Title (Right)
    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('KARTU INSTRUKSI KERJA', pageWidth - 15, 18, { align: 'right' });

    // Nomor dan Tanggal
    const kikNumber = kartuInstruksiKerja?.no_kartu_instruksi_kerja || '-';
    const currentDate = new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text(`No: ${kikNumber}`, pageWidth - 15, 25, { align: 'right' });
    doc.text(`Tanggal: ${currentDate}`, pageWidth - 15, 30, { align: 'right' });

    let y = 50;

    // Info Pesanan dan Pelanggan
    doc.setFontSize(11).setFont('helvetica', 'bold');
    doc.text('Informasi Pesanan', 15, y);
    doc.text('Informasi Pelanggan', pageWidth / 2 + 5, y);
    y += 6;

    const info = [
        {
            label: 'No Sales Order',
            value: kartuInstruksiKerja.sales_order?.no_bon_pesanan || '-',
            rightLabel: 'Nama',
            rightValue: kartuInstruksiKerja.sales_order?.customer_address?.nama_customer || '-',
        },
        {
            label: 'Tgl Pesanan',
            value: formatDate(kartuInstruksiKerja.sales_order?.eta_marketing),
            rightLabel: 'Alamat',
            rightValue: kartuInstruksiKerja.sales_order?.customer_address?.alamat_lengkap || '-',
        },
        {
            label: 'No PO',
            value: kartuInstruksiKerja.sales_order?.no_po_customer || '-',
            rightLabel: '',
            rightValue: '',
        },
    ];

    doc.setFontSize(9).setFont('helvetica', 'normal');
    info.forEach((row) => {
        doc.text(`${row.label}`, 15, y);
        doc.text(`: ${row.value}`, 50, y);
        if (row.rightLabel) doc.text(`${row.rightLabel}`, pageWidth / 2 + 5, y);
        doc.text(`: ${row.rightValue}`, pageWidth / 2 + 30, y);
        y += 6;
    });

    y += 4;
    doc.line(10, y, pageWidth - 10, y);
    y += 10;

    // Detail Produksi
    doc.setFontSize(11).setFont('helvetica', 'bold');
    doc.text('Detail Produksi', 15, y);
    y += 6;
    doc.setFontSize(9).setFont('helvetica', 'normal');

    const produksi = [
        {
            label: 'Produk',
            value: kartuInstruksiKerja.sales_order?.finish_good_item?.nama_barang || '-',
            rightLabel: 'Tgl Estimasi Selesai',
            rightValue: formatDate(kartuInstruksiKerja?.tgl_estimasi_selesai),
        },
        {
            label: 'Kode Produk',
            value: kartuInstruksiKerja.sales_order?.finish_good_item?.kode_material_produk || '-',
            rightLabel: 'Production Plan',
            rightValue: kartuInstruksiKerja.production_plan || '-',
        },
        {
            label: 'Jumlah Pesanan',
            value: `${kartuInstruksiKerja.sales_order?.jumlah_pesanan || '-'} ${
                kartuInstruksiKerja.sales_order?.finish_good_item?.unit?.nama_satuan || ''
            }`,
            rightLabel: '',
            rightValue: '',
        },
    ];

    produksi.forEach((row) => {
        doc.text(`${row.label}`, 15, y);
        doc.text(`: ${row.value}`, 50, y);
        if (row.rightLabel) doc.text(`${row.rightLabel}`, pageWidth / 2 + 5, y);
        doc.text(`: ${row.rightValue}`, pageWidth / 2 + 50, y);
        y += 6;
    });

    y += 4;
    doc.line(10, y, pageWidth - 10, y);
    y += 10;

    // Bill of Materials
    doc.setFontSize(11).setFont('helvetica', 'bold');
    doc.text('Bill of Materials', 15, y);
    y += 5;

    const tableColumn = [
        { header: 'No', dataKey: 'no' },
        { header: 'Departemen', dataKey: 'departemen' },
        { header: 'Kode Item', dataKey: 'kitem' },
        { header: 'Nama Item', dataKey: 'nitem' },
        { header: 'Qty', dataKey: 'qty' },
        { header: 'Satuan', dataKey: 'satuan' },
        { header: 'Waste', dataKey: 'waste' },
        { header: 'Total Kebutuhan', dataKey: 'total_kebutuhan' },
    ];

    // Fixed the table rows generation
    let tableRows: any[] = [];

    // Get BOMs data - try both camelCase and snake_case
    const bomsData = kartuInstruksiKerja.kartuInstruksiKerjaBoms || kartuInstruksiKerja.kartu_instruksi_kerja_boms;

    // Check if BOMs data exists and has data
    if (bomsData && Array.isArray(bomsData)) {
        console.log('Processing BOMs:', bomsData.length, 'items');

        tableRows = bomsData.map((bom, index) => {
            console.log(`Processing BOM ${index + 1}:`, bom);

            return {
                no: (index + 1).toString(),
                departemen: bom.bill_of_materials?.departemen?.nama_departemen || '-',
                kitem: bom.bill_of_materials?.master_item?.kode_master_item || '-',
                nitem: bom.bill_of_materials?.master_item?.nama_master_item || '-',
                qty: bom.bill_of_materials?.qty || 0,
                satuan: bom.bill_of_materials?.master_item?.unit?.nama_satuan || '-',
                waste: formatToInteger(bom.waste || '0'),
                total_kebutuhan: bom.total_kebutuhan || '0',
            };
        });
    } else {
        console.log('No BOMs data found or data is not an array');
        // Add a row indicating no data
        tableRows = [
            {
                no: '1',
                departemen: 'No data available',
                kitem: '-',
                nitem: '-',
                qty: 0,
                satuan: '-',
                waste: '0',
                total_kebutuhan: '0',
            },
        ];
    }

    console.log('Final table rows:', tableRows);

    autoTable(doc, {
        columns: tableColumn,
        body: tableRows,
        startY: y,
        styles: {
            fontSize: 8,
        },
        headStyles: {
            fillColor: [240, 240, 240],
            textColor: [0, 0, 0],
            lineColor: [0, 0, 0],
            lineWidth: 0.5,
        },
        bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineColor: [0, 0, 0],
            lineWidth: 0.5,
        },
    });

    if (download) {
        doc.save(`${kikNumber}.pdf`);
    } else {
        window.open(doc.output('bloburl'), '_blank');
    }
};

const handleDelete = (item: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus kartu instruksi kerja ini?')) {
        router.delete(`/kartuInstruksiKerja/${item}`, {
            onSuccess: () => {
                toast.success('Kartu Instruksi Kerja berhasil dihapus');
            },
            onError: () => {
                toast.error('Gagal menghapus Kartu Instruksi Kerja');
            },
        });
    }
};

export const columns = (): ColumnDef<KartuInstruksiKerja>[] => [
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
        accessorKey: 'no_kartu_instruksi_kerja',
        header: 'No. Surat Perintah Kerja',
    },
    {
        accessorKey: 'sales_order.no_bon_pesanan',
        header: 'No. Sales Order',
        cell: ({ row }) => row.original.sales_order?.no_bon_pesanan || '-',
    },
    {
        accessorKey: 'production_plan',
        header: 'Production Plan',
    },
    {
        accessorKey: 'tgl_estimasi_selesai',
        header: 'Tanggal Estimasi Selesai',
        cell: ({ row }) => {
            const date = row.original.tgl_estimasi_selesai;
            if (!date) return '-';

            // Assuming date is in a compatible format
            try {
                const formattedDate = new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD format
                return formattedDate;
            } catch {
                return date; // Return original if formatting fails
            }
        },
    },
    {
        accessorKey: 'sales_order.finish_good_item.nama_barang',
        header: 'Nama Produk',
        cell: ({ row }) => row.original.sales_order?.finish_good_item?.nama_barang || '-',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const item = row.original;
            const handlePreviewPdf = async () => {
                try {
                    // Fetch data lengkap kartuInstruksiKerja beserta relasinya
                    const response = await fetch(`/kartuInstruksiKerja/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    // Generate dan tampilkan PDF
                    generateKikPdf(data, false);
                } catch (error) {
                    console.error('Error generating PDF:', error);
                    alert('Gagal menghasilkan PDF. Silakan coba lagi.');
                }
            };

            const handleDownloadPdf = async () => {
                try {
                    // Fetch data lengkap kartuInstruksiKerja beserta relasinya
                    const response = await fetch(`/kartuInstruksiKerja/${item.id}/pdf`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    // Generate dan download PDF
                    generateKikPdf(data, true);
                } catch (error) {
                    console.error('Error downloading PDF:', error);
                    alert('Gagal mengunduh PDF. Silakan coba lagi.');
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
                        <DropdownMenuItem onClick={() => handleDelete(item.id)}>Delete</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.get(`/kartuInstruksiKerja/${item.id}/edit`)}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.get(`/kartuInstruksiKerja/${item.id}`)}>Detail</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handlePreviewPdf}>
                            <FileText className="mr-2 h-4 w-4" />
                            Preview PDF
                        </DropdownMenuItem>
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
