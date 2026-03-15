<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\QuizAttempt;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class LeaderboardController extends Controller
{
    /**
     * GET /leaderboard
     * Global leaderboard.
     */
    public function index(): JsonResponse
    {
        $userId = request()->user()->id;

        $leaderboard = Cache::remember('leaderboard.global', 60, function () {
            // Subquery to get MAX score per user per quiz
            $bestAttempts = DB::table('quiz_attempts')
                ->select('user_id', 'quiz_id', DB::raw('MAX(score) as max_score'))
                ->whereNotNull('submitted_at')
                ->groupBy('user_id', 'quiz_id');

            // Main query to sum the max scores per user
            $query = DB::table(DB::raw("({$bestAttempts->toSql()}) as best_scores"))
                ->mergeBindings($bestAttempts)
                ->join('users', 'best_scores.user_id', '=', 'users.id')
                ->select(
                    'best_scores.user_id',
                    'users.name as user_name',
                    DB::raw('SUM(best_scores.max_score) as total_score'),
                    DB::raw('COUNT(best_scores.quiz_id) as quizzes_completed')
                )
                ->groupBy('best_scores.user_id', 'users.name')
                ->orderByDesc('total_score')
                ->orderByDesc('quizzes_completed')
                ->orderBy('users.id')
                ->limit(50)
                ->get();

            // Add rank
            $rank = 1;
            return $query->map(function ($item) use (&$rank) {
                $item->rank = $rank++;
                return $item;
            });
        });

        // Add `is_me` flag manually after caching
        // (if we cached `is_me`, it would be wrong for other users!)
        // Handle pagination to conform to requirements (top 50, 15 per page)
        
        $collection = collect($leaderboard)->map(function ($item) use ($userId) {
            $array = (array) $item;
            $array['is_me'] = $array['user_id'] === $userId;
            return $array;
        });

        // Manual pagination
        $page = (int) request()->get('page', 1);
        $perPage = 15;
        $offset = ($page - 1) * $perPage;

        $items = $collection->slice($offset, $perPage)->values();

        return response()->json([
            'data' => $items,
            'meta' => [
                'current_page' => $page,
                'per_page'     => $perPage,
                'total'        => $collection->count(),
                'last_page'    => (int) ceil($collection->count() / $perPage),
            ],
        ]);
    }

    /**
     * GET /leaderboard/quiz/{quizId}
     * Per-quiz leaderboard.
     */
    public function quiz(int $quizId): JsonResponse
    {
        $quiz = Quiz::where('is_published', true)->findOrFail($quizId);
        $userId = request()->user()->id;

        $leaderboard = Cache::remember("leaderboard.quiz.{$quiz->id}", 60, function () use ($quiz) {
            // We want the BEST attempt per user for this quiz.
            // Using a window function (if MySQL 8+) or subquery
            // By grouping by user_id and getting MAX score, we get the best score.
            // To get the exact `submitted_at` or `timed_out` for that max score, we can use a join.

            $bestScores = DB::table('quiz_attempts')
                ->select('user_id', DB::raw('MAX(score) as max_score'))
                ->where('quiz_id', $quiz->id)
                ->whereNotNull('submitted_at')
                ->groupBy('user_id');

            $query = DB::table('quiz_attempts as qa')
                ->joinSub($bestScores, 'bs', function ($join) {
                    $join->on('qa.user_id', '=', 'bs.user_id')
                         ->on('qa.score', '=', 'bs.max_score');
                })
                ->join('users', 'qa.user_id', '=', 'users.id')
                ->where('qa.quiz_id', $quiz->id)
                ->whereNotNull('qa.submitted_at')
                ->select(
                    'qa.user_id',
                    'users.name as user_name',
                    'qa.score',
                    'qa.submitted_at',
                    'qa.timed_out'
                )
                // Deduplicate if a user has multiple attempts with the same max score
                ->groupBy(
                    'qa.user_id',
                    'users.name',
                    'qa.score',
                    'qa.submitted_at',
                    'qa.timed_out'
                )
                // In MySQL, `ONLY_FULL_GROUP_BY` might complain about this group by unless we pick min/max.
                // A safer standard approach: find the MIN(id) for the max score.
                ->orderByDesc('score')
                ->orderBy('qa.submitted_at')
                ->orderBy('qa.user_id')
                ->limit(50)
                ->get();
            
            // Deduplicate in collection since the group by above might still yield duplicates 
            // if a user has 2 attempts with identical max scores but different timestamps.
            $uniqueUsers = collect();
            $seenUsers = [];
            foreach ($query as $row) {
                if (!isset($seenUsers[$row->user_id])) {
                    $seenUsers[$row->user_id] = true;
                    $uniqueUsers->push($row);
                }
            }

            $rank = 1;
            return $uniqueUsers->map(function ($item) use (&$rank) {
                $item->rank = $rank++;
                return $item;
            });
        });

        $collection = collect($leaderboard)->map(function ($item) use ($userId) {
            $array = (array) $item;
            $array['is_me'] = $array['user_id'] === $userId;
            return $array;
        });

        $page = (int) request()->get('page', 1);
        $perPage = 15;
        $offset = ($page - 1) * $perPage;

        $items = $collection->slice($offset, $perPage)->values();

        return response()->json([
            'data' => $items,
            'meta' => [
                'current_page' => $page,
                'per_page'     => $perPage,
                'total'        => $collection->count(),
                'last_page'    => (int) ceil($collection->count() / $perPage),
            ],
        ]);
    }

    /**
     * GET /leaderboard/me
     * Auth user's own attempt history.
     */
    public function myScores(): JsonResponse
    {
        $user = request()->user();

        // Eager load quiz title and answers for counts (or we can just calculate from score if we stored it, but we need exact correct/incorrect count)
        $attempts = QuizAttempt::with(['quiz:id,title', 'attemptAnswers.selectedOption'])
            ->where('user_id', $user->id)
            ->whereNotNull('submitted_at')
            ->orderByDesc('submitted_at')
            ->get();

        $data = $attempts->map(function ($attempt) {
            $correctCount = 0;
            $incorrectCount = 0;

            foreach ($attempt->attemptAnswers as $answer) {
                if ($answer->selectedOption && $answer->selectedOption->is_correct) {
                    $correctCount++;
                } else {
                    $incorrectCount++;
                }
            }

            return [
                'id'              => $attempt->id,
                'quiz_id'         => $attempt->quiz_id,
                'quiz_title'      => $attempt->quiz->title ?? 'Unknown Quiz',
                'score'           => $attempt->score,
                'submitted_at'    => $attempt->submitted_at,
                'timed_out'       => $attempt->timed_out,
                'correct_count'   => $correctCount,
                'incorrect_count' => $incorrectCount,
            ];
        });

        return response()->json(['data' => $data]);
    }
}
