<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

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
}
