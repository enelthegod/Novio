import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import type { ReactNode } from 'react';

interface Props {
    children: ReactNode;
    roles?: string[];
}

export default function ProtectedRoute({ children, roles }: Props) {
    const { isAuthenticated, user } = useAuth();

    // Redirect to login if not authenticated
    if (!isAuthenticated) return <Navigate to="/login" />;

    // Redirect if user doesn't have required role
    if (roles && user && !roles.includes(user.role)) {
        return <Navigate to="/jobs" />;
    }

    return <>{children}</>;
}