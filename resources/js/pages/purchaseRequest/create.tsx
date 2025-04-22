/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, useForm } from "@inertiajs/react";

import { PlusCircle, Trash } from "lucide-react";
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react";
import { toast, Toaster } from "sonner";


interface Department {
    id: number;
    kode_departemen: string;
    nama_departemen: string;
}

interface MasterItem {
    id: number;
    kode_master_item: string;
    satuan_satu_id: number;
    id_type_item: number;
    type_item: {
        id: number;
        nama_type_item: string;
    };
    unit: {
        id: number;
        nama_satuan: string;
    };
}

interface CustomerAddress {
    id: number;
    kode_customer: string;
    nama_customer: string;
}

interface KartuInstruksiKerja {
    id: number;
    no_kartu_instruksi_kerja: string;
}

interface ItemReference {
    id?: string;
    type: 'customer' | 'department';
    id_department?: number;
    id_customer?: number;
    id_kartu_instruksi_kerja?: number;
    qty: number;
}

interface PurchaseRequestItem {
    id?: string;
    id_master_item: number;
    qty: number;
    eta: string;
    catatan: string;
    kode_master_item: string;
    satuan: string;
    references: ItemReference[];
}

interface CreateProps {
    departments: Department[];
    masterItems: MasterItem[];
    customerAddresses: CustomerAddress[];
    kartuInstruksiKerjas: KartuInstruksiKerja[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Purchase Request',
        href: '/purchaseRequest',
    },
    {
        title: 'Create',
        href: '/purchaseRequest/create',
    },
];

