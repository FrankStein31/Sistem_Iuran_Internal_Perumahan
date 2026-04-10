<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ResidentController;
use App\Http\Controllers\Api\HouseController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ExpenseController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/dashboard/report', [DashboardController::class, 'monthlyReport']);

    // Residents
    Route::get('/residents/all', [ResidentController::class, 'all']);
    Route::apiResource('/residents', ResidentController::class);

    // Houses
    Route::get('/houses/all', [HouseController::class, 'all']);
    Route::post('/houses/{house}/assign-resident', [HouseController::class, 'assignResident']);
    Route::post('/houses/{house}/remove-resident', [HouseController::class, 'removeResident']);
    Route::apiResource('/houses', HouseController::class);

    // Payments
    Route::post('/payments/{payment}/mark-paid', [PaymentController::class, 'markPaid']);
    Route::post('/payments/generate-bulk', [PaymentController::class, 'generateBulk']);
    Route::post('/payments/advance-pay', [PaymentController::class, 'advancePay']);
    Route::apiResource('/payments', PaymentController::class);

    // Expenses
    Route::get('/expenses/categories', [ExpenseController::class, 'categories']);
    Route::apiResource('/expenses', ExpenseController::class);
});
