import useAuth from '../../hooks/useAuth';

export default function AdminDashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-4">
            <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
            <p className="text-gray-300">Logged in as <strong>{user?.email}</strong></p>
            <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition"
            >
                Logout
            </button>
        </div>
    );
}
