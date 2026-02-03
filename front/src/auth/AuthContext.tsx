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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setToken(storedToken);
                setUser(user);
                console.log('✅ User rechargé depuis localStorage:', user);
            } catch (error) {
                console.error('❌ Erreur parsing user:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const { token: t, user: u } = await authApi.login({ email, password });

            // STOCKE TOKEN + USER
            localStorage.setItem('token', t);
            localStorage.setItem('user', JSON.stringify(u));

            setToken(t);
            setUser(u);

            console.log('✅ Login réussi, user:', u);

        } catch (error: any) {
            console.error('❌ Erreur login dans AuthContext:', error);

            // ✅ DÉTECTE SI COMPTE SUSPENDU
            if (error.response?.data?.error === 'ACCOUNT_SUSPENDED') {
                console.log('⚠️ Compte suspendu détecté');
                throw new Error('SUSPENDED');  // ✅ THROW l'erreur spéciale
            }

            // ✅ Re-throw les autres erreurs
            throw error;
        }
    };

    const setAuth = (token: string, user: User) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setToken(token);
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        console.log('✅ Logout, localStorage vidé');
    };

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Chargement...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, token, login, setAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
