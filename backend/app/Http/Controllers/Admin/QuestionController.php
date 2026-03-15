<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreQuestionRequest;
use App\Http\Requests\Admin\UpdateQuestionRequest;
use App\Http\Resources\QuestionResource;
use App\Models\Question;
use App\Models\Quiz;
use Illuminate\Http\JsonResponse;

class QuestionController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:sanctum', 'admin']);
    }

    /**
     * POST /admin/quizzes/{quizId}/questions
     */
    public function store(StoreQuestionRequest $request, int $quizId): JsonResponse
    {
        $quiz = Quiz::findOrFail($quizId);

        $question = $quiz->questions()->create([
            'body'  => $request->input('body'),
            'type'  => $request->input('type'),
            'order' => $request->input('order', 0),
        ]);

        $optionsData = collect($request->input('options'))->map(fn ($option) => [
            'body'       => $option['body'],
            'is_correct' => (bool) $option['is_correct'],
        ])->all();

        $question->options()->createMany($optionsData);

        return response()->json(
            new QuestionResource($question->load('options')),
            201
        );
    }

    /**
     * PUT /admin/questions/{id}
     */
    public function update(UpdateQuestionRequest $request, int $id): JsonResponse
    {
        $question = Question::findOrFail($id);

        $question->update(array_filter([
            'body'  => $request->input('body'),
            'type'  => $request->input('type'),
            'order' => $request->input('order'),
        ], fn ($v) => $v !== null));

        // Replace options when they are provided
        if ($request->has('options')) {
            $question->options()->delete();

            $optionsData = collect($request->input('options'))->map(fn ($option) => [
                'body'       => $option['body'],
                'is_correct' => (bool) $option['is_correct'],
            ])->all();

            $question->options()->createMany($optionsData);
        }

        return response()->json(new QuestionResource($question->load('options')));
    }

    /**
     * DELETE /admin/questions/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        $question = Question::findOrFail($id);
        $question->delete();

        return response()->json(['message' => 'Question deleted successfully.']);
    }
}
