import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CreditCard, Lock, Unlock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { loadUserData, saveUserData } from '@/utils/portalStorage';

export default function CardsPage() {
  const { user } = useAuth();
  const [isFrozen, setIsFrozen] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);

  // Load card frozen state on mount
  useEffect(() => {
    if (user) {
      const saved = loadUserData(user.id, 'cardFrozen');
      if (saved !== null) {
        setIsFrozen(saved);
      }
    }
  }, [user]);

  // Save card frozen state whenever it changes
  useEffect(() => {
    if (user) {
      saveUserData(user.id, 'cardFrozen', isFrozen);
    }
  }, [isFrozen, user]);

  const handleToggleFreeze = () => {
    setIsFrozen(!isFrozen);
    toast.success(isFrozen ? 'Card unfrozen successfully' : 'Card frozen successfully');
  };

  const cardNumber = '4532 1234 5678 9010';
  const maskedCardNumber = '4532 **** **** 9010';

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Cards</h1>
        <p className="text-muted-foreground">Manage your debit and credit cards</p>
      </div>

      <Alert className="mb-6">
        <AlertDescription>
          <Badge variant="outline" className="mr-2">Demo Mode</Badge>
          Card details and controls are simulated for demonstration purposes only.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Card Display */}
        <Card className="bg-gradient-to-br from-orange-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-sm opacity-80 mb-1">Debit Card</p>
                <p className="text-lg font-semibold">ArthaNidhi Bank</p>
              </div>
              <CreditCard className="h-8 w-8 opacity-80" />
            </div>
            
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-2xl font-mono tracking-wider">
                  {showCardNumber ? cardNumber : maskedCardNumber}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  onClick={() => setShowCardNumber(!showCardNumber)}
                >
                  {showCardNumber ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs opacity-80 mb-1">Card Holder</p>
                <p className="font-semibold">{user?.displayName || 'JOHN DOE'}</p>
              </div>
              <div>
                <p className="text-xs opacity-80 mb-1">Valid Thru</p>
                <p className="font-semibold">12/28</p>
              </div>
              <div>
                <p className="text-xs opacity-80 mb-1">CVV</p>
                <p className="font-semibold">***</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card Controls */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Card Status</CardTitle>
              <CardDescription>
                {isFrozen ? 'Your card is currently frozen' : 'Your card is active'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isFrozen ? (
                    <Lock className="h-5 w-5 text-destructive" />
                  ) : (
                    <Unlock className="h-5 w-5 text-green-500" />
                  )}
                  <Label htmlFor="freeze-toggle" className="cursor-pointer">
                    {isFrozen ? 'Frozen' : 'Active'}
                  </Label>
                </div>
                <Switch
                  id="freeze-toggle"
                  checked={isFrozen}
                  onCheckedChange={handleToggleFreeze}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                {isFrozen
                  ? 'Your card is temporarily blocked. All transactions will be declined.'
                  : 'Your card is active and ready to use for transactions.'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card Limits</CardTitle>
              <CardDescription>Daily transaction limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">ATM Withdrawal</span>
                <span className="font-semibold">₹50,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">POS Transactions</span>
                <span className="font-semibold">₹2,00,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Online Transactions</span>
                <span className="font-semibold">₹1,00,000</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Set PIN
              </Button>
              <Button variant="outline" className="w-full justify-start">
                View Transactions
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Report Lost/Stolen
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
