/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import AppLayout from '@/layouts/app-layout';
import { Permission, Role } from '@/types/index';
import { Head, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface RoleListProps {
    roles: Role[];
    permissions: Permission[];
    [key: string]: any;
}

// Komponen formulir untuk tambah/edit role
const RoleForm = ({ role, permissions, onClose }: { role?: Role; permissions: Permission[]; onClose: () => void }) => {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: role?.name || '',
        permissions: role?.permissions?.map((p) => p.name) || [],
    });

    const handlePermissionChange = (permissionName: string, isChecked: boolean) => {
        setData('permissions', isChecked ? [...data.permissions, permissionName] : data.permissions.filter((p) => p !== permissionName));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (role) {
            put(route('roles.update', role.id), {
                onSuccess: () => {
                    toast.success('Role berhasil diperbarui');
                    onClose();
                },
                onError: () => {
                    toast.error('Gagal memperbarui role');
                    console.error(errors);
                },
            });
        } else {
            post(route('roles.store'), {
                onSuccess: () => {
                    toast.success('Role baru berhasil ditambahkan');
                    onClose();
                    reset();
                },
                onError: () => {
                    toast.error('Gagal menambahkan role');
                    console.error(errors);
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nama Role</Label>
                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>
            <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="grid max-h-60 grid-cols-2 gap-2 overflow-y-auto">

                    {permissions
                        .filter((permission) => !permission.name.startsWith('generated::'))
                        .map((permission) => (
                            <div key={permission.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`permission-${permission.id}`}
                                    checked={data.permissions.includes(permission.name)}
                                    onCheckedChange={(checked) => handlePermissionChange(permission.name, checked as boolean)}
                                />
                                <Label htmlFor={`permission-${permission.id}`} className="text-sm">
                                    {permission.name}
                                </Label>
                            </div>
                        ))}
                </div>
                {errors.permissions && <p className="text-xs text-red-500">{errors.permissions}</p>}
            </div>
            <div className="flex gap-2">
                <Button type="submit" disabled={processing} className="flex-1">
                    {processing ? 'Memproses...' : role ? 'Update' : 'Simpan'}
                </Button>
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                    Batal
                </Button>
            </div>
        </form>
    );
};

const RoleList = () => {
    const { roles, permissions } = usePage<RoleListProps>().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | undefined>(undefined);

    const handleEditClick = (role: Role) => {
        setSelectedRole(role);
        setIsModalOpen(true);
    };

    const handleCreateClick = () => {
        setSelectedRole(undefined);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRole(undefined);
    };

    return (
        <AppLayout>
            <Head title="Manajemen Peran" />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Manajemen Peran</CardTitle>
                        <CardDescription>Kelola peran dan izin akses dalam sistem</CardDescription>
                    </div>
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={handleCreateClick}>Tambah Role</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>{selectedRole ? 'Edit Role' : 'Tambah Role'}</DialogTitle>
                                <DialogDescription>Tambahkan atau perbarui peran dan berikan izin yang diperlukan.</DialogDescription>
                            </DialogHeader>
                            <RoleForm role={selectedRole} permissions={permissions} onClose={handleCloseModal} />
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    {roles.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama Role</TableHead>
                                        <TableHead>Jumlah Izin</TableHead>
                                        {/* <TableHead>Izin</TableHead> */}
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roles.map((role) => (
                                        <TableRow key={role.id}>
                                            <TableCell className="font-medium">{role.name}</TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                                    {role.permissions?.length || 0} izin
                                                </span>
                                            </TableCell>
                                            {/* <TableCell className="max-w-xs">
                                                <div className="truncate" title={role.permissions?.map((p) => p.name).join(', ') || '-'}>
                                                    {role.permissions && role.permissions.length > 0
                                                        ? role.permissions
                                                              .slice(0, 3)
                                                              .map((p) => p.name)
                                                              .join(', ') + (role.permissions.length > 3 ? '...' : '')
                                                        : '-'}
                                                </div>
                                            </TableCell> */}
                                            <TableCell className="text-right">
                                                <Button size="sm" variant="outline" onClick={() => handleEditClick(role)}>
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
                            <p className="text-muted-foreground">Belum ada role yang dibuat.</p>
                            <Button onClick={handleCreateClick} className="mt-4">
                                Tambah Role Pertama
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </AppLayout>
    );
};

export default RoleList;
