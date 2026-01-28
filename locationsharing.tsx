import { useState, useEffect, useRef } from 'react';
import { useUpdateDriverLocation } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function LocationSharing() {
  const updateLocation = useUpdateDriverLocation();
  const [isSharing, setIsSharing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const THROTTLE_MS = 5000; // Only update backend once every 5 seconds

  const startSharing = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setCurrentLocation(location);

        const now = Date.now();
        if (now - lastUpdateRef.current > THROTTLE_MS) {
          updateLocation.mutate(location);
          lastUpdateRef.current = now;
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast.error('Failed to get location');
        setIsSharing(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    setWatchId(id);
    setIsSharing(true);
    toast.success('Location sharing started');
  };

  const stopSharing = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsSharing(false);
    toast.success('Location sharing stopped');
  };

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Location Sharing
          </CardTitle>
          <CardDescription>Share your real-time location with parents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <MapPin className={`h-5 w-5 ${isSharing ? 'text-success' : 'text-muted-foreground'}`} />
              <div>
                <p className="font-medium">Location Status</p>
                <p className="text-sm text-muted-foreground">
                  {isSharing ? 'Sharing location' : 'Not sharing'}
                </p>
              </div>
            </div>
            <Badge variant={isSharing ? 'default' : 'secondary'}>
              {isSharing ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          {currentLocation && (
            <div className="rounded-lg border p-4">
              <p className="mb-2 font-medium">Current Location</p>
              <p className="text-sm text-muted-foreground">
                Latitude: {currentLocation.latitude.toFixed(6)}
              </p>
              <p className="text-sm text-muted-foreground">
                Longitude: {currentLocation.longitude.toFixed(6)}
              </p>
            </div>
          )}

          <Button
            onClick={isSharing ? stopSharing : startSharing}
            disabled={updateLocation.isPending}
            size="lg"
            className="w-full gap-2"
            variant={isSharing ? 'destructive' : 'default'}
          >
            {updateLocation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Navigation className="h-5 w-5" />
            )}
            {isSharing ? 'Stop Sharing Location' : 'Start Sharing Location'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

