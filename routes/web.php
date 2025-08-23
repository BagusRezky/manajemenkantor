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

    // Routes untuk Surat Perintah Kerja
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

    Route::get('/mesins', [MesinController::class, 'index'])->name('mesins.index');
    Route::post('/mesins', [MesinController::class, 'store'])->name('mesins.store');
    Route::put('/mesins/{id}', [MesinController::class, 'update'])->name('mesins.update');
    Route::delete('/mesins/{id}', [MesinController::class, 'destroy'])->name('mesins.destroy');
    Route::get('/mesins/{id}/show', [MesinController::class, 'show'])->name('mesins.show');

    Route::get('/operators', [OperatorController::class, 'index'])->name('operators.index');
    Route::post('/operators', [OperatorController::class, 'store'])->name('operators.store');
    Route::put('/operators/{id}', [OperatorController::class, 'update'])->name('operators.update');
    Route::delete('/operators/{id}', [OperatorController::class, 'destroy'])->name('operators.destroy');
    Route::get('/operators/{id}/show', [OperatorController::class, 'show'])->name('operators.show');

    Route::get('/printings', [PrintingController::class, 'index'])->name('printings.index');
    Route::get('/printings/create', [PrintingController::class, 'create'])->name('printings.create');
    Route::post('/printings', [PrintingController::class, 'store'])->name('printings.store');
    Route::get('/printings/{printing}/edit', [PrintingController::class, 'edit'])->name('printings.edit');
    Route::put('/printings/{printing}', [PrintingController::class, 'update'])->name('printings.update');
    Route::delete('/printings/{printing}', [PrintingController::class, 'destroy'])->name('printings.destroy');
    Route::get('/printings/{printing}/pdf', [PrintingController::class, 'pdf'])->name('printings.pdf');
    Route::get('/printings/{printing}/show', [PrintingController::class, 'show'])->name('printings.show');
    Route::get('/printings/{printing}/detail', [PrintingController::class, 'detail'])->name('printings.detail');

    Route::get('/dieMakings', [DieMakingController::class, 'index'])->name('dieMakings.index');
    Route::get('/dieMakings/create', [DieMakingController::class, 'create'])->name('dieMakings.create');
    Route::post('/dieMakings', [DieMakingController::class, 'store'])->name('dieMakings.store');
    Route::delete('/dieMakings/{dieMaking}', [DieMakingController::class, 'destroy'])->name('dieMakings.destroy');

    Route::get('/mesinDiemakings', [MesinDiemakingController::class, 'index'])->name('mesinDiemakings.index');
    Route::post('/mesinDiemakings', [MesinDiemakingController::class, 'store'])->name('mesinDiemakings.store');
    Route::put('/mesinDiemakings/{mesinDiemaking}', [MesinDiemakingController::class, 'update'])->name('mesinDiemakings.update');
    Route::delete('/mesinDiemakings/{mesinDiemaking}', [MesinDiemakingController::class, 'destroy'])->name('mesinDiemakings.destroy');
    Route::get('/mesinDiemakings/{mesinDiemaking}/show', [MesinDiemakingController::class, 'show'])->name('mesinDiemakings.show');

    Route::get('/operatorDiemakings', [OperatorDiemakingController::class, 'index'])->name('operatorDiemakings.index');
    Route::post('/operatorDiemakings', [OperatorDiemakingController::class, 'store'])->name('operatorDiemakings.store');
    Route::put('/operatorDiemakings/{operatorDiemaking}', [OperatorDiemakingController::class, 'update'])->name('operatorDiemakings.update');
    Route::delete('/operatorDiemakings/{operatorDiemaking}', [OperatorDiemakingController::class, 'destroy'])->name('operatorDiemakings.destroy');
    Route::get('/operatorDiemakings/{operatorDiemaking}/show', [OperatorDiemakingController::class, 'show'])->name('operatorDiemakings.show');

    Route::get('/operatorFinishings', [OperatorFinishingController::class, 'index'])->name('operatorFinishings.index');
    Route::post('/operatorFinishings', [OperatorFinishingController::class, 'store'])->name('operatorFinishings.store');
    Route::put('/operatorFinishings/{operatorFinishing}', [OperatorFinishingController::class, 'update'])->name('operatorFinishings.update');
    Route::delete('/operatorFinishings/{operatorFinishing}', [OperatorFinishingController::class, 'destroy'])->name('operatorFinishings.destroy');
    Route::get('/operatorFinishings/{operatorFinishing}/show', [OperatorFinishingController::class, 'show'])->name('operatorFinishings.show');

    Route::get('/mesinFinishings', [MesinFinishingController::class, 'index'])->name('mesinFinishings.index');
    Route::post('/mesinFinishings', [MesinFinishingController::class, 'store'])->name('mesinFinishings.store');
    Route::put('/mesinFinishings/{mesinFinishing}', [MesinFinishingController::class, 'update'])->name('mesinFinishings.update');
    Route::delete('/mesinFinishings/{mesinFinishing}', [MesinFinishingController::class, 'destroy'])->name('mesinFinishings.destroy');
    Route::get('/mesinFinishings/{mesinFinishing}/show', [MesinFinishingController::class, 'show'])->name('mesinFinishings.show');

    Route::get('/finishings', [FinishingController::class, 'index'])->name('finishings.index');
    Route::get('/finishings/create', [FinishingController::class, 'create'])->name('finishings.create');
    Route::post('/finishings', [FinishingController::class, 'store'])->name('finishings.store');
    Route::get('/finishings/{finishing}/edit', [FinishingController::class, 'edit'])->name('finishings.edit');
    Route::put('/finishings/{finishing}', [FinishingController::class, 'update'])->name('finishings.update');
    Route::delete('/finishings/{finishing}', [FinishingController::class, 'destroy'])->name('finishings.destroy');
    Route::get('/finishings/{finishing}/pdf', [FinishingController::class, 'generatePdf'])->name('finishings.pdf');
    Route::get('/finishings/{finishing}/show', [FinishingController::class, 'show'])->name('finishings.show');
    Route::get('/finishings/{finishing}/detail', [FinishingController::class, 'detail'])->name('finishings.detail');

    Route::get('/packagings', [PackagingController::class, 'index'])->name('packagings.index');
    Route::get('/packagings/create', [PackagingController::class, 'create'])->name('packagings.create');
    Route::post('/packagings', [PackagingController::class, 'store'])->name('packagings.store');
    Route::get('/packagings/{packaging}/edit', [PackagingController::class, 'edit'])->name('packagings.edit');
    Route::put('/packagings/{packaging}', [PackagingController::class, 'update'])->name('packagings.update');
    Route::delete('/packagings/{packaging}', [PackagingController::class, 'destroy'])->name('packagings.destroy');
    Route::get('/packagings/{packaging}/show', [PackagingController::class, 'show'])->name('packagings.show');
    //Route::get('/packagings/{packaging}/pdf', [PackagingController::class, 'generatePdf'])->name('packagings.pdf');
    Route::get('/packagings/{packaging}/pdf', [PackagingController::class, 'generatePdf'])->name('packagings.pdf');
    Route::get('/packagings/label-start-number/{kikId}/{packagingId}', [PackagingController::class, 'getLabelStartNumber'])->name('packagings.labelStartNumber');

    Route::get('/suratJalans', [SuratJalanController::class, 'index'])->name('suratJalans.index');
    Route::get('/suratJalans/create', [SuratJalanController::class, 'create'])->name('suratJalans.create');
    Route::post('/suratJalans', [SuratJalanController::class, 'store'])->name('suratJalans.store');
    Route::get('/suratJalans/{suratJalan}/edit', [SuratJalanController::class, 'edit'])->name('suratJalans.edit');
    Route::put('/suratJalans/{suratJalan}', [SuratJalanController::class, 'update'])->name('suratJalans.update');
    Route::delete('/suratJalans/{suratJalan}', [SuratJalanController::class, 'destroy'])->name('suratJalans.destroy');
    Route::get('/suratJalans/{suratJalan}', [SuratJalanController::class, 'show'])->name('suratJalans.show');
    Route::get('/suratJalans/{suratJalan}/pdf', [SuratJalanController::class, 'generatePdf'])->name('suratJalans.pdf');
    Route::get('kartuInstruksiKerjas/{kartuInstruksiKerja}/customer-address', [SuratJalanController::class, 'getCustomerAddress'])->name('kartuInstruksiKerjas.customer-address');

    Route::get('/imrDiemakings', [ImrDiemakingController::class, 'index'])->name('imrDiemakings.index');
    Route::get('/imrDiemakings/create', [ImrDiemakingController::class, 'create'])->name('imrDiemakings.create');
    Route::post('/imrDiemakings', [ImrDiemakingController::class, 'store'])->name('imrDiemakings.store');
    Route::get('/imrDiemakings/{imrDiemaking}/edit', [ImrDiemakingController::class, 'edit'])->name('imrDiemakings.edit');
    Route::put('/imrDiemakings/{imrDiemaking}', [ImrDiemakingController::class, 'update'])->name('imrDiemakings.update');
    Route::delete('/imrDiemakings/{imrDiemaking}', [ImrDiemakingController::class, 'destroy'])->name('imrDiemakings.destroy');
    Route::get('/imrDiemakings/{imrDiemaking}', [ImrDiemakingController::class, 'show'])->name('imrDiemakings.show');
    Route::get('/imrDiemakings/{imrDiemaking}/pdf', [ImrDiemakingController::class, 'generatePdf'])->name('imrDiemakings.pdf');
    Route::get('/imrDiemakings/{id}/approve', [ImrDiemakingController::class, 'showApproval'])->name('imrDiemakings.showApproval');
    Route::post('/imrDiemakings/{id}/approve', [ImrDiemakingController::class, 'approve'])->name('imrDiemakings.approve');

    Route::get('/imrFinishings', [ImrFinishingController::class, 'index'])->name('imrFinishings.index');
    Route::get('/imrFinishings/create', [ImrFinishingController::class, 'create'])->name('imrFinishings.create');
    Route::post('/imrFinishings', [ImrFinishingController::class, 'store'])->name('imrFinishings.store');
    Route::get('/imrFinishings/{imrFinishing}/edit', [ImrFinishingController::class, 'edit'])->name('imrFinishings.edit');
    Route::put('/imrFinishings/{imrFinishing}', [ImrFinishingController::class, 'update'])->name('imrFinishings.update');
    Route::delete('/imrFinishings/{imrFinishing}', [ImrFinishingController::class, 'destroy'])->name('imrFinishings.destroy');
    Route::get('/imrFinishings/{imrFinishing}', [ImrFinishingController::class, 'show'])->name('imrFinishings.show');
    Route::get('/imrFinishings/{imrFinishing}/pdf', [ImrFinishingController::class, 'generatePdf'])->name('imrFinishings.pdf');
    Route::get('/imrFinishings/{id}/approve', [ImrFinishingController::class, 'showApproval'])->name('imrFinishings.showApproval');
    Route::post('/imrFinishings/{id}/approve', [ImrFinishingController::class, 'approve'])->name('imrFinishings.approve');

    Route::get('/blokirs', [BlokirController::class, 'index'])->name('blokirs.index');
    Route::get('/blokirs/create', [BlokirController::class, 'create'])->name('blokirs.create');
    Route::post('/blokirs', [BlokirController::class, 'store'])->name('blokirs.store');
    Route::get('/blokirs/{blokir}/edit', [BlokirController::class, 'edit'])->name('blokirs.edit');
    Route::put('/blokirs/{blokir}', [BlokirController::class, 'update'])->name('blokirs.update');
    Route::delete('/blokirs/{blokir}', [BlokirController::class, 'destroy'])->name('blokirs.destroy');
    Route::get('/blokirs/{blokir}', [BlokirController::class, 'show'])->name('blokirs.show');
    Route::get('/blokirs/{blokir}/pdf', [BlokirController::class, 'generatePdf'])->name('blokirs.pdf');

    Route::get('/invoices', [InvoiceController::class, 'index'])->name('invoices.index');
    Route::get('/invoices/create', [InvoiceController::class, 'create'])->name('invoices.create');
    Route::post('/invoices', [InvoiceController::class, 'store'])->name('invoices.store');
    Route::get('/invoices/{invoice}/edit', [InvoiceController::class, 'edit'])->name('invoices.edit');
    Route::put('/invoices/{invoice}', [InvoiceController::class, 'update'])->name('invoices.update');
    Route::delete('/invoices/{invoice}', [InvoiceController::class, 'destroy'])->name('invoices.destroy');
    Route::get('/invoices/{invoice}', [InvoiceController::class, 'show'])->name('invoices.show');
    Route::get('/invoices/{invoice}/pdf', [InvoiceController::class, 'generatePdf'])->name('invoices.pdf');

    Route::get('/subcountOuts', [SubcountOutController::class, 'index'])->name('subcountOuts.index');
    Route::get('/subcountOuts/create', [SubcountOutController::class, 'create'])->name('subcountOuts.create');
    Route::post('/subcountOuts', [SubcountOutController::class, 'store'])->name('subcountOuts.store');
    Route::get('/subcountOuts/{subcountOut}/edit', [SubcountOutController::class, 'edit'])->name('subcountOuts.edit');
    Route::put('/subcountOuts/{subcountOut}', [SubcountOutController::class, 'update'])->name('subcountOuts.update');
    Route::delete('/subcountOuts/{subcountOut}', [SubcountOutController::class, 'destroy'])->name('subcountOuts.destroy');
    Route::get('/subcountOuts/{subcountOut}', [SubcountOutController::class, 'show'])->name('subcountOuts.show');
    Route::get('/subcountOuts/{subcountOut}/pdf', [SubcountOutController::class, 'generatePdf'])->name('subcountOuts.pdf');

    Route::get('/subcountIns', [SubcountInController::class, 'index'])->name('subcountIns.index');
    Route::get('/subcountIns/create', [SubcountInController::class, 'create'])->name('subcountIns.create');
    Route::post('/subcountIns', [SubcountInController::class, 'store'])->name('subcountIns.store');
    Route::get('/subcountIns/{subcountIn}/edit', [SubcountInController::class, 'edit'])->name('subcountIns.edit');
    Route::put('/subcountIns/{subcountIn}', [SubcountInController::class, 'update'])->name('subcountIns.update');
    Route::delete('/subcountIns/{subcountIn}', [SubcountInController::class, 'destroy'])->name('subcountIns.destroy');
    Route::get('/subcountIns/{subcountIn}', [SubcountInController::class, 'show'])->name('subcountIns.show');
    Route::get('/subcountIns/{subcountIn}/pdf', [SubcountInController::class, 'generatePdf'])->name('subcountIns.pdf');

    Route::get('/returInternals', [ReturInternalController::class, 'index'])->name('returInternals.index');
    Route::get('/returInternals/create', [ReturInternalController::class, 'create'])->name('returInternals.create');
    Route::post('/returInternals', [ReturInternalController::class, 'store'])->name('returInternals.store');
    Route::get('/returInternals/{returInternal}/edit', [ReturInternalController::class, 'edit'])->name('returInternals.edit');
    Route::put('/returInternals/{returInternal}', [ReturInternalController::class, 'update'])->name('returInternals.update');
    Route::delete('/returInternals/{returInternal}', [ReturInternalController::class, 'destroy'])->name('returInternals.destroy');
    Route::get('/returInternals/{returInternal}', [ReturInternalController::class, 'show'])->name('returInternals.show');
    Route::get('/returInternals/{returInternal}/pdf', [ReturInternalController::class, 'generatePdf'])->name('returInternals.pdf');


});



Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
