import { Heart } from 'lucide-react';

interface FooterProps {
  onPrivacyClick?: () => void;
}

export default function Footer({ onPrivacyClick }: FooterProps) {
  return (
    <footer className="border-t border-border bg-muted/30 py-6">
      <div className="container">
        <div className="flex flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            © 2025. Built with{' '}
            <Heart className="h-4 w-4 fill-red-500 text-red-500" aria-hidden="true" /> using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          {onPrivacyClick && (
            <button
              onClick={onPrivacyClick}
              className="font-medium text-foreground hover:underline"
            >
              Privacy Policy
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}

