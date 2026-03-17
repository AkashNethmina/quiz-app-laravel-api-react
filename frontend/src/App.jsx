import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RequireAuth  from './components/guards/RequireAuth';
import RequireAdmin from './components/guards/RequireAdmin';

// Layouts
import AuthLayout from './Layouts/AuthLayout';
import AppLayout from './Layouts/AppLayout';

import AdminLayout from './Layouts/AdminLayout';

// Auth pages
import LoginPage       from './Pages/Auth/Login';
import RegisterPage    from './Pages/Auth/Register';
import ForgotPassword  from './Pages/Auth/ForgotPassword';
import ResetPassword   from './Pages/Auth/ResetPassword';
import VerifyEmail     from './Pages/Auth/VerifyEmail';

// User pages
import UserDashboard from './Pages/User/Dashboard';
import QuizList      from './Pages/User/QuizList';
import QuizPlayer    from './Pages/User/QuizPlayer';
import ResultPage    from './Pages/User/Result';
import LeaderboardPage from './Pages/LeaderboardPage';
import ProfilePage     from './Pages/ProfilePage';

// Admin pages
import AdminDashboard from './pages/Admin/Dashboard';
import AdminQuizList  from './pages/Admin/QuizList';
import AdminQuizForm  from './pages/Admin/QuizForm';
import AdminQuestions from './pages/Admin/Questions';

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* ── Public routes ─────────────────────────────── */}
                    <Route element={<AuthLayout />}>
                        <Route path="/login"          element={<LoginPage />} />
                        <Route path="/register"       element={<RegisterPage />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password"  element={<ResetPassword />} />
                    </Route>

                    {/* ── Protected routes (auth required) ──────────── */}
                    <Route element={<RequireAuth />}>
                        {/* Verify email — shown inside auth but outside AppLayout */}
                        <Route element={<AuthLayout />}>
                            <Route path="/verify-email" element={<VerifyEmail />} />
                        </Route>

                        <Route element={<AppLayout />}>
                            <Route path="/dashboard"   element={<UserDashboard />} />
                            
                            <Route path="/quizzes"             element={<QuizList />} />
                            <Route path="/quizzes/:id/play"    element={<QuizPlayer />} />
                            <Route path="/attempts/:id/result" element={<ResultPage />} />
                            
                            <Route path="/leaderboard" element={<LeaderboardPage />} />
                            <Route path="/profile"     element={<ProfilePage />} />
                        </Route>

                        {/* ── Admin routes (admin role required) ──────── */}
                        <Route element={<RequireAdmin />}>
                            <Route element={<AdminLayout />}>
                                <Route path="/admin"                     element={<Navigate to="/admin/dashboard" replace />} />
                                <Route path="/admin/dashboard"           element={<AdminDashboard />} />
                                <Route path="/admin/quizzes"             element={<AdminQuizList />} />
                                <Route path="/admin/quizzes/create"      element={<AdminQuizForm />} />
                                <Route path="/admin/quizzes/:id/edit"    element={<AdminQuizForm />} />
                                <Route path="/admin/quizzes/:id/questions" element={<AdminQuestions />} />
                            </Route>
                        </Route>
                    </Route>

                    {/* ── Default redirect ───────────────────────────── */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
