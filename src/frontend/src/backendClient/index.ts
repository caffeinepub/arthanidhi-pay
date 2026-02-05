/**
 * Backend Client Factory
 * 
 * This module provides a factory function that returns the appropriate backend client
 * based on the configured mode (IC or REST). It caches the client instance to avoid
 * recreating it on every call.
 * 
 * - IC mode: Requires an actor instance from the Internet Computer agent
 * - REST mode: Uses the configured REST base URL for HTTP requests
 * 
 * The cache is invalidated when the backend mode changes, ensuring the correct
 * client is always returned.
 */

import { getBackendConfig } from './config';
import { ICBackendClient } from './icClient';
import { RESTBackendClient } from './restClient';
import type { BackendClient } from './types';
import type { backendInterface } from '../backend';

// Cache to avoid recreating clients unnecessarily
let cachedClient: BackendClient | null = null;
let cachedMode: string | null = null;

/**
 * Returns the appropriate backend client based on configuration.
 * 
 * @param actor - Optional IC actor (required for IC mode)
 * @returns BackendClient instance (ICBackendClient or RESTBackendClient)
 * @throws Error if IC mode is selected but no actor is provided
 */
export function getBackendClient(actor?: backendInterface): BackendClient {
  const config = getBackendConfig();

  // Return cached client if mode hasn't changed
  if (cachedClient && cachedMode === config.mode) {
    return cachedClient;
  }

  // REST mode: Create REST client with base URL
  if (config.mode === 'rest') {
    cachedClient = new RESTBackendClient(config.restBaseUrl);
    cachedMode = 'rest';
    return cachedClient;
  }

  // IC mode: Requires actor
  if (!actor) {
    throw new Error('Actor is required for IC mode');
  }

  cachedClient = new ICBackendClient(actor);
  cachedMode = 'ic';
  return cachedClient;
}

/**
 * Clears the cached backend client.
 * Useful when switching modes or resetting the application state.
 */
export function clearBackendClientCache() {
  cachedClient = null;
  cachedMode = null;
}

// Re-export types and config
export * from './types';
export { getBackendConfig } from './config';
