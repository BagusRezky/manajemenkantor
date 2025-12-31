import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Karyawan } from '@/types/karyawan';
import { Head, router } from '@inertiajs/react';
import { Upload } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';


const breadcrumbs: BreadcrumbItem[] = [{ title: 'Karyawan', href: '/karyawans' }];

interface KaryawanIndexProps {
    karyawans: Karyawan[];

}

export default function Karyawans({ karyawans }: KaryawanIndexProps) {

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const formData = new FormData();
        formData.append('file', e.target.files[0]);

        router.post(route('karyawan.import'), formData, {
            onSuccess: () => {
                toast.success('Data karyawan berhasil diimpor');
                e.target.value = '';
            },
            onError: (errors) => {
                console.error(errors);
                toast.error('Gagal mengimpor data karyawan');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Master Karyawan" />

            <div className="mx-5 py-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Master Karyawan</CardTitle>
                            <CardDescription>Kelola data karyawan dan peran mereka dalam sistem</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            {/* Upload Excel */}
                            <Button type="button" variant="outline" onClick={() => document.getElementById('excel-upload')?.click()}>
                                <Upload className="mr-2 h-4 w-4" />
                                Import Excel
                            </Button>
                            <input type="file" name="file" accept=".xlsx,.xls,.csv" className="hidden" id="excel-upload" onChange={handleImport} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns()} data={karyawans} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
