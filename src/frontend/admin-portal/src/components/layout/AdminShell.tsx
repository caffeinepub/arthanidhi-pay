import { ReactNode } from 'react';
import AdminHeader from './AdminHeader';

interface AdminShellProps {
  children: ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="min-h-screen wave-background">
      <AdminHeader />
      <main className="container py-8">
        {children}
      </main>
      <footer className="border-t bg-background/95 backdrop-blur mt-16">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p>© 2026 ArthaNidhi Admin Portal. Built with love using caffeine.ai.</p>
        </div>
      </footer>
    </div>
  );
}
