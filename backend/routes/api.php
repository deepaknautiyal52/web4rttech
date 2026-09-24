<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\FinanceEntryController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\LookupController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\QuotationController;
use App\Http\Controllers\RenewalController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\TimesheetController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user()->only('id', 'name', 'email', 'role');
});

// Simple test route for frontend integration
Route::get('/hello', function () {
    return response()->json(['message' => 'Hello from Laravel backend']);
});

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->put('/settings/password', [AuthController::class, 'updatePassword']);

// Public: anyone can submit the contact form.
Route::post('/contacts', [ContactController::class, 'store']);

// Public: published newsroom articles.
Route::get('/articles', [ArticleController::class, 'publicIndex']);
Route::get('/articles/{slug}', [ArticleController::class, 'publicShow']);

// Protected: admin panel. Each area is further limited by role (User::AREA_ROLES).
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard', DashboardController::class);
    Route::get('/export/{type}', ExportController::class);
    Route::get('/lookups', LookupController::class);

    Route::middleware('area:leads')->group(function () {
        Route::get('/contacts', [ContactController::class, 'index']);
        Route::get('/analytics', [ContactController::class, 'analytics']);
        Route::get('/contacts/{contact}', [ContactController::class, 'show']);
        Route::put('/contacts/{contact}', [ContactController::class, 'update']);
        Route::patch('/contacts/{contact}', [ContactController::class, 'update']);
        Route::delete('/contacts/{contact}', [ContactController::class, 'destroy']);
        Route::post('/contacts/{contact}/activities', [ContactController::class, 'addActivity']);
        Route::delete('/contacts/{contact}/activities/{activity}', [ContactController::class, 'deleteActivity']);
        Route::post('/contacts/{contact}/convert', [ContactController::class, 'convert']);
    });

    Route::apiResource('clients', ClientController::class)->middleware('area:clients');
    Route::apiResource('projects', ProjectController::class)->middleware('area:projects');

    Route::middleware('area:quotations')->group(function () {
        Route::post('/quotations/{quotation}/invoice', [QuotationController::class, 'toInvoice']);
        Route::apiResource('quotations', QuotationController::class);
    });

    Route::middleware('area:invoices')->group(function () {
        Route::post('/invoices/{invoice}/payments', [InvoiceController::class, 'addPayment']);
        Route::delete('/payments/{payment}', [InvoiceController::class, 'deletePayment']);
        Route::apiResource('invoices', InvoiceController::class);
    });

    // Company finances (expenses & income) -- fully private, no public routes.
    Route::middleware('area:finances')->group(function () {
        Route::get('/finance-entries/analytics', [FinanceEntryController::class, 'analytics']);
        Route::apiResource('finance-entries', FinanceEntryController::class);
    });

    Route::middleware('area:renewals')->group(function () {
        Route::post('/renewals/{renewal}/renew', [RenewalController::class, 'renew']);
        Route::apiResource('renewals', RenewalController::class);
    });

    Route::apiResource('employees', EmployeeController::class)->middleware('area:employees');

    Route::middleware('area:timesheets')->group(function () {
        Route::get('/timesheets/utilization', [TimesheetController::class, 'utilization']);
        Route::apiResource('timesheets', TimesheetController::class);
    });

    Route::apiResource('tickets', TicketController::class)->middleware('area:tickets');

    Route::apiResource('admin-articles', ArticleController::class)->middleware('area:content');

    Route::apiResource('users', UserController::class)->middleware('area:users');
    Route::get('/audit-logs', [AuditLogController::class, 'index'])->middleware('area:audit');
});
