import { SearchableSelect } from '@/components/search-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { KartuInstruksiKerja } from '@/types/kartuInstruksiKerja';
import { Mesin, Operator, Printing } from '@/types/printing';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

interface Props {
    printing: Printing;
    kartuInstruksiKerjas: KartuInstruksiKerja[];
    mesins: Mesin[];
    operators: Operator[];
}

export default function EditPrinting({ printing, kartuInstruksiKerjas, mesins, operators }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Printing', href: '/printings' },
        { title: 'Edit Data', href: '#' },
    ];

    const { data, setData, put, processing, errors } = useForm({
        id_kartu_instruksi_kerja: String(printing.id_kartu_instruksi_kerja),
        id_mesin: String(printing.id_mesin),
        id_operator: String(printing.id_operator),
        tanggal_entri: printing.tanggal_entri,
        proses_printing: printing.proses_printing,
        tahap_printing: printing.tahap_printing,
        hasil_baik_printing: String(printing.hasil_baik_printing),
        hasil_rusak_printing: String(printing.hasil_rusak_printing),
        semi_waste_printing: String(printing.semi_waste_printing),
        keterangan_printing: printing.keterangan_printing || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('printings.update', printing.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Data Printing" />
            <div className="mx-5 py-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Edit Data Printing: {printing.kode_printing}</CardTitle>
                        <Link href={route('printings.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Surat Perintah Kerja (SPK) *</Label>
                                    <Input value={kartuInstruksiKerjas.find(k => String(k.id) === data.id_kartu_instruksi_kerja)?.no_kartu_instruksi_kerja || ''} readOnly />
                                    {errors.id_kartu_instruksi_kerja && <p className="text-sm text-red-500">{errors.id_kartu_instruksi_kerja}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Mesin *</Label>
                                    <SearchableSelect
                                        items={mesins.map((m) => ({ key: String(m.id), value: String(m.id), label: m.nama_mesin }))}
                                        value={data.id_mesin}
                                        onChange={(val) => setData('id_mesin', val)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Operator *</Label>
                                    <SearchableSelect
                                        items={operators.map((o) => ({ key: String(o.id), value: String(o.id), label: o.nama_operator }))}
                                        value={data.id_operator}
                                        onChange={(val) => setData('id_operator', val)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Tanggal Entri *</Label>
                                    <Input type="date" value={data.tanggal_entri} onChange={(e) => setData('tanggal_entri', e.target.value)} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Proses Printing *</Label>
                                    <Select value={data.proses_printing} onValueChange={(val) => setData('proses_printing', val)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Potong">Potong</SelectItem>
                                            <SelectItem value="Printing">Printing</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Tahap Printing *</Label>
                                    <Select value={data.tahap_printing} onValueChange={(val) => setData('tahap_printing', val)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Potong">Potong</SelectItem>
                                            <SelectItem value="Proses Cetak">Proses Cetak</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Hasil Baik (Pcs)</Label>
                                    <Input
                                        type="number"
                                        value={data.hasil_baik_printing}
                                        onChange={(e) => setData('hasil_baik_printing', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Hasil Rusak (Pcs)</Label>
                                    <Input
                                        type="number"
                                        value={data.hasil_rusak_printing}
                                        onChange={(e) => setData('hasil_rusak_printing', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Semi Waste (Pcs)</Label>
                                    <Input
                                        type="number"
                                        value={data.semi_waste_printing}
                                        onChange={(e) => setData('semi_waste_printing', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Keterangan *</Label>
                                    <Select value={data.keterangan_printing} onValueChange={(val) => setData('keterangan_printing', val)}>
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

                            <div className="flex justify-end gap-2">
                                <Button type="submit" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" /> {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
