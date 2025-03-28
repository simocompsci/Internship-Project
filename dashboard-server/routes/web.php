<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Health check endpoint
Route::get('/health-check', function () {
    return response()->json(['status' => 'ok', 'message' => 'Laravel server is running']);
});

// API health check endpoint (accessible without API prefix)
Route::get('/api/health-check', function () {
    return response()->json(['status' => 'ok', 'message' => 'API server is running']);
});
