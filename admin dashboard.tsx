'use client';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy-loaded tab components
const SystemOverview = dynamic(() => import('../components/admin/SystemOverview'), { suspense: true });
const UserManagement = dynamic(() => import('../components/admin/UserManagement'), { suspense: true });
const ProjectExport = dynamic(() => import('../components/admin/ProjectExport'), { suspense: true });
const FileViewer = dynamic(() => import('../components/admin/FileViewer'), { suspense: true });

interface AdminDashboardProps {
  onBack: () => void;
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage system, users, and download project files
            </p>
          </div>
        </div>
      </div>

      {/* Admin Alert */}
      <Alert className="mb-6" variant="info">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Administrator Access</AlertTitle>
        <AlertDescription>
          You have full administrative privileges. Use these tools responsibly to manage the SafeRide system.
        </AlertDescription>
      </Alert>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="overview">System Overview</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="export">Project Export</TabsTrigger>
          <TabsTrigger value="files">File Viewer</TabsTrigger>
        </TabsList>

        <Suspense fallback={<p>Loading System Overview...</p>}>
          <TabsContent value="overview">
            <SystemOverview />
          </TabsContent>
        </Suspense>

        <Suspense fallback={<p>Loading User Management...</p>}>
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
        </Suspense>

        <Suspense fallback={<p>Loading Project Export...</p>}>
          <TabsContent value="export">
            <ProjectExport />
          </TabsContent>
        </Suspense>

        <Suspense fallback={<p>Loading File Viewer...</p>}>
          <TabsContent value="files">
            <FileViewer />
          </TabsContent>
        </Suspense>
      </Tabs>
    </div>
  );
}

