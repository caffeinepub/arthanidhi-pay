# ArthaNidhi - Indian Personal Finance Assistant

ArthaNidhi is a comprehensive personal finance management application designed for the Indian market, featuring account management, transaction tracking, market insights, and investment tools.

## Project Structure

This project consists of two separate React applications:

### 1. User Portal (`frontend/`)
The customer-facing banking application with features including:
- Account management and balance tracking
- Transaction statements and search
- Market insights (NIFTY, SENSEX, Indian stocks)
- Mutual funds and stocks information
- Profile and settings management

### 2. Admin Portal (`frontend/admin-portal/`)
The administrative management interface with features including:
- User management and oversight
- System monitoring and configuration
- Admin-specific authentication
- Role-based access control

Both portals share the same design system and UI components but run independently with separate authentication systems.

## Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or pnpm package manager

### Installation

1. **Clone the repository and install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   # User Portal
   cp .env.example .env
   
   # Admin Portal
   cd admin-portal
   cp .env.example .env
   cd ..
   ```

3. **Run the applications:**

   **Option A: User Portal Only**
   ```bash
   npm run dev
   ```
   Access at: `http://localhost:3000`

   **Option B: Both Portals Side-by-Side**
   
   Terminal 1 (User Portal):
   ```bash
   npm run dev
   ```
   
   Terminal 2 (Admin Portal):
   ```bash
   cd admin-portal
   npm run dev
   ```
   
   - User Portal: `http://localhost:3000`
   - Admin Portal: `http://localhost:3001`

## Authentication Systems

### User Portal Authentication
- **Storage Keys**: `arthanidhi_user`, `arthanidhi_users`
- **Access**: Regular user accounts
- **Routes**: `/dashboard`, `/account`, `/statements`, etc.

### Admin Portal Authentication
- **Storage Keys**: `arthanidhi_admin_user`, `arthanidhi_admins`
- **Access**: Admin accounts only
- **Routes**: `/dashboard` (admin-specific)

Both authentication systems are completely isolated and can run simultaneously without conflicts.

⚠️ **Security Note**: The current authentication is localStorage-based for development only. For production, implement secure backend authentication with proper password hashing, JWT tokens, and httpOnly cookies.

## Features

### User Portal
- **Dashboard**: Overview of balance, recent transactions, and quick actions
- **Account Management**: View balance, monthly credits/debits, and financial charts
- **Statements**: Filter, search, and export transaction history
- **Market Insights**: Real-time Indian market data (NIFTY, SENSEX, stocks)
- **Mutual Funds**: Browse Indian mutual funds with NAV and returns
- **Stocks**: View Indian stock prices and daily changes
- **Settings**: Update profile and toggle light/dark theme

### Admin Portal
- **Dashboard**: System overview and admin tools
- **User Management**: (Coming soon) Manage user accounts and KYC
- **System Monitoring**: (Coming soon) Monitor system health and activity
- **Configuration**: (Coming soon) System settings and configuration

## Backend Integration

The application supports two backend modes:

### IC Mode (Internet Computer)
Uses the Motoko backend canister for all operations.

