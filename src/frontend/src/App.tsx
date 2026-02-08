/**
 * Main Application Component
 * 
 * This is the root component of the ArthaNidhi application. It sets up:
 * - TanStack Router for client-side routing with protected routes
 * - ThemeProvider for light/dark mode support
 * - AuthProvider for email/password authentication (localStorage-based)
 * - BalanceVisibilityProvider for session-persisted balance hide/show toggle
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
import TransferPage from './pages/TransferPage';
import StatementsPage from './pages/StatementsPage';
import MarketInsightsPage from './pages/MarketInsightsPage';
import MutualFundsPage from './pages/MutualFundsPage';
import StocksPage from './pages/StocksPage';
import GoldSilverRatesPage from './pages/GoldSilverRatesPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import PaymentsPage from './pages/PaymentsPage';
import BeneficiariesPage from './pages/BeneficiariesPage';
import CardsPage from './pages/CardsPage';
import LoansPage from './pages/LoansPage';
import DepositsPage from './pages/DepositsPage';
import InsurancePage from './pages/InsurancePage';
import RewardsOffersPage from './pages/RewardsOffersPage';
import NotificationsPage from './pages/NotificationsPage';
import SupportContactPage from './pages/SupportContactPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from './contexts/AuthContext';
import { BalanceVisibilityProvider } from './contexts/BalanceVisibilityContext';

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

const transferRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/transfer',
  component: () => (
    <ProtectedRoute>
      <TransferPage />
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

const paymentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payments',
  component: () => (
    <ProtectedRoute>
      <PaymentsPage />
    </ProtectedRoute>
  ),
});

const beneficiariesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/beneficiaries',
  component: () => (
    <ProtectedRoute>
      <BeneficiariesPage />
    </ProtectedRoute>
  ),
});

const cardsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cards',
  component: () => (
    <ProtectedRoute>
      <CardsPage />
    </ProtectedRoute>
  ),
});

const loansRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/loans',
  component: () => (
    <ProtectedRoute>
      <LoansPage />
    </ProtectedRoute>
  ),
});

const depositsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/deposits',
  component: () => (
    <ProtectedRoute>
      <DepositsPage />
    </ProtectedRoute>
  ),
});

const insuranceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/insurance',
  component: () => (
    <ProtectedRoute>
      <InsurancePage />
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

const rewardsOffersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/rewards-offers',
  component: () => (
    <ProtectedRoute>
      <RewardsOffersPage />
    </ProtectedRoute>
  ),
});

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notifications',
  component: () => (
    <ProtectedRoute>
      <NotificationsPage />
    </ProtectedRoute>
  ),
});

const supportContactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/support',
  component: () => (
    <ProtectedRoute>
      <SupportContactPage />
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
  transferRoute,
  statementsRoute,
  paymentsRoute,
  beneficiariesRoute,
  cardsRoute,
  loansRoute,
  depositsRoute,
  insuranceRoute,
  marketInsightsRoute,
  mutualFundsRoute,
  stocksRoute,
  goldSilverRatesRoute,
  rewardsOffersRoute,
  notificationsRoute,
  supportContactRoute,
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
 * 3. BalanceVisibilityProvider - Manages balance visibility state with sessionStorage persistence
 * 4. RouterProvider - Handles client-side routing
 * 5. Toaster - Displays toast notifications
 */
export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <BalanceVisibilityProvider>
          <RouterProvider router={router} />
          <Toaster />
        </BalanceVisibilityProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
