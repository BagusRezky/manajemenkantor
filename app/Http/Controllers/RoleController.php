<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;

class RoleController extends Controller
{
    public function index()
    {
        // Ambil semua peran dengan izin yang terkait
        $roles = Role::with('permissions')->get();

        // Ambil semua izin
        $permissions = Permission::all();

        return Inertia::render('role/roles', [
            'roles' => $roles,
            'permissions' => $permissions
        ]);
    }

 /**
     * Menyimpan role baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:50', 'unique:roles,name'],
            'permissions' => ['array'],
            'permissions.*' => ['string', Rule::exists('permissions', 'name')],
        ]);

        DB::transaction(function () use ($validated) {
            $role = Role::create(['name' => $validated['name']]);

            if (!empty($validated['permissions'])) {
                $role->syncPermissions($validated['permissions']);
            }
        });

        return Redirect::route('roles.index')->with('success', 'Role berhasil ditambahkan.');
    }

    /**
     * Update role yang ada.
     */
    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:50', Rule::unique('roles')->ignore($role->id)],
            'permissions' => ['array'],
            'permissions.*' => ['string', Rule::exists('permissions', 'name')],
        ]);

        DB::transaction(function () use ($validated, $role) {
            $role->update(['name' => $validated['name']]);

            // Sinkronisasi izin
            $role->syncPermissions($validated['permissions'] ?? []);
        });

        return Redirect::route('roles.index')->with('success', 'Role berhasil diperbarui.');
    }

    /**
     * Hapus role.
     */
    public function destroy(Role $role)
    {
        DB::transaction(function () use ($role) {
            // Hapus semua permission yang melekat
            $role->syncPermissions([]);
            $role->delete();
        });

        return Redirect::route('roles.index')->with('success', 'Role berhasil dihapus.');
    }
}
