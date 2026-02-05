/**
 * Admin Portal Environment Configuration
 * 
 * Loads and validates environment variables for the Admin Portal.
 * Keeps admin configuration isolated from user portal configuration.
 */

interface AdminEnvConfig {
  mode: 'ic' | 'rest';
  backendUrl?: string;
  canisterId?: string;
  environment: 'development' | 'staging' | 'production';
}

function loadAdminEnv(): AdminEnvConfig {
  const mode = (import.meta.env.VITE_ADMIN_BACKEND_MODE || 'ic') as 'ic' | 'rest';
  const backendUrl = import.meta.env.VITE_ADMIN_BACKEND_URL;
  const canisterId = import.meta.env.VITE_ADMIN_CANISTER_ID;
  const environment = (import.meta.env.VITE_ADMIN_ENV || 'development') as 'development' | 'staging' | 'production';

  if (mode === 'rest' && !backendUrl) {
    console.warn('Admin Portal: REST mode enabled but VITE_ADMIN_BACKEND_URL not set. Using default.');
  }

  if (mode === 'ic' && !canisterId) {
    console.warn('Admin Portal: IC mode enabled but VITE_ADMIN_CANISTER_ID not set.');
  }

  return {
    mode,
    backendUrl: backendUrl || 'http://localhost:4000/admin',
    canisterId,
    environment,
  };
}

export const adminEnv = loadAdminEnv();
