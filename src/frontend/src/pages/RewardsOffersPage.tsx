import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gift, Star, Bookmark, BookmarkCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { loadUserData, saveUserData } from '@/utils/portalStorage';

const offers = [
  {
    id: 'cashback-1',
    title: '10% Cashback on UPI Payments',
    description: 'Get 10% cashback up to ₹100 on UPI transactions',
    category: 'cashback',
    validTill: '31 Dec 2026',
    terms: 'Min transaction ₹500. Max cashback ₹100.',
  },
  {
    id: 'discount-1',
    title: 'Flat ₹500 Off on Flight Bookings',
    description: 'Book flights and save ₹500 instantly',
    category: 'travel',
    validTill: '15 Mar 2026',
    terms: 'Min booking value ₹5,000.',
  },
  {
    id: 'cashback-2',
    title: '5% Cashback on Grocery Shopping',
    description: 'Shop groceries and earn 5% cashback',
    category: 'shopping',
    validTill: '28 Feb 2026',
    terms: 'Valid on select merchants only.',
  },
  {
    id: 'reward-1',
    title: 'Earn 2X Reward Points',
    description: 'Double reward points on all transactions',
    category: 'rewards',
    validTill: '31 Jan 2026',
    terms: 'Valid for premium account holders.',
  },
];

export default function RewardsOffersPage() {
  const { user } = useAuth();
  const [savedOffers, setSavedOffers] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Load saved offers on mount
  useEffect(() => {
    if (user) {
      const saved = loadUserData(user.id, 'savedOffers');
      if (saved) {
        setSavedOffers(saved);
      }
    }
  }, [user]);

  // Save offers whenever they change
  useEffect(() => {
    if (user && savedOffers.length > 0) {
      saveUserData(user.id, 'savedOffers', savedOffers);
    }
  }, [savedOffers, user]);

  const toggleSaveOffer = (offerId: string) => {
    if (savedOffers.includes(offerId)) {
      setSavedOffers(savedOffers.filter(id => id !== offerId));
      toast.success('Offer removed from saved');
    } else {
      setSavedOffers([...savedOffers, offerId]);
      toast.success('Offer saved successfully');
    }
  };

  const filteredOffers = selectedCategory === 'all'
    ? offers
    : offers.filter(o => o.category === selectedCategory);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Rewards & Offers</h1>
        <p className="text-muted-foreground">Exclusive deals and cashback offers</p>
      </div>

      <Alert className="mb-6">
        <AlertDescription>
          <Badge variant="outline" className="mr-2">Demo Mode</Badge>
          All offers and rewards are simulated for demonstration purposes only.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="all" className="space-y-6" onValueChange={setSelectedCategory}>
        <TabsList>
          <TabsTrigger value="all">All Offers</TabsTrigger>
          <TabsTrigger value="cashback">Cashback</TabsTrigger>
          <TabsTrigger value="shopping">Shopping</TabsTrigger>
          <TabsTrigger value="travel">Travel</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredOffers.map((offer) => {
              const isSaved = savedOffers.includes(offer.id);
              return (
                <Card key={offer.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2 mb-2">
                          <Gift className="h-5 w-5 text-primary" />
                          {offer.title}
                        </CardTitle>
                        <CardDescription>{offer.description}</CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleSaveOffer(offer.id)}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="h-5 w-5 text-primary" />
                        ) : (
                          <Bookmark className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="capitalize">
                        {offer.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Valid till {offer.validTill}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{offer.terms}</p>
                    <Button className="w-full">Avail Offer</Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Your Reward Points
          </CardTitle>
          <CardDescription>Redeem points for exciting rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-4xl font-bold text-primary mb-2">2,450</p>
            <p className="text-sm text-muted-foreground">Available Points</p>
            <Button className="mt-4">Redeem Points</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
