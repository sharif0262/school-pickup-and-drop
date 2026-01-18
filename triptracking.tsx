import { useGetTripRequestsByParent, useGetDriverLocation, useTriggerSOS } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, User, AlertTriangle, Loader2, Navigation } from 'lucide-react';
import { TripStatus } from '../../backend';
import { toast } from 'sonner';

export default function TripTracking() {
  const { data: trips = [], isLoading } = useGetTripRequestsByParent();
  const triggerSOS = useTriggerSOS();

  const getStatusColor = (status: TripStatus) => {
    switch (status) {
      case TripStatus.inProgress:
        return 'bg-success text-white';
      case TripStatus.pending:
        return 'bg-warning text-white';
      case TripStatus.emergency:
        return 'bg-destructive text-white';
      case TripStatus.completed:
        return 'bg-muted text-muted-foreground';
      case TripStatus.canceled:
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: TripStatus) => {
    switch (status) {
      case TripStatus.inProgress:
        return 'On the Way';
      case TripStatus.pending:
        return 'Pending';
      case TripStatus.emergency:
        return 'Emergency Alert';
      case TripStatus.completed:
        return 'Completed';
      case TripStatus.canceled:
        return 'Canceled';
      default:
        return status;
    }
  };

  const handleSOS = async () => {
    try {
      await triggerSOS.mutateAsync(null);
      toast.success('SOS alert sent!');
    } catch (error) {
      console.error('SOS error:', error);
      toast.error('Failed to send SOS alert');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const activeTrips = trips.filter((trip) => trip.status === TripStatus.pending || trip.status === TripStatus.inProgress);
  const pastTrips = trips.filter((trip) => trip.status === TripStatus.completed || trip.status === TripStatus.canceled);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Trip Tracking</h3>
          <p className="text-sm text-muted-foreground">Monitor your children's trips in real-time</p>
        </div>
        <Button onClick={handleSOS} disabled={triggerSOS.isPending} variant="destructive" size="lg" className="gap-2">
          {triggerSOS.isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <AlertTriangle className="h-5 w-5" />
          )}
          SOS Alert
        </Button>
      </div>

      {activeTrips.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Active Trips</h4>
          {activeTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} getStatusColor={getStatusColor} getStatusLabel={getStatusLabel} />
          ))}
        </div>
      )}

      {pastTrips.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Past Trips</h4>
          {pastTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} getStatusColor={getStatusColor} getStatusLabel={getStatusLabel} />
          ))}
        </div>
      )}

      {trips.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-2 text-lg font-medium">No trips found</p>
            <p className="text-sm text-muted-foreground">Book your first trip to get started</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function TripCard({
  trip,
  getStatusColor,
  getStatusLabel,
}: {
  trip: any;
  getStatusColor: (status: TripStatus) => string;
  getStatusLabel: (status: TripStatus) => string;
}) {
  const { data: driverLocation } = useGetDriverLocation(trip.driverId?.toString() || null);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">Trip #{trip.id.slice(0, 8)}</CardTitle>
            <CardDescription>
              {trip.childrenIds.length} {trip.childrenIds.length === 1 ? 'child' : 'children'}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(trip.status)}>{getStatusLabel(trip.status)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-medium">Children</p>
            <p className="text-muted-foreground">{trip.childrenIds.join(', ')}</p>
          </div>
        </div>
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-medium">Pickup</p>
            <p className="text-muted-foreground">
              {trip.pickupLocation.latitude.toFixed(4)}, {trip.pickupLocation.longitude.toFixed(4)}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2 text-sm">
          <Navigation className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-medium">Dropoff</p>
            <p className="text-muted-foreground">
              {trip.dropoffLocation.latitude.toFixed(4)}, {trip.dropoffLocation.longitude.toFixed(4)}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-medium">Scheduled</p>
            <p className="text-muted-foreground">
              {new Date(Number(trip.scheduledTime) / 1_000_000).toLocaleString()}
            </p>
          </div>
        </div>
        {driverLocation && (
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-success" />
            <div>
              <p className="font-medium">Driver Location</p>
              <p className="text-muted-foreground">
                {driverLocation.latitude.toFixed(4)}, {driverLocation.longitude.toFixed(4)}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
