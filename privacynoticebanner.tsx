import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, X } from 'lucide-react';

const PRIVACY_ACKNOWLEDGMENT_KEY = 'saferide_privacy_acknowledged';

export default function PrivacyNoticeBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const acknowledged = localStorage.getItem(PRIVACY_ACKNOWLEDGMENT_KEY);
    if (!acknowledged) {
      setShowBanner(true);
    }
  }, []);

  const handleAcknowledge = () => {
    localStorage.setItem(PRIVACY_ACKNOWLEDGMENT_KEY, 'true');
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Alert className="border-primary/50 bg-background shadow-lg">
        <Shield className="h-5 w-5 text-primary" />
        <AlertDescription className="ml-2 flex flex-col gap-3">
          <div className="pr-6">
            <p className="font-medium text-foreground">Your Privacy Matters</p>
            <p className="mt-1 text-sm text-muted-foreground">
              We use strong encryption to protect your data. All sensitive information including child profiles, trip routes, and messages are encrypted at rest and in transit. We never share your data with third parties.
            </p>
          </div>
          <Button onClick={handleAcknowledge} size="sm" className="w-full">
            I Understand
          </Button>
        </AlertDescription>
        <button
          onClick={handleAcknowledge}
          className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </Alert>
    </div>
  );
}
