/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePicker } from '@/components/date-picker';
import { SearchableSelect } from '@/components/search-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { KartuInstruksiKerja } from '@/types/kartuInstruksiKerja';
import { Mesin, Operator } from '@/types/printing';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Printing',
        href: '/printings',
    },
    {
        title: 'Tambah Data',
        href: '/printings/create',
    },
];

interface Props {
    kartuInstruksiKerjas: KartuInstruksiKerja[];
    mesins: Mesin[];
    operators: Operator[];
}

export default function CreatePrinting({ kartuInstruksiKerjas, mesins, operators }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        id_kartu_instruksi_kerja: '',
        id_mesin: '',
        id_operator: '',
        tanggal_entri: '',
        proses_printing: '',
        tahap_printing: '',
        hasil_baik_printing: '',
        hasil_rusak_printing: '',
        semi_waste_printing: '',
        keterangan_printing: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Debug: Log data sebelum submit
        console.log('Data before submit:', data);

        post(route('printings.store'), {
            onSuccess: () => {
                console.log('Success!');
            },
            onError: (errors) => {
                console.log('Errors:', errors);
            },
        });
    };

    // Handler untuk number inputs dengan validasi
    const handleNumberChange = (field: string, value: string) => {
        // Pastikan value tidak negatif dan adalah angka valid
        const numValue = value === '' ? '' : Math.max(0, parseInt(value) || 0).toString();
        setData(field as any, numValue);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Data Printing" />
            <div className="mx-5 py-5">
                <Card>
                    <CardHeader>
                        <CardTitle>Tambah Data Printing</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Surat Perintah Kerja */}
                                <div className="space-y-2">
                                    <Label htmlFor="id_kartu_instruksi_kerja">Surat Perintah Kerja *</Label>
                                    <SearchableSelect
                                        items={kartuInstruksiKerjas.map((kartu) => ({
                                            key: String(kartu.id),
                                            value: String(kartu.id),
                                            label: kartu.no_kartu_instruksi_kerja,
                                        }))}
                                        value={data.id_kartu_instruksi_kerja || ''}
                                        placeholder="Pilih SPK"
                                        onChange={(value) => setData('id_kartu_instruksi_kerja', value)}
                                    />
                                    {errors.id_kartu_instruksi_kerja && <p className="text-sm text-red-500">{errors.id_kartu_instruksi_kerja}</p>}
                                </div>

                                {/* Mesin */}
                                <div className="space-y-2">
                                    <Label htmlFor="id_mesin">Mesin *</Label>
                                    <SearchableSelect
                                        items={mesins.map((mesin) => ({
                                            key: String(mesin.id),
                                            value: String(mesin.id),
                                            label: mesin.nama_mesin,
                                        }))}
                                        value={data.id_mesin || ''}
                                        placeholder="Pilih Mesin"
                                        onChange={(value) => setData('id_mesin', value)}
                                    />
                                    {errors.id_mesin && <p className="text-sm text-red-500">{errors.id_mesin}</p>}
                                </div>

                                {/* Operator */}
                                <div className="space-y-2">
                                    <Label htmlFor="id_operator">Operator *</Label>
                                    <SearchableSelect
                                        items={operators.map((operator) => ({
                                            key: String(operator.id),
                                            value: String(operator.id),
                                            label: operator.nama_operator,
                                        }))}
                                        value={data.id_operator || ''}
                                        placeholder="Pilih Operator"
                                        onChange={(value) => setData('id_operator', value)}
                                    />
                                    {errors.id_operator && <p className="text-sm text-red-500">{errors.id_operator}</p>}
                                    {errors.id_operator && <div className="text-sm text-red-600">{errors.id_operator}</div>}
                                </div>

                                {/* Tanggal Entri */}
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_entri">Tanggal Entri *</Label>
                                    <DatePicker
                                        id="tanggal_entri"
                                        value={data.tanggal_entri}
                                        onChange={(e) => setData('tanggal_entri', e.target.value ? e.target.value : '')}
                                    />
                                    {errors.tanggal_entri && <p className="text-sm text-red-500">{errors.tanggal_entri}</p>}
                                </div>

                                {/* Proses Printing */}
                                <div className="space-y-2">
                                    <Label htmlFor="proses_printing">Proses Printing *</Label>
                                    <Select value={data.proses_printing} onValueChange={(value) => setData('proses_printing', value)}>
                                        <SelectTrigger className={errors.proses_printing ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Pilih Proses Printing" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Potong">Potong</SelectItem>
                                            <SelectItem value="Printing">Printing</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.proses_printing && <div className="text-sm text-red-600">{errors.proses_printing}</div>}
                                </div>

                                {/* Tahap Printing */}
                                <div className="space-y-2">
                                    <Label htmlFor="tahap_printing">Tahap Printing *</Label>
                                    <Select value={data.tahap_printing} onValueChange={(value) => setData('tahap_printing', value)}>
                                        <SelectTrigger className={errors.tahap_printing ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Pilih Tahap Printing" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Potong">Potong</SelectItem>
                                            <SelectItem value="Proses Cetak">Proses Cetak</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.tahap_printing && <div className="text-sm text-red-600">{errors.tahap_printing}</div>}
                                </div>

                                {/* Hasil Baik */}
                                <div className="space-y-2">
                                    <Label htmlFor="hasil_baik_printing">Hasil Baik (Pcs) *</Label>
                                    <Input
                                        id="hasil_baik_printing"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={data.hasil_baik_printing}
                                        onChange={(e) => handleNumberChange('hasil_baik_printing', e.target.value)}
                                        placeholder="0"
                                        className={errors.hasil_baik_printing ? 'border-red-500' : ''}
                                    />
                                    {errors.hasil_baik_printing && <div className="text-sm text-red-600">{errors.hasil_baik_printing}</div>}
                                    <div className="text-xs text-gray-500">Current value: {data.hasil_baik_printing || '0'}</div>
                                </div>

                                {/* Hasil Rusak */}
                                <div className="space-y-2">
                                    <Label htmlFor="hasil_rusak_printing">Hasil Rusak (Pcs) *</Label>
                                    <Input
                                        id="hasil_rusak_printing"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={data.hasil_rusak_printing}
                                        onChange={(e) => handleNumberChange('hasil_rusak_printing', e.target.value)}
                                        placeholder="0"
                                        className={errors.hasil_rusak_printing ? 'border-red-500' : ''}
                                    />
                                    {errors.hasil_rusak_printing && <div className="text-sm text-red-600">{errors.hasil_rusak_printing}</div>}
                                    <div className="text-xs text-gray-500">Current value: {data.hasil_rusak_printing || '0'}</div>
                                </div>

                                {/* Semi Waste */}
                                <div className="space-y-2">
                                    <Label htmlFor="semi_waste_printing">Semi Waste (Pcs) *</Label>
                                    <Input
                                        id="semi_waste_printing"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={data.semi_waste_printing}
                                        onChange={(e) => handleNumberChange('semi_waste_printing', e.target.value)}
                                        placeholder="0"
                                        className={errors.semi_waste_printing ? 'border-red-500' : ''}
                                    />
                                    {errors.semi_waste_printing && <div className="text-sm text-red-600">{errors.semi_waste_printing}</div>}
                                    <div className="text-xs text-gray-500">Current value: {data.semi_waste_printing || '0'}</div>
                                </div>
                            </div>

                            {/* Keterangan */}
                            <div className="space-y-2">
                                <Label htmlFor="keterangan_printing">Keterangan SPK *</Label>
                                <Select value={data.keterangan_printing} onValueChange={(value) => setData('keterangan_printing', value)}>
                                    <SelectTrigger className={errors.keterangan_printing ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Pilih Jenis Keterangan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Reguler">Reguler</SelectItem>
                                        <SelectItem value="Subcount">Subcount</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.keterangan_printing && <div className="text-sm text-red-600">{errors.keterangan_printing}</div>}
                            </div>

                            {/* Debug Info */}
                            <div className="rounded bg-gray-100 p-4 text-sm">
                                <strong>Debug Info:</strong>
                                <pre>{JSON.stringify(data, null, 2)}</pre>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>

                                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                    Batal
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
