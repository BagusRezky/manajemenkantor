/* eslint-disable @typescript-eslint/no-explicit-any */
import { Role } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';

import { Upload } from 'lucide-react';
import AppLayout from '../../layouts/app-layout';
import { Karyawan } from '../../types/karyawan';

interface KaryawanListProps {
    karyawans: Karyawan[];
    roles: Role[];
    [key: string]: any;
}

const KaryawanForm = ({
    karyawan,
    roles,
    unassignedUsers,
    onClose,
}: {
    karyawan?: Karyawan;
    roles: Role[];
    unassignedUsers: any[];
    onClose: () => void;
}) => {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        user_id: karyawan?.user_id ?? '',
        pin: karyawan?.pin || '',
        nip: karyawan?.nip || '',
        nama: karyawan?.nama || '',
        jadwal_kerja: karyawan?.jadwal_kerja || '',
        tgl_mulai_jadwal: karyawan?.tgl_mulai_jadwal || '',
        tempat_lahir: karyawan?.tempat_lahir || '',
        tanggal_lahir: karyawan?.tanggal_lahir || '',
        jabatan: karyawan?.jabatan || '',
        departemen: karyawan?.departemen || '',
        kantor: karyawan?.kantor || '',
        password: karyawan?.password || '',
        rfid: karyawan?.rfid || '',
        no_telp: karyawan?.no_telp || '',
        privilege: karyawan?.privilege || '',
        status_pegawai: karyawan?.status_pegawai || 'Aktif',
        fp_zk: karyawan?.fp_zk || '',
        fp_neo: karyawan?.fp_neo || '',
        fp_revo: karyawan?.fp_revo || '',
        fp_livo: karyawan?.fp_livo || '',
        fp_uareu: karyawan?.fp_uareu || '',
        wajah: karyawan?.wajah || '',
        telapak_tangan: karyawan?.telapak_tangan || '',
        tgl_masuk_kerja: karyawan?.tgl_masuk_kerja || '',
        tgl_akhir_kontrak: karyawan?.tgl_akhir_kontrak || '',
        role: karyawan?.user?.roles?.[0]?.name ?? '',
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
        <div className="w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section: User & Identitas */}
                <div className="w-full space-y-4">
                    <h3 className="border-b pb-2 text-lg font-medium">Data Dasar</h3>

                    {/* Pilih User */}
                    <div className="space-y-2">
                        <Label htmlFor="user_id">User</Label>
                        <Select
                            value={data.user_id ? data.user_id.toString() : undefined}
                            onValueChange={(value) => setData('user_id', parseInt(value))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih User" />
                            </SelectTrigger>
                            <SelectContent>
                                {karyawan?.user && (
                                    <SelectItem value={karyawan.user.id.toString()}>
                                        {karyawan.user.name} ({karyawan.user.email})
                                    </SelectItem>
                                )}
                                {unassignedUsers.map((user) => (
                                    <SelectItem key={user.id} value={user.id.toString()}>
                                        {user.name} ({user.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.user_id && <p className="text-xs text-red-500">{errors.user_id}</p>}
                    </div>

                    {/* PIN, NIP, Nama */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="pin">PIN</Label>
                            <Input id="pin" value={data.pin} onChange={(e) => setData('pin', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nip">NIP</Label>
                            <Input id="nip" value={data.nip} onChange={(e) => setData('nip', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nama">Nama</Label>
                            <Input id="nama" value={data.nama} onChange={(e) => setData('nama', e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Section: Jadwal & Data Lahir */}
                <div className="space-y-4">
                    <h3 className="border-b pb-2 text-lg font-medium">Jadwal & Data Pribadi</h3>

                    {/* Jadwal kerja & tanggal mulai */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="jadwal_kerja">Jadwal Kerja</Label>
                            <Input id="jadwal_kerja" value={data.jadwal_kerja} onChange={(e) => setData('jadwal_kerja', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tgl_mulai_jadwal">Tanggal Mulai Jadwal</Label>
                            <Input
                                id="tgl_mulai_jadwal"
                                type="date"
                                value={data.tgl_mulai_jadwal ?? ''}
                                onChange={(e) => setData('tgl_mulai_jadwal', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Data lahir & no telp */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
                            <Input id="tempat_lahir" value={data.tempat_lahir} onChange={(e) => setData('tempat_lahir', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                            <Input
                                id="tanggal_lahir"
                                type="date"
                                value={data.tanggal_lahir ?? ''}
                                onChange={(e) => setData('tanggal_lahir', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="no_telp">No. Telp</Label>
                            <Input id="no_telp" value={data.no_telp} onChange={(e) => setData('no_telp', e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Section: Jabatan & Organisasi */}
                <div className="space-y-4">
                    <h3 className="border-b pb-2 text-lg font-medium">Data Organisasi</h3>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="jabatan">Jabatan</Label>
                            <Input id="jabatan" value={data.jabatan} onChange={(e) => setData('jabatan', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="departemen">Departemen</Label>
                            <Input id="departemen" value={data.departemen} onChange={(e) => setData('departemen', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="kantor">Kantor</Label>
                            <Input id="kantor" value={data.kantor} onChange={(e) => setData('kantor', e.target.value)} />
                        </div>
                    </div>

                    {/* Role */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={data.role ? data.role.toString() : undefined} onValueChange={(value) => setData('role', value)}>
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
                    </div>
                </div>

                {/* Section: Akses & Keamanan */}
                <div className="space-y-4">
                    <h3 className="border-b pb-2 text-lg font-medium">Akses & Keamanan</h3>

                    <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="rfid">RFID</Label>
                            <Input id="rfid" value={data.rfid} onChange={(e) => setData('rfid', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="privilege">Privilege</Label>
                            <Input id="privilege" value={data.privilege} onChange={(e) => setData('privilege', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status_pegawai">Status Pegawai</Label>
                            <select
                                id="status_pegawai"
                                value={data.status_pegawai}
                                onChange={(e) => setData('status_pegawai', e.target.value)}
                                className="h-10 w-full rounded border p-2"
                            >
                                <option value="Aktif">Aktif</option>
                                <option value="Nonaktif">Nonaktif</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Section: Data Biometrik */}
                <div className="space-y-4">
                    <h3 className="border-b pb-2 text-lg font-medium">Data Biometrik</h3>

                    <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fp_zk">FP ZK</Label>
                            <Input id="fp_zk" type="number" value={data.fp_zk ?? ''} onChange={(e) => setData('fp_zk', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fp_neo">FP Neo</Label>
                            <Input id="fp_neo" type="number" value={data.fp_neo ?? ''} onChange={(e) => setData('fp_neo', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fp_revo">FP Revo</Label>
                            <Input id="fp_revo" type="number" value={data.fp_revo ?? ''} onChange={(e) => setData('fp_revo', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fp_livo">FP Livo</Label>
                            <Input id="fp_livo" type="number" value={data.fp_livo ?? ''} onChange={(e) => setData('fp_livo', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fp_uareu">FP UareU</Label>
                            <Input id="fp_uareu" type="number" value={data.fp_uareu ?? ''} onChange={(e) => setData('fp_uareu', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="wajah">Wajah</Label>
                            <Input id="wajah" type="number" value={data.wajah ?? ''} onChange={(e) => setData('wajah', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="telapak_tangan">Telapak Tangan</Label>
                            <Input
                                id="telapak_tangan"
                                type="number"
                                value={data.telapak_tangan ?? ''}
                                onChange={(e) => setData('telapak_tangan', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Section: Kontrak Kerja */}
                <div className="space-y-4">
                    <h3 className="border-b pb-2 text-lg font-medium">Kontrak Kerja</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="tgl_masuk_kerja">Tanggal Masuk Kerja</Label>
                            <Input
                                id="tgl_masuk_kerja"
                                type="date"
                                value={data.tgl_masuk_kerja ?? ''}
                                onChange={(e) => setData('tgl_masuk_kerja', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tgl_akhir_kontrak">Tanggal Akhir Kontrak</Label>
                            <Input
                                id="tgl_akhir_kontrak"
                                type="date"
                                value={data.tgl_akhir_kontrak ?? ''}
                                onChange={(e) => setData('tgl_akhir_kontrak', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 border-t pt-4">
                    <Button type="submit" disabled={processing} className="flex-1">
                        {processing ? 'Memproses...' : karyawan ? 'Update' : 'Simpan'}
                    </Button>
                    <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                        Batal
                    </Button>
                </div>
            </form>
        </div>
    );
};

const KaryawanList = () => {
    const { karyawans, roles, unassignedUsers } = usePage<KaryawanListProps>().props;
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

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const formData = new FormData();
        formData.append('file', e.target.files[0]);

        router.post(route('karyawan.import'), formData, {
            onSuccess: () => {
                e.target.value = ''; // reset input
            },
        });
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
                    <div className="flex gap-2">
                        {/* Upload Excel */}
                        <Button type="button" variant="outline" onClick={() => document.getElementById('excel-upload')?.click()}>
                            <Upload className="mr-2 h-4 w-4" />
                            Import Excel
                        </Button>
                        <input type="file" name="file" accept=".xlsx,.xls,.csv" className="hidden" id="excel-upload" onChange={handleImport} />

                        {/* Tambah Karyawan */}
                        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={handleCreateClick}>Tambah Karyawan</Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[90vh] w-[1200px] max-w-[90vw] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>{selectedKaryawan ? 'Edit Karyawan' : 'Tambah Karyawan'}</DialogTitle>
                                    <DialogDescription>Lengkapi detail karyawan dan berikan peran yang sesuai.</DialogDescription>
                                </DialogHeader>
                                <KaryawanForm
                                    karyawan={selectedKaryawan}
                                    roles={roles}
                                    unassignedUsers={unassignedUsers}
                                    onClose={handleCloseModal}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    {karyawans.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>PIN</TableHead>
                                        <TableHead>NIP</TableHead>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Departemen</TableHead>
                                        <TableHead>Kantor</TableHead>
                                        <TableHead>Tanggal Masuk</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {karyawans.map((karyawan) => (
                                        <TableRow key={karyawan.id}>
                                            <TableCell>{karyawan.pin}</TableCell>
                                            <TableCell>{karyawan.nip}</TableCell>
                                            <TableCell>{karyawan.nama}</TableCell>
                                            <TableCell>{karyawan.departemen}</TableCell>
                                            <TableCell>{karyawan.kantor}</TableCell>
                                            <TableCell>{karyawan.tgl_masuk_kerja || '-'}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                        karyawan.status_pegawai === 'Aktif'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}
                                                >
                                                    {karyawan.status_pegawai}
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
