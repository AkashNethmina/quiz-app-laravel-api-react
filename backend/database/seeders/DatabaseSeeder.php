<?php

namespace Database\Seeders;

use App\Models\Option;
use App\Models\Question;
use App\Models\Quiz;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Users ─────────────────────────────────────────────
        User::create([
            'name'     => 'Admin',
            'email'    => 'admin@quiz.com',
            'password' => Hash::make('password'),
            'role'     => 'admin',
        ]);

        User::create([
            'name'     => 'User One',
            'email'    => 'user@quiz.com',
            'password' => Hash::make('password'),
            'role'     => 'user',
        ]);

        // ── Quiz ──────────────────────────────────────────────
        $quiz = Quiz::create([
            'title'              => 'Sample Quiz',
            'description'        => 'A sample quiz to get you started.',
            'time_limit_seconds' => 60,
            'is_published'       => true,
        ]);

        // ── MCQ Question 1 ────────────────────────────────────
        $q1 = Question::create([
            'quiz_id' => $quiz->id,
            'body'    => 'What does HTML stand for?',
            'type'    => 'mcq',
            'order'   => 1,
        ]);

        foreach ([
            ['body' => 'Hyper Text Markup Language',    'is_correct' => true],
            ['body' => 'High Tech Modern Language',     'is_correct' => false],
            ['body' => 'Hyper Transfer Markup Language','is_correct' => false],
            ['body' => 'HyperText Machine Learning',    'is_correct' => false],
        ] as $opt) {
            Option::create(array_merge($opt, ['question_id' => $q1->id]));
        }

        // ── MCQ Question 2 ────────────────────────────────────
        $q2 = Question::create([
            'quiz_id' => $quiz->id,
            'body'    => 'Which language runs in the browser?',
            'type'    => 'mcq',
            'order'   => 2,
        ]);

        foreach ([
            ['body' => 'JavaScript', 'is_correct' => true],
            ['body' => 'Python',     'is_correct' => false],
            ['body' => 'PHP',        'is_correct' => false],
            ['body' => 'Ruby',       'is_correct' => false],
        ] as $opt) {
            Option::create(array_merge($opt, ['question_id' => $q2->id]));
        }

        // ── True/False Question ───────────────────────────────
        $q3 = Question::create([
            'quiz_id' => $quiz->id,
            'body'    => 'CSS stands for Cascading Style Sheets.',
            'type'    => 'true_false',
            'order'   => 3,
        ]);

        foreach ([
            ['body' => 'True',  'is_correct' => true],
            ['body' => 'False', 'is_correct' => false],
        ] as $opt) {
            Option::create(array_merge($opt, ['question_id' => $q3->id]));
        }
    }
}

