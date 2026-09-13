<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\FinanceEntryController;
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
    return $request->user();
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

// Protected: only authenticated (admin) users can view/manage submissions.
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/contacts', [ContactController::class, 'index']);
    Route::get('/analytics', [ContactController::class, 'analytics']);
    Route::get('/contacts/{contact}', [ContactController::class, 'show']);
    Route::put('/contacts/{contact}', [ContactController::class, 'update']);
    Route::patch('/contacts/{contact}', [ContactController::class, 'update']);
    Route::delete('/contacts/{contact}', [ContactController::class, 'destroy']);

    // Company finances (expenses & income) -- fully private, no public routes.
    Route::get('/finance-entries/analytics', [FinanceEntryController::class, 'analytics']);
    Route::apiResource('finance-entries', FinanceEntryController::class);
});
