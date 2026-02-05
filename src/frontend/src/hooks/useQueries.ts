import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { getBackendClient, getBackendConfig } from '../backendClient';
import type { Account } from '../backend';
import type { Transaction, TransactionRange, Settings, MarketData, MutualFund, Stock } from '../types';
import { useEffect, useRef } from 'react';

export function useGetCallerAccount() {
  const { actor, isFetching: actorFetching } = useActor();
  const config = getBackendConfig();
  const queryClient = useQueryClient();
  const refetchAttempts = useRef(0);
  const maxRefetchAttempts = 8; // Increased from 5 to 8 for better reliability

  const query = useQuery<Account | null>({
    queryKey: ['callerAccount'],
    queryFn: async () => {
      if (config.mode === 'rest') {
        const client = getBackendClient();
        return client.getCallerAccount();
      }
      
      if (!actor) throw new Error('Actor not available');
      const client = getBackendClient(actor);
      return client.getCallerAccount();
    },
    enabled: config.mode === 'rest' || (!!actor && !actorFetching),
    retry: false,
    staleTime: 0, // Always fetch fresh data
  });

  // Auto-refetch when identifiers are missing or balance is 0 (backend is generating them)
  useEffect(() => {
    if (query.data) {
      const needsRefetch = 
        !query.data.customerId || 
        !query.data.accountNumber || 
        query.data.balance === BigInt(0);
      
      if (needsRefetch && refetchAttempts.current < maxRefetchAttempts) {
        refetchAttempts.current += 1;
        const delay = Math.min(1000 * refetchAttempts.current, 3000); // Progressive delay: 1s, 2s, 3s (max)
        
        const timeout = setTimeout(() => {
          console.log(`Refetching account (attempt ${refetchAttempts.current}/${maxRefetchAttempts})...`);
          queryClient.invalidateQueries({ queryKey: ['callerAccount'] });
        }, delay);
        
        return () => clearTimeout(timeout);
      } else if (!needsRefetch) {
        // Reset counter when we have valid data
        if (refetchAttempts.current > 0) {
          console.log('Account fully initialized:', {
            customerId: query.data.customerId,
            accountNumber: query.data.accountNumber,
            balance: query.data.balance.toString(),
          });
        }
        refetchAttempts.current = 0;
      } else if (refetchAttempts.current >= maxRefetchAttempts) {
        console.warn('Max refetch attempts reached. Account may not be fully initialized.');
      }
    }
  }, [query.data, queryClient]);

  return {
    ...query,
    isLoading: config.mode === 'ic' ? (actorFetching || query.isLoading) : query.isLoading,
    isFetched: config.mode === 'rest' ? query.isFetched : (!!actor && query.isFetched),
  };
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const config = getBackendConfig();

  const query = useQuery<Account | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (config.mode === 'rest') {
        const client = getBackendClient();
        return client.getCallerUserProfile();
      }
      
      if (!actor) throw new Error('Actor not available');
      const client = getBackendClient(actor);
      return client.getCallerUserProfile();
    },
    enabled: config.mode === 'rest' || (!!actor && !actorFetching),
    retry: false,
  });

  return {
    ...query,
    isLoading: config.mode === 'ic' ? (actorFetching || query.isLoading) : query.isLoading,
    isFetched: config.mode === 'rest' ? query.isFetched : (!!actor && query.isFetched),
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const config = getBackendConfig();

  return useMutation({
    mutationFn: async (profile: Account) => {
      if (config.mode === 'rest') {
        const client = getBackendClient();
        return client.saveCallerUserProfile(profile);
      }
      
      if (!actor) throw new Error('Actor not available');
      const client = getBackendClient(actor);
      return client.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      // Invalidate all related queries to force fresh data
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['callerAccount'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['financialHealth'] });
    },
  });
}

export function useUpdateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const config = getBackendConfig();

  return useMutation({
    mutationFn: async (displayName: string) => {
      if (config.mode === 'rest') {
        const client = getBackendClient();
        return client.updateProfile(displayName);
      }
      
      if (!actor) throw new Error('Actor not available');
      const client = getBackendClient(actor);
      return client.updateProfile(displayName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['callerAccount'] });
    },
  });
}

export function useGetBalance() {
  const { actor, isFetching } = useActor();
  const config = getBackendConfig();

  return useQuery<{ balance: bigint; currency: string }>({
    queryKey: ['balance'],
    queryFn: async () => {
      if (config.mode === 'rest') {
        const client = getBackendClient();
        const [balance, currency] = await client.getBalance();
        return { balance, currency };
      }
      
      if (!actor) return { balance: BigInt(0), currency: 'INR' };
      const client = getBackendClient(actor);
      const [balance, currency] = await client.getBalance();
      return { balance, currency };
    },
    enabled: config.mode === 'rest' || (!!actor && !isFetching),
  });
}

export function useGetStatement(range: TransactionRange | null = null) {
  const { actor, isFetching } = useActor();
  const config = getBackendConfig();

  return useQuery<Transaction[]>({
    queryKey: ['statement', range],
    queryFn: async () => {
      if (config.mode === 'rest') {
        const client = getBackendClient();
        return client.getStatement(range);
      }
      
      if (!actor) return [];
      const client = getBackendClient(actor);
      return client.getStatement(range);
    },
    enabled: config.mode === 'rest' || (!!actor && !isFetching),
  });
}

