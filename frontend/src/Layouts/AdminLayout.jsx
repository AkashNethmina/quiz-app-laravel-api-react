import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function AdminLayout() {
    const { user, role, logout, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Navbar */}
            <nav className="bg-white border-b border-gray-200 shadow-sm z-10 w-full fixed top-0 h-16">
                <div className="px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex items-center justify-between h-full">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center gap-3">
                                <span className="text-xl font-bold text-primary-600">QuizApp Admin</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700 font-medium">{user?.name}</span>
                            {role && (
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium bg-primary-100 text-primary-700`}>
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

            <div className="flex flex-1 pt-16">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-gray-200 fixed top-16 bottom-0 overflow-y-auto">
                    <nav className="p-4 space-y-2">
                        <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4">
                            Menu
                        </p>
                        <NavLink
                            to="/admin/dashboard"
                            end
                            className={({ isActive }) =>
                                `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`
                            }
                        >
                            Overview
                        </NavLink>
                        <NavLink
                            to="/admin/quizzes"
                            className={({ isActive }) =>
                                `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`
                            }
                        >
                            Manage Quizzes
                        </NavLink>
                        
                        <div className="pt-6 mt-6 border-t border-gray-100">
                            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                App
                            </p>
                            <NavLink
                                to="/dashboard"
                                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                Back to App
                            </NavLink>
                        </div>
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 ml-64 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
