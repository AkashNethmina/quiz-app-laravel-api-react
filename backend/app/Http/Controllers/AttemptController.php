<?php

namespace App\Http\Controllers;

use App\Http\Requests\SubmitAttemptRequest;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\AttemptAnswer;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;

class AttemptController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * POST /quizzes/{quizId}/start
     */
    public function start(int $quizId): JsonResponse
    {
        $quiz = Quiz::where('is_published', true)->findOrFail($quizId);
        $user = request()->user();

        // Check if user has an in-progress attempt
        $activeAttempt = QuizAttempt::where('user_id', $user->id)
            ->where('quiz_id', $quiz->id)
            ->whereNotNull('started_at')
            ->whereNull('submitted_at')
            ->where('timed_out', false)
            ->latest()
            ->first();

        $now = now();

        if ($activeAttempt) {
            $expiresAt = $activeAttempt->started_at->addSeconds($quiz->time_limit_seconds);
            if ($now->lessThan($expiresAt)) {
                // Return existing attempt details
                return $this->returnAttemptDetails($activeAttempt, $quiz, $expiresAt);
            }
        }

        // Create new attempt
        $attempt = QuizAttempt::create([
            'user_id'    => $user->id,
            'quiz_id'    => $quiz->id,
            'started_at' => $now,
            'score'      => 0,
            'timed_out'  => false,
        ]);

        $expiresAt = $now->addSeconds($quiz->time_limit_seconds);

        return $this->returnAttemptDetails($attempt, $quiz, $expiresAt);
    }

    /**
     * Helper to load quiz questions and format output for user (hiding is_correct logic).
     */
    private function returnAttemptDetails(QuizAttempt $attempt, Quiz $quiz, Carbon $expiresAt): JsonResponse
    {
        $questions = $quiz->questions()->with(['options' => function ($query) {
            $query->select('id', 'question_id', 'body');
        }])->get();

        return response()->json([
            'attempt_id'         => $attempt->id,
            'expires_at'         => $expiresAt->toIso8601String(),
            'time_limit_seconds' => $quiz->time_limit_seconds,
            'questions'          => $questions,
        ]);
    }

    /**
     * POST /attempts/{attemptId}/submit
     */
    public function submit(SubmitAttemptRequest $request, int $attemptId): JsonResponse
    {
        $user = $request->user();
        $attempt = QuizAttempt::where('user_id', $user->id)->findOrFail($attemptId);

        if ($attempt->submitted_at !== null) {
            return response()->json(['message' => 'Attempt already submitted.'], 422);
        }

        $now = now();
        $quiz = $attempt->quiz;
        $expiresAt = $attempt->started_at->clone()->addSeconds($quiz->time_limit_seconds);
        
        // If they are late, we mark timed_out but stringently we still process their submission
        $timedOut = $now->greaterThan($expiresAt);

        $answers = collect($request->input('answers'));
        $questions = $quiz->questions()->with('options')->get();

        $score = 0;
        $correctCount = 0;
        $incorrectCount = 0;
        $skippedCount = 0;

        foreach ($questions as $question) {
            $userAnswer = $answers->firstWhere('question_id', $question->id);

            if ($userAnswer) {
                $selectedOptionId = $userAnswer['option_id'];
                
                // Save the answer
                AttemptAnswer::create([
                    'attempt_id'         => $attempt->id,
                    'question_id'        => $question->id,
                    'selected_option_id' => $selectedOptionId,
                ]);

                $selectedOption = $question->options->firstWhere('id', $selectedOptionId);

                if ($selectedOption && $selectedOption->is_correct) {
                    $score += 1;
                    $correctCount++;
                } else {
                    $score -= 1;
                    $incorrectCount++;
                }
            } else {
                $skippedCount++;
            }
        }

        $attempt->update([
            'submitted_at' => $now,
            'score'        => $score,
            'timed_out'    => $timedOut,
        ]);

        // Bust leaderboard caches
        Cache::forget('leaderboard.global');
        Cache::forget("leaderboard.quiz.{$quiz->id}");

        return response()->json([
            'score'           => $score,
            'timed_out'       => $timedOut,
            'total_questions' => $questions->count(),
            'correct_count'   => $correctCount,
            'incorrect_count' => $incorrectCount,
            'skipped_count'   => $skippedCount,
        ]);
    }

    /**
     * GET /attempts/{attemptId}/result
     */
    public function result(int $attemptId): JsonResponse
    {
        $user = request()->user();
        $attempt = QuizAttempt::where('user_id', $user->id)
            ->with(['quiz.questions.options', 'attemptAnswers'])
            ->findOrFail($attemptId);

        if ($attempt->submitted_at === null) {
            return response()->json(['message' => 'Attempt not yet submitted.'], 422);
        }

        $questions = $attempt->quiz->questions;
        $userAnswers = $attempt->attemptAnswers->keyBy('question_id');

        $breakdown = $questions->map(function ($question) use ($userAnswers) {
            $userAnswer = $userAnswers->get($question->id);
            $correctOption = $question->options->firstWhere('is_correct', true);

            $selectedOption = null;
            $isCorrect = false;

            if ($userAnswer) {
                $selectedOption = $question->options->firstWhere('id', $userAnswer->selected_option_id);
                $isCorrect = $selectedOption && $selectedOption->is_correct;
            }

            return [
                'question_id'           => $question->id,
                'question_body'         => $question->body,
                'type'                  => $question->type,
                'selected_option_id'    => $selectedOption ? $selectedOption->id : null,
                'selected_option_body'  => $selectedOption ? $selectedOption->body : null,
                'is_correct'            => $isCorrect,
                'correct_option_id'     => $correctOption ? $correctOption->id : null,
                'correct_option_body'   => $correctOption ? $correctOption->body : null,
            ];
        });

        return response()->json([
            'score'        => $attempt->score,
            'timed_out'    => $attempt->timed_out,
            'submitted_at' => $attempt->submitted_at->toIso8601String(),
            'breakdown'    => $breakdown,
        ]);
    }
}
