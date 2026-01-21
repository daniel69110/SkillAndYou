import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface RequireAuthProps {
    children: ReactNode;
}

export const RequireAuth = ({ children }: RequireAuthProps) => {
    const { token } = useAuth();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};