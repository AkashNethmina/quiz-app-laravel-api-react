import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

/**
 * Protects routes that require admin role.
 * Must be nested inside RequireAuth (session is already guaranteed).
 */
export default function RequireAdmin() {
    const { role, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-linen">
                <div className="w-10 h-10 border-4 border-[#00eb5b] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}
