import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Send, Zap, Phone, Tv, Droplet, Lightbulb, Wifi, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { formatINRDecimal } from '@/utils/currency';

const billCategories = [
  { id: 'electricity', name: 'Electricity', icon: Lightbulb, color: 'text-yellow-500' },
  { id: 'water', name: 'Water', icon: Droplet, color: 'text-blue-500' },
  { id: 'gas', name: 'Gas', icon: Zap, color: 'text-orange-500' },
  { id: 'mobile', name: 'Mobile Recharge', icon: Phone, color: 'text-green-500' },
  { id: 'broadband', name: 'Broadband', icon: Wifi, color: 'text-purple-500' },
  { id: 'dth', name: 'DTH/Cable TV', icon: Tv, color: 'text-red-500' },
  { id: 'credit-card', name: 'Credit Card', icon: CreditCard, color: 'text-indigo-500' },
];

export default function PaymentsPage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [billerId, setBillerId] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategory || !billerId || !amount) {
      toast.error('Please fill in all fields');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsProcessing(false);
    toast.success(`Payment of ${formatINRDecimal(amountNum)} processed successfully! (Demo)`);
    
    // Reset form
    setSelectedCategory('');
    setBillerId('');
    setAmount('');
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Payments</h1>
        <p className="text-muted-foreground">Pay bills, recharge, and transfer money</p>
      </div>

      <Alert className="mb-6">
        <AlertDescription>
          <Badge variant="outline" className="mr-2">Demo Mode</Badge>
          All payment transactions are simulated for demonstration purposes only.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Bill Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Pay Bills
            </CardTitle>
            <CardDescription>Select a category and pay your bills instantly</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePayment} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Bill Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {billCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <div className="flex items-center gap-2">
                          <cat.icon className={`h-4 w-4 ${cat.color}`} />
                          {cat.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="billerId">Biller ID / Account Number</Label>
                <Input
                  id="billerId"
                  placeholder="Enter biller ID or account number"
                  value={billerId}
                  onChange={(e) => setBillerId(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  step="0.01"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Pay Now'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Popular payment categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {billCategories.slice(0, 6).map((cat) => (
                  <Button
                    key={cat.id}
                    variant="outline"
                    className="h-auto flex-col gap-2 py-4"
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <cat.icon className={`h-6 w-6 ${cat.color}`} />
                    <span className="text-xs">{cat.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>Your last 3 transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Electricity Bill', amount: 2450, date: 'Today' },
                  { name: 'Mobile Recharge', amount: 599, date: 'Yesterday' },
                  { name: 'Broadband Bill', amount: 999, date: '2 days ago' },
                ].map((payment, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium text-sm">{payment.name}</p>
                      <p className="text-xs text-muted-foreground">{payment.date}</p>
                    </div>
                    <p className="font-semibold">{formatINRDecimal(payment.amount)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
