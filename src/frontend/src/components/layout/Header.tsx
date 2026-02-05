import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Menu, Moon, Sun, LogOut, User } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useSettings();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await logout();
    queryClient.clear();
    navigate({ to: '/' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMobileMenuToggle}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          <button
            onClick={() => navigate({ to: isAuthenticated ? '/dashboard' : '/' })}
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <img
              src="/assets/generated/arthanidhi-logo-uploaded.dim_1200x600.png"
              alt="ArthaNidhi"
              className="h-10 w-auto"
            />
          </button>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user?.displayName || 'Account'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm">
                  <p className="font-medium">{user?.displayName || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: '/settings' })}>
                  Settings
                </DropdownMenuItem>
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
          ) : (
            <Button onClick={() => navigate({ to: '/' })} size="sm">
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
