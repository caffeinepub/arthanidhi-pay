import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../contexts/AuthContext';
import { useGetCallerUserProfile, useGetBalance, useGetStatement } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  CreditCard,
  FileText,
  BarChart3,
  Clock
} from 'lucide-react';
import { formatINR } from '../utils/currency';
import GoldSilverRatesCard from '../components/dashboard/GoldSilverRatesCard';
import NewsCard from '../components/dashboard/NewsCard';
import TransferDialog from '../components/transfers/TransferDialog';
import BalanceAmount from '../components/balance/BalanceAmount';
import BalanceVisibilityToggle from '../components/balance/BalanceVisibilityToggle';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: balanceData, isLoading: balanceLoading } = useGetBalance();
  const { data: transactions, isLoading: transactionsLoading } = useGetStatement(null);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const recentTransactions = transactions?.slice(-5).reverse() || [];

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Use name from backend profile, fallback to auth context displayName, then 'User'
  const displayName = userProfile?.name || user?.displayName || 'User';

  return (
    <div className="container py-8 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">
            {getGreeting()}, {displayName}
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {formatDateTime(currentTime)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full lg:col-span-2 bg-card/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Total Balance
            </CardTitle>
            <CardDescription>Your current account balance</CardDescription>
          </CardHeader>
          <CardContent>
            {balanceLoading ? (
              <Skeleton className="h-12 w-48" />
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <p className="text-4xl font-bold font-display">
                    <BalanceAmount amount={formatINR(balanceData?.balance || BigInt(0))} />
                  </p>
                  <BalanceVisibilityToggle />
                </div>
                <p className="text-sm text-muted-foreground">
                  Available balance in INR
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-chart-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <TransferDialog />
            <Button
              onClick={() => navigate({ to: '/account' })}
              variant="outline"
              className="w-full justify-start"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              View Account
            </Button>
            <Button
              onClick={() => navigate({ to: '/statements' })}
              variant="outline"
              className="w-full justify-start"
            >
              <FileText className="mr-2 h-4 w-4" />
              Statements
            </Button>
            <Button
              onClick={() => navigate({ to: '/market-insights' })}
              variant="outline"
              className="w-full justify-start"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Market Insights
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GoldSilverRatesCard />
        <NewsCard />
      </div>

      <Card className="bg-card/95 backdrop-blur">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No transactions yet</p>
              <p className="text-sm mt-1">Your transaction history will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((txn) => (
                <div
                  key={Number(txn.id)}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        txn.transactionType === 'credit'
                          ? 'bg-chart-2/10 text-chart-2'
                          : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {txn.transactionType === 'credit' ? (
                        <ArrowDownRight className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{txn.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(txn.timestamp)}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`font-semibold ${
                      txn.transactionType === 'credit'
                        ? 'text-chart-2'
                        : 'text-destructive'
                    }`}
                  >
                    {txn.transactionType === 'credit' ? '+' : '-'}
                    {formatINR(txn.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
          {recentTransactions.length > 0 && (
            <Button
              onClick={() => navigate({ to: '/statements' })}
              variant="ghost"
              className="w-full mt-4"
            >
              View All Transactions
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