export function useSearchTransactions(keyword: string) {
  const { actor, isFetching } = useActor();
  const config = getBackendConfig();

  return useQuery<Transaction[]>({
    queryKey: ['searchTransactions', keyword],
    queryFn: async () => {
      if (config.mode === 'rest') {
        if (!keyword) return [];
        const client = getBackendClient();
        return client.searchTransactions(keyword);
      }
      
      if (!actor || !keyword) return [];
      const client = getBackendClient(actor);
      return client.searchTransactions(keyword);
    },
    enabled: (config.mode === 'rest' || (!!actor && !isFetching)) && !!keyword,
  });
}

export function useTransfer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const config = getBackendConfig();

  return useMutation({
    mutationFn: async ({ 
      fromAccount, 
      toAccount, 
      amount, 
      description 
    }: { 
      fromAccount: string; 
      toAccount: string; 
      amount: bigint; 
      description: string;
    }) => {
      if (config.mode === 'rest') {
        const client = getBackendClient();
        return client.transfer(fromAccount, toAccount, amount, description);
      }
      
      if (!actor) throw new Error('Actor not available');
      const client = getBackendClient(actor);
      return client.transfer(fromAccount, toAccount, amount, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['statement'] });
      queryClient.invalidateQueries({ queryKey: ['financialHealth'] });
      queryClient.invalidateQueries({ queryKey: ['callerAccount'] });
    },
  });
}

export function useGetFinancialHealthData() {
  const { actor, isFetching } = useActor();
  const config = getBackendConfig();

  return useQuery<{
    balance: bigint;
    monthlyCredits: bigint;
    monthlyDebits: bigint;
  }>({
    queryKey: ['financialHealth'],
    queryFn: async () => {
      if (config.mode === 'rest') {
        const client = getBackendClient();
        return client.getFinancialHealthData();
      }
      
      if (!actor) return { balance: BigInt(0), monthlyCredits: BigInt(0), monthlyDebits: BigInt(0) };
      const client = getBackendClient(actor);
      return client.getFinancialHealthData();
    },
    enabled: config.mode === 'rest' || (!!actor && !isFetching),
  });
}

export function useGetMarketSummary() {
  const { actor, isFetching } = useActor();
  const config = getBackendConfig();

  return useQuery<MarketData[]>({
    queryKey: ['marketSummary'],
    queryFn: async () => {
      if (config.mode === 'rest') {
        const client = getBackendClient();
        return client.getMarketSummary();
      }
      
      if (!actor) return [];
      const client = getBackendClient(actor);
      return client.getMarketSummary();
    },
    enabled: config.mode === 'rest' || (!!actor && !isFetching),
  });
}

export function useGetMutualFunds() {
  const { actor, isFetching } = useActor();
  const config = getBackendConfig();

  return useQuery<MutualFund[]>({
    queryKey: ['mutualFunds'],
    queryFn: async () => {
      if (config.mode === 'rest') {
        const client = getBackendClient();
        return client.getMutualFunds();
      }
      
      if (!actor) return [];
      const client = getBackendClient(actor);
      return client.getMutualFunds();
    },
    enabled: config.mode === 'rest' || (!!actor && !isFetching),
  });
}

export function useGetStocks() {
  const { actor, isFetching } = useActor();
  const config = getBackendConfig();

  return useQuery<Stock[]>({
    queryKey: ['stocks'],
    queryFn: async () => {
      if (config.mode === 'rest') {
        const client = getBackendClient();
        return client.getStocks();
      }
      
      if (!actor) return [];
      const client = getBackendClient(actor);
      return client.getStocks();
    },
    enabled: config.mode === 'rest' || (!!actor && !isFetching),
  });
}

export function useGetSettings() {
  const { actor, isFetching } = useActor();
  const config = getBackendConfig();

  return useQuery<Settings>({
    queryKey: ['settings'],
    queryFn: async () => {
      if (config.mode === 'rest') {
        const client = getBackendClient();
        return client.getSettings();
      }
      
      if (!actor) return { isDarkMode: false, preferredCurrency: 'INR' };
      const client = getBackendClient(actor);
      return client.getSettings();
    },
    enabled: config.mode === 'rest' || (!!actor && !isFetching),
  });
}

export function useUpdateSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const config = getBackendConfig();

  return useMutation({
    mutationFn: async (settings: Settings) => {
      if (config.mode === 'rest') {
        const client = getBackendClient();
        return client.updateSettings(settings);
      }
      
      if (!actor) throw new Error('Actor not available');
      const client = getBackendClient(actor);
      return client.updateSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
}

export function useDeposit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const config = getBackendConfig();

  return useMutation({
    mutationFn: async ({ amount, description }: { amount: bigint; description: string }) => {
      if (config.mode === 'rest') {
        const client = getBackendClient();
        return client.deposit(amount, description);
      }
      
      if (!actor) throw new Error('Actor not available');
      const client = getBackendClient(actor);
      return client.deposit(amount, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['statement'] });
      queryClient.invalidateQueries({ queryKey: ['financialHealth'] });
      queryClient.invalidateQueries({ queryKey: ['callerAccount'] });
    },
  });
}

export function useWithdraw() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const config = getBackendConfig();

  return useMutation({
    mutationFn: async ({ amount, description }: { amount: bigint; description: string }) => {
      if (config.mode === 'rest') {
        const client = getBackendClient();
        return client.withdraw(amount, description);
      }
      
      if (!actor) throw new Error('Actor not available');
      const client = getBackendClient(actor);
      return client.withdraw(amount, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['statement'] });
      queryClient.invalidateQueries({ queryKey: ['financialHealth'] });
      queryClient.invalidateQueries({ queryKey: ['callerAccount'] });
    },
  });
}
