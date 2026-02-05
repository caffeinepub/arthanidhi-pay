import { useState } from 'react';
import { useGetBalance, useGetStatement, useSearchTransactions } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpRight, ArrowDownRight, Download, Search } from 'lucide-react';
import type { TransactionType } from '../types';
import { exportTransactionsToCSV } from '../utils/csv';
import { toast } from 'sonner';
import { formatINR } from '../utils/currency';

export default function StatementsPage() {
  const { data: balanceData } = useGetBalance();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [transactionType, setTransactionType] = useState<'all' | TransactionType>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const range = {
    startDate: startDate ? BigInt(new Date(startDate).getTime() * 1000000) : undefined,
    endDate: endDate ? BigInt(new Date(endDate).getTime() * 1000000) : undefined,
    transactionType: transactionType === 'all' ? undefined : transactionType,
  };

  const { data: allTransactions, isLoading: statementsLoading } = useGetStatement(
    startDate || endDate || transactionType !== 'all' ? range : null
  );

  const { data: searchResults } = useSearchTransactions(searchKeyword);

  const transactions = searchKeyword ? searchResults : allTransactions;

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleExport = () => {
    if (!transactions || transactions.length === 0) {
      toast.error('No transactions to export');
      return;
    }
    exportTransactionsToCSV(transactions, 'INR');
    toast.success('Transactions exported successfully');
  };

  const handleClearFilters = () => {
    setSearchKeyword('');
    setTransactionType('all');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="container py-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">Account Statements</h1>
        <p className="text-muted-foreground mt-1">
          View and filter your transaction history
        </p>
      </div>

      <Card className="bg-card/95 backdrop-blur">
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
          <CardDescription>Filter transactions by date, type, or search by keyword</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search description..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Transaction Type</Label>
              <Select value={transactionType} onValueChange={(value: any) => setTransactionType(value)}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="credit">Credits Only</SelectItem>
                  <SelectItem value="debit">Debits Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleClearFilters} variant="outline" size="sm">
              Clear Filters
            </Button>
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/95 backdrop-blur">
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            {transactions?.length || 0} transaction(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {statementsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : !transactions || transactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg font-medium">No transactions found</p>
              <p className="text-sm mt-1">Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((txn) => (
                <div
                  key={Number(txn.id)}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`p-3 rounded-full ${
                        txn.transactionType === 'credit'
                          ? 'bg-chart-2/10 text-chart-2'
                          : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {txn.transactionType === 'credit' ? (
                        <ArrowDownRight className="h-5 w-5" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{txn.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(txn.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-semibold ${
                        txn.transactionType === 'credit'
                          ? 'text-chart-2'
                          : 'text-destructive'
                      }`}
                    >
                      {txn.transactionType === 'credit' ? '+' : '-'}
                      {formatINR(txn.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ID: {Number(txn.id)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
