import GoldSilverRatesCard from '../components/dashboard/GoldSilverRatesCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins } from 'lucide-react';

export default function GoldSilverRatesPage() {
  return (
    <div className="container py-8 space-y-8 animate-fade-in">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Coins className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">
              Gold & Silver Rates
            </h1>
            <p className="text-muted-foreground mt-1">
              Current precious metal rates in India
            </p>
          </div>
        </div>
      </div>

      <GoldSilverRatesCard />

      <Card className="bg-card/95 backdrop-blur">
        <CardHeader>
          <CardTitle>About Gold & Silver Rates</CardTitle>
          <CardDescription>
            Understanding precious metal pricing in India
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Gold and silver rates vary across different cities in India due to factors such as
            local taxes, transportation costs, and demand-supply dynamics. The rates shown here
            are indicative and may differ from actual market rates.
          </p>
          <p>
            <strong className="text-foreground">Karat Information:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>24K Gold:</strong> 99.9% pure gold (24 parts gold out of 24)</li>
            <li><strong>22K Gold:</strong> 91.67% pure gold (22 parts gold, 2 parts alloy)</li>
            <li><strong>18K Gold:</strong> 75% pure gold (18 parts gold, 6 parts alloy)</li>
          </ul>
          <p>
            <strong className="text-foreground">Note:</strong> The rates displayed are for demonstration
            purposes only and should not be used for actual trading or investment decisions. Always
            consult with authorized dealers for current market rates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
