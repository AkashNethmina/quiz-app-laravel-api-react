import { useAuthContext } from '../context/AuthContext';

/**
 * Thin convenience hook — consumers import useAuth, not useAuthContext directly.
 * Returns { user, isAuthenticated, isLoading, role, login, register, logout }
 */
export default function useAuth() {
    return useAuthContext();
}
