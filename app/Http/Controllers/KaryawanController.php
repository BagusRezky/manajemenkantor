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

class KaryawanController extends Controller
{
    public function index()
    {
        // Ambil semua data karyawan dengan relasi user dan peran
        $karyawans = Karyawan::with('user.roles')->get();

        // Ambil semua peran untuk ditampilkan di dropdown saat memberikan peran
        $roles = Role::all();

        // Ambil semua user yang belum memiliki data karyawan
        $unassignedUsers = User::whereDoesntHave('karyawan')->get();

        return Inertia::render('karyawan/karyawans', [
            'karyawans' => $karyawans,
            'roles' => $roles,
            'unassignedUsers' => $unassignedUsers,
        ]);
    }

    /**
     * Menyimpan data karyawan baru ke database.
     */
    public function store(Request $request)
    {
        // Validasi input dari form
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id', 'unique:karyawans,user_id'],
            'nik' => ['required', 'string', 'max:20', 'unique:karyawans,nik'],
            'npwp' => ['nullable', 'string', 'max:25'],
            'tgl_lahir' => ['nullable', 'date'],
            'alamat' => ['nullable', 'string', 'max:255'],
            'telp' => ['nullable', 'string', 'max:15'],
            'tanggal_masuk' => ['required', 'date'],
            'status' => ['required', Rule::in(['Aktif', 'Non Aktif'])],
            'role' => ['required', 'string', 'exists:roles,name'],
        ]);

        // Gunakan DB transaction untuk memastikan semua query berhasil atau tidak sama sekali
        DB::transaction(function () use ($validated) {
            // Buat record karyawan baru
            Karyawan::create($validated);

            // Cari user yang bersangkutan
            $user = User::find($validated['user_id']);

            // Assign role ke user tersebut
            // syncRoles akan menghapus role lama dan mengganti dengan yang baru
            if ($user) {
                $user->syncRoles($validated['role']);
            }
        });

        // Redirect kembali ke halaman index
        return Redirect::route('karyawan.index')->with('success', 'Karyawan berhasil ditambahkan.');
    }

    /**
     * Memperbarui data karyawan yang ada di database.
     */
    public function update(Request $request, Karyawan $karyawan)
    {
        // Validasi input dari form
        $validated = $request->validate([
            // user_id tidak perlu divalidasi saat update karena tidak diubah
            'nik' => ['required', 'string', 'max:20', Rule::unique('karyawans')->ignore($karyawan->id)],
            'npwp' => ['nullable', 'string', 'max:25'],
            'tgl_lahir' => ['nullable', 'date'],
            'alamat' => ['nullable', 'string', 'max:255'],
            'telp' => ['nullable', 'string', 'max:15'],
            'tanggal_masuk' => ['required', 'date'],
            'status' => ['required', Rule::in(['Aktif', 'Non Aktif'])],
            'role' => ['required', 'string', 'exists:roles,name'],
        ]);

        // Gunakan DB transaction untuk konsistensi data
        DB::transaction(function () use ($validated, $karyawan) {
            // Update data karyawan
            $karyawan->update($validated);

            // Update role pada user yang berelasi
            // Pastikan user-nya ada sebelum mencoba update role
            if ($karyawan->user) {
                $karyawan->user->syncRoles($validated['role']);
            }
        });

        return Redirect::route('karyawan.index')->with('success', 'Data karyawan berhasil diperbarui.');
    }

    /**
     * Menghapus data karyawan dari database.
     * (Opsional, jika Anda membutuhkan fungsi hapus)
     */
    public function destroy(Karyawan $karyawan)
    {
        // Sebaiknya, saat menghapus karyawan, role dari user-nya juga dihapus
        // Namun user-nya sendiri tidak dihapus
        DB::transaction(function () use ($karyawan) {
            if ($karyawan->user) {
                // Hapus semua role dari user tersebut
                $karyawan->user->syncRoles([]);
            }

            // Hapus data karyawan
            $karyawan->delete();
        });

        return Redirect::route('karyawan.index')->with('success', 'Data karyawan berhasil dihapus.');
    }
}
