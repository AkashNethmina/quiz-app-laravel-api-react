<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Only run on PostgreSQL (Supabase) to avoid breaking local MySQL/SQLite setups
        if (DB::getDriverName() === 'pgsql') {
            $tables = [
                'migrations',
                'users',
                'password_reset_tokens',
                'sessions',
                'cache',
                'cache_locks',
                'jobs',
                'job_batches',
                'failed_jobs',
                'personal_access_tokens',
                'quizzes',
                'questions',
                'options',
                'quiz_attempts',
                'attempt_answers'
            ];

            foreach ($tables as $table) {
                if (Schema::hasTable($table)) {
                    DB::statement("ALTER TABLE \"{$table}\" ENABLE ROW LEVEL SECURITY;");
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            $tables = [
                'migrations',
                'users',
                'password_reset_tokens',
                'sessions',
                'cache',
                'cache_locks',
                'jobs',
                'job_batches',
                'failed_jobs',
                'personal_access_tokens',
                'quizzes',
                'questions',
                'options',
                'quiz_attempts',
                'attempt_answers'
            ];

            foreach ($tables as $table) {
                if (Schema::hasTable($table)) {
                    DB::statement("ALTER TABLE \"{$table}\" DISABLE ROW LEVEL SECURITY;");
                }
            }
        }
    }
};
