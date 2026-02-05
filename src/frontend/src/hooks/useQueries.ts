import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { getBackendClient, getBackendConfig } from '../backendClient';
import type { UserProfile, Transaction, TransactionRange, Settings, MarketData, MutualFund, Stock } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const config = getBackendConfig();

  const query = useQuery<UserProfile | null>({
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
    mutationFn: async (profile: UserProfile) => {
      if (config.mode === 'rest') {
        const client = getBackendClient();
        return client.saveCallerUserProfile(profile);
      }
      
      if (!actor) throw new Error('Actor not available');
      const client = getBackendClient(actor);
      return client.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
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
    },
  });
}
