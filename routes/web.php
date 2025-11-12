<?php

use App\Http\Controllers\CategoryItemController;
use App\Http\Controllers\CustomerAddressController;
use App\Http\Controllers\DepartemenController;
use App\Http\Controllers\DieMakingController;
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
use App\Http\Controllers\MesinController;
use App\Http\Controllers\MesinDiemakingController;
use App\Http\Controllers\OperatorController;
use App\Http\Controllers\PrintingController;
use App\Http\Controllers\OperatorDiemakingController;
use App\Http\Controllers\OperatorFinishingController;
use App\Http\Controllers\MesinFinishingController;
use App\Http\Controllers\FinishingController;
use App\Http\Controllers\PackagingController;
use App\Http\Controllers\SuratJalanController;
use App\Http\Controllers\ImrDiemakingController;
use App\Http\Controllers\ImrFinishingController;
use App\Http\Controllers\BlokirController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\SubcountOutController;
use App\Http\Controllers\SubcountInController;
use App\Http\Controllers\ReturInternalController;
use App\Http\Controllers\PaymentEntryGoodController;
use App\Http\Controllers\KaryawanController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\AbsenController;
use App\Http\Controllers\IzinController;
use App\Http\Controllers\LemburController;
use App\Http\Controllers\HariLiburController;
use App\Http\Controllers\BonusKaryawanController;
use App\Http\Controllers\PembayaranPinjamanController;
use App\Http\Controllers\PotonganTunjanganController;
use App\Http\Controllers\PengajuanPinjamanController;
use App\Http\Controllers\CutiController;
use App\Http\Controllers\GajiController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

