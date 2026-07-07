import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import logo from '../assets/logo.png';
import { 
    LayoutDashboard, 
    BookOpen, 
    User, 
    Trophy, 
    ShieldAlert, 
    LogOut, 
    Menu, 
    X,
    ChevronRight
} from 'lucide-react';

export default function AppLayout() {
    const { user, role, logout, isLoading } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    const navigationItems = [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/quizzes', label: 'Quizzes', icon: BookOpen },
        { to: '/profile', label: 'My Profile', icon: User },
        { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    ];

    return (
        <div className="min-h-screen bg-linen flex flex-col antialiased">
            {/* Sticky Header (Dark Pine) */}
            <header className="sticky top-0 z-30 w-full border-b border-[#003b17] bg-[#002b11] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 flex items-center justify-center shrink-0">
                                <img src={logo} alt="Questra" className="w-8 h-8 object-contain" />
                            </div>
                            <span className="text-xl font-black tracking-tight text-white">Questra</span>
                        </div>

                        {/* Right Content */}
                        <div className="hidden md:flex items-center space-x-6">
                            {/* User details */}
                            <div className="flex items-center gap-3 pr-2 border-r border-[#003b17]">
                                <div className="w-8 h-8 rounded-full bg-[#00eb5b] flex items-center justify-center">
                                    <span className="text-xs font-bold text-[#002b11]">{getInitials(user?.name)}</span>
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-white leading-tight">{user?.name}</p>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{role || 'user'}</span>
                                </div>
                            </div>

                            {role === 'admin' && (
                                <NavLink 
                                    to="/admin" 
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#003b17] bg-[#003117] hover:bg-[#00471b] text-white rounded-lg text-xs font-semibold shadow-sm transition-all duration-200"
                                >
                                    <ShieldAlert className="w-4 h-4 text-[#00eb5b]" />
                                    Admin Panel
                                </NavLink>
                            )}

                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-300 hover:text-red-400 px-3 py-2 rounded-lg transition-all duration-200"
                            >
                                <LogOut className="w-4.5 h-4.5" />
                                Logout
                            </button>
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex md:hidden">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-300 hover:text-white hover:bg-[#003b17] transition-colors"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Drawer overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 md:hidden animate-fade-in">
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-[#002b11]/30 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
                    
                    {/* Drawer Content */}
                    <nav className="fixed top-16 bottom-0 left-0 w-72 max-w-[80vw] bg-[#002b11] border-r border-[#003b17] p-6 flex flex-col justify-between shadow-2xl animate-slide-up text-white">
                        <div className="space-y-6">
                            {/* Profile details */}
                            <div className="flex items-center gap-3 pb-6 border-b border-[#003b17]">
                                <div className="w-10 h-10 rounded-full bg-[#00eb5b] flex items-center justify-center">
                                    <span className="text-sm font-semibold text-[#002b11]">{getInitials(user?.name)}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">{user?.name}</p>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{role || 'user'}</p>
                                </div>
                            </div>

                            {/* Nav Links */}
                            <div className="space-y-1.5">
                                {navigationItems.map((item) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <NavLink
                                            key={item.to}
                                            to={item.to}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={({ isActive }) =>
                                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                                                    isActive 
                                                        ? 'bg-[#00eb5b] text-[#002b11]' 
                                                        : 'text-gray-300 hover:bg-[#003b17] hover:text-white'
                                                }`
                                            }
                                        >
                                            <IconComponent className="w-5 h-5 shrink-0" />
                                            {item.label}
                                        </NavLink>
                                    );
                                })}

                                {role === 'admin' && (
                                    <NavLink
                                        to="/admin"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-[#00eb5b] hover:bg-[#003b17] transition-all mt-4 border border-dashed border-[#003b17]"
                                    >
                                        <ShieldAlert className="w-5 h-5 shrink-0" />
                                        Admin Panel
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-bold text-gray-300 hover:bg-red-950/40 hover:text-red-400 transition-all border-t border-[#003b17]"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </nav>
                </div>
            )}

            {/* Main Content Wrap */}
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row flex-1">
                {/* Desktop Sidebar */}
                <aside className="hidden md:block w-64 mr-8 shrink-0">
                    <nav className="sticky top-24 space-y-1 bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                        <span className="block px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Menu</span>
                        
                        {navigationItems.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className={({ isActive }) =>
                                        `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                                            isActive 
                                                ? 'bg-[#00eb5b] text-[#002b11] shadow-md shadow-[#00eb5b]/10' 
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`
                                    }
                                >
                                    <div className="flex items-center gap-3">
                                        <IconComponent className="w-4.5 h-4.5 shrink-0" />
                                        {item.label}
                                    </div>
                                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-50 group-hover:translate-x-0.5 transition-all" />
                                </NavLink>
                            );
                        })}

                        {role === 'admin' && (
                            <div className="pt-4 mt-4 border-t border-gray-50">
                                <span className="block px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Settings</span>
                                <NavLink
                                    to="/admin"
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                            isActive 
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                                : 'text-gray-600 hover:bg-[#faf1ed] hover:text-[#00aa6c]'
                                        }`
                                    }
                                >
                                    <ShieldAlert className="w-4.5 h-4.5 shrink-0 text-primary-600" />
                                    Admin Panel
                                </NavLink>
                            </div>
                        )}
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 min-w-0">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
