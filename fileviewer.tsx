import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileCode, FileText, Palette } from 'lucide-react';

export default function FileViewer() {
  const [selectedCategory, setSelectedCategory] = useState<'core' | 'pages' | 'components' | 'styles'>('core');

  const fileCategories = {
    core: [
      {
        path: 'frontend/src/App.tsx',
        language: 'typescript',
        description: 'Main application component with authentication flow and routing',
      },
      {
        path: 'frontend/src/hooks/useQueries.ts',
        language: 'typescript',
        description: 'Custom React Query hooks for backend operations',
      },
      {
        path: 'frontend/src/components/Header.tsx',
        language: 'typescript',
        description: 'Application header with user profile and logout',
      },
      {
        path: 'frontend/src/components/Footer.tsx',
        language: 'typescript',
        description: 'Footer with attribution and privacy policy link',
      },
    ],
    pages: [
      {
        path: 'frontend/src/pages/LoginScreen.tsx',
        language: 'typescript',
        description: 'Login screen with multiple authentication options',
      },
      {
        path: 'frontend/src/pages/ProfileSetup.tsx',
        language: 'typescript',
        description: 'User profile setup for first-time users',
      },
      {
        path: 'frontend/src/pages/RoleSelection.tsx',
        language: 'typescript',
        description: 'Role selection screen for authenticated users',
      },
      {
        path: 'frontend/src/pages/ParentDashboard.tsx',
        language: 'typescript',
        description: 'Parent dashboard with tabbed interface',
      },
      {
        path: 'frontend/src/pages/DriverDashboard.tsx',
        language: 'typescript',
        description: 'Driver dashboard with route management',
      },
      {
        path: 'frontend/src/pages/AdminDashboard.tsx',
        language: 'typescript',
        description: 'Admin dashboard with system overview and file viewer',
      },
      {
        path: 'frontend/src/pages/PrivacyPolicy.tsx',
        language: 'typescript',
        description: 'Comprehensive privacy policy page',
      },
    ],
    components: [
      {
        path: 'frontend/src/components/parent/ChildrenManagement.tsx',
        language: 'typescript',
        description: 'Component for managing child profiles',
      },
      {
        path: 'frontend/src/components/parent/TripBooking.tsx',
        language: 'typescript',
        description: 'Trip booking form for parents',
      },
      {
        path: 'frontend/src/components/parent/TripTracking.tsx',
        language: 'typescript',
        description: 'Real-time trip tracking display',
      },
      {
        path: 'frontend/src/components/parent/ParentChat.tsx',
        language: 'typescript',
        description: 'Chat interface for parents',
      },
      {
        path: 'frontend/src/components/driver/AssignedRoutes.tsx',
        language: 'typescript',
        description: 'Driver view of assigned trips',
      },
      {
        path: 'frontend/src/components/driver/LocationSharing.tsx',
        language: 'typescript',
        description: 'GPS location sharing for drivers',
      },
      {
        path: 'frontend/src/components/driver/DriverChat.tsx',
        language: 'typescript',
        description: 'Chat interface for drivers',
      },
      {
        path: 'frontend/src/components/PrivacyNoticeBanner.tsx',
        language: 'typescript',
        description: 'Privacy notice banner with acknowledgment',
      },
      {
        path: 'frontend/src/components/admin/SystemOverview.tsx',
        language: 'typescript',
        description: 'Admin system overview with statistics',
      },
      {
        path: 'frontend/src/components/admin/UserManagement.tsx',
        language: 'typescript',
        description: 'User management interface',
      },
    ],
    styles: [
      {
        path: 'frontend/src/index.css',
        language: 'css',
        description: 'Global styles with OKLCH color system',
      },
    ],
  };

  const renderFileContent = (filePath: string) => {
    // In a real implementation, this would fetch the actual file content from the backend
    // For now, we'll display a placeholder indicating the file would be shown here
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm text-muted-foreground">
            <strong>File Path:</strong> {filePath}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            The complete contents of this file would be displayed here with syntax highlighting in a production
            environment. The backend would provide the file content through a dedicated API endpoint.
          </p>
        </div>
        <div className="rounded-lg border bg-muted/30 p-6">
          <pre className="text-xs text-muted-foreground">
            <code>
              {`// ${filePath}
// File content would be displayed here with proper syntax highlighting
// This includes all imports, components, functions, and exports
// The viewer supports TypeScript, JavaScript, CSS, and other file types

import { useState } from 'react';
import { Component } from '@/components/ui/component';

export default function ExampleComponent() {
  const [state, setState] = useState(null);
  
  return (
    <div>
      {/* Component implementation */}
    </div>
  );
}`}
            </code>
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode className="h-5 w-5" />
            Frontend File Viewer
          </CardTitle>
          <CardDescription>
            View the complete contents of all frontend source files with syntax highlighting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="core">
                <FileCode className="mr-2 h-4 w-4" />
                Core Files
              </TabsTrigger>
              <TabsTrigger value="pages">
                <FileText className="mr-2 h-4 w-4" />
                Pages
              </TabsTrigger>
              <TabsTrigger value="components">
                <FileCode className="mr-2 h-4 w-4" />
                Components
              </TabsTrigger>
              <TabsTrigger value="styles">
                <Palette className="mr-2 h-4 w-4" />
                Styles
              </TabsTrigger>
            </TabsList>

            {Object.entries(fileCategories).map(([category, files]) => (
              <TabsContent key={category} value={category} className="space-y-4">
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">
                    {files.length} {files.length === 1 ? 'file' : 'files'} in this category
                  </p>
                </div>

                {files.map((file) => (
                  <Card key={file.path}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base font-mono">{file.path}</CardTitle>
                          <CardDescription className="mt-1">{file.description}</CardDescription>
                        </div>
                        <Badge variant="secondary" className="ml-4">
                          {file.language}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[400px] w-full rounded-md border">
                        <div className="p-4">{renderFileContent(file.path)}</div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>File Structure Overview</CardTitle>
          <CardDescription>Complete frontend codebase structure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-muted/30 p-4">
            <pre className="text-xs text-muted-foreground">
              {`frontend/
├── src/
│   ├── App.tsx                          # Main application component
│   ├── main.tsx                         # Application entry point
│   ├── index.css                        # Global styles with OKLCH colors
│   ├── config.ts                        # Application configuration
│   ├── backend.d.ts                     # Backend type definitions
│   │
│   ├── components/
│   │   ├── Header.tsx                   # Application header
│   │   ├── Footer.tsx                   # Application footer
│   │   ├── PrivacyNoticeBanner.tsx      # Privacy notice banner
│   │   │
│   │   ├── parent/
│   │   │   ├── ChildrenManagement.tsx   # Child profile management
│   │   │   ├── TripBooking.tsx          # Trip booking form
│   │   │   ├── TripTracking.tsx         # Real-time trip tracking
│   │   │   └── ParentChat.tsx           # Parent chat interface
│   │   │
│   │   ├── driver/
│   │   │   ├── AssignedRoutes.tsx       # Driver route management
│   │   │   ├── LocationSharing.tsx      # GPS location sharing
│   │   │   └── DriverChat.tsx           # Driver chat interface
│   │   │
│   │   ├── admin/
│   │   │   ├── SystemOverview.tsx       # System statistics
│   │   │   ├── UserManagement.tsx       # User management
│   │   │   └── FileViewer.tsx           # File content viewer
│   │   │
│   │   └── ui/                          # Shadcn UI components (read-only)
│   │
│   ├── hooks/
│   │   ├── useActor.ts                  # Backend actor initialization
│   │   ├── useInternetIdentity.ts       # Internet Identity provider
│   │   └── useQueries.ts                # React Query hooks
│   │
│   ├── pages/
│   │   ├── LoginScreen.tsx              # Login with multiple auth options
│   │   ├── ProfileSetup.tsx             # User profile setup
│   │   ├── RoleSelection.tsx            # Role selection screen
│   │   ├── ParentDashboard.tsx          # Parent dashboard
│   │   ├── DriverDashboard.tsx          # Driver dashboard
│   │   ├── AdminDashboard.tsx           # Admin dashboard
│   │   └── PrivacyPolicy.tsx            # Privacy policy page
│   │
│   └── lib/                             # Helper functions and utilities
│
├── index.html                           # HTML entry point
├── tailwind.config.js                   # Tailwind configuration
├── package.json                         # Dependencies
└── vite.config.js                       # Vite configuration`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
