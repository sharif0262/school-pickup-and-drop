'use client';

import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Clock, User } from 'lucide-react';

// Mock trip data
const trips = [
  {
    id: 'trip1',
    driverName: 'Saqib Ali',
    driverAvatar: '', // empty string will trigger fallback
    childrenIds: ['Child 1', 'Child 2'],
    pickupLocation: { latitude: 40.7128, longitude: -74.006 },
    dropoffLocation: { latitude: 40.73061, longitude: -73.935242 },
    scheduledTime: BigInt(Date.now() * 1_000_000), // nanoseconds
  },
  {
    id: 'trip2',
    driverName: 'Ayesha Khan',
    driverAvatar: '/images/ayesha.jpg', // avatar image available
    childrenIds: ['Child 3'],
    pickupLocation: { latitude: 34.0522, longitude: -118.2437 },
    dropoffLocation: { latitude: 34.0622, longitude: -118.2537 },
    scheduledTime: BigInt(Date.now() * 1_000_000),
  },
];

export default function AssignedRoutesWithAvatars() {
  const formatTime = (nano: bigint) =>
    new Date(Number(nano) / 1_000_000).toLocaleString();

  return (
    <div className="space-y-6">
      {trips.map((trip) => (
        <Card key={trip.id}>
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar>
                {trip.driverAvatar ? (
                  <AvatarImage src={trip.driverAvatar} alt={trip.driverName} />
                ) : (
                  <AvatarFallback>{trip.driverName[0]}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <CardTitle>{trip.driverName}</CardTitle>
                <CardDescription>{trip.childrenIds.length} {trip.childrenIds.length === 1 ? 'student' : 'students'}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{trip.childrenIds.join(', ')}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>Pickup: {trip.pickupLocation.latitude.toFixed(4)}, {trip.pickupLocation.longitude.toFixed(4)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>Dropoff: {trip.dropoffLocation.latitude.toFixed(4)}, {trip.dropoffLocation.longitude.toFixed(4)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Scheduled: {formatTime(trip.scheduledTime)}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

