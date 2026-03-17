import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

/**
 * Blocks access to app routes for authenticated users who have not yet
 * verified their email address. Redirects them to /verify-email.
 *
 * Place this guard INSIDE <RequireAuth> so we know the user is loaded.
 */
export default function RequireVerified() {
    const { emailVerified } = useAuth();

    if (!emailVerified) {
        return <Navigate to="/verify-email" replace />;
    }

    return <Outlet />;
}
