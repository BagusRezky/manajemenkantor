<?php

use App\Http\Controllers\SupplierController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/suppliers', [SupplierController::class, 'index'])->name('supplier');
Route::post('/suppliers', [SupplierController::class, 'store'])->name('supplier.store');
Route::get('/suppliers/{id}', [SupplierController::class, 'show'])->name('supplier.show');
Route::put('/suppliers/{id}', [SupplierController::class, 'update'])->name('supplier.update');
Route::delete('/suppliers/{id}', [SupplierController::class, 'destroy'])->name('supplier.destroy');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
