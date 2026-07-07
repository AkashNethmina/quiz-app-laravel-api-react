import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import logo from '../assets/logo.png';
import { 
    LayoutDashboard, 
    BookOpen, 
    ArrowLeft, 
    LogOut,
    Shield
} from 'lucide-react';

export default function AdminLayout() {
    const { user, role, logout, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.trim().split(' ').filter(Boolean);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linen">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#00eb5b] border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linen flex flex-col antialiased">
            {/* Top Navbar (Dark Pine) */}
            <nav className="bg-[#002b11] border-b border-[#003b17] z-20 w-full fixed top-0 h-16 text-white">
                <div className="px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex items-center justify-between h-full">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 flex items-center justify-center shrink-0">
                                <img src={logo} alt="Questra" className="w-8 h-8 object-contain" />
                            </div>
                            <span className="text-xl font-black text-white">
                                Questra 
                                <span className="text-[#00eb5b] font-semibold text-xs border border-[#003b17] bg-[#003117] px-2 py-0.5 rounded-md ml-1.5">Admin</span>
                            </span>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center space-x-6">
                            {/* Profile details */}
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#00eb5b] flex items-center justify-center">
                                    <span className="text-xs font-bold text-[#002b11]">{getInitials(user?.name)}</span>
                                </div>
                                <div className="text-left hidden sm:block">
                                    <p className="text-sm font-semibold text-white leading-tight">{user?.name}</p>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{role}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-300 hover:text-red-400 px-3 py-2 rounded-lg transition-all duration-200"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex flex-1 pt-16">
                {/* Fixed Sidebar */}
                <aside className="w-64 bg-white border-r border-gray-100 fixed top-16 bottom-0 overflow-y-auto z-10 p-4">
                    <nav className="space-y-1">
                        <span className="block px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Management</span>
                        
                        <NavLink
                            to="/admin/dashboard"
                            end
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                    isActive 
                                        ? 'bg-[#00eb5b] text-[#002b11] shadow-md shadow-[#00eb5b]/10' 
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`
                            }
                        >
                            <LayoutDashboard className="w-4.5 h-4.5 shrink-0" />
                            Overview
                        </NavLink>
                        
                        <NavLink
                            to="/admin/quizzes"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                    isActive 
                                        ? 'bg-[#00eb5b] text-[#002b11] shadow-md shadow-[#00eb5b]/10' 
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`
                            }
                        >
                            <BookOpen className="w-4.5 h-4.5 shrink-0" />
                            Manage Quizzes
                        </NavLink>
                        
                        <div className="pt-6 mt-6 border-t border-gray-50">
                            <span className="block px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Application</span>
                            <NavLink
                                transition
                                to="/dashboard"
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-[#faf1ed] hover:text-[#00aa6c] transition-all"
                            >
                                <ArrowLeft className="w-4.5 h-4.5 shrink-0 text-primary-600" />
                                Back to App
                            </NavLink>
                        </div>
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 ml-64 p-8 min-w-0">
                    <div className="max-w-5xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
