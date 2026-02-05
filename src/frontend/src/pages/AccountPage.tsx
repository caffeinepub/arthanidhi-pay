import { useGetBalance, useGetFinancialHealthData, useGetCallerAccount } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, TrendingUp, TrendingDown, PieChart as PieChartIcon, User, CreditCard, Loader2, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer as BarResponsiveContainer } from 'recharts';
import { formatINR } from '../utils/currency';

export default function AccountPage() {
  const { data: balanceData, isLoading: balanceLoading } = useGetBalance();
  const { data: healthData, isLoading: healthLoading } = useGetFinancialHealthData();
  const { data: accountData, isLoading: accountLoading, error: accountError } = useGetCallerAccount();

  const pieData = [
    {
      name: 'Credits',
      value: Number(healthData?.monthlyCredits || BigInt(0)),
      color: 'oklch(var(--chart-2))',
    },
    {
      name: 'Debits',
      value: Number(healthData?.monthlyDebits || BigInt(0)),
      color: 'oklch(var(--destructive))',
    },
  ];

  const barData = [
    {
      name: 'Balance',
      amount: Number(healthData?.balance || BigInt(0)),
    },
    {
      name: 'Monthly Credits',
      amount: Number(healthData?.monthlyCredits || BigInt(0)),
    },
    {
      name: 'Monthly Debits',
      amount: Number(healthData?.monthlyDebits || BigInt(0)),
    },
  ];

  // Check if identifiers are being generated or if balance is still 0
  const identifiersGenerating = accountData && (
    !accountData.customerId || 
    !accountData.accountNumber || 
    accountData.balance === BigInt(0)
  );

  return (
    <div className="container py-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">Account Overview</h1>
        <p className="text-muted-foreground mt-1">
          View your account details and financial health
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

      {/* Account Identifiers */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card/95 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer ID</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {accountLoading ? (
              <Skeleton className="h-8 w-48" />
            ) : identifiersGenerating ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Generating your customer ID...</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  This usually takes a few seconds. Your account is being set up.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-2xl font-bold font-mono">
                  {accountData?.customerId || 'Not Available'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Your unique customer identifier
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/95 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Number</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {accountLoading ? (
              <Skeleton className="h-8 w-48" />
            ) : identifiersGenerating ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Generating your account number...</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  This usually takes a few seconds. Your account is being set up.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-2xl font-bold font-mono">
                  {accountData?.accountNumber || 'Not Available'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Your account number for transfers
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-card/95 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {balanceLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : identifiersGenerating ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-2xl font-bold text-muted-foreground">
                    Initializing...
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your initial balance is being set up
                </p>
              </div>
            ) : (
              <div className="text-2xl font-bold">
                {formatINR(balanceData?.balance || BigInt(0))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/95 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Credits</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            {healthLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="text-2xl font-bold text-chart-2">
                {formatINR(healthData?.monthlyCredits || BigInt(0))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/95 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Debits</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            {healthLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="text-2xl font-bold text-destructive">
                {formatINR(healthData?.monthlyDebits || BigInt(0))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              Transaction Distribution
            </CardTitle>
            <CardDescription>Monthly credits vs debits breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            {healthLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : pieData[0].value === 0 && pieData[1].value === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No transaction data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) =>
                      formatINR(BigInt(value))
                    }
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/95 backdrop-blur">
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
            <CardDescription>Balance and monthly activity comparison</CardDescription>
          </CardHeader>
          <CardContent>
            {healthLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <BarResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <RechartsTooltip
                    formatter={(value: number) =>
                      formatINR(BigInt(value))
                    }
                  />
                  <Bar dataKey="amount" fill="oklch(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </BarResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
