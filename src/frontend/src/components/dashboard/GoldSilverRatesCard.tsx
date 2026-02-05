import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Coins } from 'lucide-react';
import { formatINRDecimal } from '../../utils/currency';

const INDIAN_CITIES = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Kolkata',
  'Chennai',
  'Hyderabad',
  'Ahmedabad',
  'Pune',
  'Jaipur',
  'Lucknow',
];

const KARATS = ['18', '22', '24'];
const WEIGHTS = ['1g', '10g', '100g', '1000g'];

// Base dummy rates per gram (in INR)
const BASE_GOLD_RATE_PER_GRAM = 6500;
const BASE_SILVER_RATE_PER_GRAM = 85;

export default function GoldSilverRatesCard() {
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [selectedKarat, setSelectedKarat] = useState('22');
  const [selectedWeight, setSelectedWeight] = useState('10g');

  const calculatePrice = (baseRate: number, karat: string, weight: string): number => {
    // Adjust rate based on karat
    let karatMultiplier = 1;
    if (karat === '18') karatMultiplier = 0.75;
    else if (karat === '22') karatMultiplier = 0.916;
    else if (karat === '24') karatMultiplier = 1;

    // Extract weight value
    const weightValue = parseInt(weight.replace('g', ''));

    // Calculate final price
    return baseRate * karatMultiplier * weightValue;
  };

  const goldPrice = calculatePrice(BASE_GOLD_RATE_PER_GRAM, selectedKarat, selectedWeight);
  const silverPrice = BASE_SILVER_RATE_PER_GRAM * parseInt(selectedWeight.replace('g', ''));

  return (
    <Card className="bg-card/95 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-amber-500" />
          Gold & Silver Rates
        </CardTitle>
        <CardDescription>Current market rates (dummy data)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">City</label>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INDIAN_CITIES.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Karat</label>
            <Select value={selectedKarat} onValueChange={setSelectedKarat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {KARATS.map((karat) => (
                  <SelectItem key={karat} value={karat}>
                    {karat}K
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Weight</label>
            <Select value={selectedWeight} onValueChange={setSelectedWeight}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WEIGHTS.map((weight) => (
                  <SelectItem key={weight} value={weight}>
                    {weight}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Gold ({selectedKarat}K)</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-500">
              {formatINRDecimal(goldPrice)}
            </p>
            <p className="text-xs text-muted-foreground">
              for {selectedWeight} in {selectedCity}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Silver</p>
            <p className="text-2xl font-bold text-slate-600 dark:text-slate-400">
              {formatINRDecimal(silverPrice)}
            </p>
            <p className="text-xs text-muted-foreground">
              for {selectedWeight} in {selectedCity}
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground italic">
          * Rates are for demonstration purposes only and do not reflect actual market prices
        </p>
      </CardContent>
    </Card>
  );
}
