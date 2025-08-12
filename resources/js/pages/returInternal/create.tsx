import { DatePicker } from '@/components/date-picker';
import { SearchableSelect } from '@/components/search-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { ImrDiemakingItem } from '@/types/imrDiemaking';
import { ImrFinishingItem } from '@/types/imrFinishing';
import { InternalMaterialRequestItem } from '@/types/internalMaterialRequest';
import { Head, Link, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { Package, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';

interface CombinedImr {
    id: string;
    label: string;
}

interface CreateProps {
    lastId: number;
    combinedImr: CombinedImr[];
    imrItems?: { [key: string]: (InternalMaterialRequestItem | ImrDiemakingItem | ImrFinishingItem)[] };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Retur Internal',
        href: '/returInternals',
    },
    {
        title: 'Tambah',
        href: '#',
    },
];

export default function Create({ lastId, combinedImr, imrItems = {} }: CreateProps) {
    const [selectedImr, setSelectedImr] = useState<string>('');
    const [imrItemsList, setImrItemsList] = useState<(InternalMaterialRequestItem | ImrDiemakingItem | ImrFinishingItem)[]>([]);
    const [itemQuantities, setItemQuantities] = useState<{ [key: string]: number }>({});

    const { data, setData, post, processing, errors } = useForm({
        id_imr_finishing: null as number | null,
        id_imr_diemaking: null as number | null,
        id_imr: null as number | null,
        no_retur_internal: '',
        tgl_retur_internal: '',
        nama_retur_internal: '',
        catatan_retur_internal: '',
        items: [] as {
            id_imr_item?: number;
            id_imr_diemaking_item?: number;
            id_imr_finishing_item?: number;
            qty_approved_retur: number;
        }[],
    });

    // Auto generate no retur internal
    const currentDate = new Date();
    const yearMonth = `${currentDate.getFullYear().toString().slice(-2)}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
    const nextId = String(lastId + 1).padStart(4, '0');
    const returInternalNumber = `RI/${nextId}.${yearMonth}`;

    useEffect(() => {
        setData((prevData) => ({
            ...prevData,
            no_retur_internal: returInternalNumber,
            tgl_retur_internal: format(new Date(), 'yyyy-MM-dd'),
        }));
    }, [returInternalNumber]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImrChange = (value: string) => {
        const selectedImr = combinedImr.find((imr) => imr.id === value);

        setSelectedImr(value);
        setItemQuantities({});

        // Reset form IMR IDs dan items
        setData((prevData) => ({
            ...prevData,
            id_imr_finishing: null,
            id_imr_diemaking: null,
            id_imr: null,
            items: [],
        }));

        if (!selectedImr) {
            setImrItemsList([]);
            return;
        }

        // Set IMR items based on selection
        const items = imrItems[value] || [];
        setImrItemsList(items);

        // Deteksi tipe berdasarkan field yang ada di item pertama
        if (items.length > 0) {
            const firstItem = items[0];

            if ('qty_approved_finishing' in firstItem) {
                setData((prev) => ({
                    ...prev,
                    id_imr_finishing: parseInt(value),
                    id_imr_diemaking: null,
                    id_imr: null,
                }));
            } else if ('qty_approved_diemaking' in firstItem) {
                setData((prev) => ({
                    ...prev,
                    id_imr_diemaking: parseInt(value),
                    id_imr_finishing: null,
                    id_imr: null,
                }));
            } else {
                setData((prev) => ({
                    ...prev,
                    id_imr: parseInt(value),
                    id_imr_finishing: null,
                    id_imr_diemaking: null,
                }));
            }
        }
    };

    //Function untuk get qty berdasarkan tipe item
    const getQtyAvailable = (item: InternalMaterialRequestItem | ImrDiemakingItem | ImrFinishingItem): string => {
        if ('qty_approved' in item) {
            return item.qty_approved.toString() || '0';
        }
        return '0';
    };

    // Function untuk get master item details
    const getMasterItemDetails = (item: InternalMaterialRequestItem | ImrDiemakingItem | ImrFinishingItem) => {
        return {
            kode: item.kartu_instruksi_kerja_bom?.bill_of_materials?.master_item?.kode_master_item || '-',
            nama: item.kartu_instruksi_kerja_bom?.bill_of_materials?.master_item?.nama_master_item || '-',
            // departemen: item.kartu_instruksi_kerja_bom?.bill_of_materials?.master_item?.departemen?.nama_departemen || '-',
            satuan: item.kartu_instruksi_kerja_bom?.bill_of_materials?.master_item?.unit?.nama_satuan || '-',
        };
    };

    //Handle quantity change for items
    const handleQuantityChange = (itemId: string, quantity: number) => {
        setItemQuantities((prev) => ({
            ...prev,
            [itemId]: quantity,
        }));
    };

    // Update form items whenever quantities change
    useEffect(() => {
        const formItems = imrItemsList
            .filter((item) => (itemQuantities[item.id.toString()] || 0) > 0)
            .map((item) => {
                const qty = itemQuantities[item.id.toString()] || 0;

                if ('qty_approved_finishing' in item) {
                    return {
                        id_imr_finishing_item: parseInt(item.id.toString()),
                        qty_approved_retur: qty,
                    };
                } else if ('qty_approved_diemaking' in item) {
                    return {
                        id_imr_diemaking_item: parseInt(item.id.toString()),
                        qty_approved_retur: qty,
                    };
                } else {
                    return {
                        id_imr_item: parseInt(item.id.toString()),
                        qty_approved_retur: qty,
                    };
                }
            });

        setData((prevData) => ({ ...prevData, items: formItems }));
    }, [itemQuantities, imrItemsList]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const hasItems = Object.values(itemQuantities).some((qty) => qty > 0);
        if (!hasItems) {
            toast.error('Minimal harus ada 1 item dengan qty retur > 0');
            return;
        }

        post(route('returInternals.store'), {
            onSuccess: () => {
                toast.success('Retur Internal berhasil dibuat');
            },
            onError: () => {
                toast.error('Gagal membuat Retur Internal');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Retur Internal" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Tambah Retur Internal
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Form Header */}
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="no_retur_internal">No. Retur Internal</Label>
                                            <div className="bg-popover flex items-center rounded-md border p-2">
                                                <span className="font-medium">{returInternalNumber}</span>
                                            </div>
                                            <Input id="no_retur_internal" name="no_retur_internal" value={returInternalNumber} type="hidden" />
                                            {errors.no_retur_internal && <p className="text-sm text-red-500">{errors.no_retur_internal}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="tgl_retur_internal">Tanggal Retur</Label>
                                            <DatePicker
                                                id="tgl_retur_internal"
                                                value={data.tgl_retur_internal}
                                                onChange={(e) => setData('tgl_retur_internal', e.target.value ? e.target.value : '')}
                                            />
                                            {errors.tgl_retur_internal && <p className="text-sm text-red-500">{errors.tgl_retur_internal}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="nama_retur_internal">Nama Retur Internal</Label>
                                            <Input
                                                id="nama_retur_internal"
                                                name="nama_retur_internal"
                                                value={data.nama_retur_internal}
                                                onChange={handleChange}
                                                placeholder="Nama Retur Internal"
                                            />
                                            {errors.nama_retur_internal && <p className="text-sm text-red-500">{errors.nama_retur_internal}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="imr_select">Pilih IMR</Label>
                                            <SearchableSelect
                                                items={combinedImr.map((imr) => ({
                                                    key: imr.id,
                                                    value: imr.id,
                                                    label: imr.label,
                                                }))}
                                                value={selectedImr}
                                                placeholder="Pilih IMR"
                                                onChange={handleImrChange}
                                            />
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="catatan_retur_internal">Catatan</Label>
                                            <Textarea
                                                id="catatan_retur_internal"
                                                name="catatan_retur_internal"
                                                value={data.catatan_retur_internal}
                                                onChange={handleChange}
                                                placeholder="Catatan retur internal (opsional)"
                                                rows={3}
                                            />
                                            {errors.catatan_retur_internal && <p className="text-sm text-red-500">{errors.catatan_retur_internal}</p>}
                                        </div>
                                    </div>

                                    {/* Data Item Retur Internal */}
                                    {selectedImr && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-medium">Data Item Retur Internal</h3>
                                            <div className="rounded-md border">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="bg-gray-50 dark:bg-gray-800">
                                                            <TableHead>No</TableHead>
                                                            <TableHead>Kode Item</TableHead>
                                                            <TableHead>Nama Item</TableHead>
                                                            <TableHead className="text-right">Qty Tersedia</TableHead>
                                                            <TableHead className="text-right">Qty Retur</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {imrItemsList.length > 0 ? (
                                                            imrItemsList.map((item, index) => {
                                                                const itemDetails = getMasterItemDetails(item);
                                                                const qtyAvailable = getQtyAvailable(item);

                                                                return (
                                                                    <TableRow key={item.id}>
                                                                        <TableCell>{index + 1}</TableCell>
                                                                        <TableCell className="font-medium">{itemDetails.kode}</TableCell>
                                                                        <TableCell>{itemDetails.nama}</TableCell>

                                                                        <TableCell className="text-right font-medium">
                                                                            {qtyAvailable.toLocaleString()}
                                                                        </TableCell>
                                                                        <TableCell className="text-right">
                                                                            <Input
                                                                                type="number"
                                                                                min="0"
                                                                                max={qtyAvailable}
                                                                                value={itemQuantities[item.id.toString()] || ''}
                                                                                onChange={(e) =>
                                                                                    handleQuantityChange(
                                                                                        item.id.toString(),
                                                                                        parseFloat(e.target.value) || 0,
                                                                                    )
                                                                                }
                                                                                className="w-24 text-right"
                                                                                placeholder="0"
                                                                            />
                                                                        </TableCell>
                                                                    </TableRow>
                                                                );
                                                            })
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell colSpan={7} className="text-center text-gray-500">
                                                                    {selectedImr ? 'Tidak ada item untuk IMR ini' : 'Pilih IMR terlebih dahulu'}
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex justify-end space-x-4">
                                        <Link href={route('returInternals.index')}>
                                            <Button variant="outline" type="button">
                                                <X className="mr-2 h-4 w-4" />
                                                Cancel
                                            </Button>
                                        </Link>
                                        <Button type="submit" disabled={processing}>
                                            <Save className="mr-2 h-4 w-4" />
                                            {processing ? 'Saving...' : 'Save'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <Toaster />
        </AppLayout>
    );
}
