import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function UserManagement() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Feature In Development</AlertTitle>
            <AlertDescription>
              User management interface is currently under development. You can manage user roles programmatically
              using the backend API methods: assignCallerUserRole() and getCallerUserRole().
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Roles</CardTitle>
          <CardDescription>System roles and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">Admin</h3>
              <p className="text-sm text-muted-foreground">
                Full system access including user management, trip monitoring, and system configuration.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">User (Parent/Driver)</h3>
              <p className="text-sm text-muted-foreground">
                Standard user access for parents to book trips and drivers to manage routes.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">Guest</h3>
              <p className="text-sm text-muted-foreground">
                Limited access for unauthenticated users. Cannot access application features.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
