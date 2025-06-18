import { MaterialStock } from '@/types/materialStock';
import { ColumnDef } from '@tanstack/react-table';

// Function untuk generate PDF Material Stock Report
// const generateMaterialStockPdf = (materialStocks: MaterialStock[], download = false): void => {
//     const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation
//     const pageWidth = doc.internal.pageSize.getWidth();

//     // Header dengan border
//     doc.setDrawColor(0);
//     doc.setLineWidth(0.5);
//     doc.rect(10, 10, pageWidth - 20, 30);

//     // Company Info
//     doc.setFontSize(14).setFont('helvetica', 'bold');
//     doc.text('CV. Indigama Khatulistiwa', 15, 18);
//     doc.setFontSize(10).setFont('helvetica', 'normal');
//     doc.text('Jurangpelem Satu, Bulusari, Kec. Gempol, Pasuruan,', 15, 23);
//     doc.text('Jawa Timur 67155', 15, 28);
//     doc.text('Email: indigama.khatulistiwa01@gmail.com', 15, 33);
//     doc.text('Telp: 081703101012', 15, 38);

//     doc.setFontSize(14).setFont('helvetica', 'bold');
//     doc.text('LAPORAN STOCK MATERIAL', pageWidth - 15, 18, { align: 'right' });

//     doc.setFontSize(10).setFont('helvetica', 'normal');
//     doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, pageWidth - 15, 28, { align: 'right' });

//     // Summary statistics
//     const totalItems = materialStocks.length;
//     const lowStockItems = materialStocks.filter((item) => item.status === 'low_stock').length;
//     const outOfStockItems = materialStocks.filter((item) => item.status === 'out_of_stock').length;

//     doc.setFontSize(10).setFont('helvetica', 'bold');
//     doc.text(`Total Items: ${totalItems} | Low Stock: ${lowStockItems} | Out of Stock: ${outOfStockItems}`, 15, 48);

//     // Header tabel
//     const tableColumns = [
//         { header: 'Kode Item', dataKey: 'kode' },
//         { header: 'Nama Item', dataKey: 'nama' },
//         { header: 'Type', dataKey: 'type' },
//         { header: 'Satuan', dataKey: 'satuan' },
//         { header: 'Min Stock', dataKey: 'min_stock' },
//         { header: 'Onhand', dataKey: 'onhand' },
//         { header: 'Outstanding', dataKey: 'outstanding' },
//         { header: 'Allocation', dataKey: 'allocation' },
//         { header: 'Available', dataKey: 'available' },
//         { header: 'Status', dataKey: 'status' },
//     ];

//     const tableRows = materialStocks.map((item) => ({
//         kode: item.kode_master_item,
//         nama: item.nama_master_item,
//         type: item.nama_type_barang,
//         satuan: item.satuan,
//         min_stock: item.min_stock.toString(),
//         onhand: item.onhand_stock.toFixed(2),
//         outstanding: item.outstanding_stock.toFixed(2),
//         allocation: item.allocation_stock.toFixed(2),
//         available: item.available_stock.toFixed(2),
//         status: item.status === 'normal' ? 'Normal' : item.status === 'low_stock' ? 'Low Stock' : 'Out of Stock',
//     }));

//     autoTable(doc, {
//         columns: tableColumns,
//         body: tableRows,
//         startY: 55,
//         margin: { left: 10, right: 10 },
//         styles: { fontSize: 8 },
//         headStyles: {
//             fillColor: [41, 128, 185],
//             textColor: [255, 255, 255],
//             fontStyle: 'bold',
//         },
//         bodyStyles: {
//             fillColor: [255, 255, 255],
//             textColor: [0, 0, 0],
//         },
//         alternateRowStyles: {
//             fillColor: [245, 245, 245],
//         },
//         columnStyles: {
//             kode: { cellWidth: 25 },
//             nama: { cellWidth: 50 },
//             type: { cellWidth: 30 },
//             satuan: { cellWidth: 20 },
//             min_stock: { cellWidth: 20, halign: 'right' },
//             onhand: { cellWidth: 20, halign: 'right' },
//             outstanding: { cellWidth: 25, halign: 'right' },
//             allocation: { cellWidth: 25, halign: 'right' },
//             available: { cellWidth: 20, halign: 'right' },
//             status: { cellWidth: 25, halign: 'center' },
//         },
//         didParseCell: function (data) {
//             // Color coding for status
//             if (data.column.dataKey === 'status') {
//                 const status = data.cell.raw as string;
//                 if (status === 'Out of Stock') {
//                     data.cell.styles.fillColor = [231, 76, 60];
//                     data.cell.styles.textColor = [255, 255, 255];
//                 } else if (status === 'Low Stock') {
//                     data.cell.styles.fillColor = [241, 196, 15];
//                     data.cell.styles.textColor = [0, 0, 0];
//                 } else {
//                     data.cell.styles.fillColor = [46, 204, 113];
//                     data.cell.styles.textColor = [255, 255, 255];
//                 }
//             }
//         },
//     });

//     // Output PDF
//     if (download) {
//         doc.save(`material-stock-report-${new Date().toISOString().split('T')[0]}.pdf`);
//     } else {
//         window.open(doc.output('bloburl'), '_blank');
//     }
// };

// const getStatusIcon = (status: string) => {
//     switch (status) {
//         case 'normal':
//             return <TrendingUp className="h-4 w-4 text-green-500" />;
//         case 'low_stock':
//             return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
//         case 'out_of_stock':
//             return <TrendingDown className="h-4 w-4 text-red-500" />;
//         default:
//             return null;
//     }
// };

