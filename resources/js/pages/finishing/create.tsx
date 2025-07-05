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
import { MesinFinishing, OperatorFinishing } from '@/types/finishing';
import { KartuInstruksiKerja } from '@/types/kartuInstruksiKerja';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Finishing',
        href: '/finishings',
    },
    {
        title: 'Tambah Data',
        href: '/finishings/create',
    },
];

interface Props {
    kartuInstruksiKerjas: KartuInstruksiKerja[];
    mesinFinishings: MesinFinishing[];
    operatorFinishings: OperatorFinishing[];
}

export default function CreateFinishing({ kartuInstruksiKerjas, mesinFinishings, operatorFinishings }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        id_kartu_instruksi_kerja: '',
        id_mesin_finishing: '',
        id_operator_finishing: '',
        tanggal_entri: '',
        proses_finishing: '',
        tahap_finishing: '',
        hasil_baik_finishing: '',
        hasil_rusak_finishing: '',
        semi_waste_finishing: '',
        keterangan_finishing: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Debug: Log data sebelum submit
        console.log('Data before submit:', data);

        post(route('finishings.store'), {
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
            <Head title="Tambah Data Finishing" />
            <div className="mx-5 py-5">
                <Card>
                    <CardHeader>
                        <CardTitle>Tambah Data Finishing</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Kartu Instruksi Kerja */}
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
                                    {errors.id_kartu_instruksi_kerja && <div className="text-sm text-red-600">{errors.id_kartu_instruksi_kerja}</div>}
                                </div>

                                {/* Mesin Finishing */}
                                <div className="space-y-2">
                                    <Label htmlFor="id_mesin_finishing">Mesin Finishing *</Label>
                                    <SearchableSelect
                                        items={mesinFinishings.map((mesin) => ({
                                            key: String(mesin.id),
                                            value: String(mesin.id),
                                            label: mesin.nama_mesin_finishing,
                                        }))}
                                        value={data.id_mesin_finishing || ''}
                                        placeholder="Pilih Mesin Finishing"
                                        onChange={(value) => setData('id_mesin_finishing', value)}
                                    />
                                    {errors.id_mesin_finishing && <div className="text-sm text-red-600">{errors.id_mesin_finishing}</div>}
                                </div>

                                {/* Operator Finishing */}
                                <div className="space-y-2">
                                    <Label htmlFor="id_operator_finishing">Operator Finishing *</Label>
                                    <SearchableSelect
                                        items={operatorFinishings.map((operator) => ({
                                            key: String(operator.id),
                                            value: String(operator.id),
                                            label: operator.nama_operator_finishing,
                                        }))}
                                        value={data.id_operator_finishing || ''}
                                        placeholder="Pilih Operator Finishing"
                                        onChange={(value) => setData('id_operator_finishing', value)}
                                    />
                                    {errors.id_operator_finishing && <div className="text-sm text-red-600">{errors.id_operator_finishing}</div>}
                                </div>

                                {/* Tanggal Entri */}
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_entri">Tanggal Entri *</Label>
                                    <DatePicker
                                        id="tanggal_entri"
                                        value={data.tanggal_entri}
                                        onChange={(e) => setData('tanggal_entri', e.target.value ? e.target.value : '')}
                                        className={errors.tanggal_entri ? 'border-red-500' : ''}
                                    />
                                    {errors.tanggal_entri && <p className="text-sm text-red-600">{errors.tanggal_entri}</p>}
                                </div>

                                {/* Proses Finishing */}
                                <div className="space-y-2">
                                    <Label htmlFor="proses_finishing">Proses Finishing *</Label>
                                    <Select value={data.proses_finishing} onValueChange={(value) => setData('proses_finishing', value)}>
                                        <SelectTrigger className={errors.proses_finishing ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Pilih Proses Finishing" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Protol">Protol</SelectItem>
                                            <SelectItem value="Sorter">Sorter</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.proses_finishing && <div className="text-sm text-red-600">{errors.proses_finishing}</div>}
                                </div>

                                {/* Tahap Finishing */}
                                <div className="space-y-2">
                                    <Label htmlFor="tahap_finishing">Tahap Finishing *</Label>
                                    <Select value={data.tahap_finishing} onValueChange={(value) => setData('tahap_finishing', value)}>
                                        <SelectTrigger className={errors.tahap_finishing ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Pilih Tahap Finishing" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Reguler">Reguler</SelectItem>
                                            <SelectItem value="Semi Waste">Semi Waste</SelectItem>
                                            <SelectItem value="Blokir">Blokir</SelectItem>
                                            <SelectItem value="Retur">Retur</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.tahap_finishing && <div className="text-sm text-red-600">{errors.tahap_finishing}</div>}
                                </div>

                                {/* Hasil Baik */}
                                <div className="space-y-2">
                                    <Label htmlFor="hasil_baik_finishing">Hasil Baik*</Label>
                                    <Input
                                        id="hasil_baik_finishing"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={data.hasil_baik_finishing}
                                        onChange={(e) => handleNumberChange('hasil_baik_finishing', e.target.value)}
                                        placeholder="0"
                                        className={errors.hasil_baik_finishing ? 'border-red-500' : ''}
                                    />
                                    {errors.hasil_baik_finishing && <div className="text-sm text-red-600">{errors.hasil_baik_finishing}</div>}
                                    <div className="text-xs text-gray-500">Current value: {data.hasil_baik_finishing || '0'}</div>
                                </div>

                                {/* Hasil Rusak */}
                                <div className="space-y-2">
                                    <Label htmlFor="hasil_rusak_finishing">Hasil Rusak*</Label>
                                    <Input
                                        id="hasil_rusak_finishing"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={data.hasil_rusak_finishing}
                                        onChange={(e) => handleNumberChange('hasil_rusak_finishing', e.target.value)}
                                        placeholder="0"
                                        className={errors.hasil_rusak_finishing ? 'border-red-500' : ''}
                                    />
                                    {errors.hasil_rusak_finishing && <div className="text-sm text-red-600">{errors.hasil_rusak_finishing}</div>}
                                    <div className="text-xs text-gray-500">Current value: {data.hasil_rusak_finishing || '0'}</div>
                                </div>

                                {/* Semi Waste */}
                                <div className="space-y-2">
                                    <Label htmlFor="semi_waste_finishing">Semi Waste*</Label>
                                    <Input
                                        id="semi_waste_finishing"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={data.semi_waste_finishing}
                                        onChange={(e) => handleNumberChange('semi_waste_finishing', e.target.value)}
                                        placeholder="0"
                                        className={errors.semi_waste_finishing ? 'border-red-500' : ''}
                                    />
                                    {errors.semi_waste_finishing && <div className="text-sm text-red-600">{errors.semi_waste_finishing}</div>}
                                    <div className="text-xs text-gray-500">Current value: {data.semi_waste_finishing || '0'}</div>
                                </div>
                            </div>

                            {/* Keterangan */}
                            <div className="space-y-2">
                                <Label htmlFor="keterangan_finishing">Keterangan SPK *</Label>
                                <Select value={data.keterangan_finishing} onValueChange={(value) => setData('keterangan_finishing', value)}>
                                    <SelectTrigger className={errors.keterangan_finishing ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Pilih Jenis Keterangan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Reguler">Reguler</SelectItem>
                                        <SelectItem value="Subcount">Subcount</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.keterangan_finishing && <div className="text-sm text-red-600">{errors.keterangan_finishing}</div>}
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
