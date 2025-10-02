
import { Head, Link, router, usePage } from '@inertiajs/react';
import { BarChart, Upload } from 'lucide-react';
import React from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import AppLayout from '../../layouts/app-layout';

import { Absen } from '../../types/absen';

interface AbsensPageProps extends Record<string, unknown> {
    absens: Absen[];
}

const AbsensPage = () => {
    const { absens } = usePage<AbsensPageProps>().props;

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const formData = new FormData();
        formData.append('file', e.target.files[0]);

        router.post(route('absens.import'), formData, {
            onSuccess: () => {
                e.target.value = ''; // reset input
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Data Absensi" />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Data Absensi</CardTitle>
                        <CardDescription>Kelola data absensi dari mesin fingerprint / excel</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={route('absens.report')}
                            className="inline-flex items-center gap-2 rounded border bg-gray-100 px-4 py-2 hover:bg-gray-200"
                        >
                            <BarChart className="h-4 w-4" />
                            Laporan Bulanan
                        </Link>
                        <Button type="button" variant="outline" onClick={() => document.getElementById('excel-upload')?.click()}>
                            <Upload className="mr-2 h-4 w-4" />
                            Import Excel
                        </Button>
                        <input type="file" name="file" accept=".xlsx,.xls,.csv" className="hidden" id="excel-upload" onChange={handleImport} />
                    </div>
                </CardHeader>
                <CardContent>
                    {absens.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tanggal Scan</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Jam</TableHead>
                                        <TableHead>PIN</TableHead>
                                        <TableHead>NIP</TableHead>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Jabatan</TableHead>
                                        <TableHead>Departemen</TableHead>
                                        <TableHead>Kantor</TableHead>
                                        <TableHead>Verifikasi</TableHead>
                                        <TableHead>I/O</TableHead>
                                        <TableHead>Workcode</TableHead>
                                        <TableHead>SN</TableHead>
                                        <TableHead>Mesin</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {absens.map((absen, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{absen.tanggal_scan}</TableCell>
                                            <TableCell>{absen.tanggal}</TableCell>
                                            <TableCell>{absen.jam}</TableCell>
                                            <TableCell>{absen.pin}</TableCell>
                                            <TableCell>{absen.nip}</TableCell>
                                            <TableCell>{absen.nama}</TableCell>
                                            <TableCell>{absen.jabatan}</TableCell>
                                            <TableCell>{absen.departemen}</TableCell>
                                            <TableCell>{absen.kantor}</TableCell>
                                            <TableCell>{absen.verifikasi}</TableCell>
                                            <TableCell>{absen.io}</TableCell>
                                            <TableCell>{absen.workcode}</TableCell>
                                            <TableCell>{absen.sn}</TableCell>
                                            <TableCell>{absen.mesin}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="py-10 text-center">
                            <p className="text-muted-foreground">Belum ada data absensi.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </AppLayout>
    );
};

export default AbsensPage;
