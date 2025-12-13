import { DatePicker } from '@/components/date-picker';
import { SearchableSelect } from '@/components/search-select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface EditFormPOProps {
    data: {
        id_purchase_request?: string;
        id_supplier?: string;
        tanggal_po?: string;
        eta?: string | Date;
        mata_uang?: string;
        ppn?: number;
        ongkir?: number;
        dp?: number;
        [key: string]: any;
    };
    setData: (key: string, value: any) => void;
    errors: Record<string, string | undefined>;
    purchaseRequests: any[];
    suppliers: any[];
    currencies: string[];
    purchaseOrder: any;
}

export default function EditFormPO({ data, setData, errors, purchaseRequests, suppliers, currencies, purchaseOrder }: EditFormPOProps) {
    // Find the selected PR for display
    const selectedPR = purchaseRequests.find((pr) => pr.id === data.id_purchase_request);

    return (
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Card untuk detail PO */}
            <Card>
                <CardHeader>
                    <CardTitle>Purchase Order Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="id_purchase_request">Purchase Request</Label>
                        {/* Tampilkan sebagai input disabled */}
                        <Input
                            id="id_purchase_request"
                            value={selectedPR?.no_pr || purchaseOrder.purchase_request?.no_pr || 'Purchase Request tidak ditemukan'}
                            disabled
                        />
                        {errors.id_purchase_request && <p className="text-sm text-red-500">{errors.id_purchase_request}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tanggal_po">PO Date</Label>
                        <DatePicker
                            id="tanggal_po"
                            value={data.tanggal_po}
                            onChange={(date) => {
                                setData('tanggal_po', date?.target?.value || '');
                            }}
                        />
                        {errors.tanggal_po && <p className="text-sm text-red-500">{errors.tanggal_po}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="id_supplier">Supplier</Label>
                        <SearchableSelect
                            items={suppliers.map((supplier) => ({
                                key: String(supplier.id),
                                value: String(supplier.id),
                                label: supplier.nama_suplier,
                            }))}
                            value={data.id_supplier || ''}
                            placeholder="Pilih Supplier"
                            onChange={(val) => setData('id_supplier', val)}
                        />
                        {errors.id_supplier && <p className="text-sm text-red-500">{errors.id_supplier}</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Card untuk informasi tambahan */}
            <Card>
                <CardHeader>
                    <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="eta">ETA</Label>
                        <DatePicker
                            id="eta"
                            value={data.eta}
                            onChange={(date) => {
                                setData('eta', date?.target?.value || '');
                            }}
                        />
                        {errors.eta && <p className="text-sm text-red-500">{errors.eta}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="mata_uang">Currency</Label>
                        <Select value={data.mata_uang} onValueChange={(val) => setData('mata_uang', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Currency" />
                            </SelectTrigger>
                            <SelectContent>
                                {currencies.map((currency) => (
                                    <SelectItem key={currency} value={currency}>
                                        {currency}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.mata_uang && <p className="mt-1 text-sm text-red-500">{errors.mata_uang}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ppn">PPN (%)</Label>
                        <Input
                            type="number"
                            id="ppn"
                            value={data.ppn !== undefined ? data.ppn : 0}
                            onChange={(e) => setData('ppn', parseFloat(e.target.value) || 0)}
                        />
                        {errors.ppn && <p className="mt-1 text-sm text-red-500">{errors.ppn}</p>}
                    </div>

                    <div>
                        <Label htmlFor="ongkir">Ongkir</Label>
                        <Input
                            type="number"
                            id="ongkir"
                            value={data.ongkir  ? data.ongkir : 0}
                            onChange={(e) => setData('ongkir', parseFloat(e.target.value) || 0)}
                        />
                        {errors.ongkir && <p className="mt-1 text-sm text-red-500">{errors.ongkir}</p>}
                    </div>

                    <div>
                        <Label htmlFor="dp">DP</Label>
                        <Input
                            type="number"
                            id="dp"
                            value={data.dp ? data.dp : 0}
                            onChange={(e) => setData('dp', parseFloat(e.target.value) || 0)}
                        />
                        {errors.dp && <p className="mt-1 text-sm text-red-500">{errors.dp}</p>}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
