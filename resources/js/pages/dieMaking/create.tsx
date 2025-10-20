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
import { MesinDiemaking } from '@/types/mesinDiemaking';
import { OperatorDiemaking } from '@/types/operatorDiemaking';

import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Die Making',
        href: '/diemakings',
    },
    {
        title: 'Tambah Data',
        href: '/diemakings/create',
    },
];

interface Props {
    kartuInstruksiKerjas: KartuInstruksiKerja[];
    mesinDiemakings: MesinDiemaking[];
    operatorDiemakings: OperatorDiemaking[];
}

export default function CreateDieMaking({ kartuInstruksiKerjas, mesinDiemakings, operatorDiemakings }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        id_kartu_instruksi_kerja: '',
        id_mesin_diemaking: '',
        id_operator_diemaking: '',
        tanggal_entri: '',
        proses_diemaking: '',
        tahap_diemaking: '',
        hasil_baik_diemaking: '',
        hasil_rusak_diemaking: '',
        semi_waste_diemaking: '',
        keterangan_diemaking: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Debug: Log data sebelum submit
        console.log('Data before submit:', data);

        post(route('dieMakings.store'), {
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
            <Head title="Tambah Data Die Making" />
            <div className="mx-5 py-5">
                <Card>
                    <CardHeader>
                        <CardTitle>Tambah Data Die Making</CardTitle>
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
                                        value={data.id_kartu_instruksi_kerja || ''} // fallback to empty string
                                        placeholder="Pilih SPK"
                                        onChange={(value) => setData('id_kartu_instruksi_kerja', value)}
                                    />
                                    {errors.id_kartu_instruksi_kerja && <div className="text-sm text-red-600">{errors.id_kartu_instruksi_kerja}</div>}
                                </div>

                                {/* Mesin */}
                                <div className="space-y-2">
                                    <Label htmlFor="id_mesin_diemaking">Mesin *</Label>
                                    <SearchableSelect
                                        items={mesinDiemakings.map((mesin) => ({
                                            key: String(mesin.id),
                                            value: String(mesin.id),
                                            label: mesin.nama_mesin_diemaking,
                                        }))}
                                        value={data.id_mesin_diemaking || ''}
                                        placeholder="Pilih Mesin"
                                        onChange={(value) => setData('id_mesin_diemaking', value)}
                                    />
                                    {errors.id_mesin_diemaking && <div className="text-sm text-red-600">{errors.id_mesin_diemaking}</div>}
                                </div>

                                {/* Operator */}
                                <div className="space-y-2">
                                    <Label htmlFor="id_operator_diemaking">Operator *</Label>
                                    <SearchableSelect
                                        items={operatorDiemakings.map((operator) => ({
                                            key: String(operator.id),
                                            value: String(operator.id),
                                            label: operator.nama_operator_diemaking,
                                        }))}
                                        value={data.id_operator_diemaking || ''}
                                        placeholder="Pilih Operator"
                                        onChange={(value) => setData('id_operator_diemaking', value)}
                                    />
                                    {errors.id_operator_diemaking && <div className="text-sm text-red-600">{errors.id_operator_diemaking}</div>}
                                </div>

                                {/* Tanggal Entri */}
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_entri">Tanggal Entri *</Label>
                                    <DatePicker
                                        value={data.tanggal_entri}
                                        onChange={(date) => {
                                            if (date) {
                                                const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                                                    .toISOString()
                                                    .split('T')[0];
                                                setData('tanggal_entri', formattedDate);
                                            } else {
                                                setData('tanggal_entri', '');
                                            }
                                        }}
                                    />
                                    {errors.tanggal_entri && <p className="text-sm text-red-500">{errors.tanggal_entri}</p>}
                                </div>

                                {/* Proses Die Making */}
                                <div className="space-y-2">
                                    <Label htmlFor="proses_diemaking">Proses Die Making *</Label>
                                    <Select value={data.proses_diemaking} onValueChange={(value) => setData('proses_diemaking', value)}>
                                        <SelectTrigger className={errors.proses_diemaking ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Pilih Proses Die Making" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Hot Print">Hot Print</SelectItem>
                                            <SelectItem value="Uv Spot">Uv Spot</SelectItem>
                                            <SelectItem value="Uv Holo">Uv Holo</SelectItem>
                                            <SelectItem value="Embos">Embos</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.proses_diemaking && <div className="text-sm text-red-600">{errors.proses_diemaking}</div>}
                                </div>

                                {/* Tahap Die Making */}
                                <div className="space-y-2">
                                    <Label htmlFor="tahap_diemaking">Tahap Die Making *</Label>
                                    <Select value={data.tahap_diemaking} onValueChange={(value) => setData('tahap_diemaking', value)}>
                                        <SelectTrigger className={errors.tahap_diemaking ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Pilih Tahap Die Making" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Proses Die Making 1">Proses Die Making 1</SelectItem>
                                            <SelectItem value="Proses Die Making 2">Proses Die Making 2</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.tahap_diemaking && <div className="text-sm text-red-600">{errors.tahap_diemaking}</div>}
                                </div>

                                {/* Hasil Baik */}
                                <div className="space-y-2">
                                    <Label htmlFor="hasil_baik_diemaking">Hasil Baik *</Label>
                                    <Input
                                        id="hasil_baik_diemaking"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={data.hasil_baik_diemaking}
                                        onChange={(e) => handleNumberChange('hasil_baik_diemaking', e.target.value)}
                                        placeholder="0"
                                        className={errors.hasil_baik_diemaking ? 'border-red-500' : ''}
                                    />
                                    {errors.hasil_baik_diemaking && <div className="text-sm text-red-600">{errors.hasil_baik_diemaking}</div>}
                                    <div className="text-xs text-gray-500">Current value: {data.hasil_baik_diemaking || '0'}</div>
                                </div>

                                {/* Hasil Rusak */}
                                <div className="space-y-2">
                                    <Label htmlFor="hasil_rusak_diemaking">Hasil Rusak *</Label>
                                    <Input
                                        id="hasil_rusak_diemaking"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={data.hasil_rusak_diemaking}
                                        onChange={(e) => handleNumberChange('hasil_rusak_diemaking', e.target.value)}
                                        placeholder="0"
                                        className={errors.hasil_rusak_diemaking ? 'border-red-500' : ''}
                                    />
                                    {errors.hasil_rusak_diemaking && <div className="text-sm text-red-600">{errors.hasil_rusak_diemaking}</div>}
                                    <div className="text-xs text-gray-500">Current value: {data.hasil_rusak_diemaking || '0'}</div>
                                </div>

                                {/* Semi Waste */}
                                <div className="space-y-2">
                                    <Label htmlFor="semi_waste_diemaking">Semi Waste *</Label>
                                    <Input
                                        id="semi_waste_diemaking"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={data.semi_waste_diemaking}
                                        onChange={(e) => handleNumberChange('semi_waste_diemaking', e.target.value)}
                                        placeholder="0"
                                        className={errors.semi_waste_diemaking ? 'border-red-500' : ''}
                                    />
                                    {errors.semi_waste_diemaking && <div className="text-sm text-red-600">{errors.semi_waste_diemaking}</div>}
                                    <div className="text-xs text-gray-500">Current value: {data.semi_waste_diemaking || '0'}</div>
                                </div>
                            </div>

                            {/* Keterangan */}
                            <div className="space-y-2">
                                <Label htmlFor="keterangan_diemaking">Keterangan SPK *</Label>
                                <Select value={data.keterangan_diemaking} onValueChange={(value) => setData('keterangan_diemaking', value)}>
                                    <SelectTrigger className={errors.keterangan_diemaking ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Pilih Jenis Keterangan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Reguler">Reguler</SelectItem>
                                        <SelectItem value="Subcount">Subcount</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.keterangan_diemaking && <div className="text-sm text-red-600">{errors.keterangan_diemaking}</div>}
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
