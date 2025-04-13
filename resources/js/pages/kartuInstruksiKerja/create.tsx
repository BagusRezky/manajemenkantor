import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { SalesOrder } from '@/types/salesOrder';
import { Head, useForm } from '@inertiajs/react';
import {  useState } from 'react';
import { toast, Toaster } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kartu Instruksi Kerja',
        href: '/kartuInstruksiKerja',
    },
    {
        title: 'Create',
        href: '/kartuInstruksiKerja/create',
    },
];

interface CreateProps {
    salesOrders: SalesOrder[];
}

export default function Create({ salesOrders }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        id_sales_order: '',
        no_kartu_instruksi_kerja: '',
        production_plan: '',
        tgl_estimasi_selesai: '',
        spesifikasi_kertas: '',
        up_satu: '',
        up_dua: '',
        up_tiga: '',
        ukuran_potong: '',
        ukuran_cetak: '',
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    const [finishGoodItem, setFinishGoodItem] = useState<any>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        const upperCaseFields = ['no_kartu_instruksi_kerja'];

        const newValue = upperCaseFields.includes(name) ? value.toUpperCase() : value;
        setData((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleSalesOrderChange = async (value: string) => {
        setData('id_sales_order', value);

        try {
            const response = await fetch(`/salesOrderData/${value}`);
            const result = await response.json();

            if (result.finish_good_item) {
                setFinishGoodItem(result.finish_good_item);

                // Mengisi field dengan data dari FinishGoodItem
                setData({
                    ...data,
                    id_sales_order: value,
                    spesifikasi_kertas: result.finish_good_item.spesifikasi_kertas || '',
                    up_satu: result.finish_good_item.up_satu || '',
                    up_dua: result.finish_good_item.up_dua || '',
                    up_tiga: result.finish_good_item.up_tiga || '',
                    ukuran_potong: result.finish_good_item.ukuran_potong || '',
                    ukuran_cetak: result.finish_good_item.ukuran_cetak || '',
                });
            }
        } catch (error) {
            console.error('Error fetching finish good item data:', error);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('kartuInstruksiKerja.store'), {
            onSuccess: () => {
                toast.success('Kartu Instruksi Kerja berhasil dibuat');
            },
            onError: () => {
                toast.error('Gagal membuat Kartu Instruksi Kerja');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Kartu Instruksi Kerja" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Buat Kartu Instruksi Kerja</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                        {/* No Kartu Instruksi Kerja */}
                                        <div className="space-y-2">
                                            <Label htmlFor="no_kartu_instruksi_kerja">No. Kartu Instruksi Kerja</Label>
                                            <Input
                                                id="no_kartu_instruksi_kerja"
                                                name="no_kartu_instruksi_kerja"
                                                value={data.no_kartu_instruksi_kerja}
                                                onChange={handleChange}
                                            />
                                            {errors.no_kartu_instruksi_kerja && (
                                                <p className="text-sm text-red-500">{errors.no_kartu_instruksi_kerja}</p>
                                            )}
                                        </div>

                                        {/* Sales Order */}
                                        <div className="space-y-2">
                                            <Label htmlFor="id_sales_order">No. Bon Pesanan</Label>
                                            <Select value={data.id_sales_order} onValueChange={handleSalesOrderChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih No. Bon Pesanan" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {salesOrders.map((salesOrder) => (
                                                        <SelectItem key={salesOrder.id} value={salesOrder.id.toString()}>
                                                            {salesOrder.no_bon_pesanan}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.id_sales_order && (
                                                <p className="text-sm text-red-500">{errors.id_sales_order}</p>
                                            )}
                                        </div>

                                        {/* Production Plan */}
                                        <div className="space-y-2">
                                            <Label htmlFor="production_plan">Production Plan</Label>
                                            <Input
                                                id="production_plan"
                                                name="production_plan"
                                                value={data.production_plan}
                                                onChange={handleChange}
                                            />
                                            {errors.production_plan && (
                                                <p className="text-sm text-red-500">{errors.production_plan}</p>
                                            )}
                                        </div>

                                        {/* Tanggal Estimasi Selesai */}
                                        <div className="space-y-2">
                                            <Label htmlFor="tgl_estimasi_selesai">Tanggal Estimasi Selesai</Label>
                                            <Input
                                                id="tgl_estimasi_selesai"
                                                name="tgl_estimasi_selesai"
                                                type="date"
                                                value={data.tgl_estimasi_selesai}
                                                onChange={handleChange}

                                            />
                                            {errors.tgl_estimasi_selesai && (
                                                <p className="text-sm text-red-500">{errors.tgl_estimasi_selesai}</p>
                                            )}
                                        </div>

                                        {/* Spesifikasi Kertas */}
                                        <div className="space-y-2">
                                            <Label htmlFor="spesifikasi_kertas">Spesifikasi Kertas</Label>
                                            <Input
                                                id="spesifikasi_kertas"
                                                name="spesifikasi_kertas"
                                                value={data.spesifikasi_kertas}
                                                onChange={handleChange}
                                            />
                                            {errors.spesifikasi_kertas && (
                                                <p className="text-sm text-red-500">{errors.spesifikasi_kertas}</p>
                                            )}
                                        </div>

                                        {/* Up Satu */}
                                        <div className="space-y-2">
                                            <Label htmlFor="up_satu">Up Satu</Label>
                                            <Input
                                                id="up_satu"
                                                name="up_satu"
                                                type="number"
                                                value={data.up_satu}
                                                onChange={handleChange}
                                            />
                                            {errors.up_satu && (
                                                <p className="text-sm text-red-500">{errors.up_satu}</p>
                                            )}
                                        </div>

                                        {/* Up Dua */}
                                        <div className="space-y-2">
                                            <Label htmlFor="up_dua">Up Dua</Label>
                                            <Input
                                                id="up_dua"
                                                name="up_dua"
                                                type="number"
                                                value={data.up_dua}
                                                onChange={handleChange}
                                            />
                                            {errors.up_dua && (
                                                <p className="text-sm text-red-500">{errors.up_dua}</p>
                                            )}
                                        </div>

                                        {/* Up Tiga */}
                                        <div className="space-y-2">
                                            <Label htmlFor="up_tiga">Up Tiga</Label>
                                            <Input
                                                id="up_tiga"
                                                name="up_tiga"
                                                type="number"
                                                value={data.up_tiga}
                                                onChange={handleChange}
                                            />
                                            {errors.up_tiga && (
                                                <p className="text-sm text-red-500">{errors.up_tiga}</p>
                                            )}
                                        </div>

                                        {/* Ukuran Potong */}
                                        <div className="space-y-2">
                                            <Label htmlFor="ukuran_potong">Ukuran Potong</Label>
                                            <Input
                                                id="ukuran_potong"
                                                name="ukuran_potong"
                                                value={data.ukuran_potong}
                                                onChange={handleChange}
                                            />
                                            {errors.ukuran_potong && (
                                                <p className="text-sm text-red-500">{errors.ukuran_potong}</p>
                                            )}
                                        </div>

                                        {/* Ukuran Cetak */}
                                        <div className="space-y-2">
                                            <Label htmlFor="ukuran_cetak">Ukuran Cetak</Label>
                                            <Input
                                                id="ukuran_cetak"
                                                name="ukuran_cetak"
                                                value={data.ukuran_cetak}
                                                onChange={handleChange}
                                            />
                                            {errors.ukuran_cetak && (
                                                <p className="text-sm text-red-500">{errors.ukuran_cetak}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-4">
                                        <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                            Batal
                                        </Button>
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Menyimpan...' : 'Simpan'}
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
