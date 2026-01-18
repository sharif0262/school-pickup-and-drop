import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import AssignedRoutes from '../components/driver/AssignedRoutes';
import LocationSharing from '../components/driver/LocationSharing';
import DriverChat from '../components/driver/DriverChat';

interface DriverDashboardProps {
  onBack: () => void;
}

export default function DriverDashboard({ onBack }: DriverDashboardProps) {
  const [activeTab, setActiveTab] = useState('routes');

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center gap-4">
        <Button onClick={onBack} variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Driver Dashboard</h2>
          <p className="text-sm text-muted-foreground">Manage your routes and students</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="chat">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="routes">
          <AssignedRoutes />
        </TabsContent>

        <TabsContent value="location">
          <LocationSharing />
        </TabsContent>

        <TabsContent value="chat">
          <DriverChat />
        </TabsContent>
      </Tabs>
    </div>
  );
}
