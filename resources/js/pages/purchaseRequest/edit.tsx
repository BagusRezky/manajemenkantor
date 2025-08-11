import { DatePicker } from '@/components/date-picker';
import { SearchableSelect } from '@/components/search-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { ItemInput, PurchaseRequestEditProps, ReferenceInput } from '@/types/predit';
import { Head, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { PlusCircle, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Purchase Requests',
        href: '/purchaseRequest',
    },
    {
        title: 'Edit',
        href: '/purchaseRequest/edit',
    },
];

export default function Edit({ purchaseRequest, departments, masterItems, customerAddresses, kartuInstruksiKerjas }: PurchaseRequestEditProps) {
    // Convert purchase request items to the format expected by the form
    const formattedItems = purchaseRequest.purchase_request_items.map((item) => {
        const masterItem = masterItems.find((m) => m.id === Number(item.id_master_item));
        return {
            id: item.id,
            id_master_item: item.id_master_item.toString(),
            kode_master_item: masterItem?.kode_item || masterItem?.kode_master_item || '',
            qty: item.qty.toString(),
            satuan: masterItem?.unit?.nama_satuan || '',
            eta: format(new Date(item.eta), 'yyyy-MM-dd'),
            catatan: item.catatan || '',
            references: (item.item_references || []).map((ref) => ({
                id: ref.id,
                type: ref.type as 'department' | 'customer',
                qty: ref.qty.toString(),
                id_department: ref.id_department?.toString() || '',
                id_customer: ref.id_customer_address?.toString() || '',
                id_customer_address: ref.id_customer_address?.toString() || '',
                id_kartu_instruksi_kerja: ref.id_kartu_instruksi_kerja?.toString() || '',
            })),
        };
    });

    const { data, setData, put, errors, processing } = useForm({
        id_department: purchaseRequest.id_department.toString(),
        tgl_pr: format(new Date(purchaseRequest.tgl_pr), 'yyyy-MM-dd'),
        items: formattedItems,
    });

    // State for adding new items
    const [itemInput, setItemInput] = useState<ItemInput>({
        id_master_item: '',
        qty: '',
        eta: format(new Date(), 'yyyy-MM-dd'),
        catatan: '',
        satuan: '',
        type_item: '',
        kode_master_item: '',
    });

    // State for reference modal
    const [showReferenceModal, setShowReferenceModal] = useState(false);
    const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null);
    const [referenceInput, setReferenceInput] = useState<ReferenceInput>({
        type: 'department',
        id_department: '',
        id_customer: '',
        id_kartu_instruksi_kerja: '',
        qty: '',
    });

    // Event handlers
    const handleDepartmentChange = (value: string) => {
        setData('id_department', value);
    };

    const handleMasterItemChange = (value: string) => {
        const masterItem = masterItems.find((item) => item.id.toString() === value);
        if (masterItem) {
            setItemInput({
                ...itemInput,
                id_master_item: value,
                kode_master_item: masterItem.kode_item || masterItem.kode_master_item || '',
                satuan: masterItem.unit?.nama_satuan || '',
                type_item: masterItem.type_item?.nama_type_item || masterItem.typeItem?.nama_type_item || '',
            });
        }
    };

    const handleItemInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setItemInput({
            ...itemInput,
            [e.target.name]: e.target.value,
        });
    };

    const addItem = () => {
        if (!itemInput.id_master_item || !itemInput.qty || !itemInput.eta) {
            toast.error('Mohon lengkapi item dengan benar');
            return;
        }

        const masterItem = masterItems.find((item) => item.id.toString() === itemInput.id_master_item);

        setData('items', [
            ...data.items,
            {
                id: undefined, // Add undefined id for new items
                id_master_item: itemInput.id_master_item,
                kode_master_item: masterItem?.kode_item || masterItem?.kode_master_item || '',
                qty: itemInput.qty,
                satuan: itemInput.satuan,
                eta: itemInput.eta,
                catatan: itemInput.catatan,
                references: [],
            },
        ]);

        // Reset item input
        setItemInput({
            id_master_item: '',
            qty: '',
            eta: format(new Date(), 'yyyy-MM-dd'),
            catatan: '',
            satuan: '',
            type_item: '',
            kode_master_item: '',
        });
    };

    const removeItem = (index: number) => {
        const updatedItems = [...data.items];
        updatedItems.splice(index, 1);
        setData('items', updatedItems);
    };

    const openReferenceModal = (index: number, e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentItemIndex(index);
        setReferenceInput({
            type: 'department',
            id_department: '',
            id_customer: '',
            id_kartu_instruksi_kerja: '',
            qty: '',
        });
        setShowReferenceModal(true);
    };

    const handleReferenceTypeChange = (value: 'department' | 'customer') => {
        setReferenceInput({
            ...referenceInput,
            type: value,
        });
    };

    const handleReferenceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReferenceInput({
            ...referenceInput,
            [e.target.name]: e.target.value,
        });
    };

    const addReference = () => {
        if (currentItemIndex === null) return;

        if (referenceInput.type === 'department' && !referenceInput.id_department) {
            toast.error('Mohon pilih departemen');
            return;
        }

        if (referenceInput.type === 'customer' && (!referenceInput.id_customer || !referenceInput.id_kartu_instruksi_kerja)) {
            toast.error('Mohon pilih customer dan SPK');
            return;
        }

        if (!referenceInput.qty) {
            toast.error('Mohon isi qty');
            return;
        }

        const updatedItems = [...data.items];
        updatedItems[currentItemIndex].references.push({
            id: undefined, // Add undefined id for new references
            type: referenceInput.type,
            id_department: referenceInput.type === 'department' ? referenceInput.id_department : '',
            id_customer: referenceInput.type === 'customer' ? referenceInput.id_customer : '',
            id_customer_address: referenceInput.type === 'customer' ? referenceInput.id_customer : '',
            id_kartu_instruksi_kerja: referenceInput.type === 'customer' ? referenceInput.id_kartu_instruksi_kerja : '',
            qty: referenceInput.qty,
        });

        setData('items', updatedItems);
        setShowReferenceModal(false);
    };

    const removeReference = (itemIndex: number, refIndex: number) => {
        const updatedItems = [...data.items];
        updatedItems[itemIndex].references.splice(refIndex, 1);
        setData('items', updatedItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (data.items.length === 0) {
            toast.error('Mohon tambahkan minimal satu item');
            return;
        }

        put(route('purchaseRequest.update', purchaseRequest.id), {
            onSuccess: () => {
                toast.success('Purchase Request berhasil diupdate');
            },
            onError: () => {
                toast.error('Terjadi kesalahan saat mengupdate Purchase Request');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Purchase Request" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Purchase Request #{purchaseRequest.no_pr}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Header Info */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="id_department">Departemen</Label>
                                        <SearchableSelect
                                            items={departments.map((dept) => ({
                                                key: String(dept.id),
                                                value: String(dept.id),
                                                label: `${dept.kode_departemen || ''} - ${dept.nama_departemen}`,
                                            }))}
                                            value={data.id_department || ''}
                                            placeholder="Pilih Departemen"
                                            onChange={handleDepartmentChange}
                                        />
                                        {errors.id_department && <p className="text-sm text-red-500">{errors.id_department}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="tgl_pr">Tanggal PR</Label>
                                        <DatePicker
                                            id="tgl_pr"
                                            value={data.tgl_pr}
                                            onChange={(e) => setData('tgl_pr', e.target.value ? e.target.value : '')}
                                        />
                                        {errors.tgl_pr && <p className="text-sm text-red-500">{errors.tgl_pr}</p>}
                                    </div>
                                </div>

                                {/* Item Input Section */}
                                <div className="rounded-md border p-4">
                                    <h3 className="mb-4 text-lg font-medium">Tambah Item</h3>
                                    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="id_master_item">Item</Label>
                                            <SearchableSelect
                                                items={masterItems.map((item) => ({
                                                    key: String(item.id),
                                                    value: String(item.id),
                                                    label: `${item.kode_item || item.kode_master_item || ''} - ${item.nama_item || item.nama_master_item || ''}`,
                                                }))}
                                                value={itemInput.id_master_item || ''}
                                                placeholder="Pilih Item"
                                                onChange={handleMasterItemChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="satuan">Satuan</Label>
                                            <Input id="satuan" name="satuan" value={itemInput.satuan} disabled />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="qty">Qty</Label>
                                            <Input
                                                id="qty"
                                                name="qty"
                                                type="number"
                                                step="0.01"
                                                value={itemInput.qty}
                                                onChange={handleItemInputChange}
                                                placeholder="0,00"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="eta">ETA</Label>
                                            <DatePicker
                                                id="eta"
                                                value={itemInput.eta}
                                                onChange={(e) => setItemInput({ ...itemInput, eta: e.target.value ? e.target.value : '' })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="catatan">Catatan</Label>
                                            <Input id="catatan" name="catatan" value={itemInput.catatan} onChange={handleItemInputChange} />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button type="button" onClick={addItem}>
                                            Tambah Item
                                        </Button>
                                    </div>
                                </div>

                                {/* Items Table */}
                                <div>
                                    <h3 className="mb-4 text-lg font-medium">Daftar Item</h3>
                                    <div className="rounded-md border">
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
                                                    <TableHead>Aksi</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {data.items.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={8} className="text-center">
                                                            Belum ada item
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    data.items.map((item, index) => (
                                                        <TableRow key={item.id || index}>
                                                            <TableCell>{index + 1}</TableCell>
                                                            <TableCell>{item.kode_master_item}</TableCell>
                                                            <TableCell>
                                                                {masterItems.find((m) => m.id === Number(item.id_master_item))?.nama_master_item ||
                                                                    masterItems.find((m) => m.id === Number(item.id_master_item))?.nama_item}
                                                            </TableCell>
                                                            <TableCell>{item.qty}</TableCell>
                                                            <TableCell>{item.satuan}</TableCell>
                                                            <TableCell>{item.eta}</TableCell>
                                                            <TableCell>{item.catatan}</TableCell>
                                                            <TableCell>
                                                                <div className="flex space-x-2">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        onClick={(e) => openReferenceModal(index, e)}
                                                                        title="Tambah Referensi"
                                                                    >
                                                                        <PlusCircle className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="destructive"
                                                                        size="icon"
                                                                        onClick={() => removeItem(index)}
                                                                        title="Hapus Item"
                                                                    >
                                                                        <Trash className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>

                                {/* References Display */}
                                {data.items.map(
                                    (item, itemIndex) =>
                                        item.references.length > 0 && (
                                            <div key={`ref-${item.id || itemIndex}`} className="rounded-md border p-4">
                                                <h4 className="text-md mb-2 font-medium">
                                                    Referensi untuk Item {itemIndex + 1}:{' '}
                                                    {masterItems.find((m) => m.id === Number(item.id_master_item))?.type_item?.nama_type_item ||
                                                        masterItems.find((m) => m.id === Number(item.id_master_item))?.typeItem?.nama_type_item}
                                                </h4>
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>No</TableHead>
                                                            <TableHead>Tipe</TableHead>
                                                            <TableHead>Referensi</TableHead>
                                                            <TableHead>Qty</TableHead>
                                                            <TableHead>Aksi</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {item.references.map((ref, refIndex) => (
                                                            <TableRow key={ref.id || refIndex}>
                                                                <TableCell>{refIndex + 1}</TableCell>
                                                                <TableCell>{ref.type === 'department' ? 'Departemen' : 'Customer'}</TableCell>
                                                                <TableCell>
                                                                    {ref.type === 'department' ? (
                                                                        departments.find((d) => d.id === Number(ref.id_department))?.nama_departemen
                                                                    ) : (
                                                                        <>
                                                                            {
                                                                                customerAddresses.find(
                                                                                    (c) =>
                                                                                        c.id === Number(ref.id_customer || ref.id_customer_address),
                                                                                )?.nama_customer
                                                                            }{' '}
                                                                            -
                                                                            {kartuInstruksiKerjas.find(
                                                                                (k) => k.id === Number(ref.id_kartu_instruksi_kerja),
                                                                            )?.no_kartu_instruksi_kerja ||
                                                                                kartuInstruksiKerjas.find(
                                                                                    (k) => k.id === Number(ref.id_kartu_instruksi_kerja),
                                                                                )?.no_kik}
                                                                        </>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>{ref.qty}</TableCell>
                                                                <TableCell>
                                                                    <Button
                                                                        variant="destructive"
                                                                        size="icon"
                                                                        onClick={() => removeReference(itemIndex, refIndex)}
                                                                        title="Hapus Referensi"
                                                                    >
                                                                        <Trash className="h-4 w-4" />
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        ),
                                )}

                                <div className="flex justify-end space-x-2">
                                    <Button>
                                        <a href={route('purchaseRequest.index')}>Kembali</a>
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        Update Purchase Request
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Reference Modal */}
                    <Dialog open={showReferenceModal} onOpenChange={setShowReferenceModal}>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Tambah Referensi Item</DialogTitle>
                                <DialogDescription>
                                    Tambahkan referensi untuk item{' '}
                                    {currentItemIndex !== null
                                        ? masterItems.find((m) => m.id === Number(data.items[currentItemIndex]?.id_master_item))?.type_item
                                              ?.nama_type_item ||
                                          masterItems.find((m) => m.id === Number(data.items[currentItemIndex]?.id_master_item))?.typeItem
                                              ?.nama_type_item
                                        : ''}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                <RadioGroup
                                    value={referenceInput.type}
                                    onValueChange={(value: 'department' | 'customer') => handleReferenceTypeChange(value)}
                                    className="flex space-x-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="department" id="department" />
                                        <Label htmlFor="department">Departemen</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="customer" id="customer" />
                                        <Label htmlFor="customer">Customer</Label>
                                    </div>
                                </RadioGroup>

                                {referenceInput.type === 'department' ? (
                                    <div className="space-y-2">
                                        <Label htmlFor="id_department">Departemen</Label>
                                        <Select
                                            value={referenceInput.id_department}
                                            onValueChange={(value) => setReferenceInput({ ...referenceInput, id_department: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Departemen" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {departments.map((dept) => (
                                                    <SelectItem key={dept.id} value={dept.id.toString()}>
                                                        {dept.nama_departemen}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="id_customer">Customer</Label>
                                            <Select
                                                value={referenceInput.id_customer}
                                                onValueChange={(value) =>
                                                    setReferenceInput({ ...referenceInput, id_customer: value, id_customer_address: value })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Customer" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {customerAddresses.map((customer) => (
                                                        <SelectItem key={customer.id} value={customer.id.toString()}>
                                                            {customer.nama_customer}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="id_kartu_instruksi_kerja">Surat Perintah Kerja</Label>
                                            <Select
                                                value={referenceInput.id_kartu_instruksi_kerja}
                                                onValueChange={(value) => setReferenceInput({ ...referenceInput, id_kartu_instruksi_kerja: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Surat Perintah Kerja" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {kartuInstruksiKerjas.map((kik) => (
                                                        <SelectItem key={kik.id} value={kik.id.toString()}>
                                                            {kik.no_kartu_instruksi_kerja || kik.no_kik}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="qty">Qty</Label>
                                    <Input
                                        id="qty"
                                        name="qty"
                                        type="number"
                                        step="0.01"
                                        value={referenceInput.qty}
                                        onChange={handleReferenceInputChange}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="secondary" onClick={() => setShowReferenceModal(false)}>
                                    Batal
                                </Button>
                                <Button type="button" onClick={addReference}>
                                    Tambah Referensi
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Toaster />
                </div>
            </div>
        </AppLayout>
    );
}
