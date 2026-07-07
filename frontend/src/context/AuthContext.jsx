import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from '../lib/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser]                       = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading]             = useState(true);

    // ── Rehydrate session on mount ────────────────────────────────────────────
    // GET /api/user is auth-only (no `verified` middleware), so this works for
    // both verified and unverified users.
    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get('/api/user');
                setUser(data);
                setIsAuthenticated(true);
            } catch {
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    // ── Login ─────────────────────────────────────────────────────────────────
    const login = useCallback(async (email, password) => {
        // Sanctum SPA: fetch CSRF cookie first
        await axios.get('/sanctum/csrf-cookie');
        const { data } = await axios.post('/login', { email, password });
        // After login Breeze returns 204; fetch user separately
        const me = await axios.get('/api/user');
        setUser(me.data);
        setIsAuthenticated(true);
        return data;
    }, []);

    // ── Register ──────────────────────────────────────────────────────────────
    // After registration the user is authenticated but not yet verified.
    // GET /api/user no longer requires verified email, so this always succeeds.
    const register = useCallback(async (name, email, password, password_confirmation) => {
        await axios.get('/sanctum/csrf-cookie');
        const { data } = await axios.post('/register', {
            name,
            email,
            password,
            password_confirmation,
        });
        const me = await axios.get('/api/user');
        setUser(me.data);
        setIsAuthenticated(true);
        return data;
    }, []);

    // ── Logout ────────────────────────────────────────────────────────────────
    const logout = useCallback(async () => {
        await axios.post('/logout');
        setUser(null);
        setIsAuthenticated(false);
    }, []);

    const value = {
        user,
        isAuthenticated,
        isLoading,
        // true only when the user is logged in
        emailVerified: !!user,
        role: user?.role ?? null,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthContext() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuthContext must be used inside <AuthProvider>');
    return ctx;
}
