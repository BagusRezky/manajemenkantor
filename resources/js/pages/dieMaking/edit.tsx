/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

interface Props {
    dieMaking: any;
    kartuInstruksiKerjas: KartuInstruksiKerja[];
    mesinDiemakings: MesinDiemaking[];
    operatorDiemakings: OperatorDiemaking[];
}

export default function EditDieMaking({ dieMaking, kartuInstruksiKerjas, mesinDiemakings, operatorDiemakings }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Die Making', href: '/dieMakings' },
        { title: 'Edit Data', href: '#' },
    ];

    const { data, setData, put, processing, errors } = useForm({
        id_kartu_instruksi_kerja: String(dieMaking.id_kartu_instruksi_kerja),
        id_mesin_diemaking: String(dieMaking.id_mesin_diemaking),
        id_operator_diemaking: String(dieMaking.id_operator_diemaking),
        tanggal_entri: dieMaking.tanggal_entri,
        proses_diemaking: dieMaking.proses_diemaking,
        tahap_diemaking: dieMaking.tahap_diemaking,
        hasil_baik_diemaking: String(dieMaking.hasil_baik_diemaking),
        hasil_rusak_diemaking: String(dieMaking.hasil_rusak_diemaking),
        semi_waste_diemaking: String(dieMaking.semi_waste_diemaking),
        keterangan_diemaking: dieMaking.keterangan_diemaking,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('dieMakings.update', dieMaking.id));
    };

    const handleNumberChange = (field: string, value: string) => {
        const numValue = value === '' ? '' : Math.max(0, parseInt(value) || 0).toString();
        setData(field as any, numValue);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Data Die Making" />
            <div className="mx-5 py-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Edit Data Die Making: {dieMaking.kode_diemaking}</CardTitle>
                        <Link href={route('dieMakings.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Surat Perintah Kerja *</Label>
                                    <SearchableSelect
                                        items={kartuInstruksiKerjas.map((k) => ({
                                            key: String(k.id),
                                            value: String(k.id),
                                            label: k.no_kartu_instruksi_kerja,
                                        }))}
                                        value={data.id_kartu_instruksi_kerja}
                                        onChange={(val) => setData('id_kartu_instruksi_kerja', val)}
                                    />
                                    {errors.id_kartu_instruksi_kerja && <div className="text-sm text-red-600">{errors.id_kartu_instruksi_kerja}</div>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Mesin *</Label>
                                    <SearchableSelect
                                        items={mesinDiemakings.map((m) => ({
                                            key: String(m.id),
                                            value: String(m.id),
                                            label: m.nama_mesin_diemaking,
                                        }))}
                                        value={data.id_mesin_diemaking}
                                        onChange={(val) => setData('id_mesin_diemaking', val)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Operator *</Label>
                                    <SearchableSelect
                                        items={operatorDiemakings.map((o) => ({
                                            key: String(o.id),
                                            value: String(o.id),
                                            label: o.nama_operator_diemaking,
                                        }))}
                                        value={data.id_operator_diemaking}
                                        onChange={(val) => setData('id_operator_diemaking', val)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Tanggal Entri *</Label>
                                    <Input type="date" value={data.tanggal_entri} onChange={(e) => setData('tanggal_entri', e.target.value)} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Proses Die Making *</Label>
                                    <Select value={data.proses_diemaking} onValueChange={(v) => setData('proses_diemaking', v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['Hot Print', 'Uv Spot', 'Uv Holo', 'Embos', 'Cutting', 'Uv Varnish'].map((p) => (
                                                <SelectItem key={p} value={p}>
                                                    {p}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Tahap Die Making *</Label>
                                    <Select value={data.tahap_diemaking} onValueChange={(v) => setData('tahap_diemaking', v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Proses Die Making 1">Proses Die Making 1</SelectItem>
                                            <SelectItem value="Proses Die Making 2">Proses Die Making 2</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Hasil Baik *</Label>
                                    <Input
                                        type="number"
                                        value={data.hasil_baik_diemaking}
                                        onChange={(e) => handleNumberChange('hasil_baik_diemaking', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Hasil Rusak *</Label>
                                    <Input
                                        type="number"
                                        value={data.hasil_rusak_diemaking}
                                        onChange={(e) => handleNumberChange('hasil_rusak_diemaking', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Semi Waste *</Label>
                                    <Input
                                        type="number"
                                        value={data.semi_waste_diemaking}
                                        onChange={(e) => handleNumberChange('semi_waste_diemaking', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Keterangan SPK *</Label>
                                    <Select value={data.keterangan_diemaking} onValueChange={(v) => setData('keterangan_diemaking', v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Reguler">Reguler</SelectItem>
                                            <SelectItem value="Subcount">Subcount</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
