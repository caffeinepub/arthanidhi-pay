import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="container py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/arthanidhi-logo.dim_512x512.png"
              alt="ArthaNidhi"
              className="h-8 w-auto"
            />
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground">
              © 2026. Built with <Heart className="inline h-3 w-3 text-primary fill-primary" /> using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Demo application for educational purposes only
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