// Route untuk halaman notifikasi persetujuan admin
Route::get('/approval-notice', function () {
    return Inertia::render('auth/approval-notice');
})->name('approval.notice');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Rute-rute yang sudah ada
    Route::get('/customerAddresses', [CustomerAddressController::class, 'index'])->name('customerAddresses.index')->middleware('permission:customerAddresses.index');
    Route::post('/customerAddresses', [CustomerAddressController::class, 'store'])->name('customerAddresses.store')->middleware('permission:customerAddresses.store');
    Route::put('/customerAddresses/{id}', [CustomerAddressController::class, 'update'])->name('customerAddresses.update')->middleware('permission:customerAddresses.update');
    Route::delete('/customerAddresses/{id}', [CustomerAddressController::class, 'destroy'])->name('customerAddresses.destroy')->middleware('permission:customerAddresses.destroy');
    Route::post('/customerAddresses/import', [CustomerAddressController::class, 'import'])->name('customerAddresses.import')->middleware('permission:customerAddresses.import');

    Route::get('/masterKonversis', [MasterKonversiController::class, 'index'])->name('masterKonversis.index')->middleware('permission:masterKonversis.index');
    Route::post('/masterKonversis', [MasterKonversiController::class, 'store'])->name('masterKonversis.store')->middleware('permission:masterKonversis.store');
    Route::put('/masterKonversis/{id}', [MasterKonversiController::class, 'update'])->name('masterKonversis.update')->middleware('permission:masterKonversis.update');
    Route::delete('/masterKonversis/{id}', [MasterKonversiController::class, 'destroy'])->name('masterKonversis.destroy')->middleware('permission:masterKonversis.destroy');

    Route::get('/suppliers', [SupplierController::class, 'index'])->name('suppliers.index')->middleware('permission:suppliers.index');
    Route::post('/suppliers', [SupplierController::class, 'store'])->name('suppliers.store')->middleware('permission:suppliers.store');
    Route::put('/suppliers/{id}', [SupplierController::class, 'update'])->name('suppliers.update')->middleware('permission:suppliers.update');
    Route::delete('/suppliers/{id}', [SupplierController::class, 'destroy'])->name('suppliers.destroy')->middleware('permission:suppliers.destroy');
    Route::post('/suppliers/import', [SupplierController::class, 'import'])->name('suppliers.import')->middleware('permission:suppliers.import');

    Route::get('/units', [UnitController::class, 'index'])->name('units.index')->middleware('permission:units.index');
    Route::post('/units', [UnitController::class, 'store'])->name('units.store')->middleware('permission:units.store');
    Route::put('/units/{id}', [UnitController::class, 'update'])->name('units.update')->middleware('permission:units.update');
    Route::delete('/units/{id}', [UnitController::class, 'destroy'])->name('units.destroy')->middleware('permission:units.destroy');

    Route::get('/categoryItems', [CategoryItemController::class, 'index'])->name('categoryItems.index')->middleware('permission:categoryItems.index');
    Route::post('/categoryItems', [CategoryItemController::class, 'store'])->name('categoryItems.store')->middleware('permission:categoryItems.store');
    Route::put('/categoryItems/{id}', [CategoryItemController::class, 'update'])->name('categoryItems.update')->middleware('permission:categoryItems.update');
    Route::delete('/categoryItems/{id}', [CategoryItemController::class, 'destroy'])->name('categoryItems.destroy')->middleware('permission:categoryItems.destroy');

    Route::get('/typeItems', [TypeItemController::class, 'index'])->name('typeItems.index')->middleware('permission:typeItems.index');
    Route::post('/typeItems', [TypeItemController::class, 'store'])->name('typeItems.store')->middleware('permission:typeItems.store');
    Route::put('/typeItems/{id}', [TypeItemController::class, 'update'])->name('typeItems.update')->middleware('permission:typeItems.update');
    Route::delete('/typeItems/{id}', [TypeItemController::class, 'destroy'])->name('typeItems.destroy')->middleware('permission:typeItems.destroy');

    Route::get('/masterItems', [MasterItemController::class, 'index'])->name('master-items.index')->middleware('permission:master-items.index');
    Route::get('/masterItems/create', [MasterItemController::class, 'create'])->name('master-items.create')->middleware('permission:master-items.create');
    Route::post('/masterItems', [MasterItemController::class, 'store'])->name('master-items.store')->middleware('permission:master-items.store');
    Route::get('/masterItems/{id}/edit', [MasterItemController::class, 'edit'])->name('master-items.edit')->middleware('permission:master-items.edit');
    Route::put('/masterItems/{id}', [MasterItemController::class, 'update'])->name('master-items.update')->middleware('permission:master-items.update');
    Route::delete('/masterItems/{id}', [MasterItemController::class, 'destroy'])->middleware('permission:master-items.destroy');
    Route::get('/api/type-items', [MasterItemController::class, 'getTypeItems'])->name('api.type-items');

    Route::get('/departemens', [DepartemenController::class, 'index'])->middleware('permission:departemens.index');
    Route::post('/departemens', [DepartemenController::class, 'store'])->middleware('permission:departemens.store');
    Route::put('/departemens/{id}', [DepartemenController::class, 'update'])->middleware('permission:departemens.update');
    Route::delete('/departemens/{id}', [DepartemenController::class, 'destroy'])->middleware('permission:departemens.destroy');
    Route::post('/departemens/import', [DepartemenController::class, 'import'])->name('departemens.import')->middleware('permission:departemens.import');

    Route::get('/finishGoodItems', [FinishGoodItemController::class, 'index'])->name('finishGoodItems.index')->middleware('permission:finishGoodItems.index');
    Route::get('/finishGoodItems/create', [FinishGoodItemController::class, 'create'])->name('finishGoodItems.create')->middleware('permission:finishGoodItems.create');
    Route::post('/finishGoodItems', [FinishGoodItemController::class, 'store'])->name('finishGoodItems.store')->middleware('permission:finishGoodItems.store');
    Route::get('/finishGoodItems/{id}/edit', [FinishGoodItemController::class, 'edit'])->name('finishGoodItems.edit')->middleware('permission:finishGoodItems.edit');
    Route::put('/finishGoodItems/{id}', [FinishGoodItemController::class, 'update'])->name('finishGoodItems.update')->middleware('permission:finishGoodItems.update');
    Route::delete('/finishGoodItems/{id}', [FinishGoodItemController::class, 'destroy'])->name('finishGoodItems.destroy')->middleware('permission:finishGoodItems.destroy');
    Route::get('/finishGoodItems/cut-off', [FinishGoodItemController::class, 'cutOff'])->name('finishGoodItems.cutOff')->middleware('permission:finishGoodItems.cutOff');
    Route::post('/finishGoodItems/{id}/restore', [FinishGoodItemController::class, 'restore'])->name('finishGoodItems.restore')->middleware('permission:finishGoodItems.restore');
    Route::delete('/finishGoodItems/{id}/force-delete', [FinishGoodItemController::class, 'forceDelete'])->name('finishGoodItems.forceDelete')->middleware('permission:finishGoodItems.forceDelete');
    Route::get('/finishGoodItems/{id}/detail', [FinishGoodItemController::class, 'detail'])->name('finishGoodItems.detail')->middleware('permission:finishGoodItems.detail');

    Route::get('/salesOrders', [SalesOrderController::class, 'index'])->name('salesOrders.index')->middleware('permission:salesOrders.index');
    Route::get('/salesOrders/create', [SalesOrderController::class, 'create'])->name('salesOrders.create')->middleware('permission:salesOrders.create');
    Route::post('/salesOrders', [SalesOrderController::class, 'store'])->name('salesOrders.store')->middleware('permission:salesOrders.store');
    Route::get('/salesOrders/{id}/edit', [SalesOrderController::class, 'edit'])->name('salesOrders.edit')->middleware('permission:salesOrders.edit');
    Route::put('/salesOrders/{id}', [SalesOrderController::class, 'update'])->name('salesOrders.update')->middleware('permission:salesOrders.update');
    Route::delete('/salesOrders/{id}', [SalesOrderController::class, 'destroy'])->name('salesOrders.destroy')->middleware('permission:salesOrders.destroy');
    Route::get('/salesOrders/{id}/pdf', [SalesOrderController::class, 'generatePdf'])->middleware('permission:salesOrders.pdf');

    // Routes untuk Surat Perintah Kerja
    Route::get('/kartuInstruksiKerja', [KartuInstruksiKerjaController::class, 'index'])->name('kartuInstruksiKerja.index')->middleware('permission:kartuInstruksiKerja.index');
    Route::get('/kartuInstruksiKerja/create', [KartuInstruksiKerjaController::class, 'create'])->name('kartuInstruksiKerja.create')->middleware('permission:kartuInstruksiKerja.create');
    Route::post('/kartuInstruksiKerja', [KartuInstruksiKerjaController::class, 'store'])->name('kartuInstruksiKerja.store')->middleware('permission:kartuInstruksiKerja.store');
    Route::get('/kartuInstruksiKerja/{id}/edit', [KartuInstruksiKerjaController::class, 'edit'])->name('kartuInstruksiKerja.edit')->middleware('permission:kartuInstruksiKerja.edit');
    Route::put('/kartuInstruksiKerja/{id}', [KartuInstruksiKerjaController::class, 'update'])->name('kartuInstruksiKerja.update')->middleware('permission:kartuInstruksiKerja.update');
    Route::delete('/kartuInstruksiKerja/{id}', [KartuInstruksiKerjaController::class, 'destroy'])->name('kartuInstruksiKerja.destroy')->middleware('permission:kartuInstruksiKerja.destroy');
    Route::get('/kartuInstruksiKerja/{id}', [KartuInstruksiKerjaController::class, 'show'])->name('kartuInstruksiKerja.show')->middleware('permission:kartuInstruksiKerja.show');
    Route::get('/salesOrderData/{id}', [KartuInstruksiKerjaController::class, 'getSalesOrderData'])->name('salesOrderData.show')->middleware('permission:salesOrderData.show');
    Route::get('/kartuInstruksiKerja/{id}/pdf', [KartuInstruksiKerjaController::class, 'generatePdf'])->name('kartuInstruksiKerja.pdf')->middleware('permission:kartuInstruksiKerja.pdf');


    Route::get('/purchaseRequest', [PurchaseRequestController::class, 'index'])->name('purchaseRequest.index')->middleware('permission:purchaseRequest.index');
    Route::get('/purchaseRequest/create', [PurchaseRequestController::class, 'create'])->name('purchaseRequest.create')->middleware('permission:purchaseRequest.create');
    Route::post('/purchaseRequest', [PurchaseRequestController::class, 'store'])->name('purchaseRequest.store')->middleware('permission:purchaseRequest.store');
    Route::get('/purchaseRequest/{id}', [PurchaseRequestController::class, 'show'])->name('purchaseRequest.show')->middleware('permission:purchaseRequest.show');
    Route::get('/purchaseRequest/{id}/detail', [PurchaseRequestController::class, 'detail'])->name('purchaseRequest.detail')->middleware('permission:purchaseRequest.detail');
    Route::get('/purchaseRequest/{id}/edit', [PurchaseRequestController::class, 'edit'])->name('purchaseRequest.edit')->middleware('permission:purchaseRequest.edit');
    Route::put('/purchaseRequest/{id}', [PurchaseRequestController::class, 'update'])->name('purchaseRequest.update')->middleware('permission:purchaseRequest.update');
    Route::delete('/purchaseRequest/{id}', [PurchaseRequestController::class, 'destroy'])->name('purchaseRequest.destroy')->middleware('permission:purchaseRequest.destroy');
    Route::post('purchaseRequest/{id}/authorize', [PurchaseRequestController::class, 'authorize'])->name('purchaseRequest.authorize')->middleware('permission:purchaseRequest.authorize');
    Route::get('/purchaseRequest/{id}/pdf', [PurchaseRequestController::class, 'generatePdf'])->name('purchaseRequest.pdf')->middleware('permission:purchaseRequest.pdf');

    Route::get('/purchaseOrders', [PurchaseOrderController::class, 'index'])->name('purchaseOrders.index')->middleware('permission:purchaseOrders.index');
    Route::get('/purchaseOrders/create', [PurchaseOrderController::class, 'create'])->name('purchaseOrders.create')->middleware('permission:purchaseOrders.create');
    Route::get('purchaseOrders/getPurchaseRequestItems/{id}/items', [PurchaseOrderController::class, 'getPurchaseRequestItems'])->name('purchaseOrders.getPurchaseRequestItems')->middleware('permission:purchaseOrders.getPurchaseRequestItems');
    Route::get('purchaseOrders/getUnitConversions/{itemId}/{unitId}', [PurchaseOrderController::class, 'getUnitConversions'])->name('purchaseOrders.getUnitConversions')->middleware('permission:purchaseOrders.getUnitConversions');
    Route::post('/purchaseOrders', [PurchaseOrderController::class, 'store'])->name('purchaseOrders.store')->middleware('permission:purchaseOrders.store');
    Route::get('/purchaseOrders/{id}', [PurchaseOrderController::class, 'show'])->name('purchaseOrders.show')->middleware('permission:purchaseOrders.show');
    Route::delete('/purchaseOrders/{id}', [PurchaseOrderController::class, 'destroy'])->name('purchaseOrders.destroy')->middleware('permission:purchaseOrders.destroy');
    Route::get('/purchaseOrders/{purchaseOrder}/edit', [PurchaseOrderController::class, 'edit'])->name('purchaseOrders.edit')->middleware('permission:purchaseOrders.edit');
    Route::put('/purchaseOrders/{purchaseOrder}', [PurchaseOrderController::class, 'update'])->name('purchaseOrders.update')->middleware('permission:purchaseOrders.update');
    Route::get('/purchaseOrders/{id}/pdf', [PurchaseOrderController::class, 'generatePdf'])->name('purchaseOrders.pdf')->middleware('permission:purchaseOrders.pdf');


    Route::get('/penerimaanBarangs', [PenerimaanBarangController::class, 'index'])->name('penerimaanBarangs.index')->middleware('permission:penerimaanBarangs.index');
    Route::get('/penerimaanBarangs/create', [PenerimaanBarangController::class, 'create'])->name('penerimaanBarangs.create')->middleware('permission:penerimaanBarangs.create');
    Route::post('/penerimaanBarangs', [PenerimaanBarangController::class, 'store'])->name('penerimaanBarangs.store')->middleware('permission:penerimaanBarangs.store');
    Route::get('/penerimaanBarangs/{id}', [PenerimaanBarangController::class, 'show'])->name('penerimaanBarangs.show')->middleware('permission:penerimaanBarangs.show');
    Route::get('/penerimaanBarangs/{id}/pdf', [PenerimaanBarangController::class, 'generatePdf'])->name('penerimaanBarangs.pdf')->middleware('permission:penerimaanBarangs.pdf');

    Route::get('/returEksternals', [ReturEksternalController::class, 'index'])->name('returEksternals.index')->middleware('permission:returEksternals.index');
    Route::get('/returEksternals/create', [ReturEksternalController::class, 'create'])->name('returEksternals.create')->middleware('permission:returEksternals.create');
    Route::post('/returEksternals', [ReturEksternalController::class, 'store'])->name('returEksternals.store')->middleware('permission:returEksternals.store');
    Route::get('/returEksternals/{id}', [ReturEksternalController::class, 'show'])->name('returEksternals.show')->middleware('permission:returEksternals.show');
    Route::get('/returEksternals/{id}/edit', [ReturEksternalController::class, 'edit'])->name('returEksternals.edit')->middleware('permission:returEksternals.edit');
    Route::put('/returEksternals/{id}', [ReturEksternalController::class, 'update'])->name('returEksternals.update')->middleware('permission:returEksternals.update');
    Route::delete('/returEksternals/{id}', [ReturEksternalController::class, 'destroy'])->name('returEksternals.destroy')->middleware('permission:returEksternals.destroy');
    Route::get('/returEksternals/{id}/pdf', [ReturEksternalController::class, 'generatePdf'])->name('returEksternals.pdf')->middleware('permission:returEksternals.pdf');
    Route::get('/penerimaan-barang/{id}/details', [ReturEksternalController::class, 'getPenerimaanBarangDetails'])->name('penerimaanBarang.details')->middleware('permission:penerimaanBarang.details');

    Route::get('/internalMaterialRequests', [InternalMaterialRequestController::class, 'index'])->name('internalMaterialRequests.index')->middleware('permission:internalMaterialRequests.index');
    Route::get('/internalMaterialRequests/create', [InternalMaterialRequestController::class, 'create'])->name('internalMaterialRequests.create')->middleware('permission:internalMaterialRequests.create');
    Route::post('/internalMaterialRequests', [InternalMaterialRequestController::class, 'store'])->name('internalMaterialRequests.store')->middleware('permission:internalMaterialRequests.store');
    Route::get('/internalMaterialRequests/{id}', [InternalMaterialRequestController::class, 'show'])->name('internalMaterialRequests.show')->middleware('permission:internalMaterialRequests.show');
    Route::get('/internalMaterialRequests/{id}/edit', [InternalMaterialRequestController::class, 'edit'])->name('internalMaterialRequests.edit')->middleware('permission:internalMaterialRequests.edit');
    Route::put('/internalMaterialRequests/{id}', [InternalMaterialRequestController::class, 'update'])->name('internalMaterialRequests.update')->middleware('permission:internalMaterialRequests.update');
    Route::get('/internalMaterialRequests/{id}/approve', [InternalMaterialRequestController::class, 'showApproval'])->name('internalMaterialRequests.showApproval')->middleware('permission:internalMaterialRequests.showApproval');
    Route::post('/internalMaterialRequests/{id}/approve', [InternalMaterialRequestController::class, 'approve'])->name('internalMaterialRequests.approve')->middleware('permission:internalMaterialRequests.approve');
    Route::delete('/internalMaterialRequests/{id}', [InternalMaterialRequestController::class, 'destroy'])->name('internalMaterialRequests.destroy')->middleware('permission:internalMaterialRequests.destroy');
    Route::get('/internalMaterialRequests/{id}/pdf', [InternalMaterialRequestController::class, 'generatePdf'])->name('internalMaterialRequests.pdf')->middleware('permission:internalMaterialRequests.pdf');

    Route::get('/materialStocks', [MaterialStockController::class, 'index'])->name('materialStocks.index')->middleware('permission:materialStocks.index');

    Route::get('/mesins', [MesinController::class, 'index'])->name('mesins.index')->middleware('permission:mesins.index');
    Route::post('/mesins', [MesinController::class, 'store'])->name('mesins.store')->middleware('permission:mesins.store');
    Route::put('/mesins/{id}', [MesinController::class, 'update'])->name('mesins.update')->middleware('permission:mesins.update');
    Route::delete('/mesins/{id}', [MesinController::class, 'destroy'])->name('mesins.destroy')->middleware('permission:mesins.destroy');
    Route::get('/mesins/{id}/show', [MesinController::class, 'show'])->name('mesins.show')->middleware('permission:mesins.show');

    Route::get('/operators', [OperatorController::class, 'index'])->name('operators.index')->middleware('permission:operators.index');
    Route::post('/operators', [OperatorController::class, 'store'])->name('operators.store')->middleware('permission:operators.store');
    Route::put('/operators/{id}', [OperatorController::class, 'update'])->name('operators.update')->middleware('permission:operators.update');
    Route::delete('/operators/{id}', [OperatorController::class, 'destroy'])->name('operators.destroy')->middleware('permission:operators.destroy');
    Route::get('/operators/{id}/show', [OperatorController::class, 'show'])->name('operators.show')->middleware('permission:operators.show');

    Route::get('/printings', [PrintingController::class, 'index'])->name('printings.index')->middleware('permission:printings.index');
    Route::get('/printings/create', [PrintingController::class, 'create'])->name('printings.create')->middleware('permission:printings.create');
    Route::post('/printings', [PrintingController::class, 'store'])->name('printings.store')->middleware('permission:printings.store');
    Route::get('/printings/{printing}/edit', [PrintingController::class, 'edit'])->name('printings.edit')->middleware('permission:printings.edit');
    Route::put('/printings/{printing}', [PrintingController::class, 'update'])->name('printings.update')->middleware('permission:printings.update');
    Route::delete('/printings/{printing}', [PrintingController::class, 'destroy'])->name('printings.destroy')->middleware('permission:printings.destroy');
    Route::get('/printings/{printing}/pdf', [PrintingController::class, 'pdf'])->name('printings.pdf')->middleware('permission:printings.pdf');
    Route::get('/printings/{printing}/show', [PrintingController::class, 'show'])->name('printings.show')->middleware('permission:printings.show');
    Route::get('/printings/{printing}/detail', [PrintingController::class, 'detail'])->name('printings.detail')->middleware('permission:printings.detail');

    Route::get('/dieMakings', [DieMakingController::class, 'index'])->name('dieMakings.index')->middleware('permission:dieMakings.index');
    Route::get('/dieMakings/create', [DieMakingController::class, 'create'])->name('dieMakings.create')->middleware('permission:dieMakings.create');
    Route::post('/dieMakings', [DieMakingController::class, 'store'])->name('dieMakings.store')->middleware('permission:dieMakings.store');
    Route::delete('/dieMakings/{dieMaking}', [DieMakingController::class, 'destroy'])->name('dieMakings.destroy')->middleware('permission:dieMakings.destroy');

    Route::get('/mesinDiemakings', [MesinDiemakingController::class, 'index'])->name('mesinDiemakings.index')->middleware('permission:mesinDiemakings.index');
    Route::post('/mesinDiemakings', [MesinDiemakingController::class, 'store'])->name('mesinDiemakings.store')->middleware('permission:mesinDiemakings.store');
    Route::put('/mesinDiemakings/{mesinDiemaking}', [MesinDiemakingController::class, 'update'])->name('mesinDiemakings.update')->middleware('permission:mesinDiemakings.update');
    Route::delete('/mesinDiemakings/{mesinDiemaking}', [MesinDiemakingController::class, 'destroy'])->name('mesinDiemakings.destroy')->middleware('permission:mesinDiemakings.destroy');
    Route::get('/mesinDiemakings/{mesinDiemaking}/show', [MesinDiemakingController::class, 'show'])->name('mesinDiemakings.show')->middleware('permission:mesinDiemakings.show');

    Route::get('/operatorDiemakings', [OperatorDiemakingController::class, 'index'])->name('operatorDiemakings.index')->middleware('permission:operatorDiemakings.index');
    Route::post('/operatorDiemakings', [OperatorDiemakingController::class, 'store'])->name('operatorDiemakings.store')->middleware('permission:operatorDiemakings.store');
    Route::put('/operatorDiemakings/{operatorDiemaking}', [OperatorDiemakingController::class, 'update'])->name('operatorDiemakings.update')->middleware('permission:operatorDiemakings.update');
    Route::delete('/operatorDiemakings/{operatorDiemaking}', [OperatorDiemakingController::class, 'destroy'])->name('operatorDiemakings.destroy')->middleware('permission:operatorDiemakings.destroy');
    Route::get('/operatorDiemakings/{operatorDiemaking}/show', [OperatorDiemakingController::class, 'show'])->name('operatorDiemakings.show')->middleware('permission:operatorDiemakings.show');

    Route::get('/operatorFinishings', [OperatorFinishingController::class, 'index'])->name('operatorFinishings.index')->middleware('permission:operatorFinishings.index');
    Route::post('/operatorFinishings', [OperatorFinishingController::class, 'store'])->name('operatorFinishings.store')->middleware('permission:operatorFinishings.store');
    Route::put('/operatorFinishings/{operatorFinishing}', [OperatorFinishingController::class, 'update'])->name('operatorFinishings.update')->middleware('permission:operatorFinishings.update');
    Route::delete('/operatorFinishings/{operatorFinishing}', [OperatorFinishingController::class, 'destroy'])->name('operatorFinishings.destroy')->middleware('permission:operatorFinishings.destroy');
    Route::get('/operatorFinishings/{operatorFinishing}/show', [OperatorFinishingController::class, 'show'])->name('operatorFinishings.show')->middleware('permission:operatorFinishings.show');

    Route::get('/mesinFinishings', [MesinFinishingController::class, 'index'])->name('mesinFinishings.index')->middleware('permission:mesinFinishings.index');
    Route::post('/mesinFinishings', [MesinFinishingController::class, 'store'])->name('mesinFinishings.store')->middleware('permission:mesinFinishings.store');
    Route::put('/mesinFinishings/{mesinFinishing}', [MesinFinishingController::class, 'update'])->name('mesinFinishings.update')->middleware('permission:mesinFinishings.update');
    Route::delete('/mesinFinishings/{mesinFinishing}', [MesinFinishingController::class, 'destroy'])->name('mesinFinishings.destroy')->middleware('permission:mesinFinishings.destroy');
    Route::get('/mesinFinishings/{mesinFinishing}/show', [MesinFinishingController::class, 'show'])->name('mesinFinishings.show')->middleware('permission:mesinFinishings.show');

    Route::get('/finishings', [FinishingController::class, 'index'])->name('finishings.index')->middleware('permission:finishings.index');
    Route::get('/finishings/create', [FinishingController::class, 'create'])->name('finishings.create')->middleware('permission:finishings.create');
    Route::post('/finishings', [FinishingController::class, 'store'])->name('finishings.store')->middleware('permission:finishings.store');
    Route::get('/finishings/{finishing}/edit', [FinishingController::class, 'edit'])->name('finishings.edit')->middleware('permission:finishings.edit');
    Route::put('/finishings/{finishing}', [FinishingController::class, 'update'])->name('finishings.update')->middleware('permission:finishings.update');
    Route::delete('/finishings/{finishing}', [FinishingController::class, 'destroy'])->name('finishings.destroy')->middleware('permission:finishings.destroy');
    Route::get('/finishings/{finishing}/pdf', [FinishingController::class, 'generatePdf'])->name('finishings.pdf')->middleware('permission:finishings.pdf');
    Route::get('/finishings/{finishing}/show', [FinishingController::class, 'show'])->name('finishings.show')->middleware('permission:finishings.show');
    Route::get('/finishings/{finishing}/detail', [FinishingController::class, 'detail'])->name('finishings.detail')->middleware('permission:finishings.detail');

    Route::get('/packagings', [PackagingController::class, 'index'])->name('packagings.index')->middleware('permission:packagings.index');
    Route::get('/packagings/create', [PackagingController::class, 'create'])->name('packagings.create')->middleware('permission:packagings.create');
    Route::post('/packagings', [PackagingController::class, 'store'])->name('packagings.store')->middleware('permission:packagings.store');
    Route::get('/packagings/{packaging}/edit', [PackagingController::class, 'edit'])->name('packagings.edit')->middleware('permission:packagings.edit');
    Route::put('/packagings/{packaging}', [PackagingController::class, 'update'])->name('packagings.update')->middleware('permission:packagings.update');
    Route::delete('/packagings/{packaging}', [PackagingController::class, 'destroy'])->name('packagings.destroy')->middleware('permission:packagings.destroy');
    Route::get('/packagings/{packaging}/show', [PackagingController::class, 'show'])->name('packagings.show')->middleware('permission:packagings.show');
    //Route::get('/packagings/{packaging}/pdf', [PackagingController::class, 'generatePdf'])->name('packagings.pdf');
    Route::get('/packagings/{packaging}/pdf', [PackagingController::class, 'generatePdf'])->name('packagings.pdf')->middleware('permission:packagings.pdf');
    Route::get('/packagings/label-start-number/{kikId}/{packagingId}', [PackagingController::class, 'getLabelStartNumber'])->name('packagings.labelStartNumber')->middleware('permission:packagings.labelStartNumber');

    Route::get('/suratJalans', [SuratJalanController::class, 'index'])->name('suratJalans.index')->middleware('permission:suratJalans.index');
    Route::get('/suratJalans/create', [SuratJalanController::class, 'create'])->name('suratJalans.create')->middleware('permission:suratJalans.create');
    Route::post('/suratJalans', [SuratJalanController::class, 'store'])->name('suratJalans.store')->middleware('permission:suratJalans.store');
    Route::get('/suratJalans/{suratJalan}/edit', [SuratJalanController::class, 'edit'])->name('suratJalans.edit')->middleware('permission:suratJalans.edit');
    Route::put('/suratJalans/{suratJalan}', [SuratJalanController::class, 'update'])->name('suratJalans.update')->middleware('permission:suratJalan.update');
    Route::delete('/suratJalans/{suratJalan}', [SuratJalanController::class, 'destroy'])->name('suratJalans.destroy')->middleware('permission:suratJalans.destroy');
    Route::get('/suratJalans/{suratJalan}', [SuratJalanController::class, 'show'])->name('suratJalans.show')->middleware('permission:suratJalans.show');
    Route::get('/suratJalans/{suratJalan}/pdf', [SuratJalanController::class, 'generatePdf'])->name('suratJalans.pdf')->middleware('permission:suratJalans.pdf');
    Route::get('kartuInstruksiKerjas/{kartuInstruksiKerja}/customer-address', [SuratJalanController::class, 'getCustomerAddress'])->name('kartuInstruksiKerjas.customer-address')->middleware('permission:kartuInstruksiKerjas.customer-address');

    Route::get('/imrDiemakings', [ImrDiemakingController::class, 'index'])->name('imrDiemakings.index')->middleware('permission:imrDiemakings.index');
    Route::get('/imrDiemakings/create', [ImrDiemakingController::class, 'create'])->name('imrDiemakings.create')->middleware('permission:imrDiemakings.create');
    Route::post('/imrDiemakings', [ImrDiemakingController::class, 'store'])->name('imrDiemakings.store')->middleware('permission:imrDiemakings.store');
    Route::get('/imrDiemakings/{imrDiemaking}/edit', [ImrDiemakingController::class, 'edit'])->name('imrDiemakings.edit')->middleware('permission:imrDiemakings.edit');
    Route::put('/imrDiemakings/{imrDiemaking}', [ImrDiemakingController::class, 'update'])->name('imrDiemakings.update')->middleware('permission:imrDiemakings.update');
    Route::delete('/imrDiemakings/{imrDiemaking}', [ImrDiemakingController::class, 'destroy'])->name('imrDiemakings.destroy')->middleware('permission:imrDiemakings.destroy');
    Route::get('/imrDiemakings/{imrDiemaking}', [ImrDiemakingController::class, 'show'])->name('imrDiemakings.show')->middleware('permission:imrDiemakings.show');
    Route::get('/imrDiemakings/{imrDiemaking}/pdf', [ImrDiemakingController::class, 'generatePdf'])->name('imrDiemakings.pdf')->middleware('permission:imrDiemakings.pdf');
    Route::get('/imrDiemakings/{id}/approve', [ImrDiemakingController::class, 'showApproval'])->name('imrDiemakings.showApproval')->middleware('permission:imrDiemakings.showApproval');
    Route::post('/imrDiemakings/{id}/approve', [ImrDiemakingController::class, 'approve'])->name('imrDiemakings.approve')->middleware('permission:imrDiemakings.approve');

    Route::get('/imrFinishings', [ImrFinishingController::class, 'index'])->name('imrFinishings.index')->middleware('permission:imrFinishings.index');
    Route::get('/imrFinishings/create', [ImrFinishingController::class, 'create'])->name('imrFinishings.create')->middleware('permission:imrFinishings.create');
    Route::post('/imrFinishings', [ImrFinishingController::class, 'store'])->name('imrFinishings.store')->middleware('permission:imrFinishings.store');
    Route::get('/imrFinishings/{imrFinishing}/edit', [ImrFinishingController::class, 'edit'])->name('imrFinishings.edit')->middleware('permission:imrFinishings.edit');
    Route::put('/imrFinishings/{imrFinishing}', [ImrFinishingController::class, 'update'])->name('imrFinishings.update')->middleware('permission:imrFinishings.update');
    Route::delete('/imrFinishings/{imrFinishing}', [ImrFinishingController::class, 'destroy'])->name('imrFinishings.destroy')->middleware('permission:imrFinishings.destroy');
    Route::get('/imrFinishings/{imrFinishing}', [ImrFinishingController::class, 'show'])->name('imrFinishings.show')->middleware('permission:imrFinishings.show');
    Route::get('/imrFinishings/{imrFinishing}/pdf', [ImrFinishingController::class, 'generatePdf'])->name('imrFinishings.pdf')->middleware('permission:imrFinishings.pdf');
    Route::get('/imrFinishings/{id}/approve', [ImrFinishingController::class, 'showApproval'])->name('imrFinishings.showApproval')->middleware('permission:imrFinishings.showApproval');
    Route::post('/imrFinishings/{id}/approve', [ImrFinishingController::class, 'approve'])->name('imrFinishings.approve')->middleware('permission:imrFinishings.approve');

    Route::get('/blokirs', [BlokirController::class, 'index'])->name('blokirs.index')->middleware('permission:blokirs.index');
    Route::get('/blokirs/create', [BlokirController::class, 'create'])->name('blokirs.create')->middleware('permission:blokirs.create');
    Route::post('/blokirs', [BlokirController::class, 'store'])->name('blokirs.store')->middleware('permission:blokirs.store');
    Route::get('/blokirs/{blokir}/edit', [BlokirController::class, 'edit'])->name('blokirs.edit')->middleware('permission:blokirs.edit');
    Route::put('/blokirs/{blokir}', [BlokirController::class, 'update'])->name('blokirs.update')->middleware('permission:blokirs.update');
    Route::delete('/blokirs/{blokir}', [BlokirController::class, 'destroy'])->name('blokirs.destroy')->middleware('permission:blokirs.destroy');
    Route::get('/blokirs/{blokir}', [BlokirController::class, 'show'])->name('blokirs.show')->middleware('permission:blokirs.show');
    Route::get('/blokirs/{blokir}/pdf', [BlokirController::class, 'generatePdf'])->name('blokirs.pdf')->middleware('permission:blokirs.pdf');

    Route::get('/invoices', [InvoiceController::class, 'index'])->name('invoices.index')->middleware('permission:invoices.index');
    Route::get('/invoices/create', [InvoiceController::class, 'create'])->name('invoices.create')->middleware('permission:invoices.create');
    Route::post('/invoices', [InvoiceController::class, 'store'])->name('invoices.store')->middleware('permission:invoices.store');
    Route::get('/invoices/{invoice}/edit', [InvoiceController::class, 'edit'])->name('invoices.edit')->middleware('permission:invoices.edit');
    Route::put('/invoices/{invoice}', [InvoiceController::class, 'update'])->name('invoices.update')->middleware('permission:invoices.update');
    Route::delete('/invoices/{invoice}', [InvoiceController::class, 'destroy'])->name('invoices.destroy')->middleware('permission:invoices.destroy');
    Route::get('/invoices/{invoice}', [InvoiceController::class, 'show'])->name('invoices.show')->middleware('permission:invoices.show');
    Route::get('/invoices/{invoice}/pdf', [InvoiceController::class, 'generatePdf'])->name('invoices.pdf')->middleware('permission:invoices.pdf');

    Route::get('/subcountOuts', [SubcountOutController::class, 'index'])->name('subcountOuts.index')->middleware('permission:subcountOuts.index');
    Route::get('/subcountOuts/create', [SubcountOutController::class, 'create'])->name('subcountOuts.create')->middleware('permission:subcountOuts.create');
    Route::post('/subcountOuts', [SubcountOutController::class, 'store'])->name('subcountOuts.store')->middleware('permission:subcountOuts.store');
    Route::get('/subcountOuts/{subcountOut}/edit', [SubcountOutController::class, 'edit'])->name('subcountOuts.edit')->middleware('permission:subcountOuts.edit');
    Route::put('/subcountOuts/{subcountOut}', [SubcountOutController::class, 'update'])->name('subcountOuts.update')->middleware('permission:subcountOuts.update');
    Route::delete('/subcountOuts/{subcountOut}', [SubcountOutController::class, 'destroy'])->name('subcountOuts.destroy')->middleware('permission:subcountOuts.destroy');
    Route::get('/subcountOuts/{subcountOut}', [SubcountOutController::class, 'show'])->name('subcountOuts.show')->middleware('permission:subcountOuts.show');
    Route::get('/subcountOuts/{subcountOut}/pdf', [SubcountOutController::class, 'generatePdf'])->name('subcountOuts.pdf')->middleware('permission:subcountOuts.pdf');

    Route::get('/subcountIns', [SubcountInController::class, 'index'])->name('subcountIns.index')->middleware('permission:subcountIns.index');
    Route::get('/subcountIns/create', [SubcountInController::class, 'create'])->name('subcountIns.create')->middleware('permission:subcountIns.create');
    Route::post('/subcountIns', [SubcountInController::class, 'store'])->name('subcountIns.store')->middleware('permission:subcountIns.store');
    Route::get('/subcountIns/{subcountIn}/edit', [SubcountInController::class, 'edit'])->name('subcountIns.edit')->middleware('permission:subcountIns.edit');
    Route::put('/subcountIns/{subcountIn}', [SubcountInController::class, 'update'])->name('subcountIns.update')->middleware('permission:subcountIns.update');
    Route::delete('/subcountIns/{subcountIn}', [SubcountInController::class, 'destroy'])->name('subcountIns.destroy')->middleware('permission:subcountIns.destroy');
    Route::get('/subcountIns/{subcountIn}', [SubcountInController::class, 'show'])->name('subcountIns.show')->middleware('permission:subcountIns.show');
    Route::get('/subcountIns/{subcountIn}/pdf', [SubcountInController::class, 'generatePdf'])->name('subcountIns.pdf')->middleware('permission:subcountIns.pdf');

    Route::get('/returInternals', [ReturInternalController::class, 'index'])->name('returInternals.index')->middleware('permission:returInternals.index');
    Route::get('/returInternals/create', [ReturInternalController::class, 'create'])->name('returInternals.create')->middleware('permission:returInternals.create');
    Route::post('/returInternals', [ReturInternalController::class, 'store'])->name('returInternals.store')->middleware('permission:returInternals.store');
    Route::get('/returInternals/{returInternal}/edit', [ReturInternalController::class, 'edit'])->name('returInternals.edit')->middleware('permission:returInternals.edit');
    Route::put('/returInternals/{returInternal}', [ReturInternalController::class, 'update'])->name('returInternals.update')->middleware('permission:returInternals.update');
    Route::delete('/returInternals/{returInternal}', [ReturInternalController::class, 'destroy'])->name('returInternals.destroy')->middleware('permission:returInternals.destroy');
    Route::get('/returInternals/{returInternal}', [ReturInternalController::class, 'show'])->name('returInternals.show')->middleware('permission:returInternals.show');
    Route::get('/returInternals/{returInternal}/pdf', [ReturInternalController::class, 'generatePdf'])->name('returInternals.pdf')->middleware('permission:returInternals.pdf');

    Route::get('/paymentEntryGoods', [PaymentEntryGoodController::class, 'index'])->name('paymentEntryGoods.index')->middleware('permission:paymentEntryGoods.index');
    Route::get('/paymentEntryGoods/create', [PaymentEntryGoodController::class, 'create'])->name('paymentEntryGoods.create')->middleware('permission:paymentEntryGoods.create');
    Route::post('/paymentEntryGoods', [PaymentEntryGoodController::class, 'store'])->name('paymentEntryGoods.store')->middleware('permission:paymentEntryGoods.store');
    Route::get('/paymentEntryGoods/{paymentEntryGood}/edit', [PaymentEntryGoodController::class, 'edit'])->name('paymentEntryGoods.edit')->middleware('permission:paymentEntryGoods.edit');
    Route::put('/paymentEntryGoods/{paymentEntryGood}', [PaymentEntryGoodController::class, 'update'])->name('paymentEntryGoods.update')->middleware('permission:paymentEntryGoods.update');
    Route::delete('/paymentEntryGoods/{paymentEntryGood}', [PaymentEntryGoodController::class, 'destroy'])->name('paymentEntryGoods.destroy')->middleware('permission:paymentEntryGoods.destroy');
    Route::get('/paymentEntryGoods/{paymentEntryGood}', [PaymentEntryGoodController::class, 'show'])->name('paymentEntryGoods.show')->middleware('permission:paymentEntryGoods.show');
    Route::get('/paymentEntryGoods/{paymentEntryGood}/pdf', [PaymentEntryGoodController::class, 'pdf'])->name('paymentEntryGoods.pdf')->middleware('permission:paymentEntryGoods.pdf');

    // --- Penambahan Rute untuk Manajemen Admin ---
    Route::middleware('role:admin')->group(function () {
        // Rute untuk Master Karyawan
        Route::get('/karyawans', [KaryawanController::class, 'index'])->name('karyawan.index');
        Route::post('/karyawans', [KaryawanController::class, 'store'])->name('karyawan.store');
        Route::get('/karyawans/{karyawan}/edit', [KaryawanController::class, 'edit'])->name('karyawan.edit');
        Route::put('/karyawans/{karyawan}', [KaryawanController::class, 'update'])->name('karyawan.update');
        Route::delete('/karyawans/{karyawan}', [KaryawanController::class, 'destroy'])->name('karyawan.destroy');
        // Rute untuk mengupdate status karyawan
        Route::post('/karyawans/{karyawan}/update-status', [KaryawanController::class, 'updateStatus'])->name('karyawan.updateStatus');
        Route::post('/karyawans/import', [KaryawanController::class, 'import'])->name('karyawan.import');


        // Rute untuk Manajemen Roles dan Permissions
        Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
        Route::post('/roles', [RoleController::class, 'store'])->name('roles.store');
        Route::put('/roles/{role}', [RoleController::class, 'update'])->name('roles.update');
        Route::delete('/roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');

        Route::get('/absens', [AbsenController::class, 'index'])->name('absens.index')->middleware('permission:absens.index');
        Route::get('/absens/create', [AbsenController::class, 'create'])->name('absens.create')->middleware('permission:absens.create');
        Route::post('/absens', [AbsenController::class, 'store'])->name('absens.store')->middleware('permission:absens.store');
        Route::get('/absens/{absen}/edit', [AbsenController::class, 'edit'])->name('absens.edit')->middleware('permission:absens.edit');
        Route::put('/absens/{absen}', [AbsenController::class, 'update'])->name('absens.update')->middleware('permission:absens.update');
        Route::post('/absens/import', [AbsenController::class, 'import'])->name('absens.import')->middleware('permission:absens.import');
        Route::get('/absens/reports', [AbsenController::class, 'report'])->name('absens.report')->middleware('permission:absens.report');
        Route::get('/absens/rekap', [AbsenController::class, 'rekap'])->name('absens.rekap')->middleware('permission:absens.rekap');
        Route::delete('/absens/delete-periode', [AbsenController::class, 'deleteByPeriod'])->name('absens.deletePeriode')->middleware('permission:absens.deletePeriode');


        Route::get('/lemburs', [LemburController::class, 'index'])->name('lemburs.index')->middleware('permission:lemburs.index');
        Route::get('/lemburs/create', [LemburController::class, 'create'])->name('lemburs.create')->middleware('permission:lemburs.create');
        Route::post('/lemburs', [LemburController::class, 'store'])->name('lemburs.store')->middleware('permission:lemburs.store');
        Route::get('/lemburs/{lembur}/edit', [LemburController::class, 'edit'])->name('lemburs.edit')->middleware('permission:lemburs.edit');
        Route::put('/lemburs/{lembur}', [LemburController::class, 'update'])->name('lemburs.update')->middleware('permission:lemburs.update');
        Route::delete('/lemburs/{lembur}', [LemburController::class, 'destroy'])->name('lemburs.destroy')->middleware('permission:lemburs.destroy');

        Route::get('/izins', [IzinController::class, 'index'])->name('izins.index')->middleware('permission:izins.index');
        Route::get('/izins/create', [IzinController::class, 'create'])->name('izins.create')->middleware('permission:izins.create');
        Route::post('/izins', [IzinController::class, 'store'])->name('izins.store')->middleware('permission:izins.store');
        Route::get('/izins/{izin}/edit', [IzinController::class, 'edit'])->name('izins.edit')->middleware('permission:izins.edit');
        Route::put('/izins/{izin}', [IzinController::class, 'update'])->name('izins.update')->middleware('permission:izins.update');
        Route::delete('/izins/{izin}', [IzinController::class, 'destroy'])->name('izins.destroy')->middleware('permission:izins.destroy');

        Route::get('/hariLiburs', [HariLiburController::class, 'index'])->name('hariLiburs.index')->middleware('permission:hariLiburs.index');
        Route::get('/hariLiburs/create', [HariLiburController::class, 'create'])->name('hariLiburs.create')->middleware('permission:hariLiburs.create');
        Route::post('/hariLiburs', [HariLiburController::class, 'store'])->name('hariLiburs.store')->middleware('permission:hariLiburs.store');
        Route::get('/hariLiburs/{hariLibur}/edit', [HariLiburController::class, 'edit'])->name('hariLiburs.edit')->middleware('permission:hariLiburs.edit');
        Route::put('/hariLiburs/{hariLibur}', [HariLiburController::class, 'update'])->name('hariLiburs.update')->middleware('permission:hariLiburs.update');
        Route::delete('/hariLiburs/{hariLibur}', [HariLiburController::class, 'destroy'])->name('hariLiburs.destroy')->middleware('permission:hariLiburs.destroy');

        Route::get('/bonusKaryawans', [BonusKaryawanController::class, 'index'])->name('bonusKaryawans.index')->middleware('permission:bonusKaryawans.index');
        Route::get('/bonusKaryawans/create', [BonusKaryawanController::class, 'create'])->name('bonusKaryawans.create')->middleware('permission:bonusKaryawans.create');
        Route::post('/bonusKaryawans', [BonusKaryawanController::class, 'store'])->name('bonusKaryawans.store')->middleware('permission:bonusKaryawans.store');
        Route::get('/bonusKaryawans/{bonusKaryawan}/edit', [BonusKaryawanController::class, 'edit'])->name('bonusKaryawans.edit')->middleware('permission:bonusKaryawans.edit');
        Route::put('/bonusKaryawans/{bonusKaryawan}', [BonusKaryawanController::class, 'update'])->name('bonusKaryawans.update')->middleware('permission:bonusKaryawans.update');
        Route::delete('/bonusKaryawans/{bonusKaryawan}', [BonusKaryawanController::class, 'destroy'])->name('bonusKaryawans.destroy')->middleware('permission:bonusKaryawans.destroy');

        Route::get('/potonganTunjangans', [PotonganTunjanganController::class, 'index'])->name('potonganTunjangans.index')->middleware('permission:potonganTunjangans.index');
        Route::get('/potonganTunjangans/create', [PotonganTunjanganController::class, 'create'])->name('potonganTunjangans.create')->middleware('permission:potonganTunjangans.create');
        Route::post('/potonganTunjangans', [PotonganTunjanganController::class, 'store'])->name('potonganTunjangans.store')->middleware('permission:potonganTunjangans.store');
        Route::get('/potonganTunjangans/{potonganTunjangan}/edit', [PotonganTunjanganController::class, 'edit'])->name('potonganTunjangans.edit')->middleware('permission:potonganTunjangans.edit');
        Route::put('/potonganTunjangans/{potonganTunjangan}', [PotonganTunjanganController::class, 'update'])->name('potonganTunjangans.update')->middleware('permission:potonganTunjangans.update');
        Route::delete('/potonganTunjangans/{potonganTunjangan}', [PotonganTunjanganController::class, 'destroy'])->name('potonganTunjangans.destroy')->middleware('permission:potonganTunjangans.destroy');

        Route::get('/pengajuanPinjamans', [PengajuanPinjamanController::class, 'index'])->name('pengajuanPinjamans.index')->middleware('permission:pengajuanPinjamans.index');
        Route::get('/pengajuanPinjamans/create', [PengajuanPinjamanController::class, 'create'])->name('pengajuanPinjamans.create')->middleware('permission:pengajuanPinjamans.create');
        Route::post('/pengajuanPinjamans', [PengajuanPinjamanController::class, 'store'])->name('pengajuanPinjamans.store')->middleware('permission:pengajuanPinjamans.store');
        Route::get('/pengajuanPinjamans/{pengajuanPinjaman}/edit', [PengajuanPinjamanController::class, 'edit'])->name('pengajuanPinjamans.edit')->middleware('permission:pengajuanPinjamans.edit');
        Route::put('/pengajuanPinjamans/{pengajuanPinjaman}', [PengajuanPinjamanController::class, 'update'])->name('pengajuanPinjamans.update')->middleware('permission:pengajuanPinjamans.update');
        Route::delete('/pengajuanPinjamans/{pengajuanPinjaman}', [PengajuanPinjamanController::class, 'destroy'])->name('pengajuanPinjamans.destroy')->middleware('permission:pengajuanPinjamans.destroy');

        Route::get('/pembayaranPinjamans', [PembayaranPinjamanController::class, 'index'])->name('pembayaranPinjamans.index')->middleware('permission:pembayaranPinjamans.index');
        Route::get('/pembayaranPinjamans/create', [PembayaranPinjamanController::class, 'create'])->name('pembayaranPinjamans.create')->middleware('permission:pembayaranPinjamans.create');
        Route::post('/pembayaranPinjamans', [PembayaranPinjamanController::class, 'store'])->name('pembayaranPinjamans.store')->middleware('permission:pembayaranPinjamans.store');
        Route::get('/pembayaranPinjamans/{pembayaranPinjaman}/edit', [PembayaranPinjamanController::class, 'edit'])->name('pembayaranPinjamans.edit')->middleware('permission:pembayaranPinjamans.edit');
        Route::put('/pembayaranPinjamans/{pembayaranPinjaman}', [PembayaranPinjamanController::class, 'update'])->name('pembayaranPinjamans.update')->middleware('permission:pembayaranPinjamans.update');
        Route::delete('/pembayaranPinjamans/{pembayaranPinjaman}', [PembayaranPinjamanController::class, 'destroy'])->name('pembayaranPinjamans.destroy')->middleware('permission:pembayaranPinjamans.destroy');
        Route::get('/pembayaranPinjamans/rekap', [PembayaranPinjamanController::class, 'rekap'])->name('pembayaranPinjamans.rekap')->middleware('permission:pembayaranPinjamans.rekap');

        Route::get('/cutis', [CutiController::class, 'index'])->name('cutis.index')->middleware('permission:cutis.index');
        Route::get('/cutis/create', [CutiController::class, 'create'])->name('cutis.create')->middleware('permission:cutis.create');
        Route::post('/cutis', [CutiController::class, 'store'])->name('cutis.store')->middleware('permission:cutis.store');
        Route::get('/cutis/{cuti}/edit', [CutiController::class, 'edit'])->name('cutis.edit')->middleware('permission:cutis.edit');
        Route::put('/cutis/{cuti}', [CutiController::class, 'update'])->name('cutis.update')->middleware('permission:cutis.update');
        Route::delete('/cutis/{cuti}', [CutiController::class, 'destroy'])->name('cutis.destroy')->middleware('permission:cutis.destroy');
        Route::get('/cutiTahunan', [CutiController::class, 'cutiTahunan'])->name('cutiTahunan.index')->middleware('permission:cutiTahunan.index');

        Route::get('/gajis', [GajiController::class, 'index'])->name('gajis.index')->middleware('permission:gajis.index');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
