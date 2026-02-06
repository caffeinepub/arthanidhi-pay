import React, { createContext, useContext, useState, useEffect } from 'react';

interface BalanceVisibilityContextType {
  isBalanceVisible: boolean;
  toggleBalanceVisibility: () => void;
}

const BalanceVisibilityContext = createContext<BalanceVisibilityContextType | undefined>(undefined);

const STORAGE_KEY = 'arthanidhi_balance_visibility';

export function BalanceVisibilityProvider({ children }: { children: React.ReactNode }) {
  const [isBalanceVisible, setIsBalanceVisible] = useState<boolean>(() => {
    // Initialize from sessionStorage
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored !== null ? stored === 'true' : true; // Default to visible
  });

  useEffect(() => {
    // Persist to sessionStorage whenever it changes
    sessionStorage.setItem(STORAGE_KEY, String(isBalanceVisible));
  }, [isBalanceVisible]);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible((prev) => !prev);
  };

  return (
    <BalanceVisibilityContext.Provider value={{ isBalanceVisible, toggleBalanceVisibility }}>
      {children}
    </BalanceVisibilityContext.Provider>
  );
}

export function useBalanceVisibility() {
  const context = useContext(BalanceVisibilityContext);
  if (context === undefined) {
    throw new Error('useBalanceVisibility must be used within a BalanceVisibilityProvider');
  }
  return context;
}
