import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Heart, Home, Car, Briefcase } from 'lucide-react';
import { formatINRDecimal } from '@/utils/currency';

const insuranceProducts = [
  {
    id: 'life',
    name: 'Life Insurance',
    icon: Shield,
    coverage: 5000000,
    premium: 15000,
    description: 'Comprehensive life coverage for your family',
    features: ['Death benefit', 'Maturity benefit', 'Tax benefits'],
  },
  {
    id: 'health',
    name: 'Health Insurance',
    icon: Heart,
    coverage: 1000000,
    premium: 12000,
    description: 'Complete health coverage for you and your family',
    features: ['Cashless hospitalization', 'Pre & post hospitalization', 'No claim bonus'],
  },
  {
    id: 'home',
    name: 'Home Insurance',
    icon: Home,
    coverage: 2000000,
    premium: 8000,
    description: 'Protect your home and belongings',
    features: ['Structure damage', 'Contents coverage', 'Natural calamities'],
  },
  {
    id: 'vehicle',
    name: 'Vehicle Insurance',
    icon: Car,
    coverage: 500000,
    premium: 10000,
    description: 'Comprehensive vehicle protection',
    features: ['Own damage', 'Third party liability', 'Personal accident'],
  },
  {
    id: 'business',
    name: 'Business Insurance',
    icon: Briefcase,
    coverage: 10000000,
    premium: 50000,
    description: 'Protect your business assets',
    features: ['Property damage', 'Liability coverage', 'Business interruption'],
  },
];

export default function InsurancePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = selectedCategory === 'all'
    ? insuranceProducts
    : insuranceProducts.filter(p => p.id === selectedCategory);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Insurance</h1>
        <p className="text-muted-foreground">Protect what matters most to you</p>
      </div>

      <Alert className="mb-6">
        <AlertDescription>
          <Badge variant="outline" className="mr-2">Demo Mode</Badge>
          All insurance products and premiums are simulated for demonstration purposes only.
        </AlertDescription>
      </Alert>

      <div className="mb-6">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-64">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Insurance</SelectItem>
            <SelectItem value="life">Life Insurance</SelectItem>
            <SelectItem value="health">Health Insurance</SelectItem>
            <SelectItem value="home">Home Insurance</SelectItem>
            <SelectItem value="vehicle">Vehicle Insurance</SelectItem>
            <SelectItem value="business">Business Insurance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredProducts.map((product) => {
          const Icon = product.icon;
          return (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  {product.name}
                </CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Coverage</p>
                    <p className="text-lg font-semibold">{formatINRDecimal(product.coverage)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Annual Premium</p>
                    <p className="text-lg font-semibold text-primary">{formatINRDecimal(product.premium)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Key Features:</p>
                  <ul className="space-y-1">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">Get Quote</Button>
                  <Button variant="outline" className="flex-1">Learn More</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
