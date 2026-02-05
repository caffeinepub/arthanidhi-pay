/**
 * REST Backend Client Implementation
 * 
 * This class implements the BackendClient interface for REST API mode. It makes
 * HTTP requests to an external Node.js/Express backend using the browser's fetch API.
 * 
 * Key features:
 * - Automatic authentication: Reads user.id from localStorage and sends it as a
 *   Bearer token in the Authorization header
 * - BigInt handling: Uses stringifyWithBigInt/parseWithBigInt utilities to serialize
 *   and deserialize bigint values as strings in JSON
 * - Error handling: Parses error responses and throws user-friendly error messages
 * - Query parameters: Properly encodes query parameters for GET requests
 * 
 * All operations match the REST_BACKEND_CONTRACT.md specification.
 */

import type { BackendClient } from './types';
import type { UserProfile, Transaction, TransactionRange, Settings, MarketData, MutualFund, Stock } from '../backend';
import { stringifyWithBigInt, parseWithBigInt } from '../utils/jsonBigint';

export class RESTBackendClient implements BackendClient {
  constructor(private baseUrl: string) {}

  /**
   * Makes an HTTP request to the REST API.
   * 
   * @param endpoint - API endpoint path (e.g., '/profile', '/balance')
   * @param options - Fetch options (method, headers, body, etc.)
   * @returns Parsed response data
   * @throws Error with user-friendly message if request fails
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Set default headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add authentication token from localStorage
    const user = localStorage.getItem('arthanidhi_user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        headers['Authorization'] = `Bearer ${userData.id}`;
      } catch (e) {
        console.error('Failed to parse user data for auth header:', e);
      }
    }

    // Make the request
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle error responses
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Request failed: ${response.status} ${response.statusText}`;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        if (errorText) {
          errorMessage = errorText;
        }
      }

      throw new Error(errorMessage);
    }

    // Parse response body
    const text = await response.text();
    if (!text) {
      return undefined as T;
    }

    // Use custom JSON parser to handle bigint values
    return parseWithBigInt<T>(text);
  }

  // Profile operations
  async getCallerUserProfile(): Promise<UserProfile | null> {
    return this.request<UserProfile | null>('/profile');
  }

  async saveCallerUserProfile(profile: UserProfile): Promise<void> {
    await this.request('/profile', {
      method: 'POST',
      body: stringifyWithBigInt(profile),
    });
  }

  async updateProfile(displayName: string): Promise<void> {
    await this.request('/profile', {
      method: 'PUT',
      body: stringifyWithBigInt({ displayName }),
    });
  }

  // Balance operations
  async getBalance(): Promise<[bigint, string]> {
    const result = await this.request<{ balance: bigint; currency: string }>('/balance');
    return [result.balance, result.currency];
  }

  // Transaction operations
  async getStatement(range: TransactionRange | null): Promise<Transaction[]> {
    const queryParams = new URLSearchParams();
    
    if (range) {
      if (range.startDate !== undefined) {
        queryParams.append('startDate', range.startDate.toString());
      }
      if (range.endDate !== undefined) {
        queryParams.append('endDate', range.endDate.toString());
      }
      if (range.transactionType !== undefined) {
        queryParams.append('transactionType', range.transactionType);
      }
    }

    const query = queryParams.toString();
    const endpoint = query ? `/statement?${query}` : '/statement';
    
    return this.request<Transaction[]>(endpoint);
  }

  async searchTransactions(keyword: string): Promise<Transaction[]> {
    return this.request<Transaction[]>(`/transactions/search?keyword=${encodeURIComponent(keyword)}`);
  }

  // Financial health
  async getFinancialHealthData(): Promise<{
    balance: bigint;
    monthlyCredits: bigint;
    monthlyDebits: bigint;
  }> {
    return this.request('/financial-health');
  }

  // Market data
  async getMarketSummary(): Promise<MarketData[]> {
    return this.request<MarketData[]>('/market-summary');
  }

  async getMutualFunds(): Promise<MutualFund[]> {
    return this.request<MutualFund[]>('/mutual-funds');
  }

  async getStocks(): Promise<Stock[]> {
    return this.request<Stock[]>('/stocks');
  }

  // Settings
  async getSettings(): Promise<Settings> {
    return this.request<Settings>('/settings');
  }

  async updateSettings(settings: Settings): Promise<void> {
    await this.request('/settings', {
      method: 'PUT',
      body: stringifyWithBigInt(settings),
    });
  }

  // Transactions
  async deposit(amount: bigint, description: string): Promise<void> {
    await this.request('/deposit', {
      method: 'POST',
      body: stringifyWithBigInt({ amount, description }),
    });
  }

  async withdraw(amount: bigint, description: string): Promise<void> {
    await this.request('/withdraw', {
      method: 'POST',
      body: stringifyWithBigInt({ amount, description }),
    });
  }
}
