import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthResponse } from '../types';

interface AuthContextType {
    token: string | null;
    user: Omit<AuthResponse, 'token'> | null;
    login: (data: AuthResponse) => void;
    logout: () => void;
    isAuthenticated: boolean;
}
// eslint-disable-next-line
export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem('token')
    );
    const [user, setUser] = useState<Omit<AuthResponse, 'token'> | null>(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    const login = (data: AuthResponse) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
            name: data.name,
            email: data.email,
            role: data.role
        }));
        setToken(data.token);
        setUser({ name: data.name, email: data.email, role: data.role });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            token,
            user,
            login,
            logout,
            isAuthenticated: !!token
        }}>
            {children}
        </AuthContext.Provider>
    );
}