import { useGetStocks } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatINR } from '../utils/currency';

export default function StocksPage() {
  const { data: stocks, isLoading } = useGetStocks();

  const formatChange = (change: bigint) => {
    const num = Number(change);
    return `${num >= 0 ? '+' : ''}${num}`;
  };

  return (
    <div className="container py-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">Stocks</h1>
        <p className="text-muted-foreground mt-1">
          Track Indian stock market performance
        </p>
      </div>

      <Alert className="bg-card/95 backdrop-blur">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Informational Only:</strong> Stock data shown here is simulated for demonstration purposes. 
          This is not real-time market data and should not be used for actual trading or investment decisions.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-card/95 backdrop-blur">
                <CardHeader>
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-4 w-32 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          stocks?.slice(0, 3).map((stock) => {
            const isPositive = Number(stock.dailyChange) >= 0;
            return (
              <Card key={stock.symbol} className="bg-card/95 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-sm font-medium">{stock.symbol}</CardTitle>
                    <CardDescription className="text-xs mt-1">{stock.company}</CardDescription>
                  </div>
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4 text-chart-2" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatINR(stock.price)}</div>
                  <p
                    className={`text-xs font-medium ${
                      isPositive ? 'text-chart-2' : 'text-destructive'
                    }`}
                  >
                    {formatChange(stock.dailyChange)} today
                  </p>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <Card className="bg-card/95 backdrop-blur">
        <CardHeader>
          <CardTitle>All Stocks</CardTitle>
          <CardDescription>Detailed view of tracked stocks</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Market</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Daily Change</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stocks?.map((stock) => {
                  const isPositive = Number(stock.dailyChange) >= 0;
                  return (
                    <TableRow key={stock.symbol}>
                      <TableCell className="font-medium">{stock.symbol}</TableCell>
                      <TableCell>{stock.company}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{stock.market}</TableCell>
                      <TableCell className="text-right">{formatINR(stock.price)}</TableCell>
                      <TableCell
                        className={`text-right font-medium ${
                          isPositive ? 'text-chart-2' : 'text-destructive'
                        }`}
                      >
                        {formatChange(stock.dailyChange)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            isPositive
                              ? 'bg-chart-2/10 text-chart-2'
                              : 'bg-destructive/10 text-destructive'
                          }`}
                        >
                          {isPositive ? (
                            <>
                              <TrendingUp className="h-3 w-3" />
                              Up
                            </>
                          ) : (
                            <>
                              <TrendingDown className="h-3 w-3" />
                              Down
                            </>
                          )}
                        </span>
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
