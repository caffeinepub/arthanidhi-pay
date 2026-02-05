import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MarketData {
    marketLabel: string;
    currency: string;
    category: string;
    change: bigint;
    price: bigint;
    symbol: string;
}
export interface Settings {
    preferredCurrency: string;
    isDarkMode: boolean;
}
export type Time = bigint;
export interface Stock {
    dailyChange: bigint;
    company: string;
    currency: string;
    market: string;
    price: bigint;
    symbol: string;
}
export interface TransactionRange {
    transactionType?: TransactionType;
    endDate?: Time;
    startDate?: Time;
}
export interface MutualFund {
    nav: bigint;
    oneDayChange: bigint;
    name: string;
    currency: string;
    category: string;
    oneYearReturn: bigint;
}
export interface UserProfile {
    displayName: string;
    createdAt: bigint;
    email?: string;
}
export interface Transaction {
    id: bigint;
    transactionType: TransactionType;
    description: string;
    timestamp: bigint;
    amount: bigint;
}
export enum TransactionType {
    credit = "credit",
    debit = "debit"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createAccount(displayName: string): Promise<void>;
    deposit(amount: bigint, description: string): Promise<void>;
    getBalance(): Promise<[bigint, string]>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFinancialHealthData(): Promise<{
        balance: bigint;
        monthlyDebits: bigint;
        monthlyCredits: bigint;
    }>;
    getMarketSummary(): Promise<Array<MarketData>>;
    getMutualFunds(): Promise<Array<MutualFund>>;
    getSettings(): Promise<Settings>;
    getStatement(range: TransactionRange | null): Promise<Array<Transaction>>;
    getStocks(): Promise<Array<Stock>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchTransactions(keyword: string): Promise<Array<Transaction>>;
    updateProfile(displayName: string): Promise<void>;
    updateSettings(settings: Settings): Promise<void>;
    withdraw(amount: bigint, description: string): Promise<void>;
}
