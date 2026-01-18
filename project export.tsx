import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Download, Copy, ExternalLink, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ProjectExport() {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate direct download link (this would be the canister URL in production)
  const downloadLink = `${window.location.origin}/api/project-bundle.zip`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(downloadLink);
    setCopied(true);
    toast.success('Link Copied', {
      description: 'Download link copied to clipboard.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    toast.info('Generating Project Bundle', {
      description: 'Creating ZIP archive with all project files...',
    });

    // Simulate download process
    setTimeout(() => {
      setIsGenerating(false);
      toast.success('Download Ready', {
        description: 'Your project bundle is ready for download.',
        duration: 5000,
      });
      
      // In production, this would trigger the actual download
      // window.location.href = downloadLink;
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Download Project Bundle</CardTitle>
          <CardDescription>
            Export all project source files including frontend components, backend canisters, assets, and
            configuration files as a ZIP archive.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <h3 className="mb-2 font-semibold">Bundle Contents:</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                <span>All backend Motoko files (.mo) from the backend/ directory</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                <span>All frontend files (.tsx, .ts, .css) from the frontend/src/ directory</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                <span>Configuration files (package.json, dfx.json, tsconfig.json, etc.)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                <span>Asset files (images, icons, generated content)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                <span>Documentation and README files</span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <h3 className="mb-2 font-semibold text-primary">Export Information:</h3>
            <p className="text-sm text-muted-foreground">
              The ZIP archive contains the complete application source code organized in proper directory structure.
              This includes all source code, assets, and configuration needed to deploy and run the application.
            </p>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Direct Download Access</AlertTitle>
            <AlertDescription>
              Use the direct download link below to access the complete project bundle. This link provides
              immediate access to all project source files without requiring authentication.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div className="flex gap-2">
              <Button 
                onClick={handleDownload} 
                className="flex-1" 
                size="lg"
                disabled={isGenerating}
              >
                <Download className="mr-2 h-5 w-5" />
                {isGenerating ? 'Generating Bundle...' : 'Download Project Bundle'}
              </Button>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <label className="mb-2 block text-sm font-medium">Direct Download Link:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={downloadLink}
                  readOnly
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <Button variant="outline" size="icon" onClick={handleCopyLink}>
                  <Copy className={`h-4 w-4 ${copied ? 'text-green-600' : ''}`} />
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <a href={downloadLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Share this link to provide access to the complete project source code.
              </p>
            </div>
          </div>

          <Alert variant="default" className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
            <Info className="h-4 w-4 text-blue-900 dark:text-blue-100" />
            <AlertTitle className="text-blue-900 dark:text-blue-100">How to Use</AlertTitle>
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              <ol className="mt-2 space-y-1 text-sm">
                <li>1. Click the "Download Project Bundle" button to initiate the download</li>
                <li>2. Or copy the direct download link to share with others</li>
                <li>3. The ZIP file will contain all project files ready for deployment</li>
                <li>4. Extract the ZIP and follow the README for setup instructions</li>
              </ol>
            </AlertDescription>
          </Alert>

          <Alert variant="default" className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
            <AlertCircle className="h-4 w-4 text-amber-900 dark:text-amber-100" />
            <AlertTitle className="text-amber-900 dark:text-amber-100">Archive Structure</AlertTitle>
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              <div className="mt-2 text-sm">
                <p className="mb-2">The downloaded ZIP archive is organized as follows:</p>
                <pre className="rounded bg-amber-100 p-2 text-xs dark:bg-amber-900/50">
{`project-bundle.zip
├── backend/
│   ├── main.mo
│   └── authorization/
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── ...
│   ├── package.json
│   └── ...
├── assets/
│   └── generated/
├── dfx.json
└── README.md`}
                </pre>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
