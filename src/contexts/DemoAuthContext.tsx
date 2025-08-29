"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: 'PATIENT' | 'DOCTOR';
}

interface DemoAuthContextType {
  user: DemoUser | null;
  isAuthenticated: boolean;
  isDemo: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  enableDemoMode: () => void;
}

const DemoAuthContext = createContext<DemoAuthContextType | undefined>(undefined);

// Demo users for testing
const DEMO_USERS: DemoUser[] = [
  {
    id: '1',
    email: 'patient@demo.com',
    name: 'Demo Patient',
    role: 'PATIENT'
  },
  {
    id: '2', 
    email: 'doctor@demo.com',
    name: 'Dr. Demo',
    role: 'DOCTOR'
  }
];

export function DemoAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const router = useRouter();

  // Check for existing demo session on mount
  useEffect(() => {
    const demoAuth = localStorage.getItem('demo-auth');
    const demoUser = localStorage.getItem('demo-user');
    const isNetlify = typeof window !== 'undefined' && window.location.hostname.includes('netlify');
    
    if (demoAuth === 'true' && demoUser) {
      try {
        const user = JSON.parse(demoUser);
        setUser(user);
        setIsDemo(true);
        
        // Set cookies for middleware
        document.cookie = `demo-auth=true; path=/; max-age=86400`;
        document.cookie = `demo-user=${user.email}; path=/; max-age=86400`;
      } catch (error) {
        console.error('Failed to parse demo user:', error);
        localStorage.removeItem('demo-auth');
        localStorage.removeItem('demo-user');
      }
    } else if (isNetlify) {
      // Auto-enable demo mode in Netlify environment
      enableDemoMode();
    }
  }, []);

  const enableDemoMode = () => {
    // Auto-login as demo patient in Netlify environment
    const demoUser = DEMO_USERS[0]; // Default to patient
    
    setUser(demoUser);
    setIsDemo(true);
    
    // Store in localStorage
    localStorage.setItem('demo-auth', 'true');
    localStorage.setItem('demo-user', JSON.stringify(demoUser));
    
    // Set cookies for middleware
    document.cookie = `demo-auth=true; path=/; max-age=86400`;
    document.cookie = `demo-user=${demoUser.email}; path=/; max-age=86400`;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Check demo users first
    const demoUser = DEMO_USERS.find(u => u.email === email);
    
    if (demoUser && (password === 'demo123' || password === 'demo')) {
      setUser(demoUser);
      setIsDemo(true);
      
      // Store in localStorage for persistence
      localStorage.setItem('demo-auth', 'true');
      localStorage.setItem('demo-user', JSON.stringify(demoUser));
      
      // Set cookies for middleware
      document.cookie = `demo-auth=true; path=/; max-age=86400`;
      document.cookie = `demo-user=${demoUser.email}; path=/; max-age=86400`;
      
      return true;
    }

    // If not demo user, try regular authentication (would fail in serverless)
    try {
      // This would normally call the NextAuth signIn function
      // For now, we'll just return false since API routes don't work
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsDemo(false);
    
    // Clear localStorage
    localStorage.removeItem('demo-auth');
    localStorage.removeItem('demo-user');
    
    // Clear cookies
    document.cookie = 'demo-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'demo-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    router.push('/');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isDemo,
    login,
    logout,
    enableDemoMode
  };

  return (
    <DemoAuthContext.Provider value={value}>
      {children}
    </DemoAuthContext.Provider>
  );
}

export function useDemoAuth(): DemoAuthContextType {
  const context = useContext(DemoAuthContext);
  if (context === undefined) {
    throw new Error('useDemoAuth must be used within a DemoAuthProvider');
  }
  return context;
}

// Hook to check if we're in demo mode
export function useIsDemo(): boolean {
  const { isDemo } = useDemoAuth();
  return isDemo;
}

// Hook to get demo user info
export function useDemoUser(): DemoUser | null {
  const { user, isDemo } = useDemoAuth();
  return isDemo ? user : null;
}