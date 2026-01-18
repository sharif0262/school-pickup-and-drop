import { useState } from 'react';
import { useGetChildProfiles, useCreateTripRequest } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin, Calendar, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function TripBooking() {
  const { data: children = [] } = useGetChildProfiles();
  const createTrip = useCreateTripRequest();
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [pickupLat, setPickupLat] = useState('');
  const [pickupLng, setPickupLng] = useState('');
  const [dropoffLat, setDropoffLat] = useState('');
  const [dropoffLng, setDropoffLng] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const handleChildToggle = (childName: string) => {
    setSelectedChildren((prev) =>
      prev.includes(childName) ? prev.filter((name) => name !== childName) : [...prev, childName]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedChildren.length === 0) {
      toast.error('Please select at least one child');
      return;
    }

    if (!pickupLat || !pickupLng || !dropoffLat || !dropoffLng) {
      toast.error('Please enter pickup and dropoff locations');
      return;
    }

    if (!scheduledDate || !scheduledTime) {
      toast.error('Please select date and time');
      return;
    }

    try {
      const dateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      const scheduledTimeNano = BigInt(dateTime.getTime()) * BigInt(1_000_000);

      await createTrip.mutateAsync({
        childrenIds: selectedChildren,
        pickupLocation: {
          latitude: parseFloat(pickupLat),
          longitude: parseFloat(pickupLng),
        },
        dropoffLocation: {
          latitude: parseFloat(dropoffLat),
          longitude: parseFloat(dropoffLng),
        },
        scheduledTime: scheduledTimeNano,
      });

      toast.success('Trip booked successfully!');
      setSelectedChildren([]);
      setPickupLat('');
      setPickupLng('');
      setDropoffLat('');
      setDropoffLng('');
      setScheduledDate('');
      setScheduledTime('');
    } catch (error) {
      console.error('Book trip error:', error);
      toast.error('Failed to book trip');
    }
  };

  if (children.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <MapPin className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="mb-2 text-lg font-medium">No children profiles found</p>
          <p className="text-sm text-muted-foreground">Please add children profiles first to book trips</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book a Trip</CardTitle>
        <CardDescription>Schedule a pick-up or drop-off for your children</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label>Select Children</Label>
            <div className="space-y-2">
              {children.map((child) => (
                <div key={child.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={child.name}
                    checked={selectedChildren.includes(child.name)}
                    onCheckedChange={() => handleChildToggle(child.name)}
                  />
                  <label htmlFor={child.name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {child.name} ({child.grade})
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Pickup Location</Label>
              <Input
                type="number"
                step="any"
                placeholder="Latitude"
                value={pickupLat}
                onChange={(e) => setPickupLat(e.target.value)}
              />
              <Input
                type="number"
                step="any"
                placeholder="Longitude"
                value={pickupLng}
                onChange={(e) => setPickupLng(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Dropoff Location</Label>
              <Input
                type="number"
                step="any"
                placeholder="Latitude"
                value={dropoffLat}
                onChange={(e) => setDropoffLat(e.target.value)}
              />
              <Input
                type="number"
                step="any"
                placeholder="Longitude"
                value={dropoffLng}
                onChange={(e) => setDropoffLng(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" disabled={createTrip.isPending} className="w-full gap-2" size="lg">
            {createTrip.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            <Calendar className="h-5 w-5" />
            Book Trip
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
