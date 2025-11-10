import { Head, router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import AppLayout from '../../layouts/app-layout';

interface Rekap {
    nip: string;
    nama: string;
    total_hadir: number;
    total_hari: number;
}

interface ReportsPageProps {
    rekap: Rekap[];
    filters: {
        bulan?: number;
        tahun?: number;
        nip?: string;
    };
    [key: string]: unknown;
}

const ReportsPage = () => {
    const { rekap, filters } = usePage<ReportsPageProps>().props;

    const [bulan, setBulan] = useState(filters.bulan || new Date().getMonth() + 1);
    const [tahun, setTahun] = useState(filters.tahun || new Date().getFullYear());
    const [nip, setNip] = useState(filters.nip || '');

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('absens.report'), { bulan, tahun, nip }, { preserveState: true });
    };

    return (
        <AppLayout>
            <Head title="Laporan Bulanan Absensi" />
            <Card>
                <CardHeader>
                    <CardTitle>Laporan Bulanan Absensi</CardTitle>
                    <CardDescription>Pilih bulan, tahun, dan NIP untuk menampilkan rekap</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleFilter} className="mb-4 flex flex-wrap gap-2">
                        <select value={bulan} onChange={(e) => setBulan(Number(e.target.value))} className="rounded border p-2">
                            {[...Array(12)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            value={tahun}
                            onChange={(e) => setTahun(Number(e.target.value))}
                            className="rounded border p-2"
                            placeholder="Tahun"
                        />
                        <input type="text" value={nip} onChange={(e) => setNip(e.target.value)} className="rounded border p-2" placeholder="NIP" />
                        <Button type="submit">Filter</Button>
                    </form>

                    {rekap.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>NIP</TableHead>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Total Hadir</TableHead>
                                        <TableHead>Total Hari</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rekap.map((r, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{r.nip}</TableCell>
                                            <TableCell>{r.nama}</TableCell>
                                            <TableCell>{r.total_hadir}</TableCell>
                                            <TableCell>{r.total_hari}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="py-10 text-center">
                            <p className="text-muted-foreground">Belum ada data rekap untuk filter ini.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </AppLayout>
    );
};

export default ReportsPage;
