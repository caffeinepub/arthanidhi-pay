/**
 * Portal Storage Utility
 * 
 * Provides typed localStorage helpers that scope data per authenticated user.
 * Uses the AuthContext user.id to ensure demo data (beneficiaries, support tickets, etc.)
 * is isolated per user session.
 */

interface StorageData {
  beneficiaries: Beneficiary[];
  supportTickets: SupportTicket[];
  cardFrozen: boolean;
  notifications: NotificationItem[];
  savedOffers: string[];
}

export interface Beneficiary {
  id: string;
  name: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  addedAt: number;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: string;
  timestamp: number;
  read: boolean;
}

/**
 * Get storage key scoped to the current user
 */
function getUserStorageKey(userId: string, key: keyof StorageData): string {
  return `arthanidhi_${userId}_${key}`;
}

/**
 * Load data from localStorage for the current user
 */
export function loadUserData<K extends keyof StorageData>(
  userId: string,
  key: K
): StorageData[K] | null {
  try {
    const storageKey = getUserStorageKey(userId, key);
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Failed to load ${key} for user ${userId}:`, error);
    return null;
  }
}

/**
 * Save data to localStorage for the current user
 */
export function saveUserData<K extends keyof StorageData>(
  userId: string,
  key: K,
  data: StorageData[K]
): void {
  try {
    const storageKey = getUserStorageKey(userId, key);
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save ${key} for user ${userId}:`, error);
  }
}

/**
 * Clear all data for a specific key across all users (useful for logout)
 */
export function clearUserData(userId: string, key: keyof StorageData): void {
  try {
    const storageKey = getUserStorageKey(userId, key);
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error(`Failed to clear ${key} for user ${userId}:`, error);
  }
}
