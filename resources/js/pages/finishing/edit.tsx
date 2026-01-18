/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchableSelect } from '@/components/search-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Finishing, MesinFinishing, OperatorFinishing } from '@/types/finishing';
import { KartuInstruksiKerja } from '@/types/kartuInstruksiKerja';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    finishing: Finishing;
    kartuInstruksiKerjas: KartuInstruksiKerja[];
    mesinFinishings: MesinFinishing[];
    operatorFinishings: OperatorFinishing[];
}

export default function EditFinishing({ finishing, kartuInstruksiKerjas, mesinFinishings, operatorFinishings }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Finishing', href: '/finishings' },
        { title: 'Edit Data', href: '#' },
    ];

    const { data, setData, put, processing, errors } = useForm({
        id_kartu_instruksi_kerja: String(finishing.id_kartu_instruksi_kerja),
        id_mesin_finishing: String(finishing.id_mesin_finishing),
        id_operator_finishing: String(finishing.id_operator_finishing),
        tanggal_entri: finishing.tanggal_entri,
        proses_finishing: finishing.proses_finishing,
        tahap_finishing: finishing.tahap_finishing,
        hasil_baik_finishing: String(finishing.hasil_baik_finishing),
        hasil_rusak_finishing: String(finishing.hasil_rusak_finishing),
        semi_waste_finishing: String(finishing.semi_waste_finishing),
        keterangan_finishing: finishing.keterangan_finishing,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('finishings.update', finishing.id), {
            onSuccess: () => toast.success('Data finishing berhasil diperbarui'),
        });
    };

    const handleNumberChange = (field: string, value: string) => {
        const numValue = value === '' ? '' : Math.max(0, parseInt(value) || 0).toString();
        setData(field as any, numValue);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Data Finishing" />
            <div className="mx-5 py-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Edit Data Finishing: {finishing.kode_finishing}</CardTitle>
                        <Link href={route('finishings.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Surat Perintah Kerja (KIK) *</Label>
                                    <Input
                                        value={
                                            kartuInstruksiKerjas.find((k) => String(k.id) === data.id_kartu_instruksi_kerja)
                                                ?.no_kartu_instruksi_kerja || ''
                                        }
                                        readOnly
                                    />
                                    {errors.id_kartu_instruksi_kerja && <p className="text-sm text-red-500">{errors.id_kartu_instruksi_kerja}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Mesin Finishing *</Label>
                                    <SearchableSelect
                                        items={mesinFinishings.map((m) => ({
                                            key: String(m.id),
                                            value: String(m.id),
                                            label: m.nama_mesin_finishing,
                                        }))}
                                        value={data.id_mesin_finishing}
                                        onChange={(val) => setData('id_mesin_finishing', val)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Operator Finishing *</Label>
                                    <SearchableSelect
                                        items={operatorFinishings.map((o) => ({
                                            key: String(o.id),
                                            value: String(o.id),
                                            label: o.nama_operator_finishing,
                                        }))}
                                        value={data.id_operator_finishing}
                                        onChange={(val) => setData('id_operator_finishing', val)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Tanggal Entri *</Label>
                                    <Input type="date" value={data.tanggal_entri} onChange={(e) => setData('tanggal_entri', e.target.value)} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Proses Finishing *</Label>
                                    <Select value={data.proses_finishing} onValueChange={(v) => setData('proses_finishing', v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Protol">Protol</SelectItem>
                                            <SelectItem value="Sorter">Sorter</SelectItem>
                                            <SelectItem value="Lem">Lem</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Tahap Finishing *</Label>
                                    <Select value={data.tahap_finishing} onValueChange={(v) => setData('tahap_finishing', v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Reguler">Reguler</SelectItem>
                                            <SelectItem value="Semi Waste">Semi Waste</SelectItem>
                                            <SelectItem value="Blokir">Blokir</SelectItem>
                                            <SelectItem value="Retur">Retur</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Hasil Baik *</Label>
                                    <Input
                                        type="number"
                                        value={data.hasil_baik_finishing}
                                        onChange={(e) => handleNumberChange('hasil_baik_finishing', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Hasil Rusak *</Label>
                                    <Input
                                        type="number"
                                        value={data.hasil_rusak_finishing}
                                        onChange={(e) => handleNumberChange('hasil_rusak_finishing', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Semi Waste *</Label>
                                    <Input
                                        type="number"
                                        value={data.semi_waste_finishing}
                                        onChange={(e) => handleNumberChange('semi_waste_finishing', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Keterangan SPK *</Label>
                                    <Select value={data.keterangan_finishing} onValueChange={(v) => setData('keterangan_finishing', v)}>
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

                            <div className="flex justify-end gap-3 border-t pt-4">
                                <Button type="submit" disabled={processing} className="bg-green-600 hover:bg-green-700">
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
