/* eslint-disable @typescript-eslint/no-explicit-any */
import { Role } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';

import AppLayout from '../../layouts/app-layout';
import { Karyawan } from '../../types/karyawan';

interface KaryawanListProps {
    karyawans: Karyawan[];
    roles: Role[];
    [key: string]: any;
}

const KaryawanForm = ({ karyawan, roles, onClose }: { karyawan?: Karyawan; roles: Role[]; onClose: () => void }) => {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        user_id: karyawan?.user_id || '',
        nik: karyawan?.nik || '',
        npwp: karyawan?.npwp || '',
        tgl_lahir: karyawan?.tgl_lahir || '',
        alamat: karyawan?.alamat || '',
        telp: karyawan?.telp || '',
        tanggal_masuk: karyawan?.tanggal_masuk || '',
        tanggal_keluar: karyawan?.tanggal_keluar || '',
        status: karyawan?.status || 'Aktif',
        role: karyawan?.user?.roles?.[0]?.name || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (karyawan) {
            put(route('karyawan.update', karyawan.id), {
                onSuccess: () => {
                    toast.success('Data karyawan berhasil diperbarui');
                    onClose();
                },
                onError: () => {
                    toast.error('Gagal memperbarui data karyawan');
                    console.error(errors);
                },
            });
        } else {
            post(route('karyawan.store'), {
                onSuccess: () => {
                    toast.success('Data karyawan baru berhasil ditambahkan');
                    onClose();
                    reset();
                },
                onError: () => {
                    toast.error('Gagal menambahkan data karyawan');
                    console.error(errors);
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="nik">NIK</Label>
                    <Input id="nik" value={data.nik} onChange={(e) => setData('nik', e.target.value)} required />
                    {errors.nik && <p className="text-xs text-red-500">{errors.nik}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="npwp">NPWP</Label>
                    <Input id="npwp" value={data.npwp} onChange={(e) => setData('npwp', e.target.value)} />
                    {errors.npwp && <p className="text-xs text-red-500">{errors.npwp}</p>}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="tgl_lahir">Tanggal Lahir</Label>
                    <Input id="tgl_lahir" type="date" value={data.tgl_lahir} onChange={(e) => setData('tgl_lahir', e.target.value)} />
                    {errors.tgl_lahir && <p className="text-xs text-red-500">{errors.tgl_lahir}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="telp">Telepon</Label>
                    <Input id="telp" value={data.telp} onChange={(e) => setData('telp', e.target.value)} />
                    {errors.telp && <p className="text-xs text-red-500">{errors.telp}</p>}
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="alamat">Alamat</Label>
                <Input id="alamat" value={data.alamat} onChange={(e) => setData('alamat', e.target.value)} />
                {errors.alamat && <p className="text-xs text-red-500">{errors.alamat}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="tanggal_masuk">Tanggal Masuk</Label>
                <Input
                    id="tanggal_masuk"
                    type="date"
                    value={data.tanggal_masuk}
                    onChange={(e) => setData('tanggal_masuk', e.target.value)}
                    required
                />
                {errors.tanggal_masuk && <p className="text-xs text-red-500">{errors.tanggal_masuk}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={data.status} onValueChange={(value) => setData('status', value as 'Aktif' | 'Non Aktif')}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Aktif">Aktif</SelectItem>
                        <SelectItem value="Non Aktif">Non Aktif</SelectItem>
                    </SelectContent>
                </Select>
                {errors.status && <p className="text-xs text-red-500">{errors.status}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Role" />
                    </SelectTrigger>
                    <SelectContent>
                        {roles.map((role) => (
                            <SelectItem key={role.id} value={role.name}>
                                {role.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.role && <p className="text-xs text-red-500">{errors.role}</p>}
            </div>
            <div className="flex gap-2">
                <Button type="submit" disabled={processing} className="flex-1">
                    {processing ? 'Memproses...' : karyawan ? 'Update' : 'Simpan'}
                </Button>
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                    Batal
                </Button>
            </div>
        </form>
    );
};

const KaryawanList = () => {
    const { karyawans, roles } = usePage<KaryawanListProps>().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedKaryawan, setSelectedKaryawan] = useState<Karyawan | undefined>(undefined);

    const handleEditClick = (karyawan: Karyawan) => {
        setSelectedKaryawan(karyawan);
        setIsModalOpen(true);
    };

    const handleCreateClick = () => {
        setSelectedKaryawan(undefined);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedKaryawan(undefined);
    };

    return (
        <AppLayout>
            <Head title="Master Karyawan" />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Master Karyawan</CardTitle>
                        <CardDescription>Kelola data karyawan dan peran mereka dalam sistem</CardDescription>
                    </div>
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={handleCreateClick}>Tambah Karyawan</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>{selectedKaryawan ? 'Edit Karyawan' : 'Tambah Karyawan'}</DialogTitle>
                                <DialogDescription>Lengkapi detail karyawan dan berikan peran yang sesuai.</DialogDescription>
                            </DialogHeader>
                            <KaryawanForm karyawan={selectedKaryawan} roles={roles} onClose={handleCloseModal} />
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    {karyawans.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>NIK</TableHead>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Tanggal Masuk</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {karyawans.map((karyawan) => (
                                        <TableRow key={karyawan.id}>
                                            <TableCell className="font-medium">{karyawan.nik}</TableCell>
                                            <TableCell>{karyawan.user?.name || '-'}</TableCell>
                                            <TableCell>{karyawan.user?.email || '-'}</TableCell>
                                            <TableCell>{karyawan.tanggal_masuk || '-'}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                        karyawan.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}
                                                >
                                                    {karyawan.status}
                                                </span>
                                            </TableCell>
                                            <TableCell>{karyawan.user?.roles?.[0]?.name || '-'}</TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" variant="outline" onClick={() => handleEditClick(karyawan)}>
                                                    Edit
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="py-10 text-center">
                            <p className="text-muted-foreground">Belum ada data karyawan.</p>
                            <Button onClick={handleCreateClick} className="mt-4">
                                Tambah Karyawan Pertama
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </AppLayout>
    );
};

export default KaryawanList;
