<?php

use App\Http\Controllers\CategoryItemController;
use App\Http\Controllers\CustomerAddressController;
use App\Http\Controllers\DepartemenController;
use App\Http\Controllers\MasterKonversiController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\TypeItemController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\MasterItemController;
use App\Http\Controllers\FinishGoodItemController;
use App\Http\Controllers\SalesOrderController;
use App\Http\Controllers\KartuInstruksiKerjaController;
use App\Http\Controllers\PurchaseRequestController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\PenerimaanBarangController;
use App\Http\Controllers\ReturEksternalController;
use App\Http\Controllers\InternalMaterialRequestController;
use App\Http\Controllers\MaterialStockController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
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

    Route::get('/suppliers', [SupplierController::class, 'index']);
    Route::post('/suppliers', [SupplierController::class, 'store']);
    Route::put('/suppliers/{id}', [SupplierController::class, 'update']);
    Route::delete('/suppliers/{id}', [SupplierController::class, 'destroy']);

    Route::get('/units', [UnitController::class, 'index']);
    Route::post('/units', [UnitController::class, 'store']);
    Route::put('/units/{id}', [UnitController::class, 'update']);
    Route::delete('/units/{id}', [UnitController::class, 'destroy']);

    Route::get('/categoryItems', [CategoryItemController::class, 'index']);
    Route::post('/categoryItems', [CategoryItemController::class, 'store']);
    Route::put('/categoryItems/{id}', [CategoryItemController::class, 'update']);
    Route::delete('/categoryItems/{id}', [CategoryItemController::class, 'destroy']);

    Route::get('/typeItems', [TypeItemController::class, 'index']);
    Route::post('/typeItems', [TypeItemController::class, 'store']);
    Route::put('/typeItems/{id}', [TypeItemController::class, 'update']);
    Route::delete('/typeItems/{id}', [TypeItemController::class, 'destroy']);

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

    Route::get('/finishGoodItems', [FinishGoodItemController::class, 'index'])->name('finishGoodItems.index');
    Route::get('/finishGoodItems/create', [FinishGoodItemController::class, 'create'])->name('finishGoodItems.create');
    Route::post('/finishGoodItems', [FinishGoodItemController::class, 'store'])->name('finishGoodItems.store');
    Route::get('/finishGoodItems/{id}/edit', [FinishGoodItemController::class, 'edit'])->name('finishGoodItems.edit');
    Route::put('/finishGoodItems/{id}', [FinishGoodItemController::class, 'update'])->name('finishGoodItems.update');
    Route::delete('/finishGoodItems/{id}', [FinishGoodItemController::class, 'destroy'])->name('finishGoodItems.destroy');
    Route::get('/finishGoodItems/cut-off', [FinishGoodItemController::class, 'cutOff'])->name('finishGoodItems.cutOff');
    Route::post('/finishGoodItems/{id}/restore', [FinishGoodItemController::class, 'restore'])->name('finishGoodItems.restore');
    Route::delete('/finishGoodItems/{id}/force-delete', [FinishGoodItemController::class, 'forceDelete'])->name('finishGoodItems.forceDelete');
    Route::get('/finishGoodItems/{id}/detail', [FinishGoodItemController::class, 'detail'])->name('finishGoodItems.detail');

    Route::get('/salesOrders', [SalesOrderController::class, 'index'])->name('salesOrders.index');
    Route::get('/salesOrders/create', [SalesOrderController::class, 'create'])->name('salesOrders.create');
    Route::post('/salesOrders', [SalesOrderController::class, 'store'])->name('salesOrders.store');
    Route::get('/salesOrders/{id}/edit', [SalesOrderController::class, 'edit'])->name('salesOrders.edit');
    Route::put('/salesOrders/{id}', [SalesOrderController::class, 'update'])->name('salesOrders.update');
    Route::delete('/salesOrders/{id}', [SalesOrderController::class, 'destroy'])->name('salesOrders.destroy');
    Route::get('/salesOrders/{id}/pdf', [SalesOrderController::class, 'generatePdf']);

    // Routes untuk Kartu Instruksi Kerja
    Route::get('/kartuInstruksiKerja', [KartuInstruksiKerjaController::class, 'index'])->name('kartuInstruksiKerja.index');
    Route::get('/kartuInstruksiKerja/create', [KartuInstruksiKerjaController::class, 'create'])->name('kartuInstruksiKerja.create');
    Route::post('/kartuInstruksiKerja', [KartuInstruksiKerjaController::class, 'store'])->name('kartuInstruksiKerja.store');
    Route::get('/kartuInstruksiKerja/{id}/edit', [KartuInstruksiKerjaController::class, 'edit'])->name('kartuInstruksiKerja.edit');
    Route::put('/kartuInstruksiKerja/{id}', [KartuInstruksiKerjaController::class, 'update'])->name('kartuInstruksiKerja.update');
    Route::delete('/kartuInstruksiKerja/{id}', [KartuInstruksiKerjaController::class, 'destroy'])->name('kartuInstruksiKerja.destroy');
    Route::get('/kartuInstruksiKerja/{id}', [KartuInstruksiKerjaController::class, 'show'])->name('kartuInstruksiKerja.show');
    Route::get('/salesOrderData/{id}', [KartuInstruksiKerjaController::class, 'getSalesOrderData'])->name('salesOrderData.show');
    Route::get('/kartuInstruksiKerja/{id}/pdf', [KartuInstruksiKerjaController::class, 'generatePdf'])->name('kartuInstruksiKerja.pdf');


    Route::get('/purchaseRequest', [PurchaseRequestController::class, 'index'])->name('purchaseRequest.index');
    Route::get('/purchaseRequest/create', [PurchaseRequestController::class, 'create'])->name('purchaseRequest.create');
    Route::post('/purchaseRequest', [PurchaseRequestController::class, 'store'])->name('purchaseRequest.store');
    Route::get('/purchaseRequest/{id}', [PurchaseRequestController::class, 'show'])->name('purchaseRequest.show');
    Route::get('/purchaseRequest/{id}/detail', [PurchaseRequestController::class, 'detail'])->name('purchaseRequest.detail');
    Route::get('/purchaseRequest/{id}/edit', [PurchaseRequestController::class, 'edit'])->name('purchaseRequest.edit');
    Route::put('/purchaseRequest/{id}', [PurchaseRequestController::class, 'update'])->name('purchaseRequest.update');
    Route::delete('/purchaseRequest/{id}', [PurchaseRequestController::class, 'destroy'])->name('purchaseRequest.destroy');
    Route::post('purchaseRequest/{id}/authorize', [PurchaseRequestController::class, 'authorize'])->name('purchaseRequest.authorize');
    Route::get('/purchaseRequest/{id}/pdf', [PurchaseRequestController::class, 'generatePdf'])->name('purchaseRequest.pdf');

    Route::get('/purchaseOrders', [PurchaseOrderController::class, 'index'])->name('purchaseOrders.index');
    Route::get('/purchaseOrders/create', [PurchaseOrderController::class, 'create'])->name('purchaseOrders.create');
    Route::get('purchaseOrders/getPurchaseRequestItems/{id}/items', [PurchaseOrderController::class, 'getPurchaseRequestItems'])->name('purchaseOrders.getPurchaseRequestItems');
    Route::get('purchaseOrders/getUnitConversions/{itemId}/{unitId}', [PurchaseOrderController::class, 'getUnitConversions'])->name('purchaseOrders.getUnitConversions');
    Route::post('/purchaseOrders', [PurchaseOrderController::class, 'store'])->name('purchaseOrders.store');
    Route::get('/purchaseOrders/{id}', [PurchaseOrderController::class, 'show'])->name('purchaseOrders.show');
    Route::delete('/purchaseOrders/{id}', [PurchaseOrderController::class, 'destroy'])->name('purchaseOrders.destroy');
    Route::get('/purchaseOrders/{purchaseOrder}/edit', [PurchaseOrderController::class, 'edit'])->name('purchaseOrders.edit');
    Route::put('/purchaseOrders/{purchaseOrder}', [PurchaseOrderController::class, 'update'])->name('purchaseOrders.update');
    Route::get('/purchaseOrders/{id}/pdf', [PurchaseOrderController::class, 'generatePdf'])->name('purchaseOrders.pdf');


    Route::get('/penerimaanBarangs', [PenerimaanBarangController::class, 'index'])->name('penerimaanBarangs.index');
    Route::get('/penerimaanBarangs/create', [PenerimaanBarangController::class, 'create'])->name('penerimaanBarangs.create');
    Route::post('/penerimaanBarangs', [PenerimaanBarangController::class, 'store'])->name('penerimaanBarangs.store');
    Route::get('/penerimaanBarangs/{id}', [PenerimaanBarangController::class, 'show'])->name('penerimaanBarangs.show');
    Route::get('/penerimaanBarangs/{id}/pdf', [PenerimaanBarangController::class, 'generatePdf'])->name('penerimaanBarangs.pdf');

    Route::get('/returEksternals', [ReturEksternalController::class, 'index'])->name('returEksternals.index');
    Route::get('/returEksternals/create', [ReturEksternalController::class, 'create'])->name('returEksternals.create');
    Route::post('/returEksternals', [ReturEksternalController::class, 'store'])->name('returEksternals.store');
    Route::get('/returEksternals/{id}', [ReturEksternalController::class, 'show'])->name('returEksternals.show');
    Route::get('/returEksternals/{id}/edit', [ReturEksternalController::class, 'edit'])->name('returEksternals.edit');
    Route::put('/returEksternals/{id}', [ReturEksternalController::class, 'update'])->name('returEksternals.update');
    Route::delete('/returEksternals/{id}', [ReturEksternalController::class, 'destroy'])->name('returEksternals.destroy');
    Route::get('/returEksternals/{id}/pdf', [ReturEksternalController::class, 'generatePdf'])->name('returEksternals.pdf');
    Route::get('/penerimaan-barang/{id}/details', [ReturEksternalController::class, 'getPenerimaanBarangDetails'])->name('penerimaanBarang.details');

    Route::get('/internalMaterialRequests', [InternalMaterialRequestController::class, 'index'])->name('internalMaterialRequests.index');
    Route::get('/internalMaterialRequests/create', [InternalMaterialRequestController::class, 'create'])->name('internalMaterialRequests.create');
    Route::post('/internalMaterialRequests', [InternalMaterialRequestController::class, 'store'])->name('internalMaterialRequests.store');
    Route::get('/internalMaterialRequests/{id}', [InternalMaterialRequestController::class, 'show'])->name('internalMaterialRequests.show');
    Route::get('/internalMaterialRequests/{id}/edit', [InternalMaterialRequestController::class, 'edit'])->name('internalMaterialRequests.edit');
    Route::put('/internalMaterialRequests/{id}', [InternalMaterialRequestController::class, 'update'])->name('internalMaterialRequests.update');
    Route::get('/internalMaterialRequests/{id}/approve', [InternalMaterialRequestController::class, 'showApproval'])->name('internalMaterialRequests.showApproval');
    Route::post('/internalMaterialRequests/{id}/approve', [InternalMaterialRequestController::class, 'approve'])->name('internalMaterialRequests.approve');
    Route::delete('/internalMaterialRequests/{id}', [InternalMaterialRequestController::class, 'destroy'])->name('internalMaterialRequests.destroy');
    Route::get('/internalMaterialRequests/{id}/pdf', [InternalMaterialRequestController::class, 'generatePdf'])->name('internalMaterialRequests.pdf');

    Route::get('/materialStocks', [MaterialStockController::class, 'index'])->name('materialStocks.index');
    Route::get('/materialStocks/pdf', [MaterialStockController::class, 'generatePdf'])->name('materialStocks.pdf');
    Route::get('/materialStocks/{id}/details', [MaterialStockController::class, 'getStockDetails'])->name('materialStocks.details');
});



Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