export default function Create({departments,masterItems,customerAddresses,kartuInstruksiKerjas}: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        id_department: '',
        tgl_pr: '',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items: [] as any,
    });

    // State for managing temporary item input
    const [itemInput, setItemInput] = useState<{
        id_master_item: string;
        qty: string;
        eta: string;
        catatan: string;
        kode_master_item: string;
        satuan: string;
    }>({
        id_master_item: '',
        qty: '',
        eta: '',
        catatan: '',
        kode_master_item: '',
        satuan: '',
    });

    // States for reference modal
    const [showReferenceModal, setShowReferenceModal] = useState(false);
    const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null);
    const [referenceInput, setReferenceInput] = useState<{
        type: 'customer' | 'department';
        id_department: string;
        id_customer: string;
        id_kartu_instruksi_kerja: string;
        qty: string;
    }>({
        type: 'department',
        id_department: '',
        id_customer: '',
        id_kartu_instruksi_kerja: '',
        qty: '',
    });

    // Handle department change
    const handleDepartmentChange = (value: string) => {
        setData('id_department', value);
    };

    // Handle date change
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData('tgl_pr', e.target.value);
    };

    // Handle item input changes
    const handleItemInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setItemInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle master item selection
    const handleMasterItemChange = (value: string) => {
        const selectedItem = masterItems.find((item) => item.id.toString() === value);

        if (selectedItem) {
            setItemInput({
                ...itemInput,
                id_master_item: value,
                kode_master_item: selectedItem.kode_master_item,
                satuan: selectedItem.unit.nama_satuan,
            });
        }
    };

    // Add item to the list
    const addItem = () => {
        if (!itemInput.id_master_item || !itemInput.qty || !itemInput.eta) {
            toast.error('Harap isi semua field item yang diperlukan');
            return;
        }

        const newItem: PurchaseRequestItem = {
            id: crypto.randomUUID(), // Generate unique ID for each item
            id_master_item: parseInt(itemInput.id_master_item),
            qty: parseFloat(itemInput.qty),
            eta: itemInput.eta,
            catatan: itemInput.catatan,
            kode_master_item: itemInput.kode_master_item,
            satuan: itemInput.satuan,
            references: [],
        };

        setData('items', [...data.items, newItem]);

        // Reset item input
        setItemInput({
            id_master_item: '',
            qty: '',
            eta: '',
            catatan: '',
            kode_master_item: '',
            satuan: '',
        });
    };

    // Remove item from the list
    const removeItem = (index: number) => {
        const updatedItems = [...(data.items as PurchaseRequestItem[])];
        updatedItems.splice(index, 1);
        setData('items', updatedItems);
    };

    // Open reference modal for a specific item
    const openReferenceModal = (index: number, e: React.MouseEvent) => {

        e.stopPropagation(); // Prevent event bubbling
        e.preventDefault(); // Prevent default action
        setCurrentItemIndex(index);
        setShowReferenceModal(true);
    };

    // Handle reference input changes
    const handleReferenceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setReferenceInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle reference type change
    const handleReferenceTypeChange = (value: 'customer' | 'department') => {
        setReferenceInput({
            ...referenceInput,
            type: value,
            id_department: '',
            id_customer: '',
            id_kartu_instruksi_kerja: '',
            qty: '',
        });
    };

    // Add reference to the current item
    const addReference = () => {
        if (currentItemIndex === null) return;

        let isValid = true;
        let errorMessage = '';

        if (referenceInput.type === 'department') {
            if (!referenceInput.id_department || !referenceInput.qty) {
                isValid = false;
                errorMessage = 'Harap isi departemen dan qty';
            }
        } else {
            if (!referenceInput.id_customer || !referenceInput.id_kartu_instruksi_kerja || !referenceInput.qty) {
                isValid = false;
                errorMessage = 'Harap isi customer, kartu instruksi kerja, dan qty';
            }
        }

        if (!isValid) {
            toast.error(errorMessage);
            return;
        }

        const newReference: ItemReference = {
            id: crypto.randomUUID(),
            type: referenceInput.type,
            qty: parseFloat(referenceInput.qty),
        };

        if (referenceInput.type === 'department') {
            newReference.id_department = parseInt(referenceInput.id_department);
        } else {
            newReference.id_customer = parseInt(referenceInput.id_customer);
            newReference.id_kartu_instruksi_kerja = parseInt(referenceInput.id_kartu_instruksi_kerja);
        }

        const updatedItems = [...data.items];
        updatedItems[currentItemIndex].references.push(newReference);
        setData('items', updatedItems);

        // Reset reference input
        setReferenceInput({
            type: referenceInput.type,
            id_department: '',
            id_customer: '',
            id_kartu_instruksi_kerja: '',
            qty: '',
        });
    };

    // Remove reference from an item
    const removeReference = (itemIndex: number, referenceIndex: number) => {
        const updatedItems = [...data.items];
        updatedItems[itemIndex].references.splice(referenceIndex, 1);
        setData('items', updatedItems);
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (data.items.length === 0) {
            toast.error('Harap tambahkan minimal satu item');
            return;
        }

        post(route('purchaseRequest.store'), {
            onSuccess: () => {
                toast.success('Purchase Request berhasil dibuat');
            },
            onError: (errors) => {
                console.error(errors);
                toast.error('Gagal membuat Purchase Request');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Purchase Request" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Buat Purchase Request</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Header Info */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="id_department">Departemen</Label>
                                        <Select value={data.id_department} onValueChange={handleDepartmentChange}>
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
                                        {errors.id_department && <p className="text-sm text-red-500">{errors.id_department}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="tgl_pr">Tanggal PR</Label>
                                        <Input id="tgl_pr" name="tgl_pr" type="date" value={data.tgl_pr} onChange={handleDateChange} />
                                        {errors.tgl_pr && <p className="text-sm text-red-500">{errors.tgl_pr}</p>}
                                    </div>
                                </div>

                                {/* Item Input Section */}
                                <div className="rounded-md border p-4">
                                    <h3 className="mb-4 text-lg font-medium">Tambah Item</h3>
                                    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="id_master_item">Item</Label>
                                            <Select value={itemInput.id_master_item} onValueChange={handleMasterItemChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Item" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {masterItems.map((item) => (
                                                        <SelectItem key={item.id} value={item.id.toString()}>
                                                            {item.type_item.nama_type_item}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="kode_master_item">Kode Item</Label>
                                            <Input id="kode_master_item" name="kode_master_item" value={itemInput.kode_master_item} disabled />
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
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="eta">ETA</Label>
                                            <Input id="eta" name="eta" type="date" value={itemInput.eta} onChange={handleItemInputChange} />
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
                                                    data.items.map((item: { id: Key | null | undefined; kode_master_item: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; id_master_item: number; qty: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; satuan: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; eta: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; catatan: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, index: number) => (
                                                        <TableRow key={item.id}>
                                                            <TableCell>{index + 1}</TableCell>
                                                            <TableCell>{item.kode_master_item}</TableCell>
                                                            <TableCell>
                                                                {masterItems.find((m) => m.id === item.id_master_item)?.type_item.nama_type_item}
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
                                    (item: { references: any[]; id: any; id_master_item: number; }, itemIndex: number) =>
                                        item.references.length > 0 && (
                                            <div key={`ref-${item.id}`} className="rounded-md border p-4">
                                                <h4 className="text-md mb-2 font-medium">
                                                    Referensi untuk Item {itemIndex + 1}:{' '}
                                                    {masterItems.find((m) => m.id === item.id_master_item)?.type_item.nama_type_item}
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
                                                        {item.references.map((ref: { id: Key | null | undefined; type: string; id_department: number; id_customer: number; id_kartu_instruksi_kerja: number; qty: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, refIndex: number) => (
                                                            <TableRow key={ref.id}>
                                                                <TableCell>{refIndex + 1}</TableCell>
                                                                <TableCell>{ref.type === 'department' ? 'Departemen' : 'Customer'}</TableCell>
                                                                <TableCell>
                                                                    {ref.type === 'department'? (
                                                                        departments.find((d) => d.id === ref.id_department)?.nama_departemen
                                                                    ) : (
                                                                        <>
                                                                            {customerAddresses.find((c) => c.id === ref.id_customer)?.nama_customer} -
                                                                            {
                                                                                kartuInstruksiKerjas.find(
                                                                                    (k) => k.id === ref.id_kartu_instruksi_kerja,
                                                                                )?.no_kartu_instruksi_kerja
                                                                            }
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

                                <div className="flex justify-end">
                                    <Button type="submit" disabled={processing}>
                                        Simpan Purchase Request
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
                                       ? masterItems.find((m) => m.id === data.items[currentItemIndex]?.id_master_item)?.type_item.nama_type_item
                                        : ''}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                <RadioGroup
                                    value={referenceInput.type}
                                    onValueChange={(value: 'customer' | 'department') => handleReferenceTypeChange(value)}
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
                                                onValueChange={(value) => setReferenceInput({ ...referenceInput, id_customer: value })}
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
                                            <Label htmlFor="id_kartu_instruksi_kerja">Kartu Instruksi Kerja</Label>
                                            <Select
                                                value={referenceInput.id_kartu_instruksi_kerja}
                                                onValueChange={(value) => setReferenceInput({ ...referenceInput, id_kartu_instruksi_kerja: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Kartu Instruksi Kerja" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {kartuInstruksiKerjas.map((kik) => (
                                                        <SelectItem key={kik.id} value={kik.id.toString()}>
                                                            {kik.no_kartu_instruksi_kerja}
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

