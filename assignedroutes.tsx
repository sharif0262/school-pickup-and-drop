import { useGetAllTripRequests, useUpdateTripStatus } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, User, Loader2, CheckCircle, XCircle, PlayCircle } from 'lucide-react';
import { TripStatus } from '../../backend';
import { toast } from 'sonner';

export default function AssignedRoutes() {
  const { data: allTrips = [], isLoading } = useGetAllTripRequests();
  const { identity } = useInternetIdentity();
  const updateStatus = useUpdateTripStatus();

  const myTrips = allTrips.filter(
    (trip) => trip.driverId?.toString() === identity?.getPrincipal().toString()
  );

  const handleStatusUpdate = async (tripId: string, status: TripStatus) => {
    try {
      await updateStatus.mutateAsync({ tripId, status });
      toast.success('Trip status updated!');
    } catch (error) {
      console.error('Update status error:', error);
      toast.error('Failed to update trip status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (myTrips.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <MapPin className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="mb-2 text-lg font-medium">No assigned routes</p>
          <p className="text-sm text-muted-foreground">You don't have any trips assigned yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Assigned Routes</h3>
        <p className="text-sm text-muted-foreground">Manage your assigned trips and student pickups</p>
      </div>

      <div className="space-y-4">
        {myTrips.map((trip) => (
          <Card key={trip.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">Trip #{trip.id.slice(0, 8)}</CardTitle>
                  <CardDescription>
                    {trip.childrenIds.length} {trip.childrenIds.length === 1 ? 'student' : 'students'}
                  </CardDescription>
                </div>
                <Badge
                  className={
                    trip.status === TripStatus.inProgress
                      ? 'bg-success text-white'
                      : trip.status === TripStatus.pending
                        ? 'bg-warning text-white'
                        : 'bg-muted text-muted-foreground'
                  }
                >
                  {trip.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Students</p>
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
                  <MapPin className="h-4 w-4 text-muted-foreground" />
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
              </div>

              <div className="flex gap-2">
                {trip.status === TripStatus.pending && (
                  <Button
                    onClick={() => handleStatusUpdate(trip.id, TripStatus.inProgress)}
                    disabled={updateStatus.isPending}
                    className="flex-1 gap-2"
                    size="lg"
                  >
                    <PlayCircle className="h-4 w-4" />
                    Start Trip
                  </Button>
                )}
                {trip.status === TripStatus.inProgress && (
                  <>
                    <Button
                      onClick={() => handleStatusUpdate(trip.id, TripStatus.completed)}
                      disabled={updateStatus.isPending}
                      className="flex-1 gap-2"
                      size="lg"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Complete
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(trip.id, TripStatus.emergency)}
                      disabled={updateStatus.isPending}
                      variant="destructive"
                      className="flex-1 gap-2"
                      size="lg"
                    >
                      <XCircle className="h-4 w-4" />
                      Emergency
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
