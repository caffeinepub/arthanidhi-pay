/**
 * Backend Client Factory
 * 
 * This module provides a factory function that returns the appropriate backend client
 * based on the current configuration (IC or REST mode). It caches the client instance
 * to avoid recreating it on every call.
 * 
 * Client selection behavior:
 * - IC mode: Requires an actor parameter; returns ICBackendClient that delegates to the Motoko canister
 * - REST mode: Uses the configured base URL; returns RESTBackendClient that makes HTTP requests
 * 
 * Constraint: In IC mode, the actor must be provided. In REST mode, the base URL must be configured.
 */

import { ICBackendClient } from './icClient';
import { RESTBackendClient } from './restClient';
import type { BackendClient, BackendConfig } from './types';
import type { backendInterface } from '../backend';
import { getBackendConfig as getConfig } from './config';

let cachedClient: BackendClient | null = null;
let cachedMode: string | null = null;

/**
 * Get the backend configuration from environment variables
 */
export function getBackendConfig(): BackendConfig {
  return getConfig();
}

/**
 * Get or create a backend client instance based on the current configuration.
 * 
 * @param actor - Optional actor for IC mode (required when mode is 'ic')
 * @returns BackendClient instance
 * @throws Error if configuration is invalid
 */
export function getBackendClient(actor?: backendInterface): BackendClient {
  const config = getBackendConfig();

  // Reset cache if mode changed
  if (cachedMode !== config.mode) {
    cachedClient = null;
    cachedMode = config.mode;
  }

  // Return cached client if available
  if (cachedClient) {
    return cachedClient;
  }

  // Create new client based on mode
  if (config.mode === 'ic') {
    if (!actor) {
      throw new Error('Actor is required for IC mode');
    }
    cachedClient = new ICBackendClient(actor);
  } else {
    if (!config.restBaseUrl) {
      throw new Error('REST base URL is required for REST mode');
    }
    cachedClient = new RESTBackendClient(config.restBaseUrl);
  }

  return cachedClient;
}
