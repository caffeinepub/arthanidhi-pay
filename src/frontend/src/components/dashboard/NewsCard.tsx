import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Newspaper, Globe, MapPin, AlertCircle } from 'lucide-react';

interface NewsItem {
  id: string;
  category: 'India' | 'World';
  headline: string;
  summary: string;
  timestamp: string;
}

const mockNews: NewsItem[] = [
  {
    id: '1',
    category: 'India',
    headline: 'RBI Maintains Repo Rate at 6.5% in Latest Policy Review',
    summary: 'The Reserve Bank of India kept the key lending rate unchanged, focusing on inflation management while supporting economic growth.',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    category: 'World',
    headline: 'Global Markets Rally on Positive Economic Data',
    summary: 'Major indices across Asia, Europe, and the US showed strong gains following better-than-expected employment figures.',
    timestamp: '4 hours ago',
  },
  {
    id: '3',
    category: 'India',
    headline: 'SEBI Introduces New Guidelines for Mutual Fund Investments',
    summary: 'The Securities and Exchange Board of India announced enhanced disclosure norms to improve transparency for retail investors.',
    timestamp: '6 hours ago',
  },
  {
    id: '4',
    category: 'World',
    headline: 'Oil Prices Stabilize After Recent Volatility',
    summary: 'Crude oil futures found support as major producers signaled commitment to production targets amid geopolitical concerns.',
    timestamp: '8 hours ago',
  },
  {
    id: '5',
    category: 'India',
    headline: 'Indian Rupee Strengthens Against Dollar',
    summary: 'The rupee gained ground in forex markets supported by strong foreign institutional investor inflows into equity markets.',
    timestamp: '10 hours ago',
  },
  {
    id: '6',
    category: 'World',
    headline: 'Tech Stocks Lead Market Recovery',
    summary: 'Technology sector showed resilience with major companies reporting robust quarterly earnings and positive forward guidance.',
    timestamp: '12 hours ago',
  },
];

export default function NewsCard() {
  return (
    <Card className="bg-card/95 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-primary" />
            Financial News
          </CardTitle>
          <Badge variant="outline" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            Demo
          </Badge>
        </div>
        <CardDescription>
          Latest updates from India and around the world
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-muted/50 rounded-lg border border-border/50">
          <p className="text-xs text-muted-foreground flex items-start gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Disclaimer:</strong> This news feed displays simulated demo content for demonstration purposes only. 
              In a production environment, this would show real-time financial news from verified sources.
            </span>
          </p>
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {mockNews.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {item.category === 'India' ? (
                      <MapPin className="h-4 w-4 text-chart-2" />
                    ) : (
                      <Globe className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge 
                        variant={item.category === 'India' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {item.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {item.timestamp}
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm leading-tight">
                      {item.headline}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
