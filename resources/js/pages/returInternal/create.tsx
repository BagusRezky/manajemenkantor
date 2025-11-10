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
import { ReturInternal } from '@/types/returInternal';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { Package, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';

interface CombinedImr {
    id: string;
    label: string;
    type: 'printing' | 'diemaking' | 'finishing';
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

    const { data, setData, processing, errors } = useForm({
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
    const yearMonth = `${currentDate.getFullYear().toString()}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
    const nextId = String(lastId + 1).padStart(4, '0');
    const returInternalNumber = `RI-${yearMonth}.${nextId}`;

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
        const selected = combinedImr.find((imr) => imr.id === value);

        setSelectedImr(value);
        setItemQuantities({});
        setData((prevData) => ({
            ...prevData,
            id_imr: null,
            id_imr_finishing: null,
            id_imr_diemaking: null,
            items: [],
        }));

        if (!selected) {
            setImrItemsList([]);
            return;
        }

        const items = imrItems[value] || [];
        setImrItemsList(items);

        if (selected.type === 'finishing') {
            setData((prev) => ({ ...prev, id_imr_finishing: parseInt(value) }));
        } else if (selected.type === 'diemaking') {
            setData((prev) => ({ ...prev, id_imr_diemaking: parseInt(value) }));
        } else {
            setData((prev) => ({ ...prev, id_imr: parseInt(value) }));
        }
    };

    // //Function untuk get qty berdasarkan tipe item
    // const getQtyBeforeApproved = (item: InternalMaterialRequestItem | ImrDiemakingItem | ImrFinishingItem): number => {
    //     return item.qty_approved || 0;
    // };

    // // Function untuk get qty berdasarkan tipe item
    // const getQtyApproved = (item: ReturInternal ): number => {
    //     return item?.items?.[0]?.qty_approved_retur ?? 0;
    // };

    const getQtyAvailable = (item: InternalMaterialRequestItem | ImrDiemakingItem | ImrFinishingItem | ReturInternal): number => {
        let beforeApproved = 0;
        let approved = 0;

        if ('qty_approved' in item) {
            beforeApproved = item.qty_approved || 0;
        } else if ('items' in item) {
            beforeApproved = item?.items?.[0]?.qty_approved_retur ?? 0;
        }

        if ('items' in item) {
            approved = item?.items?.[0]?.qty_approved_retur ?? 0;
        }

        return beforeApproved - approved;
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

        const selected = combinedImr.find((imr) => imr.id === selectedImr);

        const mappedItems = imrItemsList
            .filter((item) => (itemQuantities[item.id] || 0) > 0)
            .map((item) => {
                const qty = itemQuantities[item.id] || 0;

                if (selected?.type === 'finishing') {
                    return {
                        id_imr_finishing_item: parseInt(item.id.toString(), 10),
                        qty_approved_retur: qty,
                    };
                } else if (selected?.type === 'diemaking') {
                    return {
                        id_imr_diemaking_item: parseInt(item.id.toString(), 10),
                        qty_approved_retur: qty,
                    };
                } else {
                    return {
                        id_imr_item: parseInt(item.id.toString(), 10),
                        qty_approved_retur: qty,
                    };
                }
            });

        // kirim payload langsung via router.post (boleh override data)
        const payload = {
            ...data, // id_imr / id_imr_diemaking / id_imr_finishing, nomor, tanggal, dll
            items: mappedItems, // items terbaru (tidak tergantung setState)
        };

        router.post(route('returInternals.store'), payload, {
            onSuccess: () => {
                toast.success('Retur Internal berhasil dibuat');
            },
            onError: (errs) => {
                console.error(errs);
                toast.error('Gagal membuat Retur Internal');
            },
            preserveScroll: true,
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
                                                value={data.tgl_retur_internal}
                                                onChange={(date) => {
                                                    if (date) {
                                                        const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                                                            .toISOString()
                                                            .split('T')[0];
                                                        setData('tgl_retur_internal', formattedDate);
                                                    } else {
                                                        setData('tgl_retur_internal', '');
                                                    }
                                                }}
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
                                                            <TableHead>Qty Tersedia</TableHead>
                                                            <TableHead>Qty Retur</TableHead>
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

                                                                        <TableCell>{qtyAvailable.toLocaleString()}</TableCell>
                                                                        <TableCell>
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
