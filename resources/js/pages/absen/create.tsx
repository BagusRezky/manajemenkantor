import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const breadcumbs = [
  { title: "Absen", href: route("absens.index") },
  { title: "Tambah Data", href: route("absens.create") },
];

interface Karyawan {
  id: number;
  nama: string;
  pin: string | null;
  nip: string | null;
  jabatan: string | null;
  departemen: string | null;
  kantor: string | null;
}

interface Props {
  karyawans: Karyawan[];
}

export default function Create({ karyawans }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    karyawan_id: "",
    tanggal_scan: "",
    io: "",
    verifikasi: "",
    workcode: "",
    sn: "",
    mesin: "",
    // Field otomatis diisi setelah pilih karyawan
    pin: "",
    nip: "",
    nama: "",
    jabatan: "",
    departemen: "",
    kantor: "",
  });

  // Fungsi untuk mengisi data otomatis setelah pilih karyawan
  const handleSelectKaryawan = (id: string) => {
    setData("karyawan_id", id);
    const selected = karyawans.find((k) => k.id === Number(id));
    if (selected) {
      setData({
        ...data,
        karyawan_id: id,
        pin: selected.pin || "",
        nip: selected.nip || "",
        nama: selected.nama || "",
        jabatan: selected.jabatan || "",
        departemen: selected.departemen || "",
        kantor: selected.kantor || "",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("absens.store"));
  };

  return (
    <AppLayout breadcrumbs={breadcumbs}>
      <Head title="Tambah Absen" />

      <Card>
        <CardHeader>
          <CardTitle>Tambah Data Absen</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Pilih karyawan */}
            <div>
              <Label>Pilih Karyawan</Label>
              <select
                className="w-full border rounded-md p-2 mt-1"
                value={data.karyawan_id}
                onChange={(e) => handleSelectKaryawan(e.target.value)}
              >
                <option value="">-- Pilih Karyawan --</option>
                {karyawans.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama}
                  </option>
                ))}
              </select>
              {errors.karyawan_id && (
                <p className="text-sm text-red-500 mt-1">{errors.karyawan_id}</p>
              )}
            </div>

            {/* Otomatis terisi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>PIN</Label>
                <Input value={data.pin} disabled />
              </div>
              <div>
                <Label>NIP</Label>
                <Input value={data.nip} disabled />
              </div>
              <div>
                <Label>Jabatan</Label>
                <Input value={data.jabatan} disabled />
              </div>
              <div>
                <Label>Departemen</Label>
                <Input value={data.departemen} disabled />
              </div>
              <div>
                <Label>Kantor</Label>
                <Input value={data.kantor} disabled />
              </div>
            </div>

            {/* Input manual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Tanggal Scan</Label>
                <Input
                  type="datetime-local"
                  value={data.tanggal_scan}
                  onChange={(e) => setData("tanggal_scan", e.target.value)}
                />
                {errors.tanggal_scan && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.tanggal_scan}
                  </p>
                )}
              </div>

                <div>
                <Label>SN</Label>
                <Input
                  type="text"
                  value={data.sn}
                  onChange={(e) => setData("sn", e.target.value)}
                />
                {errors.sn && (
                  <p className="text-sm text-red-500 mt-1">{errors.sn}</p>
                )}
              </div>

              <div>
                <Label>Mesin</Label>
                <Input
                  type="text"
                  value={data.mesin}
                  onChange={(e) => setData("mesin", e.target.value)}
                />
                {errors.mesin && (
                  <p className="text-sm text-red-500 mt-1">{errors.mesin}</p>
                )}
              </div>

                <div>
                <Label>Workcode</Label>
                <Input
                  type="number"
                  value={data.workcode}
                  onChange={(e) => setData("workcode", e.target.value)}
                />
                {errors.workcode && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.workcode}
                  </p>
                )}
              </div>
                <div>
                <Label>Verifikasi</Label>
                <Input
                  type="number"
                  value={data.verifikasi}
                  onChange={(e) => setData("verifikasi", e.target.value)}
                />
                {errors.verifikasi && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.verifikasi}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label>IO (Masuk/Keluar)</Label>
              <select
                className="w-full border rounded-md p-2 mt-1"
                value={data.io}
                onChange={(e) => setData("io", e.target.value)}
              >
                <option value="">-- Pilih IO --</option>
                <option value="1">Masuk (1)</option>
                <option value="2">Keluar (2)</option>
              </select>
              {errors.io && (
                <p className="text-sm text-red-500 mt-1">{errors.io}</p>
              )}
            </div>

            {/* Tombol */}
            <div className="pt-4">
              <Button type="submit" disabled={processing}>
                Simpan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
