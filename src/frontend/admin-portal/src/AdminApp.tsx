/**
 * Admin Portal Root Component
 * 
 * This is the root component of the ArthaNidhi Admin Portal. It sets up:
 * - TanStack Router for admin-specific routes
 * - ThemeProvider for light/dark mode support
 * - AdminAuthProvider for admin authentication
 * - Toaster for toast notifications
 * - AdminShell layout wrapper for consistent admin page structure
 * 
 * All authenticated admin routes are wrapped with AdminProtectedRoute component.
 */

import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import AdminShell from './components/layout/AdminShell';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminSignupPage from './pages/AdminSignupPage';
import AdminForgotPasswordPage from './pages/AdminForgotPasswordPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AccessDeniedPage from './pages/AccessDeniedPage';
import AdminProtectedRoute from './components/auth/AdminProtectedRoute';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { AdminAuthProvider } from './contexts/AdminAuthContext';

// Root layout component that wraps all admin pages with AdminShell
function AdminRootLayout() {
  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}

// Root route definition
const rootRoute = createRootRoute({
  component: AdminRootLayout,
});

// Public routes (no authentication required)
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: AdminLoginPage,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: AdminSignupPage,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  component: AdminForgotPasswordPage,
});

const accessDeniedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/access-denied',
  component: AccessDeniedPage,
});

// Protected routes (admin authentication required)
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <AdminProtectedRoute>
      <AdminDashboardPage />
    </AdminProtectedRoute>
  ),
});

// Build route tree
const routeTree = rootRoute.addChildren([
  loginRoute,
  signupRoute,
  forgotPasswordRoute,
  accessDeniedRoute,
  dashboardRoute,
]);

// Create router instance
const router = createRouter({ routeTree });

/**
 * AdminApp Component
 * 
 * Wraps the entire admin portal with necessary providers:
 * 1. ThemeProvider - Manages light/dark theme with system preference support
 * 2. AdminAuthProvider - Manages admin authentication state and localStorage session
 * 3. RouterProvider - Handles client-side routing
 * 4. Toaster - Displays toast notifications
 */
export default function AdminApp() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AdminAuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AdminAuthProvider>
    </ThemeProvider>
  );
}
