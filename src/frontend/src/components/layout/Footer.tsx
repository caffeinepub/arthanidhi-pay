import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-background/80 backdrop-blur">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/arthanidhi-logo.dim_512x512.png"
              alt="ArthaNidhi"
              className="h-8 w-8"
            />
            <span className="font-display text-lg font-semibold">ArthaNidhi</span>
          </div>

          <div className="text-center md:text-left space-y-2">
            <p className="text-xs text-muted-foreground max-w-2xl">
              <strong>Disclaimer:</strong> ArthaNidhi is a demonstration financial application. 
              This is not a real financial institution. All data is simulated for educational purposes only. 
              No real money or financial transactions are processed. This application does not provide financial advice.
            </p>
            <p className="text-xs text-muted-foreground">
              © 2026. Built with <Heart className="inline h-3 w-3 text-primary fill-primary" /> using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
