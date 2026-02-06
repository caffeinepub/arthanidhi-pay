import { useRef } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { 
  LayoutDashboard, 
  Wallet, 
  FileText, 
  Send,
  Users,
  CreditCard,
  Landmark,
  PiggyBank,
  Shield,
  TrendingUp, 
  PieChart, 
  BarChart3,
  Coins,
  Gift,
  Bell,
  HeadphonesIcon,
  Settings,
  ChevronLeft,
  ChevronUp,
  ChevronDown
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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
      label: 'Payments', 
      path: '/payments', 
      icon: Send,
      description: 'Pay Bills & Transfer'
    },
    { 
      label: 'Beneficiaries', 
      path: '/beneficiaries', 
      icon: Users,
      description: 'Manage Recipients'
    },
    { 
      label: 'Cards', 
      path: '/cards', 
      icon: CreditCard,
      description: 'Debit & Credit Cards'
    },
    { 
      label: 'Loans', 
      path: '/loans', 
      icon: Landmark,
      description: 'Personal & Home Loans'
    },
    { 
      label: 'Deposits', 
      path: '/deposits', 
      icon: PiggyBank,
      description: 'FD & RD'
    },
    { 
      label: 'Insurance', 
      path: '/insurance', 
      icon: Shield,
      description: 'Life & Health'
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
    { 
      label: 'Rewards & Offers', 
      path: '/rewards-offers', 
      icon: Gift,
      description: 'Cashback & Deals'
    },
    { 
      label: 'Notifications', 
      path: '/notifications', 
      icon: Bell,
      description: 'Alerts & Updates'
    },
    { 
      label: 'Support & Contact', 
      path: '/support', 
      icon: HeadphonesIcon,
      description: 'Help Center'
    },
  ];

  const handleNavigation = (path: string) => {
    navigate({ to: path });
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleScrollUp = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollBy({ top: -200, behavior: 'smooth' });
      }
    }
  };

  const handleScrollDown = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollBy({ top: 200, behavior: 'smooth' });
      }
    }
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-sidebar border-r border-sidebar-border",
        isMobile ? "w-full" : "w-64"
      )}
    >
      {isMobile && onClose && (
        <div className="p-4 flex items-center justify-end border-b border-sidebar-border">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Up chevron - always visible */}
      <div className="px-3 pt-3 pb-1">
        <button
          onClick={handleScrollUp}
          aria-label="Scroll up"
          className={cn(
            "w-full flex items-center justify-center px-3 py-1.5 rounded-md text-sm transition-all",
            "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <ChevronUp className="h-4 w-4" />
        </button>
      </div>

      <ScrollArea ref={scrollAreaRef} className="flex-1 px-3">
        <nav className="space-y-1 py-2">
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
                <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-sidebar-primary-foreground")} />
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
            <Settings className="h-5 w-5 shrink-0" />
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
        </nav>
      </ScrollArea>

      {/* Down chevron - always visible */}
      <div className="px-3 pt-1 pb-3">
        <button
          onClick={handleScrollDown}
          aria-label="Scroll down"
          className={cn(
            "w-full flex items-center justify-center px-3 py-1.5 rounded-md text-sm transition-all",
            "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
