<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\SaleController;
use App\Http\Controllers\Api\AnalyticsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

/*Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});*/

// User routes
Route::prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::post('/', [UserController::class, 'store']);
    Route::get('/{user}', [UserController::class, 'show']);
    Route::put('/{user}', [UserController::class, 'update']);
    Route::delete('/{user}', [UserController::class, 'destroy']);
    Route::get('/stats/overview', [UserController::class, 'getStats']);
});

// Product routes
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::post('/', [ProductController::class, 'store']);
    Route::get('/stats/overview', [ProductController::class, 'getStats']);
    Route::get('/stats/categories', [ProductController::class, 'getCategoriesData']);
    Route::get('/{product}', [ProductController::class, 'show']);
    Route::put('/{product}', [ProductController::class, 'update']);
    Route::delete('/{product}', [ProductController::class, 'destroy']);
});

// Order routes
Route::prefix('orders')->group(function () {
    Route::get('/', [OrderController::class, 'index']);
    Route::post('/', [OrderController::class, 'store']);
    Route::get('/{order}', [OrderController::class, 'show']);
    Route::put('/{order}', [OrderController::class, 'update']);
    Route::delete('/{order}', [OrderController::class, 'destroy']);
    Route::get('/stats/overview', [OrderController::class, 'getStats']);
    Route::get('/stats/recent', [OrderController::class, 'getRecent']);
    Route::get('/stats/status-distribution', [OrderController::class, 'getStatusDistribution']);
});

// Sales routes
Route::prefix('sales')->group(function () {
    Route::get('/', [SaleController::class, 'index']);
    Route::post('/', [SaleController::class, 'store']);
    Route::get('/{sale}', [SaleController::class, 'show']);
    Route::put('/{sale}', [SaleController::class, 'update']);
    Route::delete('/{sale}', [SaleController::class, 'destroy']);
    Route::get('/stats/overview', [SaleController::class, 'getStats']);
    Route::get('/stats/by-category', [SaleController::class, 'getSalesByCategory']);
    Route::get('/stats/monthly', [SaleController::class, 'getMonthlySales']);
    Route::get('/stats/daily', [SaleController::class, 'getDailySales']);
});

// Analytics routes
Route::prefix('analytics')->group(function () {
    Route::get('/dashboard', [AnalyticsController::class, 'getDashboardStats']);
    Route::get('/sales-vs-targets', [AnalyticsController::class, 'getSalesVsTargets']);
    Route::get('/traffic-sources', [AnalyticsController::class, 'getTrafficSources']);
});

Route::get('/test', function () {
    return response()->json(['message' => 'API is working!']);
});