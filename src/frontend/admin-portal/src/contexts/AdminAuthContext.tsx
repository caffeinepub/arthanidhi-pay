/**
 * Admin Authentication Context
 * 
 * This module provides a localStorage-based authentication system for the ArthaNidhi
 * Admin Portal. It manages admin sessions, login, signup, and logout functionality.
 * 
 * ⚠️ IMPORTANT: This is a demo authentication system for development purposes only.
 * It stores admin credentials in plain text in localStorage, which is NOT secure for
 * production use.
 * 
 * Key features:
 * - Signup: Creates new admin accounts stored in localStorage
 * - Login: Validates credentials against stored admins
 * - Session: Persists admin session in localStorage (key: 'arthanidhi_admin_user')
 * - Isolated from user portal: Uses separate localStorage keys
 * 
 * For production:
 * - Implement secure backend authentication (JWT, OAuth2, etc.)
 * - Hash passwords with bcrypt or Argon2
 * - Use httpOnly cookies for session management
 * - Implement CSRF protection
 * - Add rate limiting for login attempts
 * - Implement role-based access control (RBAC)
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * Admin user object structure stored in localStorage
 */
interface AdminUser {
  id: string;        // Unique admin ID (e.g., "admin_1234567890")
  email: string;     // Admin's email address
  displayName: string; // Admin's display name
  role: 'admin';     // Admin role (always 'admin')
  createdAt: number; // Account creation timestamp (milliseconds)
}

/**
 * Admin authentication context value
 */
interface AdminAuthContextType {
  user: AdminUser | null;           // Current admin user or null if not authenticated
  isAuthenticated: boolean;         // True if admin is logged in
  isLoading: boolean;               // True while checking for existing session
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

/**
 * AdminAuthProvider component that wraps the admin portal and provides authentication state.
 */
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing admin session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('arthanidhi_admin_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored admin user:', error);
        localStorage.removeItem('arthanidhi_admin_user');
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * Creates a new admin account.
   * 
   * @param email - Admin's email address
   * @param password - Admin's password (stored in plain text - NOT SECURE)
   * @param displayName - Admin's display name
   * @throws Error if admin already exists
   */
  const signup = async (email: string, password: string, displayName: string) => {
    // Get existing admins from localStorage
    const adminsData = localStorage.getItem('arthanidhi_admins');
    const admins: Record<string, { password: string; user: AdminUser }> = adminsData 
      ? JSON.parse(adminsData) 
      : {};

    // Check if admin already exists
    if (admins[email]) {
      throw new Error('Admin with this email already exists');
    }

    // Create new admin user
    const newUser: AdminUser = {
      id: `admin_${Date.now()}`,
      email,
      displayName,
      role: 'admin',
      createdAt: Date.now(),
    };

    // Store admin credentials (⚠️ password is NOT hashed - insecure!)
    admins[email] = {
      password,
      user: newUser,
    };

    localStorage.setItem('arthanidhi_admins', JSON.stringify(admins));
    localStorage.setItem('arthanidhi_admin_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  /**
   * Logs in an existing admin.
   * 
   * @param email - Admin's email address
   * @param password - Admin's password
   * @throws Error if admin not found or password is incorrect
   */
  const login = async (email: string, password: string) => {
    const adminsData = localStorage.getItem('arthanidhi_admins');
    const admins: Record<string, { password: string; user: AdminUser }> = adminsData 
      ? JSON.parse(adminsData) 
      : {};

    const adminRecord = admins[email];
    
    if (!adminRecord) {
      throw new Error('Admin not found. Please sign up first.');
    }

    if (adminRecord.password !== password) {
      throw new Error('Invalid password');
    }

    localStorage.setItem('arthanidhi_admin_user', JSON.stringify(adminRecord.user));
    setUser(adminRecord.user);
  };

  /**
   * Logs out the current admin by clearing the session from localStorage.
   */
  const logout = () => {
    localStorage.removeItem('arthanidhi_admin_user');
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

/**
 * Hook to access admin authentication context.
 * Must be used within an AdminAuthProvider.
 */
export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
