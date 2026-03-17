# QuizApp

A full-stack quiz application with timed MCQ and True/False quizzes, auto-submit, negative marking, and a live leaderboard.

Built for educators and learners who want a clean, competitive quiz experience. Admins can create and publish quizzes with configurable time limits. Users can attempt quizzes, see instant results, and compete on the leaderboard.

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 12, Breeze API, Sanctum, MySQL |
| Frontend | React 19, Vite, React Router v7, Tailwind CSS |
| Auth | Sanctum cookie-based SPA authentication |
| Testing (BE) | Pest / PHPUnit via `php artisan test` |
| Dev Tools | Composer, NPM, Artisan CLI |

---

## ✨ Features

### User
- Browse all published quizzes
- Start a timed quiz (MCQ and True/False question types)
- Auto-submit when the countdown timer expires
- Scoring: **+1** for correct, **-1** for incorrect, **0** for skipped
- View per-question result breakdown after submission
- Global leaderboard and per-quiz leaderboard
- Personal score history on the profile page

### Admin
- Create, edit, and delete quizzes
- Set a time limit (in seconds) per quiz
- Add MCQ questions with up to 6 options (exactly 1 correct)
- Add True/False questions
- Publish and unpublish quizzes
- View all quizzes with question counts and status

---

## ⚙️ Prerequisites

| Tool | Version | Check command |
|---|---|---|
| PHP | 8.2+ | `php -v` |
| Composer | 2.x | `composer -V` |
| Node.js | 18+ | `node -v` |
| NPM | 9+ | `npm -v` |
| MySQL | 8.0+ | `mysql --version` |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AkashNethmina/quiz-app-laravel-api-react.git
cd quiz-app-laravel-api-react
```

### 2. Backend setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Configure the following values in `backend/.env`:

```env
DB_DATABASE=quizapp
DB_USERNAME=root
DB_PASSWORD=your_password

FRONTEND_URL=http://localhost:5173
SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
```

Then run migrations and seed the database:

```bash
php artisan migrate --seed
php artisan serve
```

Backend runs at `http://localhost:8000`.

### 3. Frontend setup

```bash
cd ../frontend
npm install
cp .env.example .env
```

Set the API URL in `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

Start the dev server:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`.

---

## 🔑 Default Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@quiz.com | password |
| User | user@quiz.com | password |

---

## 🗺️ Application Routes

### Frontend

| Path | Access | Description |
|---|---|---|
| `/` | Public | Redirects to `/dashboard` |
| `/login` | Public | Login page |
| `/register` | Public | Register page |
| `/dashboard` | Auth | User dashboard with stats |
| `/quizzes` | Auth | Browse available quizzes |
| `/quizzes/:id/play` | Auth | Quiz player |
| `/attempts/:id/result` | Auth | Quiz result breakdown |
| `/leaderboard` | Auth | Global and per-quiz leaderboard |
| `/profile` | Auth | Personal score history |
| `/admin` | Admin | Admin dashboard |
| `/admin/quizzes` | Admin | Manage all quizzes |
| `/admin/quizzes/create` | Admin | Create new quiz |
| `/admin/quizzes/:id/edit` | Admin | Edit existing quiz |
| `/admin/quizzes/:id/questions` | Admin | Manage quiz questions |

---

## 📡 API Endpoints

### Auth (Breeze)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | — | Register new user |
| POST | `/login` | — | Login |
| POST | `/logout` | Auth | Logout |
| GET | `/api/user` | Auth | Get current user with role |

### Quizzes (User)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/quizzes` | Auth | List published quizzes |
| POST | `/api/quizzes/:id/start` | Auth | Start a quiz attempt |
| POST | `/api/attempts/:id/submit` | Auth | Submit answers |
| GET | `/api/attempts/:id/result` | Auth | Get result breakdown |

### Leaderboard

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/leaderboard` | Auth | Global leaderboard (best score per user) |
| GET | `/api/leaderboard/quiz/:id` | Auth | Per-quiz leaderboard |
| GET | `/api/leaderboard/me` | Auth | My personal score history |

### Admin — Quizzes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/quizzes` | Admin | List all quizzes |
| POST | `/api/admin/quizzes` | Admin | Create quiz |
| GET | `/api/admin/quizzes/:id` | Admin | Get quiz with questions and options |
| PUT | `/api/admin/quizzes/:id` | Admin | Update quiz |
| DELETE | `/api/admin/quizzes/:id` | Admin | Delete quiz (cascades) |
| PATCH | `/api/admin/quizzes/:id/publish` | Admin | Toggle publish status |

