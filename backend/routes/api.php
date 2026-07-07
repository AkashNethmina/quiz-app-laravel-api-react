<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin;

// ── /api/user — auth only (no email-verified check) ──────────────────────────
// Unverified users still need to load their profile (e.g. to show email on the
// verify-email page). Everything else is gated behind the `verified` middleware.
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json($request->user()->only([
        'id', 'name', 'email', 'role', 'email_verified_at', 'created_at',
    ]));
});

// ── Auth-protected routes (email must be verified) ────────────────────────────
Route::middleware(['auth:sanctum'])->group(function () {

    // Public quiz & attempt routes
    Route::get('quizzes', [App\Http\Controllers\QuizController::class, 'index']);
    Route::post('quizzes/{quizId}/start', [App\Http\Controllers\AttemptController::class, 'start']);
    Route::post('attempts/{attemptId}/submit', [App\Http\Controllers\AttemptController::class, 'submit']);
    Route::get('attempts/{attemptId}/result', [App\Http\Controllers\AttemptController::class, 'result']);

    // Leaderboards
    Route::get('leaderboard', [App\Http\Controllers\LeaderboardController::class, 'index']);
    Route::get('leaderboard/quiz/{quizId}', [App\Http\Controllers\LeaderboardController::class, 'quiz']);
    Route::get('leaderboard/me', [App\Http\Controllers\LeaderboardController::class, 'myScores']);
});

// ── Admin-only routes ─────────────────────────────────────────────────────────
Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])->group(function () {

    // Quiz CRUD + publish toggle
    Route::get('quizzes',                [Admin\QuizController::class, 'index']);
    Route::post('quizzes',               [Admin\QuizController::class, 'store']);
    Route::get('quizzes/{id}',           [Admin\QuizController::class, 'show']);
    Route::put('quizzes/{id}',           [Admin\QuizController::class, 'update']);
    Route::delete('quizzes/{id}',        [Admin\QuizController::class, 'destroy']);
    Route::patch('quizzes/{id}/publish', [Admin\QuizController::class, 'publish']);

    // Question management
    Route::post('quizzes/{quizId}/questions', [Admin\QuestionController::class, 'store']);
    Route::put('questions/{id}',              [Admin\QuestionController::class, 'update']);
    Route::delete('questions/{id}',           [Admin\QuestionController::class, 'destroy']);
});

