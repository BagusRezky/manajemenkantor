/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PurchaseRequest } from '@/types/purchaseRequest';
import { Head } from '@inertiajs/react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useEffect, useRef } from 'react';

interface CompanyInfo {
    name: string;
    address: string;
    phone: string;
    email: string;
    logo?: string;
}

interface PdfPreviewProps {
    purchaseRequest: PurchaseRequest;
    companyInfo: CompanyInfo;
    currentDate: string;
    downloadMode?: boolean;
}

export default function PdfPreview({ purchaseRequest, companyInfo, downloadMode = false }: PdfPreviewProps) {
    const previewRef = useRef<HTMLDivElement>(null);

    // Auto download jika dalam mode download
    useEffect(() => {
        if (downloadMode) {
            // Delay kecil untuk memastikan render selesai
            const timer = setTimeout(() => {
                generatePdf();
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [downloadMode]);

    const generatePdf = (): void => {
        try {
            // Inisialisasi dokumen PDF
            const doc = new jsPDF('p', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.getWidth();

            // Header Document - PURCHASE REQUEST
            doc.setFontSize(14).setFont('helvetica', 'bold');
            doc.text('PURCHASE REQUEST', pageWidth - 15, 18, { align: 'right' });

            doc.setFont('helvetica', 'normal');
            doc.text(purchaseRequest.no_pr || '', pageWidth - 15, 25, { align: 'right' });

            // Tambahkan header dengan border
            doc.setDrawColor(0);
            doc.setLineWidth(0.5);
            doc.rect(10, 10, pageWidth - 20, 30);

            // Company Info
            doc.setFontSize(14).setFont('helvetica', 'bold');
            doc.text(companyInfo.name, 15, 18);
            doc.setFontSize(10).setFont('helvetica', 'normal');
            doc.text(companyInfo.address, 15, 23);
            doc.text('Jawa Timur 67155', 15, 28); // Assuming this is part of the address
            doc.text(`Email: ${companyInfo.email}`, 15, 33);
            doc.text(`Telp: ${companyInfo.phone}`, 15, 38);

            // Informasi Purchase Request
            doc.setLineWidth(0.5);
            doc.rect(10, 45, pageWidth - 20, 35);

            doc.setFontSize(10).setFont('helvetica', 'bold');
            doc.text('Tanggal PR', 15, 52);
            doc.text(':', 65, 52);
            doc.setFont('helvetica', 'normal');
            const prDate = new Date(purchaseRequest.tgl_pr);
            const formattedDate = prDate.toLocaleDateString('id-ID');
            doc.text(formattedDate, 70, 52);

            doc.setFont('helvetica', 'bold');
            doc.text('Departemen', 15, 59);
            doc.text(':', 65, 59);
            doc.setFont('helvetica', 'normal');
            doc.text(purchaseRequest.departemen.nama_departemen || '', 70, 59);

            doc.setFont('helvetica', 'bold');
            doc.text('Status', 15, 66);
            doc.text(':', 65, 66);
            doc.setFont('helvetica', 'normal');
            doc.text(purchaseRequest.status || '', 70, 66);

            // Header tabel "DATA ITEM"
            doc.setFontSize(10).setFont('helvetica', 'bold');
            doc.rect(10, 95, pageWidth - 20, 10);
            doc.text('DATA ITEM', pageWidth / 2, 101, { align: 'center' });

            // Isi tabel item menggunakan autoTable
            const tableColumns = [
                { header: 'No', dataKey: 'no' },
                { header: 'Deskripsi', dataKey: 'item' },
                { header: 'Qty', dataKey: 'qty' },
                { header: 'Satuan', dataKey: 'satuan' },
                { header: 'ETA', dataKey: 'eta' },
                { header: 'Catatan', dataKey: 'catatan' },
            ];

            const tableRows =
                purchaseRequest.purchase_request_items.map((item, index) => {
                    return {
                        no: (index + 1).toString(),
                        item: item.master_item ? `(${item.master_item.kode_master_item}) ${item.master_item.nama_master_item}` : '',
                        qty: item.qty || 0,
                        satuan: item.master_item?.unit?.nama_satuan || '-',
                        eta: new Date(item.eta).toLocaleDateString('id-ID'),
                        catatan: item.catatan || '-',
                    };
                }) || [];

            autoTable(doc, {
                columns: tableColumns,
                body: tableRows,
                startY: 105,
                margin: { left: 10, right: 10 },
                styles: { fontSize: 9, cellPadding: 2 },
                headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.5 },
                bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.5 },
                columnStyles: {
                    no: { cellWidth: 10, halign: 'center' },
                    item: { cellWidth: 65 },
                    qty: { cellWidth: 15, halign: 'center' },
                    satuan: { cellWidth: 20, halign: 'center' },
                    eta: { cellWidth: 25, halign: 'center' },
                    catatan: { cellWidth: 45 },
                },
            });

            // Ambil posisi Y setelah tabel
            const tableEndY = (doc as any).lastAutoTable.finalY;

            // Tanda tangan
            let currentY = tableEndY + 35;
            doc.setFontSize(10).setFont('helvetica', 'normal');
            doc.text('Dibuat Oleh,', 50, currentY, { align: 'center' });
            doc.text('Disetujui Oleh,', pageWidth - 50, currentY, { align: 'center' });

            // Tempat tanda tangan
            doc.text('( ..................................... )', 50, currentY + 30, { align: 'center' });
            doc.text('( ..................................... )', pageWidth - 50, currentY + 30, { align: 'center' });

            // // Footer - Date
            // const footerY = doc.internal.pageSize.getHeight() - 10;
            // doc.setFontSize(8);
            // doc.text(currentDate, 10, footerY);

            // Output PDF
            if (downloadMode) {
                doc.save(`${purchaseRequest.no_pr}.pdf`);
                // Opsional: tutup window jika dalam mode download
                setTimeout(() => {
                    window.close();
                }, 500);
            } else {
                doc.save(`${purchaseRequest.no_pr}.pdf`);
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Terjadi kesalahan saat membuat PDF. Silakan coba lagi.');
        }
    };

    return (
        <>
            <Head title={`${purchaseRequest.no_pr}`} />

            <div className="p-6" ref={previewRef}>
                {/* Hanya tampilkan tombol jika bukan dalam mode download */}
                {!downloadMode && (
                    <button onClick={generatePdf} className="mb-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" type="button">
                        Download PDF
                    </button>
                )}

                {/* Preview Container - Visual style matching PO PDF */}
                <div className="mx-auto border border-gray-200 bg-white p-8 text-black shadow-lg" style={{ width: '210mm', minHeight: '297mm' }}>
                    {/* Header */}
                    <div className="relative border border-black p-4">
                        <div className="mb-4">
                            <h2 className="text-lg font-bold">{companyInfo.name}</h2>
                            <p className="text-sm">{companyInfo.address}</p>
                            <p className="text-sm">Jawa Timur 67155</p>
                            <p className="text-sm">Email: {companyInfo.email}</p>
                            <p className="text-sm">Telp: {companyInfo.phone}</p>
                        </div>
                        <div className="absolute top-4 right-4 text-right">
                            <h1 className="text-lg font-bold">PURCHASE REQUEST</h1>
                            <p>{purchaseRequest.no_pr}</p>
                        </div>
                    </div>

                    {/* PR Information */}
                    <div className="mt-4 border border-black p-4">
                        <div className="grid grid-cols-2 gap-x-4">
                            <div className="mb-2">
                                <div className="grid grid-cols-2">
                                    <span className="font-bold">Tanggal PR</span>
                                    <span>: {new Date(purchaseRequest.tgl_pr).toLocaleDateString('id-ID')}</span>
                                </div>
                            </div>
                            <div className="mb-2">
                                <div className="grid grid-cols-2">
                                    <span className="font-bold">Departemen</span>
                                    <span>: {purchaseRequest.departemen.nama_departemen}</span>
                                </div>
                            </div>
                            <div className="mb-2">
                                <div className="grid grid-cols-2">
                                    <span className="font-bold">Status</span>
                                    <span>: {purchaseRequest.status}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Header */}
                    <div className="mt-8 border border-black p-2 text-center font-bold">DATA ITEM</div>

                    {/* Items Table */}
                    <table className="w-full border-collapse border border-black">
                        <thead>
                            <tr className="bg-white">
                                <th className="border border-black p-2 text-center">No</th>
                                <th className="border border-black p-2">Deskripsi</th>
                                <th className="border border-black p-2 text-center">Qty</th>
                                <th className="border border-black p-2 text-center">Satuan</th>
                                <th className="border border-black p-2 text-center">ETA</th>
                                <th className="border border-black p-2">Catatan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchaseRequest.purchase_request_items.map((item, index) => (
                                <tr key={index}>
                                    <td className="border border-black p-2 text-center">{index + 1}</td>
                                    <td className="border border-black p-2">
                                        {item.master_item && (
                                            <>
                                                ({item.master_item.kode_master_item}) {item.master_item.nama_master_item}
                                            </>
                                        )}
                                    </td>
                                    <td className="border border-black p-2 text-center">{item.qty}</td>
                                    <td className="border border-black p-2 text-center">{item.master_item?.unit?.nama_satuan || '-'}</td>
                                    <td className="border border-black p-2 text-center">{new Date(item.eta).toLocaleDateString('id-ID')}</td>
                                    <td className="border border-black p-2">{item.catatan || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Signatures */}
                    <div className="mt-20 flex justify-between">
                        <div className="w-1/3 text-center">
                            <p>Dibuat Oleh,</p>
                            <div className="h-28"></div>
                            <p>( ..................................... )</p>
                        </div>
                        <div className="w-1/3 text-center">
                            <p>Disetujui Oleh,</p>
                            <div className="h-28"></div>
                            <p>( ..................................... )</p>
                        </div>
                    </div>

                    {/* Footer
                    <div className="mt-16 text-xs">{currentDate}</div> */}
                </div>
            </div>
        </>
    );
}
