<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use Illuminate\Http\JsonResponse;

class QuizController extends Controller
{
    public function __construct()
    {
        // $this->middleware('auth:sanctum');
    }

    /**
     * GET /quizzes
     * Return all published quizzes with question count.
     */
    public function index(): JsonResponse
    {
        $quizzes = Quiz::where('is_published', true)
            ->withCount('questions')
            ->latest()
            ->get([
                'id',
                'title',
                'description',
                'time_limit_seconds',
                'is_published',
                'created_at',
            ]);

        return response()->json(['data' => $quizzes]);
    }
}
