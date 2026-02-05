import { useNavigate, useRouterState } from '@tanstack/react-router';
import { 
  LayoutDashboard, 
  Wallet, 
  FileText, 
  TrendingUp, 
  PieChart, 
  BarChart3,
  Coins,
  Settings,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

export default function Sidebar({ isOpen = true, onClose, isMobile = false }: SidebarProps) {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navItems = [
    { 
      label: 'Dashboard', 
      path: '/dashboard', 
      icon: LayoutDashboard,
      description: 'Overview'
    },
    { 
      label: 'Account', 
      path: '/account', 
      icon: Wallet,
      description: 'Balance & Details'
    },
    { 
      label: 'Statements', 
      path: '/statements', 
      icon: FileText,
      description: 'Transaction History'
    },
    { 
      label: 'Market Insights', 
      path: '/market-insights', 
      icon: TrendingUp,
      description: 'Market Data'
    },
    { 
      label: 'Mutual Funds', 
      path: '/mutual-funds', 
      icon: PieChart,
      description: 'Fund Performance'
    },
    { 
      label: 'Stocks', 
      path: '/stocks', 
      icon: BarChart3,
      description: 'Stock Market'
    },
    { 
      label: 'Gold & Silver Rates', 
      path: '/gold-silver-rates', 
      icon: Coins,
      description: 'Precious Metals'
    },
  ];

  const handleNavigation = (path: string) => {
    navigate({ to: path });
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-sidebar border-r border-sidebar-border",
        isMobile ? "w-full" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <img
            src="/assets/generated/arthanidhi-logo.dim_512x512.png"
            alt="ArthaNidhi"
            className="h-8 w-8"
          />
          <span className="font-display font-bold text-lg text-sidebar-foreground">
            ArthaNidhi
          </span>
        </div>
        {isMobile && onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-sidebar-primary-foreground")} />
                <div className="flex flex-col items-start flex-1 min-w-0">
                  <span className="truncate">{item.label}</span>
                  {!isMobile && (
                    <span className={cn(
                      "text-xs truncate",
                      isActive ? "text-sidebar-primary-foreground/70" : "text-muted-foreground"
                    )}>
                      {item.description}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        <Separator className="my-4" />

        <button
          onClick={() => handleNavigation('/settings')}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
            currentPath === '/settings'
              ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          <div className="flex flex-col items-start flex-1 min-w-0">
            <span className="truncate">Settings</span>
            {!isMobile && (
              <span className={cn(
                "text-xs truncate",
                currentPath === '/settings' ? "text-sidebar-primary-foreground/70" : "text-muted-foreground"
              )}>
                Profile & Preferences
              </span>
            )}
          </div>
        </button>
      </ScrollArea>
    </aside>
  );
}
