import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RequireAuth  from './components/guards/RequireAuth';
import RequireAdmin from './components/guards/RequireAdmin';

// Auth pages
import LoginPage    from './pages/Auth/Login';
import RegisterPage from './pages/Auth/Register';

// User pages
import UserDashboard from './pages/User/Dashboard';

// Admin pages
import AdminDashboard from './pages/Admin/Dashboard';

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* ── Public routes ─────────────────────────────── */}
                    <Route path="/login"    element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* ── Protected routes (auth required) ──────────── */}
                    <Route element={<RequireAuth />}>
                        <Route path="/dashboard"   element={<UserDashboard />} />
                        {/* /quizzes and /leaderboard will be added in Phase 4 */}
                        <Route path="/quizzes"     element={<div className="p-8">Quizzes — coming soon</div>} />
                        <Route path="/leaderboard" element={<div className="p-8">Leaderboard — coming soon</div>} />

                        {/* ── Admin routes (admin role required) ──────── */}
                        <Route element={<RequireAdmin />}>
                            <Route path="/admin"           element={<AdminDashboard />} />
                            <Route path="/admin/*"          element={<AdminDashboard />} />
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
