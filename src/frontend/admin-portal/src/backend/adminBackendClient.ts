/**
 * Admin Portal Backend Client
 * 
 * Provides a wrapper for calling backend operations with authenticated admin sessions.
 * This client is designed to work with both IC and REST modes, similar to the user portal
 * backend client, but with admin-specific authentication and role checks.
 * 
 * For now, this is a placeholder that will be expanded as admin-specific backend
 * operations are implemented.
 */

import { adminEnv } from '../config/env';

export class AdminBackendClient {
  private mode: 'ic' | 'rest';
  private baseUrl?: string;

  constructor() {
    this.mode = adminEnv.mode;
    this.baseUrl = adminEnv.backendUrl;
  }

  /**
   * Placeholder for future admin operations
   */
  async getSystemStatus(): Promise<{ status: string }> {
    // This will be implemented when backend admin operations are added
    return { status: 'operational' };
  }

  /**
   * Placeholder for user management operations
   */
  async getAllUsers(): Promise<any[]> {
    // This will be implemented when backend admin operations are added
    return [];
  }
}

export const adminBackendClient = new AdminBackendClient();
