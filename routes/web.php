<?php

use App\Http\Controllers\CategoryItemController;
use App\Http\Controllers\CustomerAddressController;
use App\Http\Controllers\DepartemenController;
use App\Http\Controllers\MasterKonversiController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\TypeItemController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\MasterItemController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});



Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/suppliers', [SupplierController::class, 'index']);
    Route::post('/suppliers', [SupplierController::class, 'store']);
    Route::put('/suppliers/{id}', [SupplierController::class, 'update']);
    Route::delete('/suppliers/{id}', [SupplierController::class, 'destroy']);
});

Route::middleware(['auth', 'verified'])->group(function () {
   Route::get('/units', [UnitController::class, 'index']);
    Route::post('/units', [UnitController::class, 'store']);
    Route::put('/units/{id}', [UnitController::class, 'update']);
    Route::delete('/units/{id}', [UnitController::class, 'destroy']);
});

Route::middleware(['auth', 'verified'])->group(function () {
   Route::get('/typeItems', [TypeItemController::class, 'index']);
    Route::post('/typeItems', [TypeItemController::class, 'store']);
    Route::put('/typeItems/{id}', [TypeItemController::class, 'update']);
    Route::delete('/typeItems/{id}', [TypeItemController::class, 'destroy']);
});

Route::middleware(['auth', 'verified'])->group(function () {
   Route::get('/customerAddresses', [CustomerAddressController::class, 'index']);
    Route::post('/customerAddresses', [CustomerAddressController::class, 'store']);
    Route::put('/customerAddresses/{id}', [CustomerAddressController::class, 'update']);
    Route::delete('/customerAddresses/{id}', [CustomerAddressController::class, 'destroy']);

    Route::get('/masterKonversis', [MasterKonversiController::class, 'index']);
    Route::post('/masterKonversis', [MasterKonversiController::class, 'store']);
    Route::put('/masterKonversis/{id}', [MasterKonversiController::class, 'update']);
    Route::delete('/masterKonversis/{id}', [MasterKonversiController::class, 'destroy']);

    Route::get('/categoryItems', [CategoryItemController::class, 'index']);
    Route::post('/categoryItems', [CategoryItemController::class, 'store']);
    Route::put('/categoryItems/{id}', [CategoryItemController::class, 'update']);
    Route::delete('/categoryItems/{id}', [CategoryItemController::class, 'destroy']);

    Route::get('/masterItems', [MasterItemController::class, 'index'])->name('master-items.index');
    Route::get('/masterItems/create', [MasterItemController::class, 'create'])->name('master-items.create');
    Route::post('/masterItems', [MasterItemController::class, 'store'])->name('master-items.store');
    Route::get('/masterItems/{id}/edit', [MasterItemController::class, 'edit'])->name('master-items.edit');
    Route::put('/masterItems/{id}', [MasterItemController::class, 'update'])->name('master-items.update');
    Route::delete('/masterItems/{id}', [MasterItemController::class, 'destroy']);
    Route::get('/api/type-items', [MasterItemController::class, 'getTypeItems'])->name('api.type-items');

    Route::get('/departemens', [DepartemenController::class, 'index']);
    Route::post('/departemens', [DepartemenController::class, 'store']);
    Route::put('/departemens/{id}', [DepartemenController::class, 'update']);
    Route::delete('/departemens/{id}', [DepartemenController::class, 'destroy']);

});



Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
