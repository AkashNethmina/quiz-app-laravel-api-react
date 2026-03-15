import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function AppLayout() {
    const { user, role, logout, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navbar */}
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <span className="text-xl font-bold text-indigo-600">QuizApp</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700 font-medium">{user?.name}</span>
                            {role && (
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'}`}>
                                    {role}
                                </span>
                            )}
                            <button
                                onClick={handleLogout}
                                className="text-sm font-medium text-gray-500 hover:text-gray-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row">
                {/* Sidebar (Desktop) / Nav */}
                <aside className="w-full md:w-64 mb-6 md:mb-0 md:mr-6 flex-shrink-0">
                    <nav className="space-y-1">
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`
                            }
                        >
                            Dashboard
                        </NavLink>
                        <NavLink
                            to="/quizzes"
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`
                            }
                        >
                            Quizzes
                        </NavLink>
                        <NavLink
                            to="/profile"
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`
                            }
                        >
                            My Profile
                        </NavLink>
                        <NavLink
                            to="/leaderboard"
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`
                            }
                        >
                            Leaderboard
                        </NavLink>

                        {role === 'admin' && (
                            <div className="pt-4 mt-4 border-t border-gray-200">
                                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                    Admin
                                </p>
                                <NavLink
                                    to="/admin"
                                    className={({ isActive }) =>
                                        `block px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`
                                    }
                                >
                                    Admin Panel
                                </NavLink>
                            </div>
                        )}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
