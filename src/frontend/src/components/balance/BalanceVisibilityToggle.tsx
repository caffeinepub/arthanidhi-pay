import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBalanceVisibility } from '../../contexts/BalanceVisibilityContext';

export default function BalanceVisibilityToggle() {
  const { isBalanceVisible, toggleBalanceVisibility } = useBalanceVisibility();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleBalanceVisibility}
      aria-label={isBalanceVisible ? 'Hide balance' : 'Show balance'}
      className="h-8 w-8"
    >
      {isBalanceVisible ? (
        <Eye className="h-4 w-4" />
      ) : (
        <EyeOff className="h-4 w-4" />
      )}
    </Button>
  );
}
