# ArthaNidhi Admin Portal

This is the administrative portal for ArthaNidhi, providing secure access to system management, user oversight, and configuration tools.

## Overview

The Admin Portal is a separate React application that runs independently from the user-facing ArthaNidhi portal. It uses the same design system and background styling but provides distinct administrative functionality.

## Features

- **Separate Authentication**: Admin portal uses its own authentication system with isolated localStorage keys
- **Role-Based Access**: Only users with admin role can access protected admin routes
- **Independent Environment**: Runs on its own port with separate environment configuration
- **Shared Design System**: Uses the same ArthaNidhi wave background and UI components

## Running the Admin Portal

### Development Mode

1. **Navigate to the admin portal directory:**
   ```bash
   cd frontend/admin-portal
   ```

2. **Install dependencies (if not already installed):**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The admin portal will run on `http://localhost:3001` (or the next available port).

### Running Both Portals Side-by-Side in VS Code

To run both the user portal and admin portal simultaneously:

1. **Open two terminal windows in VS Code**

2. **Terminal 1 - User Portal:**
   ```bash
   cd frontend
   npm run dev
   ```
   Runs on `http://localhost:3000`

3. **Terminal 2 - Admin Portal:**
   ```bash
   cd frontend/admin-portal
   npm run dev
   ```
   Runs on `http://localhost:3001`

Both portals will run independently with their own authentication systems and environment configurations.

## Environment Configuration

The admin portal uses separate environment variables from the user portal:

- `VITE_ADMIN_BACKEND_MODE`: Backend mode (ic or rest)
- `VITE_ADMIN_BACKEND_URL`: Backend URL for REST mode
- `VITE_ADMIN_CANISTER_ID`: Canister ID for IC mode
- `VITE_ADMIN_ENV`: Environment (development, staging, production)

See `.env.example` for the complete list of configuration options.

## Authentication

The admin portal uses a separate authentication system:

- **Storage Keys**: Uses `arthanidhi_admin_user` and `arthanidhi_admins` (isolated from user portal)
- **Role Requirement**: All protected routes require admin role
- **Password Reset**: Includes forgot password flow for admin accounts

## Project Structure

