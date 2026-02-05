import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, Moon, Sun, LogOut } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

export default function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Account', path: '/account' },
    { label: 'Statements', path: '/statements' },
    { label: 'Market Insights', path: '/market-insights' },
    { label: 'Mutual Funds', path: '/mutual-funds' },
    { label: 'Stocks', path: '/stocks' },
  ];

  const handleNavigation = (path: string) => {
    navigate({ to: path });
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate({ to: '/' });
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <button
            onClick={() => handleNavigation(isAuthenticated ? '/dashboard' : '/')}
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <img
              src="/assets/generated/arthanidhi-logo.dim_512x512.png"
              alt="ArthaNidhi"
              className="h-10 w-auto"
            />
          </button>

          {isAuthenticated && (
            <nav className="hidden lg:flex items-center gap-6">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hidden sm:inline-flex"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden lg:inline-flex">
                    {user?.displayName || 'Account'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleNavigation('/settings')}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={toggleTheme}
                    className="sm:hidden"
                  >
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64">
                  <div className="flex flex-col gap-4 mt-8">
                    <div className="px-2 py-2 border-b">
                      <p className="text-sm font-medium">
                        {user?.displayName || 'Account'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {user?.email}
                      </p>
                    </div>
                    {navItems.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => handleNavigation(item.path)}
                        className="px-2 py-2 text-left text-sm font-medium hover:bg-accent rounded-md transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
                    <button
                      onClick={() => handleNavigation('/settings')}
                      className="px-2 py-2 text-left text-sm font-medium hover:bg-accent rounded-md transition-colors"
                    >
                      Settings
                    </button>
                    <button
                      onClick={toggleTheme}
                      className="px-2 py-2 text-left text-sm font-medium hover:bg-accent rounded-md transition-colors sm:hidden"
                    >
                      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-2 py-2 text-left text-sm font-medium text-destructive hover:bg-accent rounded-md transition-colors mt-4 border-t pt-4"
                    >
                      <LogOut className="inline mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <Button onClick={() => handleNavigation('/')} size="sm">
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
