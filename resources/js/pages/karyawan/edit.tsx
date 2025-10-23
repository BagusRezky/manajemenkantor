import { DatePicker } from '@/components/date-picker';
import { SearchableSelect } from '@/components/search-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Role, User } from '@/types';
import { Karyawan } from '@/types/karyawan';

import { Head, useForm } from '@inertiajs/react';

interface Props {
    karyawan: Karyawan;
    roles: Role[];
    users: User[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Karyawan', href: route('karyawan.index') },
    { title: 'Edit Data', href: '#' },
];

export default function EditKaryawan({ karyawan, roles, users }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        user_id: karyawan.user_id ?? '',
        pin: karyawan.pin ?? '',
        nip: karyawan.nip ?? '',
        nama: karyawan.nama ?? '',
        jadwal_kerja: karyawan.jadwal_kerja ?? '',
        tgl_mulai_jadwal: karyawan.tgl_mulai_jadwal ?? '',
        tempat_lahir: karyawan.tempat_lahir ?? '',
        tanggal_lahir: karyawan.tanggal_lahir ?? '',
        jabatan: karyawan.jabatan ?? '',
        departemen: karyawan.departemen ?? '',
        kantor: karyawan.kantor ?? '',
        rfid: karyawan.rfid ?? '',
        no_telp: karyawan.no_telp ?? '',
        privilege: karyawan.privilege ?? '',
        status_pegawai: karyawan.status_pegawai ?? 'Aktif',
        tgl_masuk_kerja: karyawan.tgl_masuk_kerja ?? '',
        tgl_akhir_kontrak: karyawan.tgl_akhir_kontrak ?? '',
        role: karyawan.user?.roles?.[0]?.name ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('karyawan.update', karyawan.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Data Karyawan" />

            <div className="mx-5 py-5">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Data Karyawan</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Nama */}
                                <div className="space-y-2">
                                    <Label htmlFor="nama">Nama</Label>
                                    <Input
                                        id="nama"
                                        value={data.nama}
                                        onChange={(e) => setData('nama', e.target.value)}
                                        className={errors.nama ? 'border-red-500' : ''}
                                    />
                                    {errors.nama && <p className="text-sm text-red-500">{errors.nama}</p>}
                                </div>

                                {/* NIP */}
                                <div className="space-y-2">
                                    <Label htmlFor="nip">NIP</Label>
                                    <Input id="nip" value={data.nip} onChange={(e) => setData('nip', e.target.value)} />
                                </div>

                                {/* Jabatan */}
                                <div className="space-y-2">
                                    <Label htmlFor="jabatan">Jabatan</Label>
                                    <Input id="jabatan" value={data.jabatan} onChange={(e) => setData('jabatan', e.target.value)} />
                                </div>

                                {/* Departemen */}
                                <div className="space-y-2">
                                    <Label htmlFor="departemen">Departemen</Label>
                                    <Input id="departemen" value={data.departemen} onChange={(e) => setData('departemen', e.target.value)} />
                                </div>

                                {/* Kantor */}
                                <div className="space-y-2">
                                    <Label htmlFor="kantor">Kantor</Label>
                                    <Input id="kantor" value={data.kantor} onChange={(e) => setData('kantor', e.target.value)} />
                                </div>

                                {/* Jadwal Kerja */}
                                <div className="space-y-2">
                                    <Label htmlFor="jadwal_kerja">Jadwal Kerja</Label>
                                    <Input id="jadwal_kerja" value={data.jadwal_kerja} onChange={(e) => setData('jadwal_kerja', e.target.value)} />
                                </div>

                                {/* Tanggal Mulai Jadwal */}
                                <div className="space-y-2">
                                    <Label htmlFor="tgl_mulai_jadwal">Tanggal Mulai Jadwal</Label>
                                    <DatePicker
                                        value={data.tgl_mulai_jadwal}
                                        onChange={(date) =>
                                            setData(
                                                'tgl_mulai_jadwal',
                                                date ? new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0] : '',
                                            )
                                        }
                                    />
                                </div>

                                {/* Tempat Lahir */}
                                <div className="space-y-2">
                                    <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
                                    <Input id="tempat_lahir" value={data.tempat_lahir} onChange={(e) => setData('tempat_lahir', e.target.value)} />
                                </div>

                                {/* Tanggal Lahir */}
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                                    <DatePicker
                                        value={data.tanggal_lahir}
                                        onChange={(date) =>
                                            setData(
                                                'tanggal_lahir',
                                                date ? new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0] : '',
                                            )
                                        }
                                    />
                                </div>

                                {/* No Telp */}
                                <div className="space-y-2">
                                    <Label htmlFor="no_telp">No. Telp</Label>
                                    <Input id="no_telp" value={data.no_telp} onChange={(e) => setData('no_telp', e.target.value)} />
                                </div>

                                {/* RFID */}
                                <div className="space-y-2">
                                    <Label htmlFor="rfid">RFID</Label>
                                    <Input id="rfid" value={data.rfid} onChange={(e) => setData('rfid', e.target.value)} />
                                </div>

                                {/* Privilege */}
                                <div className="space-y-2">
                                    <Label htmlFor="privilege">Privilege</Label>
                                    <Input id="privilege" value={data.privilege} onChange={(e) => setData('privilege', e.target.value)} />
                                </div>

                                {/* Status Pegawai */}
                                <div className="space-y-2">
                                    <Label htmlFor="status_pegawai">Status Pegawai *</Label>
                                    <select
                                        id="status_pegawai"
                                        value={data.status_pegawai}
                                        onChange={(e) => setData('status_pegawai', e.target.value)}
                                        className="w-full rounded-md border p-2"
                                    >
                                        <option value="Aktif">Aktif</option>
                                        <option value="Nonaktif">Nonaktif</option>
                                    </select>
                                    {errors.status_pegawai && <p className="text-sm text-red-500">{errors.status_pegawai}</p>}
                                </div>

                                {/* Role */}
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role *</Label>
                                    <SearchableSelect
                                        items={roles.map((role) => ({
                                            key: role.id.toString(),
                                            value: role.name,
                                            label: role.name,
                                        }))}
                                        value={data.role || ''}
                                        placeholder="Pilih Role"
                                        onChange={(value) => setData('role', value)}
                                    />
                                    {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
                                </div>

                                {/* Tanggal Masuk Kerja */}
                                <div className="space-y-2">
                                    <Label htmlFor="tgl_masuk_kerja">Tanggal Masuk Kerja</Label>
                                    <DatePicker
                                        value={data.tgl_masuk_kerja}
                                        onChange={(date) =>
                                            setData(
                                                'tgl_masuk_kerja',
                                                date ? new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0] : '',
                                            )
                                        }
                                    />
                                </div>

                                {/* Tanggal Akhir Kontrak */}
                                <div className="space-y-2">
                                    <Label htmlFor="tgl_akhir_kontrak">Tanggal Akhir Kontrak</Label>
                                    <DatePicker
                                        value={data.tgl_akhir_kontrak}
                                        onChange={(date) =>
                                            setData(
                                                'tgl_akhir_kontrak',
                                                date ? new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0] : '',
                                            )
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="user_id">User</Label>
                                    <SearchableSelect
                                        items={(users || []).map((user) => ({
                                            key: user.id.toString(),
                                            value: user.id.toString(),
                                            label: user.name,
                                        }))}
                                        value={String(data.user_id) || ''}
                                        placeholder="Pilih User"
                                        onChange={(value) => setData('user_id', value)}
                                    />
                                    {errors.user_id && <p className="text-sm text-red-500">{errors.user_id}</p>}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-4 pt-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>

                                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                    Batal
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
