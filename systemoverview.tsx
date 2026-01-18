import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetAllTripRequests } from '../../hooks/useQueries';
import { Loader2, Users, Car, AlertTriangle, CheckCircle } from 'lucide-react';
import { TripStatus } from '../../backend';

export default function SystemOverview() {
  const { data: allTrips, isLoading } = useGetAllTripRequests();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const trips = allTrips || [];
  const pendingTrips = trips.filter((t) => t.status === TripStatus.pending).length;
  const inProgressTrips = trips.filter((t) => t.status === TripStatus.inProgress).length;
  const completedTrips = trips.filter((t) => t.status === TripStatus.completed).length;
  const emergencyTrips = trips.filter((t) => t.status === TripStatus.emergency).length;

  const stats = [
    {
      title: 'Total Trips',
      value: trips.length,
      icon: Car,
      description: 'All time trip requests',
      color: 'text-blue-600',
    },
    {
      title: 'Pending Trips',
      value: pendingTrips,
      icon: Users,
      description: 'Awaiting driver assignment',
      color: 'text-yellow-600',
    },
    {
      title: 'In Progress',
      value: inProgressTrips,
      icon: CheckCircle,
      description: 'Currently active trips',
      color: 'text-green-600',
    },
    {
      title: 'Emergency Alerts',
      value: emergencyTrips,
      icon: AlertTriangle,
      description: 'Requires immediate attention',
      color: 'text-red-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest trip requests and system events</CardDescription>
        </CardHeader>
        <CardContent>
          {trips.length === 0 ? (
            <p className="text-center text-muted-foreground">No trips recorded yet</p>
          ) : (
            <div className="space-y-4">
              {trips.slice(0, 5).map((trip) => (
                <div key={trip.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">Trip #{trip.id.slice(0, 8)}...</p>
                    <p className="text-sm text-muted-foreground">
                      {trip.childrenIds.length} {trip.childrenIds.length === 1 ? 'child' : 'children'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium capitalize">{trip.status}</p>
                    <p className="text-xs text-muted-foreground">
                      {trip.driverId ? 'Driver assigned' : 'No driver'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trip Status Distribution</CardTitle>
          <CardDescription>Overview of all trip statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Completed</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-green-600"
                    style={{ width: `${trips.length > 0 ? (completedTrips / trips.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{completedTrips}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">In Progress</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-blue-600"
                    style={{ width: `${trips.length > 0 ? (inProgressTrips / trips.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{inProgressTrips}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Pending</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-yellow-600"
                    style={{ width: `${trips.length > 0 ? (pendingTrips / trips.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{pendingTrips}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Emergency</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-red-600"
                    style={{ width: `${trips.length > 0 ? (emergencyTrips / trips.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{emergencyTrips}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