### Admin — Questions

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/admin/quizzes/:id/questions` | Admin | Add question to quiz |
| PUT | `/api/admin/questions/:id` | Admin | Update question and options |
| DELETE | `/api/admin/questions/:id` | Admin | Delete question (cascades) |

---

## 🗄️ Database Schema

| Table | Purpose |
|---|---|
| `users` | Stores users with `role` field: `admin` or `user` |
| `quizzes` | Quiz metadata, time limit in seconds, publish status |
| `questions` | MCQ or True/False questions, belongs to a quiz |
| `options` | Answer options with `is_correct` flag, belongs to a question |
| `quiz_attempts` | One attempt per user per quiz, stores score and timeout status |
| `attempt_answers` | Records each answer selected during an attempt |

---

## 🧪 Running Tests

### Backend

```bash
cd backend
php artisan test
```

Covers:
- User registration and login
- Role enforcement (admin middleware)
- Quiz CRUD and publish toggle
- Question validation (MCQ requires exactly 1 correct option, True/False requires exactly 2 options)
- Attempt start, submit, and result retrieval
- Scoring logic: all correct, all incorrect, all skipped, mixed
- Leaderboard ranking and `is_me` flag

---

## 📁 Project Structure

### Backend (`/backend`)

```
app/
  Http/
    Controllers/
      Admin/              → QuizController, QuestionController
      AttemptController.php
      LeaderboardController.php
      QuizController.php
    Middleware/
      AdminMiddleware.php
    Requests/             → Form validation (StoreQuizRequest, etc.)
    Resources/            → API response transformers
  Models/                 → User, Quiz, Question, Option,
                            QuizAttempt, AttemptAnswer
database/
  migrations/             → All table migrations
  seeders/                → Admin user + sample quiz seeder
routes/
  api.php                 → All API routes
tests/
  Feature/                → Auth, Quiz, Attempt, Leaderboard tests
  Unit/                   → ScoringTest
```

### Frontend (`/frontend`)

```
src/
  components/
    admin/                → QuestionForm
    guards/               → RequireAuth, RequireAdmin
    leaderboard/          → LeaderboardTable, RankBadge, PlayerCell
    quiz/                 → QuizTimer
    ui/                   → Toast, LoadingSkeleton,
                            ConfirmDialog, EmptyState, ErrorMessage
  context/                → AuthContext, ToastContext
  hooks/                  → useAuth, useToast
  layouts/                → AppLayout, AuthLayout
  lib/                    → axios.js
  pages/
    admin/                → AdminDashboardPage, AdminQuizListPage,
                            AdminQuizFormPage, AdminQuestionsPage
    auth/                 → LoginPage, RegisterPage
    (root)                → DashboardPage, QuizListPage,
                            QuizPlayerPage, ResultPage,
                            LeaderboardPage, ProfilePage,
                            NotFoundPage, ErrorPage
```

---

## 🔒 Security Notes

- Passwords hashed with bcrypt (Laravel default)
- Role is always assigned server-side — `role` field in registration requests is ignored
- Sanctum CSRF protection enforced on all state-changing requests
- `is_correct` field is stripped from options returned to non-admin users
- Admin routes are double-protected: `auth:sanctum` + `AdminMiddleware`
- Session-based auth — no JWT tokens stored in `localStorage`

---

## 🐛 Common Issues

| Issue | Fix |
|---|---|
| CORS error on login | Ensure `FRONTEND_URL` in `backend/.env` exactly matches the frontend origin including port |
| 419 CSRF mismatch | Confirm `GET /sanctum/csrf-cookie` is called before any POST request |
| Blank page after login | Check `VITE_API_URL` in `frontend/.env` is set and correct |
| Sanctum not setting cookie | `SESSION_DOMAIN` must match the domain of both frontend and backend |
| Tests failing on fresh clone | Run `php artisan migrate --seed` before running tests |
| Timer out of sync with server | The timer uses `expiresAt` from the server, not a local `Date.now()` countdown |

---

## 📄 License

MIT License — free to use, modify, and distribute.