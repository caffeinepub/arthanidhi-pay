import type { BackendClient } from './types';
import type { backendInterface } from '../backend';

export class ICBackendClient implements BackendClient {
  constructor(private actor: backendInterface) {}

  async getCallerUserProfile() {
    return this.actor.getCallerUserProfile();
  }

  async saveCallerUserProfile(profile: any) {
    return this.actor.saveCallerUserProfile(profile);
  }

  async updateProfile(displayName: string) {
    return this.actor.updateProfile(displayName);
  }

  async getBalance() {
    return this.actor.getBalance();
  }

  async getStatement(range: any) {
    return this.actor.getStatement(range);
  }

  async searchTransactions(keyword: string) {
    return this.actor.searchTransactions(keyword);
  }

  async getFinancialHealthData() {
    return this.actor.getFinancialHealthData();
  }

  async getMarketSummary() {
    return this.actor.getMarketSummary();
  }

  async getMutualFunds() {
    return this.actor.getMutualFunds();
  }

  async getStocks() {
    return this.actor.getStocks();
  }

  async getSettings() {
    return this.actor.getSettings();
  }

  async updateSettings(settings: any) {
    return this.actor.updateSettings(settings);
  }

  async deposit(amount: bigint, description: string) {
    return this.actor.deposit(amount, description);
  }

  async withdraw(amount: bigint, description: string) {
    return this.actor.withdraw(amount, description);
  }
}
