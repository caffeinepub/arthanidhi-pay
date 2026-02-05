import { useState } from 'react';
import { useTransfer, useGetCallerAccount } from '../../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRightLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatINR } from '../../utils/currency';

export default function TransferDialog() {
  const [open, setOpen] = useState(false);
  const [recipientAccount, setRecipientAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: callerAccount } = useGetCallerAccount();
  const transferMutation = useTransfer();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!recipientAccount.trim()) {
      newErrors.recipientAccount = 'Recipient account number is required';
    }

    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = 'Please enter a valid positive amount';
    } else if (callerAccount && BigInt(Math.floor(amountNum * 100)) > callerAccount.balance) {
      newErrors.amount = 'Insufficient balance';
    }

    if (callerAccount && recipientAccount === callerAccount.accountNumber) {
      newErrors.recipientAccount = 'Cannot transfer to your own account';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!callerAccount) {
      toast.error('Account information not available');
      return;
    }

    try {
      const amountInPaise = BigInt(Math.floor(parseFloat(amount) * 100));
      
      await transferMutation.mutateAsync({
        fromAccount: callerAccount.accountNumber,
        toAccount: recipientAccount.trim(),
        amount: amountInPaise,
        description: description.trim() || 'Transfer',
      });

      toast.success('Transfer completed successfully');
      setOpen(false);
      setRecipientAccount('');
      setAmount('');
      setDescription('');
      setErrors({});
    } catch (error: any) {
      console.error('Transfer error:', error);
      const errorMessage = error?.message || 'Transfer failed. Please try again.';
      toast.error(errorMessage);
    }
  };

  const handleAmountChange = (value: string) => {
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
      if (errors.amount) {
        setErrors({ ...errors, amount: '' });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full justify-start" variant="outline">
          <ArrowRightLeft className="mr-2 h-4 w-4" />
          Transfer Money
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Transfer Money</DialogTitle>
            <DialogDescription>
              Send money to another ArthaNidhi account. All fields are required.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {callerAccount && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-lg font-semibold">{formatINR(callerAccount.balance)}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="recipientAccount">
                Recipient Account Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="recipientAccount"
                placeholder="INR-123456789"
                value={recipientAccount}
                onChange={(e) => {
                  setRecipientAccount(e.target.value);
                  if (errors.recipientAccount) {
                    setErrors({ ...errors, recipientAccount: '' });
                  }
                }}
                disabled={transferMutation.isPending}
              />
              {errors.recipientAccount && (
                <p className="text-sm text-destructive">{errors.recipientAccount}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">
                Amount (INR) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="amount"
                type="text"
                placeholder="0.00"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                disabled={transferMutation.isPending}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter transfer description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={transferMutation.isPending}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={transferMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={transferMutation.isPending}>
              {transferMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Transfer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
