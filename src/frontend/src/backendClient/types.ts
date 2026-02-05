/**
 * Backend Client Interface
 * 
 * This module defines the BackendClient interface that abstracts the differences
 * between IC (Internet Computer) and REST backend implementations. Both ICBackendClient
 * and RESTBackendClient implement this interface, allowing the frontend to switch
 * between backends without changing application code.
 * 
 * The interface includes all operations needed by the ArthaNidhi application:
 * - Profile management
 * - Balance and transaction operations
 * - Financial health data
 * - Market data (indices, mutual funds, stocks)
 * - User settings
 */

import type { UserProfile } from '../backend';
import type { Transaction, TransactionRange, Settings, MarketData, MutualFund, Stock } from '../types';

/**
 * BackendClient interface that both IC and REST clients must implement.
 * Provides a unified API for all backend operations.
 */
export interface BackendClient {
  // Profile operations
  getCallerUserProfile(): Promise<UserProfile | null>;
  saveCallerUserProfile(profile: UserProfile): Promise<void>;
  updateProfile(displayName: string): Promise<void>;

  // Balance operations
  getBalance(): Promise<[bigint, string]>;

  // Transaction operations
  getStatement(range: TransactionRange | null): Promise<Transaction[]>;
  searchTransactions(keyword: string): Promise<Transaction[]>;

  // Financial health
  getFinancialHealthData(): Promise<{
    balance: bigint;
    monthlyCredits: bigint;
    monthlyDebits: bigint;
  }>;

  // Market data
  getMarketSummary(): Promise<MarketData[]>;
  getMutualFunds(): Promise<MutualFund[]>;
  getStocks(): Promise<Stock[]>;

  // Settings
  getSettings(): Promise<Settings>;
  updateSettings(settings: Settings): Promise<void>;

  // Transactions
  deposit(amount: bigint, description: string): Promise<void>;
  withdraw(amount: bigint, description: string): Promise<void>;
}

/**
 * Backend mode type: 'ic' for Internet Computer, 'rest' for REST API
 */
export type BackendMode = 'ic' | 'rest';

/**
 * Backend configuration interface
 */
export interface BackendConfig {
  mode: BackendMode;
  restBaseUrl?: string;
}
