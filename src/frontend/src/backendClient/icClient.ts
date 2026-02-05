import type { backendInterface, Account, TransactionRecord } from '../backend';
import type { BackendClient } from './types';
import type { Transaction, TransactionRange, Settings, MarketData, MutualFund, Stock } from '../types';

/**
 * IC Backend Client Implementation
 * 
 * This client delegates Account operations to the Motoko actor and returns
 * demo/mock data for other operations. It implements the BackendClient interface
 * to provide a consistent API for the frontend.
 */
export class ICBackendClient implements BackendClient {
  constructor(private actor: backendInterface) {}

  async getCallerAccount(): Promise<Account | null> {
    return this.actor.getCallerAccount();
  }

  async saveCallerAccount(account: Account): Promise<void> {
    return this.actor.saveCallerAccount(account);
  }

  // Legacy compatibility methods
  async getCallerUserProfile(): Promise<Account | null> {
    return this.actor.getCallerAccount();
  }

  async saveCallerUserProfile(profile: Account): Promise<void> {
    return this.actor.saveCallerAccount(profile);
  }

  async updateProfile(displayName: string): Promise<void> {
    const existingProfile = await this.actor.getCallerAccount();
    if (!existingProfile) {
      throw new Error('Profile not found');
    }
    
    const updatedProfile: Account = {
      ...existingProfile,
      name: displayName,
    };
    
    return this.actor.saveCallerAccount(updatedProfile);
  }

  async getBalance(): Promise<[bigint, string]> {
    const account = await this.actor.getCallerAccount();
    return [account?.balance || BigInt(0), 'INR'];
  }

  async transfer(fromAccount: string, toAccount: string, amount: bigint, description: string): Promise<void> {
    return this.actor.transfer(fromAccount, toAccount, amount, description);
  }

  async getStatement(range: TransactionRange | null): Promise<Transaction[]> {
    const history = await this.actor.getTransactionHistory();
    const account = await this.actor.getCallerAccount();
    const accountNumber = account?.accountNumber || '';
    
    return history.map((txn: TransactionRecord) => {
      // Determine if this is a credit or debit for the current user
      const isCredit = txn.toAccount === accountNumber;
      
      return {
        id: txn.id,
        amount: txn.amount,
        description: txn.description,
        timestamp: txn.timestamp,
        transactionType: isCredit ? ('credit' as const) : ('debit' as const),
      };
    });
  }

  async searchTransactions(keyword: string): Promise<Transaction[]> {
    const allTransactions = await this.getStatement(null);
    const lowerKeyword = keyword.toLowerCase();
    
    return allTransactions.filter(txn =>
      txn.description.toLowerCase().includes(lowerKeyword)
    );
  }

  async getFinancialHealthData(): Promise<{
    balance: bigint;
    monthlyCredits: bigint;
    monthlyDebits: bigint;
  }> {
    const account = await this.actor.getCallerAccount();
    const history = await this.actor.getTransactionHistory();
    
    const now = BigInt(Date.now() * 1000000);
    const oneMonthAgo = now - BigInt(30 * 24 * 60 * 60 * 1000000000);
    
    let monthlyCredits = BigInt(0);
    let monthlyDebits = BigInt(0);
    
    const accountNumber = account?.accountNumber || '';
    
    for (const txn of history) {
      if (txn.timestamp >= oneMonthAgo) {
        if (txn.toAccount === accountNumber) {
          monthlyCredits += txn.amount;
        } else if (txn.fromAccount === accountNumber) {
          monthlyDebits += txn.amount;
        }
      }
    }
    
    return {
      balance: account?.balance || BigInt(0),
      monthlyCredits,
      monthlyDebits,
    };
  }

  async getMarketSummary(): Promise<MarketData[]> {
    return [
      {
        symbol: 'NIFTY 50',
        name: 'NIFTY 50',
        price: BigInt(2245000),
        change: BigInt(12500),
        changePercent: 0.56,
        marketLabel: 'NSE',
      },
      {
        symbol: 'SENSEX',
        name: 'SENSEX',
        price: BigInt(7398000),
        change: BigInt(-8500),
        changePercent: -0.11,
        marketLabel: 'BSE',
      },
    ];
  }

  async getMutualFunds(): Promise<MutualFund[]> {
    return [
      {
        id: 'mf-1',
        name: 'HDFC Equity Fund',
        category: 'Large Cap',
        nav: BigInt(85432),
        oneDayChange: BigInt(125),
        oneYearReturn: 1545,
      },
      {
        id: 'mf-2',
        name: 'ICICI Prudential Bluechip',
        category: 'Large Cap',
        nav: BigInt(92150),
        oneDayChange: BigInt(-85),
        oneYearReturn: 1823,
      },
    ];
  }

  async getStocks(): Promise<Stock[]> {
    return [
      {
        symbol: 'RELIANCE',
        name: 'Reliance Industries',
        company: 'Reliance Industries',
        market: 'NSE',
        price: BigInt(285000),
        dailyChange: BigInt(450),
        changePercent: 0.16,
      },
      {
        symbol: 'TCS',
        name: 'Tata Consultancy Services',
        company: 'Tata Consultancy Services',
        market: 'NSE',
        price: BigInt(395000),
        dailyChange: BigInt(-250),
        changePercent: -0.06,
      },
    ];
  }

  async getSettings(): Promise<Settings> {
    return {
      isDarkMode: false,
      preferredCurrency: 'INR',
    };
  }

  async updateSettings(settings: Settings): Promise<void> {
    // Settings are managed client-side
  }

  async deposit(amount: bigint, description: string): Promise<void> {
    const account = await this.actor.getCallerAccount();
    if (!account) {
      throw new Error('Account not found');
    }
    return this.actor.deposit(account.accountNumber, amount);
  }

  async withdraw(amount: bigint, description: string): Promise<void> {
    throw new Error('Withdraw not implemented in IC mode');
  }
}
