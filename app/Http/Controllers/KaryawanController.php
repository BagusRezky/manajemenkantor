<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Karyawan;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\KaryawanImport;

class KaryawanController extends Controller
{
    public function index()
    {
        // Ambil semua data karyawan dengan relasi user dan peran
        $karyawans = Karyawan::with('user.roles')->get();

        // Ambil semua peran untuk ditampilkan di dropdown
        $roles = Role::all();

        // Ambil semua user yang belum memiliki data karyawan
        $unassignedUsers = User::whereDoesntHave('karyawan')->get();

        return Inertia::render('karyawan/karyawans', [
            'karyawans' => $karyawans,
            'roles' => $roles,
            'unassignedUsers' => $unassignedUsers,
        ]);
    }

    public function store(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'user_id'        => ['nullable', 'exists:users,id', 'unique:karyawans,user_id'],
            'pin'            => ['nullable', 'string', 'max:20'],
            'nip'            => ['nullable', 'string', 'max:30'],
            'nama'           => ['required', 'string', 'max:255'],
            'jadwal_kerja'   => ['nullable', 'string', 'max:100'],
            'tgl_mulai_jadwal' => ['nullable', 'date'],
            'tempat_lahir'   => ['nullable', 'string', 'max:100'],
            'tanggal_lahir'  => ['nullable', 'date'],
            'jabatan'        => ['nullable', 'string', 'max:100'],
            'departemen'     => ['nullable', 'string', 'max:100'],
            'kantor'         => ['nullable', 'string', 'max:100'],
            'rfid'           => ['nullable', 'string', 'max:100'],
            'no_telp'        => ['nullable', 'string', 'max:20'],
            'privilege'      => ['nullable', 'string', 'max:50'],
            'status_pegawai' => ['required', Rule::in(['Aktif', 'Nonaktif'])],
            'tgl_masuk_kerja' => ['nullable', 'date'],
            'tgl_akhir_kontrak' => ['nullable', 'date'],
            'role'           => ['nullable', 'string', 'exists:roles,name'],
        ]);

        DB::transaction(function () use ($validated) {
            $role = $validated['role'];
            unset($validated['role']);

            $karyawan = Karyawan::create($validated);

            if ($karyawan->user) {
                $karyawan->user->syncRoles($role);
            }
        });

        return Redirect::route('karyawan.index')->with('success', 'Karyawan berhasil ditambahkan.');
    }

    public function update(Request $request, Karyawan $karyawan)
    {
        $validated = $request->validate([
            'user_id'        => ['nullable', 'exists:users,id', 'unique:karyawans,user_id,' . $karyawan->id],
            'pin'            => ['nullable', 'string', 'max:20'],
            'nip'            => ['nullable', 'string', 'max:30'],
            'nama'           => ['required', 'string', 'max:255'],
            'jadwal_kerja'   => ['nullable', 'string', 'max:100'],
            'tgl_mulai_jadwal' => ['nullable', 'date'],
            'tempat_lahir'   => ['nullable', 'string', 'max:100'],
            'tanggal_lahir'  => ['nullable', 'date'],
            'jabatan'        => ['nullable', 'string', 'max:100'],
            'departemen'     => ['nullable', 'string', 'max:100'],
            'kantor'         => ['nullable', 'string', 'max:100'],
            'rfid'           => ['nullable', 'string', 'max:100'],
            'no_telp'        => ['nullable', 'string', 'max:20'],
            'privilege'      => ['nullable', 'string', 'max:50'],
            'status_pegawai' => ['required', Rule::in(['Aktif', 'Nonaktif'])],
            'tgl_masuk_kerja' => ['nullable', 'date'],
            'tgl_akhir_kontrak' => ['nullable', 'date'],
            'role'           => ['required', 'string', 'exists:roles,name'],
        ]);

        DB::transaction(function () use ($validated, $karyawan) {
            $role = $validated['role'];
            unset($validated['role']);

            $karyawan->update($validated);

            if ($karyawan->user) {
                $karyawan->user->syncRoles($role);
            }
        });

        return Redirect::route('karyawan.index')->with('success', 'Data karyawan berhasil diperbarui.');
    }

    public function destroy(Karyawan $karyawan)
    {
        DB::transaction(function () use ($karyawan) {
            if ($karyawan->user) {
                $karyawan->user->syncRoles([]);
            }
            $karyawan->delete();
        });

        return Redirect::route('karyawan.index')->with('success', 'Data karyawan berhasil dihapus.');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv'
        ]);

        Excel::import(new KaryawanImport, $request->file('file'));

        return redirect()->route('karyawan.index')->with('success', 'Data karyawan berhasil diimport dari Excel.');
    }
}
