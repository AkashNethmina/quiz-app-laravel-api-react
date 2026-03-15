import useAuth from '../../hooks/useAuth';

export default function UserDashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">Welcome, <strong>{user?.name}</strong>!</p>
            <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition"
            >
                Logout
            </button>
        </div>
    );
}
