/* eslint-disable @typescript-eslint/no-explicit-any */
import { PurchaseRequest } from '@/types/purchaseRequest';
import { Head } from '@inertiajs/react';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
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

export default function PdfPreview({ purchaseRequest, companyInfo, currentDate, downloadMode = false }: PdfPreviewProps) {
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
            // Inisialisasi jsPDF dengan ukuran A4
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            // Margin
            const margin = 10;

            // Posisi awal
            let y = margin;

            // Lebar konten
            const pageWidth = doc.internal.pageSize.getWidth();
            const contentWidth = pageWidth - 2 * margin;

            // Header - Informasi Perusahaan
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(companyInfo.name, margin, y);

            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            y += 5;
            doc.text(companyInfo.address, margin, y);
            y += 4;
            doc.text(`Telp. ${companyInfo.phone}`, margin, y);
            y += 4;
            doc.text(`Email: ${companyInfo.email}`, margin, y);
            y += 8;

            // Header - Informasi Purchase Request
            const prInfoWidth = 80;
            const prInfoX = pageWidth - margin - prInfoWidth;

            doc.setFillColor(240, 240, 240);
            doc.rect(prInfoX, margin, prInfoWidth, 25, 'S');

            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('PURCHASE REQUEST ORDER', prInfoX + prInfoWidth / 2, margin + 6, { align: 'center' });

            // PR Number dan Tanggal
            const halfWidth = prInfoWidth / 2;
            doc.rect(prInfoX, margin + 10, halfWidth, 8, 'S');
            doc.rect(prInfoX + halfWidth, margin + 10, halfWidth, 8, 'S');

            doc.setFontSize(9);
            doc.text(purchaseRequest.no_pr, prInfoX + halfWidth / 2, margin + 15, { align: 'center' });

            const prDate = new Date(purchaseRequest.tgl_pr);
            const formattedDate = prDate.toLocaleDateString('id-ID');
            doc.text(formattedDate, prInfoX + halfWidth + halfWidth / 2, margin + 15, { align: 'center' });

            // Diajukan Oleh
            doc.setFontSize(8);
            doc.text('Diajukan Oleh:', prInfoX + 5, margin + 22);

            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.text(purchaseRequest.departemen.nama_departemen, prInfoX + prInfoWidth / 2, margin + 22, { align: 'center' });

            // Tabel Item
            y += 20;

            // Buat array untuk tabel items
            const itemsTableData = purchaseRequest.purchase_request_items.map((item, index) => [
                (index + 1).toString(),
                item.master_item ? `(${item.master_item.kode_master_item}) ${item.master_item.nama_master_item}` : '',
                `${item.qty} ${item.master_item?.unit?.nama_satuan || ''}`,
                new Date(item.eta).toLocaleDateString('id-ID'),
                item.catatan || '',
            ]);

            // Header tabel
            autoTable(doc, {
                startY: y,
                head: [['No', 'Deskripsi', 'Qty', 'ETA', 'Catatan']],
                body: itemsTableData,
                headStyles: {
                    fillColor: [240, 240, 240],
                    textColor: [0, 0, 0],
                    fontStyle: 'bold',
                },
                styles: {
                    fontSize: 9,
                    cellPadding: 3,
                },
                columnStyles: {
                    0: { cellWidth: 10, halign: 'center' },
                    2: { halign: 'center' },
                    3: { halign: 'center' },
                },
                margin: { left: margin, right: margin },
                tableWidth: 'auto',
                theme: 'grid',
            });


            // Footer - Tanda tangan
            // Mendapatkan posisi y setelah tabel terakhir
            y = (doc as any).lastAutoTable.finalY + 20;

            const signatureWidth = (contentWidth - margin) / 2;

            // Signature 1 - Dibuat oleh
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text('Dibuat Oleh,', margin + signatureWidth / 3, y, { align: 'center' });

            y += 20;
            const lineWidth = 50;
            doc.line(margin + signatureWidth / 3 - lineWidth / 2, y, margin + signatureWidth / 3 + lineWidth / 2, y);

            // Signature 2 - Disetujui oleh
            doc.text('Disetujui Oleh,', margin + signatureWidth + signatureWidth / 3, y - 20, { align: 'center' });

            doc.line(
                margin + signatureWidth + signatureWidth / 3 - lineWidth / 2,
                y,
                margin + signatureWidth + signatureWidth / 3 + lineWidth / 2,
                y,
            );

            // Footer - Date and page
            const footerY = doc.internal.pageSize.getHeight() - 10;

            doc.setFontSize(8);
            doc.text(currentDate, margin, footerY);


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
            <Head title={`Purchase Request - ${purchaseRequest.no_pr}`} />

            <div className="p-6" ref={previewRef}>
                {/* Hanya tampilkan tombol jika bukan dalam mode download */}
                {!downloadMode && (
                    <button onClick={generatePdf} className="mb-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" type="button">
                        Download PDF
                    </button>
                )}

                {/* Preview Container - Bukan lagi untuk PDF rendering, hanya untuk tampilan */}
                <div className="mx-auto border border-gray-200 bg-white p-8 text-black shadow-lg" style={{ width: '210mm', minHeight: '297mm' }}>
                    <div className="mb-6 flex items-start justify-between">
                        <div>
                            <h2 className="text-lg font-bold">{companyInfo.name}</h2>
                            <p className="text-sm">{companyInfo.address}</p>
                            <p className="text-sm">Telp. {companyInfo.phone}</p>
                            <p className="text-sm">Email: {companyInfo.email}</p>
                        </div>

                        <div className="border border-black bg-gray-50 p-4">
                            <h1 className="mb-2 text-center text-xl font-bold">PURCHASE REQUEST</h1>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="border border-black p-1 text-center">{purchaseRequest.no_pr}</div>
                                <div className="border border-black p-1 text-center">
                                    {new Date(purchaseRequest.tgl_pr).toLocaleDateString('id-ID')}
                                </div>
                            </div>
                            <div className="mt-2">
                                <p className="text-sm">Diajukan Oleh :</p>
                                <p className="text-center font-bold">{purchaseRequest.departemen.nama_departemen}</p>
                            </div>
                        </div>
                    </div>

                    <table className="mb-6 w-full border-collapse border border-black">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="w-10 border border-black p-2 text-center">No</th>
                                <th className="border border-black p-2">Deskripsi</th>
                                <th className="w-20 border border-black p-2 text-center">Qty</th>
                                <th className="w-32 border border-black p-2 text-center">ETA</th>
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
                                    <td className="border border-black p-2 text-center">
                                        {item.qty} {item.master_item?.unit?.nama_satuan || ''}
                                    </td>
                                    <td className="border border-black p-2 text-center">{new Date(item.eta).toLocaleDateString('id-ID')}</td>
                                    <td className="border border-black p-2">{item.catatan}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>



                    <div className="mt-20 mb-8 flex justify-between">
                        <div className="w-1/3 text-center">
                            <p>Dibuat Oleh,</p>
                            <div className="h-16"></div>
                            <p className="border-black pt-2">_________________________</p>
                        </div>
                        <div className="w-1/3 text-center">
                            <p>Disetujui Oleh,</p>
                            <div className="h-16"></div>
                            <p className="border-black pt-2">_________________________</p>
                        </div>
                    </div>

                    <div className="mt-20 flex justify-between text-xs text-gray-600">
                        <div>{currentDate}</div>
                    </div>
                </div>
            </div>
        </>
    );
}
