// File: context/AuthContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
  ID: number;
  Name: string;
  Email: string;
  Role: string; 
}

interface AuthContextType {
  user: User | null;
  login: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = async (loginData: any) => {
    // Panggil API login Anda
    const response = await api.post('/auth/login', loginData);
    if (response.status) {
      // Simpan data user dari respons
      setUser(response.data.user);
      router.push('/kasir'); // Arahkan ke halaman kasir
    } else {
      throw new Error(response.message);
    }
  };

  const logout = async () => {
    await api.delete('/auth/logout');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};