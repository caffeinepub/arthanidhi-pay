import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PiggyBank, Calculator } from 'lucide-react';
import { formatINRDecimal } from '@/utils/currency';

const depositProducts = [
  {
    id: 'fd-1y',
    name: 'Fixed Deposit - 1 Year',
    rate: 6.5,
    minAmount: 10000,
    tenure: '12 months',
    type: 'FD',
  },
  {
    id: 'fd-3y',
    name: 'Fixed Deposit - 3 Years',
    rate: 7.0,
    minAmount: 10000,
    tenure: '36 months',
    type: 'FD',
  },
  {
    id: 'fd-5y',
    name: 'Fixed Deposit - 5 Years',
    rate: 7.5,
    minAmount: 10000,
    tenure: '60 months',
    type: 'FD',
  },
  {
    id: 'rd',
    name: 'Recurring Deposit',
    rate: 6.0,
    minAmount: 500,
    tenure: '12-120 months',
    type: 'RD',
  },
];

export default function DepositsPage() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [tenure, setTenure] = useState('');
  const [maturityAmount, setMaturityAmount] = useState<number | null>(null);

  const calculateMaturity = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(tenure) / 12;

    if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r <= 0 || t <= 0) {
      return;
    }

    // Simple interest calculation for FD
    const maturity = p * (1 + r * t);
    setMaturityAmount(maturity);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Deposits</h1>
        <p className="text-muted-foreground">Fixed and recurring deposit schemes</p>
      </div>

      <Alert className="mb-6">
        <AlertDescription>
          <Badge variant="outline" className="mr-2">Demo Mode</Badge>
          All deposit products and calculations are simulated for demonstration purposes only.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">Deposit Products</TabsTrigger>
          <TabsTrigger value="calculator">Maturity Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {depositProducts.map((deposit) => (
              <Card key={deposit.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PiggyBank className="h-5 w-5" />
                    {deposit.name}
                  </CardTitle>
                  <CardDescription>
                    <Badge variant="secondary">{deposit.type}</Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Interest Rate</span>
                    <span className="font-semibold">{deposit.rate}% p.a.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Min Amount</span>
                    <span className="font-semibold">{formatINRDecimal(deposit.minAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tenure</span>
                    <span className="font-semibold">{deposit.tenure}</span>
                  </div>
                  <Button className="w-full mt-4">Open Account</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calculator">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Maturity Calculator
                </CardTitle>
                <CardDescription>Calculate your deposit maturity amount</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="principal">Deposit Amount (₹)</Label>
                  <Input
                    id="principal"
                    type="number"
                    placeholder="100000"
                    value={principal}
                    onChange={(e) => setPrincipal(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate">Interest Rate (% p.a.)</Label>
                  <Input
                    id="rate"
                    type="number"
                    placeholder="7.0"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    step="0.1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tenure">Tenure (months)</Label>
                  <Input
                    id="tenure"
                    type="number"
                    placeholder="36"
                    value={tenure}
                    onChange={(e) => setTenure(e.target.value)}
                  />
                </div>
                <Button onClick={calculateMaturity} className="w-full">
                  Calculate Maturity
                </Button>
              </CardContent>
            </Card>

            {maturityAmount !== null && (
              <Card>
                <CardHeader>
                  <CardTitle>Maturity Details</CardTitle>
                  <CardDescription>Your deposit will mature to</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-6 border-b">
                    <p className="text-sm text-muted-foreground mb-2">Maturity Amount</p>
                    <p className="text-4xl font-bold text-primary">{formatINRDecimal(maturityAmount)}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Principal Amount</span>
                      <span className="font-semibold">{formatINRDecimal(parseFloat(principal))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Interest Earned</span>
                      <span className="font-semibold text-green-600">
                        {formatINRDecimal(maturityAmount - parseFloat(principal))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tenure</span>
                      <span className="font-semibold">{tenure} months</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
