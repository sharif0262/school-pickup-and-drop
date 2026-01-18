import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useActor } from '../hooks/useActor';
import { Loader2 } from 'lucide-react';
import ParentDashboard from './ParentDashboard';
import DriverDashboard from './DriverDashboard';
import AdminDashboard from './AdminDashboard';

type Role = 'parent' | 'driver' | 'admin' | null;

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const { actor } = useActor();

  useEffect(() => {
    async function checkAdminStatus() {
      if (!actor) return;
      try {
        const adminStatus = await actor.isCallerAdmin();
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    }
    checkAdminStatus();
  }, [actor]);

  if (checkingAdmin) {
    return (
      <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (selectedRole === 'parent') {
    return <ParentDashboard onBack={() => setSelectedRole(null)} />;
  }

  if (selectedRole === 'driver') {
    return <DriverDashboard onBack={() => setSelectedRole(null)} />;
  }

  if (selectedRole === 'admin') {
    return <AdminDashboard onBack={() => setSelectedRole(null)} />;
  }

  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <div className="w-full max-w-4xl space-y-6">
        <div className="text-center">
          <h2 className="mb-2 text-3xl font-bold">Choose Your Role</h2>
          <p className="text-muted-foreground">Select how you want to use SafeRide</p>
        </div>

        <div className={`grid gap-6 ${isAdmin ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
          <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={() => setSelectedRole('parent')}>
            <CardHeader className="text-center">
              <img
                src="/assets/generated/parent-child-icon.dim_64x64.png"
                alt="Parent"
                className="mx-auto mb-4 h-16 w-16"
              />
              <CardTitle>Parent</CardTitle>
              <CardDescription>Book trips and track your children</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Book pick-up and drop-off requests</li>
                <li>• Track driver location in real-time</li>
                <li>• Manage child profiles</li>
                <li>• Chat with drivers</li>
                <li>• Emergency SOS alerts</li>
              </ul>
              <Button className="mt-6 w-full" size="lg">
                Continue as Parent
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={() => setSelectedRole('driver')}>
            <CardHeader className="text-center">
              <img
                src="/assets/generated/driver-icon.dim_64x64.png"
                alt="Driver"
                className="mx-auto mb-4 h-16 w-16"
              />
              <CardTitle>Driver</CardTitle>
              <CardDescription>Manage routes and student pickups</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• View assigned routes</li>
                <li>• Mark student attendance</li>
                <li>• Update trip status</li>
                <li>• Share live location</li>
                <li>• Chat with parents</li>
              </ul>
              <Button className="mt-6 w-full" size="lg">
                Continue as Driver
              </Button>
            </CardContent>
          </Card>

          {isAdmin && (
            <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={() => setSelectedRole('admin')}>
              <CardHeader className="text-center">
                <img
                  src="/assets/generated/school-bus-icon.dim_64x64.png"
                  alt="Admin"
                  className="mx-auto mb-4 h-16 w-16"
                />
                <CardTitle>Admin</CardTitle>
                <CardDescription>Manage system and users</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Manage user accounts</li>
                  <li>• Monitor all trips</li>
                  <li>• View analytics dashboard</li>
                  <li>• Download project bundle</li>
                  <li>• System administration</li>
                </ul>
                <Button className="mt-6 w-full" size="lg" variant="secondary">
                  Continue as Admin
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
