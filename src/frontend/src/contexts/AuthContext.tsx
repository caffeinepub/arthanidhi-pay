/**
 * Authentication Context
 * 
 * This module provides a localStorage-based authentication system for the ArthaNidhi
 * application. It manages user sessions, login, signup, and logout functionality.
 * 
 * ⚠️ IMPORTANT: This is a demo authentication system for development purposes only.
 * It stores user credentials in plain text in localStorage, which is NOT secure for
 * production use.
 * 
 * Key features:
 * - Signup: Creates new user accounts stored in localStorage
 * - Login: Validates credentials against stored users
 * - Session: Persists user session in localStorage (key: 'arthanidhi_user')
 * - REST mode integration: The user.id is used as a bearer token in REST API calls
 * 
 * For production:
 * - Implement secure backend authentication (JWT, OAuth2, etc.)
 * - Hash passwords with bcrypt or Argon2
 * - Use httpOnly cookies for session management
 * - Implement CSRF protection
 * - Add rate limiting for login attempts
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * User object structure stored in localStorage
 */
interface User {
  id: string;        // Unique user ID (e.g., "user_1234567890")
  email: string;     // User's email address
  displayName: string; // User's display name
  createdAt: number; // Account creation timestamp (milliseconds)
}

/**
 * Authentication context value
 */
interface AuthContextType {
  user: User | null;           // Current user or null if not authenticated
  isAuthenticated: boolean;    // True if user is logged in
  isLoading: boolean;          // True while checking for existing session
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component that wraps the application and provides authentication state.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('arthanidhi_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('arthanidhi_user');
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * Creates a new user account.
   * 
   * @param email - User's email address
   * @param password - User's password (stored in plain text - NOT SECURE)
   * @param displayName - User's display name
   * @throws Error if user already exists
   */
  const signup = async (email: string, password: string, displayName: string) => {
    // Get existing users from localStorage
    const usersData = localStorage.getItem('arthanidhi_users');
    const users: Record<string, { password: string; user: User }> = usersData 
      ? JSON.parse(usersData) 
      : {};

    // Check if user already exists
    if (users[email]) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      displayName,
      createdAt: Date.now(),
    };

    // Store user credentials (⚠️ password is NOT hashed - insecure!)
    users[email] = {
      password,
      user: newUser,
    };

    localStorage.setItem('arthanidhi_users', JSON.stringify(users));
    localStorage.setItem('arthanidhi_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  /**
   * Logs in an existing user.
   * 
   * @param email - User's email address
   * @param password - User's password
   * @throws Error if user not found or password is incorrect
   */
  const login = async (email: string, password: string) => {
    const usersData = localStorage.getItem('arthanidhi_users');
    const users: Record<string, { password: string; user: User }> = usersData 
      ? JSON.parse(usersData) 
      : {};

    const userRecord = users[email];
    
    if (!userRecord) {
      throw new Error('User not found. Please sign up first.');
    }

    if (userRecord.password !== password) {
      throw new Error('Invalid password');
    }

    localStorage.setItem('arthanidhi_user', JSON.stringify(userRecord.user));
    setUser(userRecord.user);
  };

  /**
   * Logs out the current user by clearing the session from localStorage.
   */
  const logout = () => {
    localStorage.removeItem('arthanidhi_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
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
    </AuthContext.Provider>
  );
}

/**
 * Hook to access authentication context.
 * Must be used within an AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
