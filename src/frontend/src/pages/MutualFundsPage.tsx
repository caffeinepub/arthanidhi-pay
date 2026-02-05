import { useGetMutualFunds } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatINR } from '../utils/currency';

export default function MutualFundsPage() {
  const { data: mutualFunds, isLoading } = useGetMutualFunds();

  const formatChange = (change: bigint) => {
    const num = Number(change);
    return `${num >= 0 ? '+' : ''}${num}%`;
  };

  return (
    <div className="container py-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">Mutual Funds</h1>
        <p className="text-muted-foreground mt-1">
          Explore Indian mutual fund options and performance
        </p>
      </div>

      <Alert className="bg-card/95 backdrop-blur">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Informational Only:</strong> Mutual fund data shown here is simulated for demonstration purposes. 
          This is not real-time data and should not be used for actual investment decisions.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-card/95 backdrop-blur">
                <CardHeader>
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-4 w-20" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          mutualFunds?.map((fund) => {
            const isPositive = Number(fund.oneDayChange) >= 0;
            return (
              <Card key={fund.name} className="bg-card/95 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium line-clamp-2">{fund.name}</CardTitle>
                  <CardDescription className="text-xs">{fund.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">{formatINR(fund.nav)}</div>
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`font-medium ${
                        isPositive ? 'text-chart-2' : 'text-destructive'
                      }`}
                    >
                      {formatChange(fund.oneDayChange)} 1D
                    </span>
                    <span className="text-muted-foreground">
                      {Number(fund.oneYearReturn)}% 1Y
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <Card className="bg-card/95 backdrop-blur">
        <CardHeader>
          <CardTitle>All Mutual Funds</CardTitle>
          <CardDescription>Detailed view of available mutual funds</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fund Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">NAV</TableHead>
                  <TableHead className="text-right">1D Change</TableHead>
                  <TableHead className="text-right">1Y Return</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mutualFunds?.map((fund) => {
                  const isPositive = Number(fund.oneDayChange) >= 0;
                  return (
                    <TableRow key={fund.name}>
                      <TableCell className="font-medium">{fund.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{fund.category}</TableCell>
                      <TableCell className="text-right">{formatINR(fund.nav)}</TableCell>
                      <TableCell
                        className={`text-right font-medium ${
                          isPositive ? 'text-chart-2' : 'text-destructive'
                        }`}
                      >
                        <span className="inline-flex items-center gap-1">
                          {isPositive ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {formatChange(fund.oneDayChange)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium text-chart-2">
                        +{Number(fund.oneYearReturn)}%
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
