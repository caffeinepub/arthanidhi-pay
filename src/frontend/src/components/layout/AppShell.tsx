import { ReactNode, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} isMobile />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
