/**
 * IC Backend Client Implementation
 * 
 * This class implements the BackendClient interface for IC (Internet Computer) mode.
 * Since the Motoko backend only supports basic UserProfile operations, this client
 * returns demo/mock data for all other operations.
 * 
 * Note: In a production application, you would implement these methods in the Motoko
 * backend and this client would simply delegate to the actor.
 */

import type { BackendClient } from './types';
import type { backendInterface, UserProfile } from '../backend';

export class ICBackendClient implements BackendClient {
  constructor(private actor: backendInterface) {}

  async getCallerUserProfile() {
    return this.actor.getCallerUserProfile();
  }

  async saveCallerUserProfile(profile: UserProfile) {
    return this.actor.saveCallerUserProfile(profile);
  }

  async updateProfile(displayName: string) {
    // Fetch existing profile to preserve KYC fields
    const existingProfile = await this.actor.getCallerUserProfile();
    
    if (existingProfile) {
      // Update only the name field, preserve KYC data
      return this.actor.saveCallerUserProfile({
        ...existingProfile,
        name: displayName,
      });
    } else {
      // If no profile exists, create one with empty KYC fields
      return this.actor.saveCallerUserProfile({
        name: displayName,
        dateOfBirth: '',
        idDocumentNumber: '',
        address: '',
      });
    }
  }

  async getBalance() {
    // Demo data - in production, implement in Motoko backend
    return [BigInt(150000000), 'INR'] as [bigint, string];
  }

  async getStatement(range: any) {
    // Demo data - in production, implement in Motoko backend
    return [];
  }

  async searchTransactions(keyword: string) {
    // Demo data - in production, implement in Motoko backend
    return [];
  }

  async getFinancialHealthData() {
    // Demo data - in production, implement in Motoko backend
    return {
      balance: BigInt(150000000),
      monthlyCredits: BigInt(50000000),
      monthlyDebits: BigInt(30000000),
    };
  }

  async getMarketSummary() {
    // Demo data - in production, implement in Motoko backend
    return [];
  }

  async getMutualFunds() {
    // Demo data - in production, implement in Motoko backend
    return [];
  }

  async getStocks() {
    // Demo data - in production, implement in Motoko backend
    return [];
  }

  async getSettings() {
    // Demo data - in production, implement in Motoko backend
    return { isDarkMode: false, preferredCurrency: 'INR' };
  }

  async updateSettings(settings: any) {
    // Demo data - in production, implement in Motoko backend
    return;
  }

  async deposit(amount: bigint, description: string) {
    // Demo data - in production, implement in Motoko backend
    return;
  }

  async withdraw(amount: bigint, description: string) {
    // Demo data - in production, implement in Motoko backend
    return;
  }
}
