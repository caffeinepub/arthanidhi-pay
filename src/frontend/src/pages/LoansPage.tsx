import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Landmark, Calculator } from 'lucide-react';
import { formatINRDecimal } from '@/utils/currency';

const loanProducts = [
  {
    id: 'personal',
    name: 'Personal Loan',
    rate: 10.5,
    maxAmount: 2500000,
    tenure: '12-60 months',
    description: 'Quick approval, minimal documentation',
  },
  {
    id: 'home',
    name: 'Home Loan',
    rate: 8.5,
    maxAmount: 10000000,
    tenure: '5-30 years',
    description: 'Low interest rates, tax benefits',
  },
  {
    id: 'car',
    name: 'Car Loan',
    rate: 9.0,
    maxAmount: 2000000,
    tenure: '12-84 months',
    description: 'Finance your dream car',
  },
  {
    id: 'education',
    name: 'Education Loan',
    rate: 7.5,
    maxAmount: 5000000,
    tenure: '5-15 years',
    description: 'Invest in your future',
  },
];

export default function LoansPage() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [tenure, setTenure] = useState('');
  const [emi, setEmi] = useState<number | null>(null);

  const calculateEMI = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 12 / 100;
    const n = parseFloat(tenure);

    if (isNaN(p) || isNaN(r) || isNaN(n) || p <= 0 || r <= 0 || n <= 0) {
      return;
    }

    const emiValue = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setEmi(emiValue);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Loans</h1>
        <p className="text-muted-foreground">Explore loan products and calculate EMI</p>
      </div>

      <Alert className="mb-6">
        <AlertDescription>
          <Badge variant="outline" className="mr-2">Demo Mode</Badge>
          All loan products and calculations are simulated for demonstration purposes only.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">Loan Products</TabsTrigger>
          <TabsTrigger value="calculator">EMI Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {loanProducts.map((loan) => (
              <Card key={loan.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Landmark className="h-5 w-5" />
                    {loan.name}
                  </CardTitle>
                  <CardDescription>{loan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Interest Rate</span>
                    <span className="font-semibold">{loan.rate}% p.a.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Max Amount</span>
                    <span className="font-semibold">{formatINRDecimal(loan.maxAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tenure</span>
                    <span className="font-semibold">{loan.tenure}</span>
                  </div>
                  <Button className="w-full mt-4">Apply Now</Button>
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
                  EMI Calculator
                </CardTitle>
                <CardDescription>Calculate your monthly installment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="principal">Loan Amount (₹)</Label>
                  <Input
                    id="principal"
                    type="number"
                    placeholder="500000"
                    value={principal}
                    onChange={(e) => setPrincipal(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate">Interest Rate (% p.a.)</Label>
                  <Input
                    id="rate"
                    type="number"
                    placeholder="10.5"
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
                <Button onClick={calculateEMI} className="w-full">
                  Calculate EMI
                </Button>
              </CardContent>
            </Card>

            {emi !== null && (
              <Card>
                <CardHeader>
                  <CardTitle>EMI Breakdown</CardTitle>
                  <CardDescription>Monthly payment details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-6 border-b">
                    <p className="text-sm text-muted-foreground mb-2">Monthly EMI</p>
                    <p className="text-4xl font-bold text-primary">{formatINRDecimal(emi)}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Principal Amount</span>
                      <span className="font-semibold">{formatINRDecimal(parseFloat(principal))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Interest</span>
                      <span className="font-semibold">
                        {formatINRDecimal(emi * parseFloat(tenure) - parseFloat(principal))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Amount</span>
                      <span className="font-semibold">{formatINRDecimal(emi * parseFloat(tenure))}</span>
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
