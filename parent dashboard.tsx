import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import ChildrenManagement from '../components/parent/ChildrenManagement';
import TripBooking from '../components/parent/TripBooking';
import TripTracking from '../components/parent/TripTracking';
import ParentChat from '../components/parent/ParentChat';

interface ParentDashboardProps {
  onBack: () => void;
}

export default function ParentDashboard({ onBack }: ParentDashboardProps) {
  const [activeTab, setActiveTab] = useState('children');

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center gap-4">
        <Button onClick={onBack} variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Parent Dashboard</h2>
          <p className="text-sm text-muted-foreground">Manage your children's transportation</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="children">Children</TabsTrigger>
          <TabsTrigger value="booking">Book Trip</TabsTrigger>
          <TabsTrigger value="tracking">Track Trips</TabsTrigger>
          <TabsTrigger value="chat">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="children">
          <ChildrenManagement />
        </TabsContent>

        <TabsContent value="booking">
          <TripBooking />
        </TabsContent>

        <TabsContent value="tracking">
          <TripTracking />
        </TabsContent>

        <TabsContent value="chat">
          <ParentChat />
        </TabsContent>
      </Tabs>
    </div>
  );
}
