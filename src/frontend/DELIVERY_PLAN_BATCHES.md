# ArthaNidhi Project Delivery Plan - Batch Structure

This document provides an ordered, deterministic sequence for assembling the ArthaNidhi project code in batches. It clearly separates user portal files from admin portal files and provides instructions for running both in VS Code.

## Project Overview

The ArthaNidhi project consists of two separate React applications:

1. **User Portal** (`frontend/`) - Customer-facing banking application
2. **Admin Portal** (`frontend/admin-portal/`) - Administrative management interface

Both portals share the same design system and UI components but run independently with separate authentication systems and environment configurations.

## Batch 1: Shared Configuration & Assets

These files are shared between both portals:

### Configuration Files (Root Level)
- `frontend/package.json` - Shared dependencies
- `frontend/tailwind.config.js` - Shared Tailwind configuration
- `frontend/postcss.config.js` - PostCSS configuration
- `frontend/tsconfig.json` - TypeScript configuration
- `frontend/vite.config.js` - Vite build configuration

### Shared Styles
- `frontend/src/index.css` - Global styles with OKLCH color system and wave background utility

### Shared UI Components (Read-Only)
- `frontend/src/components/ui/*` - All shadcn/ui components (do not modify)

### Assets
- `frontend/public/assets/generated/arthanidhi-logo.dim_512x512.png`
- `frontend/public/assets/generated/arthanidhi-logo-lockup.dim_1400x400.png`
- `frontend/public/assets/generated/arthanidhi-wave-bg.dim_1920x1080.png`
- All other assets in `frontend/public/assets/`

## Batch 2: User Portal Core

### Entry Points
- `frontend/index.html` - User portal HTML entry
- `frontend/src/main.tsx` - User portal React bootstrap
- `frontend/src/App.tsx` - User portal root component with routing

### Authentication & Context
- `frontend/src/contexts/AuthContext.tsx` - User authentication context
- `frontend/src/components/auth/ProtectedRoute.tsx` - User route guard

### Layout Components
- `frontend/src/components/layout/AppShell.tsx` - User portal layout wrapper
- `frontend/src/components/layout/Header.tsx` - User portal navigation
- `frontend/src/components/layout/Footer.tsx` - User portal footer

## Batch 3: User Portal Pages

### Authentication Pages
- `frontend/src/pages/LoginPage.tsx` - User login
- `frontend/src/pages/SignupPage.tsx` - User signup
- `frontend/src/pages/ForgotPasswordPage.tsx` - User password recovery

### Application Pages
- `frontend/src/pages/DashboardPage.tsx` - User dashboard
- `frontend/src/pages/AccountPage.tsx` - Account overview
- `frontend/src/pages/StatementsPage.tsx` - Transaction statements
- `frontend/src/pages/MarketInsightsPage.tsx` - Market data
- `frontend/src/pages/MutualFundsPage.tsx` - Mutual funds
- `frontend/src/pages/StocksPage.tsx` - Stock listings
- `frontend/src/pages/ProfileSettingsPage.tsx` - User settings

## Batch 4: User Portal Backend Integration

### Backend Client
- `frontend/src/backendClient/types.ts` - Backend client interface
- `frontend/src/backendClient/config.ts` - Backend configuration
- `frontend/src/backendClient/icClient.ts` - IC mode client
- `frontend/src/backendClient/restClient.ts` - REST mode client
- `frontend/src/backendClient/index.ts` - Client factory

### Hooks & Utilities
- `frontend/src/hooks/useQueries.ts` - React Query hooks
- `frontend/src/hooks/useSettings.ts` - Settings management
- `frontend/src/utils/currency.ts` - Currency formatting
- `frontend/src/utils/csv.ts` - CSV export
- `frontend/src/utils/jsonBigint.ts` - BigInt JSON handling

### Environment
- `frontend/.env.example` - User portal environment template

## Batch 5: Admin Portal Core

### Entry Points
- `frontend/admin-portal/index.html` - Admin portal HTML entry
- `frontend/admin-portal/src/main.tsx` - Admin portal React bootstrap
- `frontend/admin-portal/src/AdminApp.tsx` - Admin portal root component

### Authentication & Context
- `frontend/admin-portal/src/contexts/AdminAuthContext.tsx` - Admin authentication
- `frontend/admin-portal/src/components/auth/AdminProtectedRoute.tsx` - Admin route guard

### Layout Components
- `frontend/admin-portal/src/components/layout/AdminShell.tsx` - Admin layout wrapper
- `frontend/admin-portal/src/components/layout/AdminHeader.tsx` - Admin navigation

### Styles
- `frontend/admin-portal/src/styles/admin.css` - Admin portal styles (imports shared)

## Batch 6: Admin Portal Pages

### Authentication Pages
- `frontend/admin-portal/src/pages/AdminLoginPage.tsx` - Admin login
- `frontend/admin-portal/src/pages/AdminSignupPage.tsx` - Admin signup
- `frontend/admin-portal/src/pages/AdminForgotPasswordPage.tsx` - Admin password recovery

### Application Pages
- `frontend/admin-portal/src/pages/AdminDashboardPage.tsx` - Admin dashboard
- `frontend/admin-portal/src/pages/AccessDeniedPage.tsx` - Access denied screen

## Batch 7: Admin Portal Backend & Configuration

### Backend Client
- `frontend/admin-portal/src/backend/adminBackendClient.ts` - Admin backend client

### Configuration
- `frontend/admin-portal/src/config/env.ts` - Admin environment loader
- `frontend/admin-portal/.env.example` - Admin environment template

### Documentation
- `frontend/admin-portal/README.md` - Admin portal documentation

## Batch 8: Documentation

### Project Documentation
- `frontend/README.md` - Main project documentation
- `frontend/DELIVERY_PLAN_BATCHES.md` - This file
- `frontend/ENVIRONMENT_SETUP.md` - Environment setup guide
- `frontend/REST_BACKEND_CONTRACT.md` - REST API specification

## Running Both Portals in VS Code

### Prerequisites
1. Node.js 18+ installed
2. VS Code with two terminal windows

### Setup Steps

1. **Install Dependencies (once):**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure User Portal:**
   ```bash
   cd frontend
   cp .env.example .env
   # Edit .env as needed
   ```

3. **Configure Admin Portal:**
   ```bash
   cd frontend/admin-portal
   cp .env.example .env
   # Edit .env as needed
   ```

### Running Side-by-Side

**Terminal 1 - User Portal:**
