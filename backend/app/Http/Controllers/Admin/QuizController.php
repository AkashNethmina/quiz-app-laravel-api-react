<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreQuizRequest;
use App\Http\Requests\Admin\UpdateQuizRequest;
use App\Http\Resources\QuizDetailResource;
use App\Http\Resources\QuizResource;
use App\Models\Quiz;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class QuizController extends Controller
{
    /**
     * GET /admin/quizzes
     * Return all quizzes with questions_count.
     */
    public function index(): AnonymousResourceCollection
    {
        $quizzes = Quiz::withCount(['questions', 'attempts'])->latest()->get();

        return QuizResource::collection($quizzes);
    }

    /**
     * POST /admin/quizzes
     */
    public function store(StoreQuizRequest $request): JsonResponse
    {
        $data = $request->validated();
        if (isset($data['time_limit'])) {
            $data['time_limit_seconds'] = $data['time_limit'];
            unset($data['time_limit']);
        }
        $quiz = Quiz::create($data);

        return response()->json(new QuizResource($quiz), 201);
    }

    /**
     * GET /admin/quizzes/{id}
     */
    public function show(int $id): JsonResponse
    {
        $quiz = Quiz::with(['questions.options'])->withCount('questions')->findOrFail($id);

        return response()->json(new QuizDetailResource($quiz));
    }

    /**
     * PUT /admin/quizzes/{id}
     */
    public function update(UpdateQuizRequest $request, int $id): JsonResponse
    {
        $quiz = Quiz::findOrFail($id);
        $data = $request->validated();
        if (isset($data['time_limit'])) {
            $data['time_limit_seconds'] = $data['time_limit'];
            unset($data['time_limit']);
        }
        $quiz->update($data);

        return response()->json(new QuizResource($quiz->loadCount('questions')));
    }

    /**
     * DELETE /admin/quizzes/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        $quiz = Quiz::findOrFail($id);
        $quiz->delete();

        return response()->json(['message' => 'Quiz deleted successfully.']);
    }

    /**
     * PATCH /admin/quizzes/{id}/publish
     * Toggle is_published.
     */
    public function publish(int $id): JsonResponse
    {
        $quiz = Quiz::findOrFail($id);
        $quiz->update(['is_published' => ! $quiz->is_published]);

        return response()->json(new QuizResource($quiz->loadCount('questions')));
    }
}
