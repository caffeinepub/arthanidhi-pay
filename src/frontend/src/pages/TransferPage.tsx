import { useState } from 'react';
import { useTransfer, useGetCallerAccount, useGetBalance } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRightLeft, Loader2, AlertCircle, CheckCircle2, Wallet, User } from 'lucide-react';
import { toast } from 'sonner';
import { formatINR } from '../utils/currency';
import BalanceAmount from '../components/balance/BalanceAmount';
import BalanceVisibilityToggle from '../components/balance/BalanceVisibilityToggle';

export default function TransferPage() {
  const [recipientAccount, setRecipientAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: callerAccount, isLoading: accountLoading, error: accountError } = useGetCallerAccount();
  const { data: balanceData, isLoading: balanceLoading } = useGetBalance();
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

  // Check if identifiers are being generated - ensure it's always a boolean
  const identifiersGenerating = !!(callerAccount && (
    !callerAccount.customerId || 
    !callerAccount.accountNumber || 
    callerAccount.balance === BigInt(0)
  ));

  return (
    <div className="container py-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">Transfer Money</h1>
        <p className="text-muted-foreground mt-1">
          Send money to another ArthaNidhi account instantly
        </p>
      </div>

      {accountError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load account data. Please refresh the page or contact support.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Account Information Cards */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-card/95 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Account</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {accountLoading ? (
                <Skeleton className="h-16 w-full" />
              ) : identifiersGenerating ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Setting up your account...</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Account Number</div>
                  <div className="text-lg font-mono font-semibold">
                    {callerAccount?.accountNumber || 'Not Available'}
                  </div>
                  <div className="text-xs text-muted-foreground">Customer ID</div>
                  <div className="text-sm font-mono">
                    {callerAccount?.customerId || 'Not Available'}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card/95 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {balanceLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : identifiersGenerating ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-lg font-bold text-muted-foreground">
                    Initializing...
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">
                    <BalanceAmount amount={formatINR(balanceData?.balance || BigInt(0))} />
                  </div>
                  <BalanceVisibilityToggle />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card/95 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="text-sm">Transfer Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Transfers are instant and secure</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Verify recipient account number before sending</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Transaction history is updated immediately</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>No transfer fees for ArthaNidhi accounts</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transfer Form */}
        <div className="lg:col-span-2">
          <Card className="bg-card/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-primary" />
                Transfer Details
              </CardTitle>
              <CardDescription>
                Enter the recipient's account details and transfer amount
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
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
                    disabled={transferMutation.isPending || identifiersGenerating}
                    className="font-mono"
                  />
                  {errors.recipientAccount && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.recipientAccount}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Enter the ArthaNidhi account number of the recipient
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">
                    Amount (INR) <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      ₹
                    </span>
                    <Input
                      id="amount"
                      type="text"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      disabled={transferMutation.isPending || identifiersGenerating}
                      className="pl-8 font-mono"
                    />
                  </div>
                  {errors.amount && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.amount}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Enter the amount you want to transfer
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter transfer description or note..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={transferMutation.isPending || identifiersGenerating}
                    rows={4}
                    maxLength={200}
                  />
                  <p className="text-xs text-muted-foreground">
                    {description.length}/200 characters
                  </p>
                </div>

                {identifiersGenerating && (
                  <Alert>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <AlertDescription>
                      Your account is being set up. Please wait a moment before making transfers.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setRecipientAccount('');
                      setAmount('');
                      setDescription('');
                      setErrors({});
                    }}
                    disabled={transferMutation.isPending}
                    className="flex-1"
                  >
                    Clear Form
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={transferMutation.isPending || identifiersGenerating}
                    className="flex-1"
                  >
                    {transferMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {transferMutation.isPending ? 'Processing...' : 'Transfer Money'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Recent Transfers */}
          <Card className="bg-card/95 backdrop-blur mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Recent Transfers</CardTitle>
              <CardDescription>Your last transfer transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {callerAccount?.transactionHistory && callerAccount.transactionHistory.length > 0 ? (
                <div className="space-y-3">
                  {callerAccount.transactionHistory.slice(0, 5).map((tx) => (
                    <div key={tx.id.toString()} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div className="space-y-1">
                        <p className="font-medium text-sm">
                          {tx.fromAccount === callerAccount.accountNumber ? 'Sent to' : 'Received from'}{' '}
                          <span className="font-mono text-xs">
                            {tx.fromAccount === callerAccount.accountNumber ? tx.toAccount : tx.fromAccount}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">{tx.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(Number(tx.timestamp) / 1_000_000).toLocaleString()}
                        </p>
                      </div>
                      <div className={`text-right ${tx.fromAccount === callerAccount.accountNumber ? 'text-destructive' : 'text-chart-2'}`}>
                        <p className="font-semibold">
                          {tx.fromAccount === callerAccount.accountNumber ? '-' : '+'}
                          {formatINR(tx.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ArrowRightLeft className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No transfer history yet</p>
                  <p className="text-sm">Your transfers will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
