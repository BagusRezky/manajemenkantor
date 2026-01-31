import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { MasterCoa } from '@/types/masterCoa';
import { Head } from '@inertiajs/react';

export default function Show({ item }: { item: MasterCoa }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Master COA', href: route('masterCoas.index') },
        { title: 'Detail Data', href: '#' },
    ];

    const formatCurrency = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);

    const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
        <div className="border-b pb-2">
            <p className="text-muted-foreground text-sm">{label}</p>
            <p className="font-medium">{value || '-'}</p>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail COA - ${item.nama_akun}`} />
            <div className="mx-5 py-5">
                <Card className="mx-auto max-w-4xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Informasi</CardTitle>
                        <Badge variant={item.status ? 'default' : 'destructive'}>{item.status ? 'Active' : 'Inactive'}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <DetailItem label="Kode Akuntansi" value={item.kode_akuntansi} />
                            <DetailItem label="Nama Akun" value={item.nama_akun} />
                            <DetailItem label="Karyawan" value={item.karyawan?.nama} />
                            <DetailItem label="COA Class" value={item.master_coa_class?.name} />
                            <DetailItem label="Periode" value={item.periode} />
                            <DetailItem label="Gudang" value={item.gudang} />
                        </div>

                        <div className="bg-muted/50 grid grid-cols-1 gap-6 rounded-lg p-4 md:grid-cols-3">
                            <DetailItem label="Saldo Debit" value={formatCurrency(item.saldo_debit)} />
                            <DetailItem label="Saldo Kredit" value={formatCurrency(item.saldo_kredit)} />
                            <DetailItem label="Nominal Default" value={formatCurrency(item.nominal_default)} />
                        </div>

                        <DetailItem label="Keterangan" value={item.keterangan} />

                        <div className="flex gap-2 pt-4">
                            <Button variant="outline" onClick={() => window.history.back()}>
                                Kembali
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
