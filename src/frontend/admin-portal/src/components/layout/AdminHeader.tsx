import { useNavigate } from '@tanstack/react-router';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, LogOut, Shield } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AdminHeader() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAdminAuth();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    logout();
    navigate({ to: '/' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <button
            onClick={() => navigate({ to: isAuthenticated ? '/dashboard' : '/' })}
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <img
              src="/assets/generated/arthanidhi-logo.dim_512x512.png"
              alt="ArthaNidhi Admin"
              className="h-10 w-10"
            />
            <div className="flex flex-col items-start">
              <span className="font-display text-xl font-semibold tracking-tight">
                ArthaNidhi
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Admin Portal
              </span>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
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
                <Button variant="ghost">
                  {user?.displayName || 'Admin'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm">
                  <p className="font-medium">{user?.displayName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate({ to: '/' })} size="sm">
              Admin Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
