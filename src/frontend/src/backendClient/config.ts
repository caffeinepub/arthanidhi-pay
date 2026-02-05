/**
 * Backend Configuration Module
 * 
 * This module reads environment variables to determine which backend mode to use:
 * - 'ic': Internet Computer mode (uses Motoko canister via actor)
 * - 'rest': REST API mode (uses external Node.js/Express backend)
 * 
 * Environment Variables:
 * - VITE_BACKEND_MODE: 'ic' or 'rest' (default: 'ic')
 * - VITE_REST_BASE_URL: Base URL for REST API (default: 'http://localhost:3001/api')
 * 
 * The configuration is validated and warnings are logged for invalid or missing values.
 */

export interface BackendConfig {
  mode: 'ic' | 'rest';
  restBaseUrl: string;
}

/**
 * Reads and validates backend configuration from environment variables.
 * 
 * @returns BackendConfig object with validated mode and REST base URL
 */
export function getBackendConfig(): BackendConfig {
  // Read environment variables with defaults
  const mode = (import.meta.env.VITE_BACKEND_MODE || 'ic') as 'ic' | 'rest';
  const restBaseUrl = import.meta.env.VITE_REST_BASE_URL || 'http://localhost:3001/api';

  // Validate mode
  if (mode !== 'ic' && mode !== 'rest') {
    console.warn(`Invalid VITE_BACKEND_MODE: ${mode}. Defaulting to 'ic'.`);
    return { mode: 'ic', restBaseUrl };
  }

  // Warn if REST mode is enabled but base URL is not configured
  if (mode === 'rest' && !import.meta.env.VITE_REST_BASE_URL) {
    console.warn('REST mode enabled but VITE_REST_BASE_URL not set. Using default: http://localhost:3001/api');
  }

  return { mode, restBaseUrl };
}
