import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';

import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';

import { Download, FileText, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { KartuInstruksiKerja } from '@/types/kartuInstruksiKerja';



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

    // Logo Placeholder
    doc.setFillColor(230, 230, 230);
    doc.circle(20, 20, 10, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('IK', 17, 22);

    // Company Info
    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('CV. Indigama Khatulistiwa', 35, 18);
    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text('Jurangpelem Satu, Bulusari, Kec. Gempol, Pasuruan,', 35, 23);
    doc.text('Jawa Timur 67155', 35, 28);
    doc.text('Email: indigama.khatulistiwa01@gmail.com', 35, 33);
    doc.text('Telp: 081703101012', 35, 38);

    // Title Box
    doc.setFillColor(230, 240, 255);
    doc.roundedRect(pageWidth - 80, 12, 70, 25, 2, 2, 'F');
    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('Kartu Instruksi Kerja', pageWidth - 45, 22, { align: 'center' });

    const kikNumber = kartuInstruksiKerja?.no_kartu_instruksi_kerja || '-';
    const currentDate = new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text(kikNumber, pageWidth - 70, 30);
    doc.text(currentDate, pageWidth - 20, 30, { align: 'right' });

    // Content Box
    doc.setDrawColor(100).setLineWidth(0.3);
    doc.roundedRect(10, 45, pageWidth - 20, 150, 2, 2, 'S');

    let y = 55;

    doc.setFontSize(11).setFont('helvetica', 'bold');
    doc.text('Informasi Pesanan', 15, y);
    doc.text('Informasi Pelanggan', pageWidth / 2 + 5, y);

    y += 7;
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
            // rightLabel: 'Telepon',
            // rightValue: kartuInstruksiKerja.sales_order?. || '-',
        },
        // {
        //     label: 'Tgl PO',
        //     value: formatDate(kartuInstruksiKerja.sales_order?.),
        //     rightLabel: 'Email',
        //     rightValue: kartuInstruksiKerja.salesOrder?.customerAddress?.email || '-',
        // },
    ];

    doc.setFontSize(9).setFont('helvetica', 'normal');
    info.forEach((row) => {
        doc.setFont('helvetica', 'bold').text(row.label, 15, y);
        doc.setFont('helvetica', 'normal').text(`: ${row.value}`, 50, y);
        // doc.setFont('helvetica', 'bold').text(row.rightLabel, pageWidth / 2 + 5, y);
        doc.setFont('helvetica', 'normal').text(`: ${row.rightValue}`, pageWidth / 2 + 30, y);
        y += 6;
    });

    y += 4;
    doc.line(10, y, pageWidth - 10, y);
    y += 10;

    // Production Details
    doc.setFontSize(11).setFont('helvetica', 'bold');
    doc.text('Detail Produksi', 15, y);
    y += 7;
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
            // rightLabel: 'Status',
            // rightValue: kartuInstruksiKerja.status || 'draft',
        },
    ];

    produksi.forEach((row) => {
        doc.setFont('helvetica', 'bold').text(row.label, 15, y);
        doc.setFont('helvetica', 'normal').text(`: ${row.value}`, 50, y);
        // doc.setFont('helvetica', 'bold').text(row.rightLabel, pageWidth / 2 + 5, y);
        doc.setFont('helvetica', 'normal').text(`: ${row.rightValue}`, pageWidth / 2 + 50, y);
        y += 6;
    });

    y += 4;
    doc.line(10, y, pageWidth - 10, y);
    y += 10;

    // Bill of Materials Section
    doc.setFontSize(11).setFont('helvetica', 'bold');
    doc.text('Bill of Materials', 15, y);

    y += 5;
    const tableColumn = ['Departemen', 'Kode Item', 'Nama Item', 'Qty', 'Satuan', 'Waste', 'Total Kebutuhan'];

    const tableRows: string[][] = [];

    kartuInstruksiKerja.kartuInstruksiKerjaBoms?.forEach((bom, i) => {
        console.log(`BOM ${i}:`, bom);

        const material = bom.bom;
        if (!material) {
            console.warn(`Data kosong untuk bom index ${i}`);
            return;
        }

        tableRows.push([
            material.departemen?.nama_departemen || '-',
            material.master_item?.kode_master_item || '-',
            material.master_item?.nama_master_item || '-',
            material.qty?.toString() || '0',
            material.master_item?.unit?.nama_satuan || '-',
            material.waste?.toString() || '0',
        ]);
    });


    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: y,
        styles: {
            fontSize: 8,
        },
        bodyStyles: {
            textColor: [0, 0, 0], // 🔥 Warna teks body jadi hitam
        },
    });

    if (download) {
        doc.save(`KIK-${kikNumber}.pdf`);
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



export const columns = (
    setSelectedItem: (item: KartuInstruksiKerja | null) => void,
    openDetailModal: (item: KartuInstruksiKerja) => void,
): ColumnDef<KartuInstruksiKerja>[] => [
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
                    const response = await fetch(`/kartuInstruksiKerja/${item.id}`);
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
                    const response = await fetch(`/kartuInstruksiKerja/${item.id}`);
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
                        {/* <DropdownMenuItem onClick={() => router.get(`/kartuInstruksiKerja/${item.id}/edit`)}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator /> */}
                        <DropdownMenuItem onClick={() => openDetailModal(item)}>Detail</DropdownMenuItem>
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
