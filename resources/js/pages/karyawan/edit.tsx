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
        nik: karyawan.nik ?? '',
        no_ktp: karyawan.no_ktp ?? '',
        jenis_kelamin: karyawan.jenis_kelamin ?? '',
        status_perkawinan: karyawan.status_perkawinan ?? '',
        agama: karyawan.agama ?? '',
        keterangan_tambahan: karyawan.keterangan_tambahan ?? '',
        alamat_domisili: karyawan.alamat_domisili ?? '',
        kota_domisili: karyawan.kota_domisili ?? '',
        kecamatan_domisili: karyawan.kecamatan_domisili ?? '',
        desa_domisili: karyawan.desa_domisili ?? '',
        kode_pos_domisili: karyawan.kode_pos_domisili ?? '',
        alamat_ktp: karyawan.alamat_ktp ?? '',
        kota_ktp: karyawan.kota_ktp ?? '',
        kecamatan_ktp: karyawan.kecamatan_ktp ?? '',
        desa_ktp: karyawan.desa_ktp ?? '',
        kode_pos_ktp: karyawan.kode_pos_ktp ?? '',
        gaji_pokok: karyawan.gaji_pokok ?? '',
        tipe_gaji: karyawan.tipe_gaji ?? '',
        nama_npwp: karyawan.nama_npwp ?? '',
        alamat_npwp: karyawan.alamat_npwp ?? '',
        nama_bank: karyawan.nama_bank ?? '',
        rekening_an: karyawan.rekening_an ?? '',
        nomor_rekening: karyawan.nomor_rekening ?? '',
        ptkp: karyawan.ptkp ?? '',
        tunjangan_kompetensi: karyawan.tunjangan_kompetensi ?? '',
        tunjangan_jabatan: karyawan.tunjangan_jabatan ?? '',
        tunjangan_intensif: karyawan.tunjangan_intensif ?? '',
        tanggal_npwp: karyawan.tanggal_npwp ?? '',
        nomor_npwp: karyawan.nomor_npwp ?? '',
        bpjs_nama: karyawan.bpjs_nama ?? '',
        bpjs_kesehatan: karyawan.bpjs_kesehatan ?? '',
        bpjs_ketenagakerjaan: karyawan.bpjs_ketenagakerjaan ?? '',
        bpjs_cabang: karyawan.bpjs_cabang ?? '',
        bpjs_tanggal: karyawan.bpjs_tanggal ?? '',
        status_lembur: karyawan.status_lembur ?? '',
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
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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

                                {/* PIN */}
                                <div className="space-y-2">
                                    <Label htmlFor="pin">PIN</Label>
                                    <Input id="pin" value={data.pin} onChange={(e) => setData('pin', e.target.value)} />
                                    {errors.pin && <p className="text-sm text-red-500">{errors.pin}</p>}
                                </div>

                                {/* NIK */}
                                <div className="space-y-2">
                                    <Label htmlFor="nik">NIK</Label>
                                    <Input id="nik" value={data.nik} onChange={(e) => setData('nik', e.target.value)} />
                                    {errors.nik && <p className="text-sm text-red-500">{errors.nik}</p>}
                                </div>

                                {/* No KTP */}
                                <div className="space-y-2">
                                    <Label htmlFor="no_ktp">No. KTP</Label>
                                    <Input id="no_ktp" value={data.no_ktp} onChange={(e) => setData('no_ktp', e.target.value)} />
                                    {errors.no_ktp && <p className="text-sm text-red-500">{errors.no_ktp}</p>}
                                </div>

                                {/* Jenis Kelamin */}
                                <div className="space-y-2">
                                    <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                                    <select
                                        id="jenis_kelamin"
                                        value={data.jenis_kelamin}
                                        onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                        className="w-full rounded-md border p-2"
                                    >
                                        <option value="">Pilih Jenis Kelamin</option>
                                        <option value="Laki-laki">Laki-laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </select>
                                    {errors.jenis_kelamin && <p className="text-sm text-red-500">{errors.jenis_kelamin}</p>}
                                </div>

                                {/* Status Perkawinan */}
                                <div className="space-y-2">
                                    <Label htmlFor="status_perkawinan">Status Perkawinan</Label>
                                    <select
                                        id="status_perkawinan"
                                        value={data.status_perkawinan}
                                        onChange={(e) => setData('status_perkawinan', e.target.value)}
                                        className="w-full rounded-md border p-2"
                                    >
                                        <option value="">Pilih Status</option>
                                        <option value="Belum Menikah">Belum Menikah</option>
                                        <option value="Menikah">Menikah</option>
                                    </select>
                                    {errors.status_perkawinan && <p className="text-sm text-red-500">{errors.status_perkawinan}</p>}
                                </div>

                                {/* Agama */}
                                <div className="space-y-2">
                                    <Label htmlFor="agama">Agama</Label>
                                    <select
                                        id="agama"
                                        value={data.agama}
                                        onChange={(e) => setData('agama', e.target.value)}
                                        className="w-full rounded-md border p-2"
                                    >
                                        <option value="">Pilih Agama</option>
                                        <option value="Islam">Islam</option>
                                        <option value="Kristen">Kristen</option>
                                        <option value="Katolik">Katolik</option>
                                        <option value="Hindu">Hindu</option>
                                        <option value="Buddha">Buddha</option>
                                        <option value="Konghucu">Konghucu</option>
                                    </select>
                                    {errors.agama && <p className="text-sm text-red-500">{errors.agama}</p>}
                                </div>
                            </div>

                            {/* Alamat Domisili Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Alamat Domisili</h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="alamat_domisili">Alamat Domisili</Label>
                                        <Input
                                            id="alamat_domisili"
                                            value={data.alamat_domisili}
                                            onChange={(e) => setData('alamat_domisili', e.target.value)}
                                        />
                                        {errors.alamat_domisili && <p className="text-sm text-red-500">{errors.alamat_domisili}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="kota_domisili">Kota</Label>
                                        <Input
                                            id="kota_domisili"
                                            value={data.kota_domisili}
                                            onChange={(e) => setData('kota_domisili', e.target.value)}
                                        />
                                        {errors.kota_domisili && <p className="text-sm text-red-500">{errors.kota_domisili}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="kecamatan_domisili">Kecamatan</Label>
                                        <Input
                                            id="kecamatan_domisili"
                                            value={data.kecamatan_domisili}
                                            onChange={(e) => setData('kecamatan_domisili', e.target.value)}
                                        />
                                        {errors.kecamatan_domisili && <p className="text-sm text-red-500">{errors.kecamatan_domisili}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="desa_domisili">Desa</Label>
                                        <Input
                                            id="desa_domisili"
                                            value={data.desa_domisili}
                                            onChange={(e) => setData('desa_domisili', e.target.value)}
                                        />
                                        {errors.desa_domisili && <p className="text-sm text-red-500">{errors.desa_domisili}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="kode_pos_domisili">Kode Pos</Label>
                                        <Input
                                            id="kode_pos_domisili"
                                            value={data.kode_pos_domisili}
                                            onChange={(e) => setData('kode_pos_domisili', e.target.value)}
                                        />
                                        {errors.kode_pos_domisili && <p className="text-sm text-red-500">{errors.kode_pos_domisili}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Alamat KTP Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Alamat KTP</h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="alamat_ktp">Alamat KTP</Label>
                                        <Input id="alamat_ktp" value={data.alamat_ktp} onChange={(e) => setData('alamat_ktp', e.target.value)} />
                                        {errors.alamat_ktp && <p className="text-sm text-red-500">{errors.alamat_ktp}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="kota_ktp">Kota</Label>
                                        <Input id="kota_ktp" value={data.kota_ktp} onChange={(e) => setData('kota_ktp', e.target.value)} />
                                        {errors.kota_ktp && <p className="text-sm text-red-500">{errors.kota_ktp}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="kecamatan_ktp">Kecamatan</Label>
                                        <Input
                                            id="kecamatan_ktp"
                                            value={data.kecamatan_ktp}
                                            onChange={(e) => setData('kecamatan_ktp', e.target.value)}
                                        />
                                        {errors.kecamatan_ktp && <p className="text-sm text-red-500">{errors.kecamatan_ktp}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="desa_ktp">Desa</Label>
                                        <Input id="desa_ktp" value={data.desa_ktp} onChange={(e) => setData('desa_ktp', e.target.value)} />
                                        {errors.desa_ktp && <p className="text-sm text-red-500">{errors.desa_ktp}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="kode_pos_ktp">Kode Pos</Label>
                                        <Input
                                            id="kode_pos_ktp"
                                            value={data.kode_pos_ktp}
                                            onChange={(e) => setData('kode_pos_ktp', e.target.value)}
                                        />
                                        {errors.kode_pos_ktp && <p className="text-sm text-red-500">{errors.kode_pos_ktp}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Data Gaji Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Data Gaji</h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="gaji_pokok">Gaji Pokok</Label>
                                        <Input
                                            id="gaji_pokok"
                                            type="number"
                                            value={data.gaji_pokok}
                                            onChange={(e) => setData('gaji_pokok', e.target.value)}
                                        />
                                        {errors.gaji_pokok && <p className="text-sm text-red-500">{errors.gaji_pokok}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tipe_gaji">Tipe Gaji</Label>
                                        <select
                                            id="tipe_gaji"
                                            value={data.tipe_gaji}
                                            onChange={(e) => setData('tipe_gaji', e.target.value)}
                                            className="w-full rounded-md border p-2"
                                        >
                                            <option value="">Pilih Tipe Gaji</option>
                                            <option value="Harian">Harian</option>
                                            <option value="Bulanan">Bulanan</option>
                                        </select>
                                        {errors.tipe_gaji && <p className="text-sm text-red-500">{errors.tipe_gaji}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tunjangan_kompetensi">Tunjangan Kompetensi</Label>
                                        <Input
                                            id="tunjangan_kompetensi"
                                            type="number"
                                            value={data.tunjangan_kompetensi}
                                            onChange={(e) => setData('tunjangan_kompetensi', e.target.value)}
                                        />
                                        {errors.tunjangan_kompetensi && <p className="text-sm text-red-500">{errors.tunjangan_kompetensi}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tunjangan_jabatan">Tunjangan Jabatan</Label>
                                        <Input
                                            id="tunjangan_jabatan"
                                            type="number"
                                            value={data.tunjangan_jabatan}
                                            onChange={(e) => setData('tunjangan_jabatan', e.target.value)}
                                        />
                                        {errors.tunjangan_jabatan && <p className="text-sm text-red-500">{errors.tunjangan_jabatan}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tunjangan_intensif">Tunjangan Intensif</Label>
                                        <Input
                                            id="tunjangan_intensif"
                                            type="number"
                                            value={data.tunjangan_intensif}
                                            onChange={(e) => setData('tunjangan_intensif', e.target.value)}
                                        />
                                        {errors.tunjangan_intensif && <p className="text-sm text-red-500">{errors.tunjangan_intensif}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Data NPWP Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Data NPWP</h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="nama_npwp">Nama NPWP</Label>
                                        <Input id="nama_npwp" value={data.nama_npwp} onChange={(e) => setData('nama_npwp', e.target.value)} />
                                        {errors.nama_npwp && <p className="text-sm text-red-500">{errors.nama_npwp}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="nomor_npwp">Nomor NPWP</Label>
                                        <Input id="nomor_npwp" value={data.nomor_npwp} onChange={(e) => setData('nomor_npwp', e.target.value)} />
                                        {errors.nomor_npwp && <p className="text-sm text-red-500">{errors.nomor_npwp}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tanggal_npwp">Tanggal NPWP</Label>
                                        <DatePicker
                                            value={data.tanggal_npwp}
                                            onChange={(date) =>
                                                setData(
                                                    'tanggal_npwp',
                                                    date
                                                        ? new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0]
                                                        : '',
                                                )
                                            }
                                        />
                                        {errors.tanggal_npwp && <p className="text-sm text-red-500">{errors.tanggal_npwp}</p>}
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="alamat_npwp">Alamat NPWP</Label>
                                        <Input id="alamat_npwp" value={data.alamat_npwp} onChange={(e) => setData('alamat_npwp', e.target.value)} />
                                        {errors.alamat_npwp && <p className="text-sm text-red-500">{errors.alamat_npwp}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="ptkp">PTKP</Label>
                                        <Input id="ptkp" value={data.ptkp} onChange={(e) => setData('ptkp', e.target.value)} />
                                        {errors.ptkp && <p className="text-sm text-red-500">{errors.ptkp}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Data Bank Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Data Bank</h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="nama_bank">Nama Bank</Label>
                                        <Input id="nama_bank" value={data.nama_bank} onChange={(e) => setData('nama_bank', e.target.value)} />
                                        {errors.nama_bank && <p className="text-sm text-red-500">{errors.nama_bank}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="rekening_an">Rekening Atas Nama</Label>
                                        <Input id="rekening_an" value={data.rekening_an} onChange={(e) => setData('rekening_an', e.target.value)} />
                                        {errors.rekening_an && <p className="text-sm text-red-500">{errors.rekening_an}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="nomor_rekening">Nomor Rekening</Label>
                                        <Input
                                            id="nomor_rekening"
                                            value={data.nomor_rekening}
                                            onChange={(e) => setData('nomor_rekening', e.target.value)}
                                        />
                                        {errors.nomor_rekening && <p className="text-sm text-red-500">{errors.nomor_rekening}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Data BPJS Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Data BPJS</h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="bpjs_nama">Nama BPJS</Label>
                                        <Input id="bpjs_nama" value={data.bpjs_nama} onChange={(e) => setData('bpjs_nama', e.target.value)} />
                                        {errors.bpjs_nama && <p className="text-sm text-red-500">{errors.bpjs_nama}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bpjs_kesehatan">BPJS Kesehatan</Label>
                                        <Input
                                            id="bpjs_kesehatan"
                                            value={data.bpjs_kesehatan}
                                            onChange={(e) => setData('bpjs_kesehatan', e.target.value)}
                                        />
                                        {errors.bpjs_kesehatan && <p className="text-sm text-red-500">{errors.bpjs_kesehatan}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bpjs_ketenagakerjaan">BPJS Ketenagakerjaan</Label>
                                        <Input
                                            id="bpjs_ketenagakerjaan"
                                            value={data.bpjs_ketenagakerjaan}
                                            onChange={(e) => setData('bpjs_ketenagakerjaan', e.target.value)}
                                        />
                                        {errors.bpjs_ketenagakerjaan && <p className="text-sm text-red-500">{errors.bpjs_ketenagakerjaan}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bpjs_cabang">BPJS Cabang</Label>
                                        <Input id="bpjs_cabang" value={data.bpjs_cabang} onChange={(e) => setData('bpjs_cabang', e.target.value)} />
                                        {errors.bpjs_cabang && <p className="text-sm text-red-500">{errors.bpjs_cabang}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bpjs_tanggal">Tanggal BPJS</Label>
                                        <DatePicker
                                            value={data.bpjs_tanggal}
                                            onChange={(date) =>
                                                setData(
                                                    'bpjs_tanggal',
                                                    date
                                                        ? new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0]
                                                        : '',
                                                )
                                            }
                                        />
                                        {errors.bpjs_tanggal && <p className="text-sm text-red-500">{errors.bpjs_tanggal}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Role Karyawan</h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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

                                    <div className="space-y-2">
                                        <Label htmlFor="status_lembur">Status Lembur</Label>
                                        <select
                                            id="status_lembur"
                                            value={data.status_lembur}
                                            onChange={(e) => setData('status_lembur', e.target.value)}
                                            className="w-full rounded-md border p-2"
                                        >
                                            <option value="">Pilih Status Lembur</option>
                                            <option value="Aktif">Aktif</option>
                                            <option value="Tidak Aktif">Tidak Aktif</option>
                                        </select>
                                        {errors.status_lembur && <p className="text-sm text-red-500">{errors.status_lembur}</p>}
                                    </div>
                                </div>
                            </div>
                            {/* Keterangan Tambahan */}
                            <div className="space-y-2">
                                <Label htmlFor="keterangan_tambahan">Keterangan Tambahan</Label>
                                <textarea
                                    id="keterangan_tambahan"
                                    value={data.keterangan_tambahan}
                                    onChange={(e) => setData('keterangan_tambahan', e.target.value)}
                                    className="min-h-[100px] w-full rounded-md border p-2"
                                />
                                {errors.keterangan_tambahan && <p className="text-sm text-red-500">{errors.keterangan_tambahan}</p>}
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
