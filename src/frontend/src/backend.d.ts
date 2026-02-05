import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Account {
    balance: bigint;
    dateOfBirth: string;
    name: string;
    idDocumentNumber: string;
    address: string;
    customerId: string;
    accountNumber: string;
    transactionHistory: Array<TransactionRecord>;
}
export interface TransactionRecord {
    id: bigint;
    fromAccount: string;
    description: string;
    timestamp: bigint;
    toAccount: string;
    amount: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deposit(accountNumber: string, amount: bigint): Promise<void>;
    getAccount(user: Principal): Promise<Account | null>;
    getCallerAccount(): Promise<Account | null>;
    getCallerUserRole(): Promise<UserRole>;
    getTransactionHistory(): Promise<Array<TransactionRecord>>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerAccount(profile: Account): Promise<void>;
    transfer(fromAccount: string, toAccount: string, amount: bigint, description: string): Promise<void>;
}
