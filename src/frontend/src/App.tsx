/**
 * Main Application Component
 * 
 * This is the root component of the ArthaNidhi application. It sets up:
 * - TanStack Router for client-side routing with protected routes
 * - ThemeProvider for light/dark mode support
 * - AuthProvider for email/password authentication (localStorage-based)
 * - Toaster for toast notifications
 * - AppShell layout wrapper for consistent page structure
 * 
 * All authenticated routes are wrapped with ProtectedRoute component to ensure
 * users must be logged in before accessing application features.
 */

import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import AppShell from './components/layout/AppShell';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import AccountPage from './pages/AccountPage';
import StatementsPage from './pages/StatementsPage';
import MarketInsightsPage from './pages/MarketInsightsPage';
import MutualFundsPage from './pages/MutualFundsPage';
import StocksPage from './pages/StocksPage';
import GoldSilverRatesPage from './pages/GoldSilverRatesPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from './contexts/AuthContext';

// Root layout component that wraps all pages with AppShell
function RootLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

// Root route definition
const rootRoute = createRootRoute({
  component: RootLayout,
});

// Public routes (no authentication required)
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LoginPage,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: SignupPage,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  component: ForgotPasswordPage,
});

// Protected routes (authentication required)
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  ),
});

const accountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/account',
  component: () => (
    <ProtectedRoute>
      <AccountPage />
    </ProtectedRoute>
  ),
});

const statementsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/statements',
  component: () => (
    <ProtectedRoute>
      <StatementsPage />
    </ProtectedRoute>
  ),
});

const marketInsightsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/market-insights',
  component: () => (
    <ProtectedRoute>
      <MarketInsightsPage />
    </ProtectedRoute>
  ),
});

const mutualFundsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mutual-funds',
  component: () => (
    <ProtectedRoute>
      <MutualFundsPage />
    </ProtectedRoute>
  ),
});

const stocksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/stocks',
  component: () => (
    <ProtectedRoute>
      <StocksPage />
    </ProtectedRoute>
  ),
});

const goldSilverRatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/gold-silver-rates',
  component: () => (
    <ProtectedRoute>
      <GoldSilverRatesPage />
    </ProtectedRoute>
  ),
});

const profileSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: () => (
    <ProtectedRoute>
      <ProfileSettingsPage />
    </ProtectedRoute>
  ),
});

// Build route tree
const routeTree = rootRoute.addChildren([
  loginRoute,
  signupRoute,
  forgotPasswordRoute,
  dashboardRoute,
  accountRoute,
  statementsRoute,
  marketInsightsRoute,
  mutualFundsRoute,
  stocksRoute,
  goldSilverRatesRoute,
  profileSettingsRoute,
]);

// Create router instance
const router = createRouter({ routeTree });

/**
 * App Component
 * 
 * Wraps the entire application with necessary providers:
 * 1. ThemeProvider - Manages light/dark theme with system preference support
 * 2. AuthProvider - Manages user authentication state and localStorage session
 * 3. RouterProvider - Handles client-side routing
 * 4. Toaster - Displays toast notifications
 */
export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}
