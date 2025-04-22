import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface PurchaseRequestItem {
    id: string;
    qty: number;
    eta: string;
    catatan: string;
    masterItem: {
        kode_master_item: string;
        typeItem: {
            nama_type_item: string;
        };
        unit: {
            nama_satuan: string;
        };
    };
    itemReferences: {
        id: string;
        type: 'customer' | 'department';
        qty: number;
        departemen?: {
            nama_departemen: string;
        };
        customerAddress?: {
            nama_customer: string;
        };
        kartuInstruksiKerja?: {
            no_kartu_instruksi_kerja: string;
        };
    }[];
}

interface PurchaseRequest {
    id: string;
    no_pr: string;
    tgl_pr: string;
    departemen: {
        nama_departemen: string;
    };
    purchaseRequestItems: PurchaseRequestItem[];
}

interface DetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: PurchaseRequest | null;
}

export default function DetailModal({ isOpen, onClose, item }: DetailModalProps) {
    if (!item) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Detail Purchase Request: {item.no_pr}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* PR Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Purchase Request</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="font-semibold">No. PR:</p>
                                    <p>{item.no_pr}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Tanggal PR:</p>
                                    <p>{item.tgl_pr}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Departemen:</p>
                                    <p>{item.departemen.nama_departemen}</p>
                                </div>
                                {/* <div>
                                    <p className="font-semibold">Total Item:</p>
                                    <p>{item.purchaseRequestItems.length}</p>
                                </div> */}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Item</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>Kode Item</TableHead>
                                        <TableHead>Nama Item</TableHead>
                                        <TableHead>Qty</TableHead>
                                        <TableHead>Satuan</TableHead>
                                        <TableHead>ETA</TableHead>
                                        <TableHead>Catatan</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {item.purchaseRequestItems &&
                                        item.purchaseRequestItems.map((prItem, index) => (
                                            <TableRow key={prItem.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{prItem.masterItem?.kode_master_item || '-'}</TableCell>
                                                <TableCell>{prItem.masterItem?.typeItem?.nama_type_item || '-'}</TableCell>
                                                <TableCell>{prItem.qty}</TableCell>
                                                <TableCell>{prItem.masterItem.unit.nama_satuan}</TableCell>
                                                <TableCell>{prItem.eta}</TableCell>
                                                <TableCell>{prItem.catatan}</TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* References for each item */}
                    {item.purchaseRequestItems &&
                        item.purchaseRequestItems.map(
                            (prItem, itemIndex) =>
                                prItem.itemReferences &&
                                prItem.itemReferences.length > 0 && (
                                    <Card key={`ref-${prItem.id}`}>
                                        <CardHeader>
                                            <CardTitle>
                                                Referensi untuk Item {itemIndex + 1}: {prItem.masterItem.typeItem.nama_type_item}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>No</TableHead>
                                                        <TableHead>Tipe</TableHead>
                                                        <TableHead>Referensi</TableHead>
                                                        <TableHead>Qty</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {prItem.itemReferences.map((ref, refIndex) => (
                                                        <TableRow key={ref.id}>
                                                            <TableCell>{refIndex + 1}</TableCell>
                                                            <TableCell>{ref.type === 'department' ? 'Departemen' : 'Customer'}</TableCell>
                                                            <TableCell>
                                                                {ref.type === 'department' ? (
                                                                    ref.departemen?.nama_departemen
                                                                ) : (
                                                                    <>
                                                                        {ref.customerAddress?.nama_customer} -
                                                                        {ref.kartuInstruksiKerja?.no_kartu_instruksi_kerja}
                                                                    </>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>{ref.qty}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                ),
                        )}
                </div>

                <DialogFooter>
                    <Button onClick={onClose}>Tutup</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
