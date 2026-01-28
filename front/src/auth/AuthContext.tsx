import {createContext, useContext, useEffect, useState} from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { authApi } from '../api/authApi';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    setAuth: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider');
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);  // ← AJOUTÉ

    // ===== NOUVEAU: Recharge token au démarrage =====
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            // Decode JWT pour récupérer user info
            try {
                const payload = JSON.parse(atob(storedToken.split('.')[1]));
                const userFromToken: User = {
                    id: payload.userId,
                    email: payload.sub,
                    firstName: payload.firstName || '',
                    lastName: payload.lastName || '',
                    skills: []
                };
                setToken(storedToken);
                setUser(userFromToken);
            } catch (error) {
                console.error('Token invalide:', error);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const { token: t, user: u } = await authApi.login({ email, password });
        localStorage.setItem('token', t);
        setToken(t);
        setUser(u);
    };

    const setAuth = (token: string, user: User) => {
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    // Affiche loader pendant vérification token
    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Chargement...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, token, login, setAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
