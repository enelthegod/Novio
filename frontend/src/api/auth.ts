import api from './axios';
import type { AuthResponse } from '../types';

interface LoginData {
    email: string;
    password: string;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    role: string;
}

export const login = async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/Auth/login', data);
    return response.data;
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/Auth/register', data);
    return response.data;
};