// const getStatusBadge = (status: string) => {
//     switch (status) {
//         case 'normal':
//             return <Badge className="bg-green-100 text-green-800">Normal</Badge>;
//         case 'low_stock':
//             return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>;
//         case 'out_of_stock':
//             return <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>;
//         default:
//             return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
//     }
// };

export const columns = (): ColumnDef<MaterialStock>[] => [
    {
        accessorKey: 'kode_master_item',
        header: 'Kode Item',
        cell: ({ row }) => {
            const data = row.original;
            return (
                <div className="flex items-center space-x-2">
                    {/* {getStatusIcon(data.status)} */}
                    <span className="font-mono text-sm">{data.kode_master_item}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'nama_master_item',
        header: 'Nama Item',
        cell: ({ row }) => {
            const data = row.original;
            return (
                <div>
                    <div className="font-medium">{data.nama_master_item}</div>
                    <div className="text-sm text-gray-500">{data.nama_type_barang}</div>
                </div>
            );
        },
    },
    {
        accessorKey: 'satuan',
        header: 'Satuan',
        cell: ({ row }) => {
            return <span className="text-sm">{row.getValue('satuan')}</span>;
        },
    },
    {
        accessorKey: 'min_stock',
        header: 'Min Stock',
        cell: ({ row }) => {
            return <span className="text-right font-mono">{row.getValue('min_stock')}</span>;
        },
    },
    {
        accessorKey: 'onhand_stock',
        header: 'Onhand Stock',
        cell: ({ row }) => {
            const value = row.getValue('onhand_stock') as number;
            return <span className="text-right font-mono font-bold">{value.toFixed(2)}</span>;
        },
    },
    {
        accessorKey: 'outstanding_stock',
        header: 'Outstanding',
        cell: ({ row }) => {
            const value = row.getValue('outstanding_stock') as number;
            return <span className="text-right font-mono text-blue-600">{value.toFixed(2)}</span>;
        },
    },
    {
        accessorKey: 'allocation_stock',
        header: 'Allocation',
        cell: ({ row }) => {
            const value = row.getValue('allocation_stock') as number;
            return <span className="text-right font-mono text-orange-600">{value.toFixed(2)}</span>;
        },
    },
    // {
    //     accessorKey: 'available_stock',
    //     header: 'Available',
    //     cell: ({ row }) => {
    //         const value = row.getValue('available_stock') as number;
    //         const textColor = value <= 0 ? 'text-red-600' : value > 0 ? 'text-green-600' : 'text-gray-600';
    //         return <span className={`text-right font-mono font-bold ${textColor}`}>{value.toFixed(2)}</span>;
    //     },
    // },
    // {
    //     accessorKey: 'status',
    //     header: 'Status',
    //     cell: ({ row }) => {
    //         const status = row.getValue('status') as string;
    //         return getStatusBadge(status);
    //     },
    // },
    // {
    //     id: 'actions',
    //     header: 'Actions',
    //     cell: ({ row }) => {
    //         const item = row.original;

    //         const handlePreviewPdf = async () => {
    //             try {
    //                 const response = await fetch('/materialStocks/pdf');
    //                 if (!response.ok) {
    //                     throw new Error('Failed to fetch data');
    //                 }
    //                 const data = await response.json();
    //                 generateMaterialStockPdf(data.materialStocks, false);
    //             } catch (error) {
    //                 console.error('Error generating PDF:', error);
    //                 toast.error('Gagal menghasilkan PDF. Silakan coba lagi.');
    //             }
    //         };

    //         const handleDownloadPdf = async () => {
    //             try {
    //                 const response = await fetch('/materialStocks/pdf');
    //                 if (!response.ok) {
    //                     throw new Error('Failed to fetch data');
    //                 }
    //                 const data = await response.json();
    //                 generateMaterialStockPdf(data.materialStocks, true);
    //             } catch (error) {
    //                 console.error('Error downloading PDF:', error);
    //                 toast.error('Gagal mengunduh PDF. Silakan coba lagi.');
    //             }
    //         };

    //         const handleViewDetails = async () => {
    //             try {
    //                 const response = await fetch(`/materialStocks/${item.id}/details`);
    //                 if (!response.ok) {
    //                     throw new Error('Failed to fetch details');
    //                 }
    //                 const details = await response.json();
    //                 console.log('Stock details:', details);
    //                 toast.success('Detail stock berhasil dimuat (check console)');
    //             } catch (error) {
    //                 console.error('Error fetching details:', error);
    //                 toast.error('Gagal memuat detail stock.');
    //             }
    //         };

    //         return (
    //             <DropdownMenu>
    //                 <DropdownMenuTrigger asChild>
    //                     <Button variant="ghost" className="h-8 w-8 p-0">
    //                         <span className="sr-only">Open menu</span>
    //                         <MoreHorizontal className="h-4 w-4" />
    //                     </Button>
    //                 </DropdownMenuTrigger>
    //                 <DropdownMenuContent align="end">
    //                     <DropdownMenuItem onClick={handleViewDetails}>View Details</DropdownMenuItem>
    //                     <DropdownMenuSeparator />
    //                     <DropdownMenuItem onClick={handlePreviewPdf}>
    //                         <FileText className="mr-2 h-4 w-4" />
    //                         Preview PDF
    //                     </DropdownMenuItem>
    //                     <DropdownMenuSeparator />
    //                     <DropdownMenuItem onClick={handleDownloadPdf}>
    //                         <Download className="mr-2 h-4 w-4" />
    //                         Download PDF
    //                     </DropdownMenuItem>
    //                 </DropdownMenuContent>
    //             </DropdownMenu>
    //         );
    //     },
    // },
];
