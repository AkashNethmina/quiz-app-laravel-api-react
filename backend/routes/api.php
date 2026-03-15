<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// ── Auth-protected routes ─────────────────────────────────────────────────────
Route::middleware(['auth:sanctum'])->group(function () {

    // Returns the authenticated user including the role field
    Route::get('/user', function (Request $request) {
        return response()->json($request->user()->only([
            'id', 'name', 'email', 'role', 'email_verified_at', 'created_at',
        ]));
    });

});

// ── Admin-only routes ─────────────────────────────────────────────────────────
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    // Admin routes will be added in Phase 4
});

