/**
 * Frontend Type Definitions
 * 
 * This module defines types used by the ArthaNidhi frontend application.
 * These types are used for demo data and REST mode operations.
 * 
 * Note: The IC backend (Motoko) only supports UserProfile operations.
 * All other operations (transactions, market data, etc.) are either:
 * - Simulated with demo data in the frontend
 * - Implemented by an external REST backend (see REST_BACKEND_CONTRACT.md)
 */

/**
 * Transaction type enum
 */
export type TransactionType = 'credit' | 'debit';

/**
 * Transaction record
 */
export interface Transaction {
  id: bigint;
  timestamp: bigint;
  amount: bigint;
  transactionType: TransactionType;
  description: string;
}

/**
 * Transaction range filter
 */
export interface TransactionRange {
  startDate?: bigint;
  endDate?: bigint;
  transactionType?: TransactionType;
}

/**
 * User settings
 */
export interface Settings {
  isDarkMode: boolean;
  preferredCurrency: string;
}

/**
 * Market data for indices and assets
 */
export interface MarketData {
  symbol: string;
  name: string;
  marketLabel: string;
  price: bigint;
  change: bigint;
  changePercent: number;
}

/**
 * Mutual fund data
 */
export interface MutualFund {
  id: string;
  name: string;
  category: string;
  nav: bigint;
  oneDayChange: bigint;
  oneYearReturn: number;
}

/**
 * Stock data
 */
export interface Stock {
  symbol: string;
  name: string;
  company: string;
  market: string;
  price: bigint;
  dailyChange: bigint;
  changePercent: number;
}
