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
- DFX (DFINITY Canister SDK) - Required for IC mode only

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

## Development Environments

ArthaNidhi Pay supports multiple environment configurations:

### Available Environment Files

- `.env.development.example` - Development environment template
- `.env.staging.example` - Staging environment template  
- `.env.example` - Default environment template

### Running Different Environments

**Development (default):**
