import { useBalanceVisibility } from '../../contexts/BalanceVisibilityContext';

interface BalanceAmountProps {
  amount: string;
  className?: string;
}

export default function BalanceAmount({ amount, className = '' }: BalanceAmountProps) {
  const { isBalanceVisible } = useBalanceVisibility();

  if (!isBalanceVisible) {
    // Replace digits with bullets while preserving structure
    const masked = amount.replace(/\d/g, '•');
    return <span className={`font-mono ${className}`}>{masked}</span>;
  }

  return <span className={`font-mono ${className}`}>{amount}</span>;
}
