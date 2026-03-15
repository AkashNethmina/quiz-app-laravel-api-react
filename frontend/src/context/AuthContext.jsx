import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from '../lib/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser]                   = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading]         = useState(true);

    // ── Rehydrate session on mount ────────────────────────────────────────────
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

export function useAuthContext() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuthContext must be used inside <AuthProvider>');
    return ctx;
}
