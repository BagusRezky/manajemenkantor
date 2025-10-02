<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Membuat roles
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        // $superAdminRole = Role::firstOrCreate(['name' => 'super-admin']);
        // $printingRole = Role::firstOrCreate(['name' => 'printing']);
        // $ppicRole = Role::firstOrCreate(['name' => 'ppic']);

        // Mendapatkan semua rute dengan nama
        $routes = collect(Route::getRoutes())->filter(function ($route) {
            return $route->getName();
        });

        // Membuat permissions dari nama rute
        $permissions = $routes->map(function ($route) {
            return Permission::firstOrCreate(['name' => $route->getName()]);
        })->toArray();

        // Berikan semua permissions kepada role 'admin'
        $adminRole->givePermissionTo(Permission::all());

        // // Contoh: Berikan permission spesifik ke role 'printing'
        // $printingRole->givePermissionTo([
        //     'printings.index',
        //     'printings.create',
        //     'printings.store',
        //     'printings.show',
        //     'mesins.index',
        //     'mesins.store',
        //     'mesins.show',
        //     'operators.index',
        //     'operators.store',
        //     'operators.show',
        // ]);

        // // Tambahkan permissions spesifik untuk role 'ppic'
        // $ppicRole->givePermissionTo([
        //     'kartuInstruksiKerja.index',
        //     'kartuInstruksiKerja.create',
        //     'kartuInstruksiKerja.store',
        //     'kartuInstruksiKerja.edit',
        //     'kartuInstruksiKerja.update',
        //     'kartuInstruksiKerja.destroy',
        //     'kartuInstruksiKerja.show',
        //     'salesOrderData.show',
        //     'kartuInstruksiKerja.pdf',
        // ]);

         // Cek apakah user admin sudah ada sebelum membuat
        $adminUser = User::firstOrCreate(
            ['email' => 'admin2@gmail.com'],
            [
                'name' => 'admin2',
                'password' => bcrypt('password'),
            ]
        );

        // Berikan role 'admin' ke user
        if (!$adminUser->hasRole('admin')) {
            $adminUser->assignRole($adminRole);
        }
    }
}
