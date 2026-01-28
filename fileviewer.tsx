'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, FileCode, FileText, Palette, MessageCircle, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

import { useGetMessages, useSendMessage } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';

type Category = 'core' | 'pages' | 'components' | 'styles';

export default function DriverDashboard({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'routes' | 'location' | 'chat' | 'files'>('routes');

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button onClick={onBack} variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Driver Dashboard</h2>
          <p className="text-sm text-muted-foreground">Manage your routes, location, and messages</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="chat">Messages</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>

        {/* Routes Placeholder */}
        <TabsContent value="routes">
          <Card>
            <CardContent>
              <p className="text-muted-foreground">Assigned routes will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Location Placeholder */}
        <TabsContent value="location">
          <Card>
            <CardContent>
              <p className="text-muted-foreground">Location sharing component goes here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages */}
        <TabsContent value="chat">
          <DriverChat />
        </TabsContent>

        {/* File Viewer */}
        <TabsContent value="files">
          <FileViewer />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ---------------------------- DriverChat Component --------------------------- */
function DriverChat() {
  const { data: messages = [], isLoading } = useGetMessages();
  const sendMessage = useSendMessage();
  const { identity } = useInternetIdentity();
  const [receiverId, setReceiverId] = useState('');
  const [messageText, setMessageText] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiverId || !messageText.trim()) return toast.error('Enter receiver ID and message');

    try {
      await sendMessage.mutateAsync({ receiver: receiverId, text: messageText.trim() });
      setMessageText('');
      toast.success('Message sent!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to send message');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" /> Messages
          </CardTitle>
          <CardDescription>Chat with parents about trips</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScrollArea className="h-[300px] rounded-md border p-4">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No messages yet
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, idx) => {
                  const isOwn = msg.sender.toString() === identity?.getPrincipal().toString();
                  return (
                    <div key={idx} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className="mt-1 text-xs opacity-70">
                          {new Date(Number(msg.timestamp) / 1_000_000).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          <form onSubmit={handleSend} className="space-y-3">
            <input
              className="input"
              placeholder="Parent Principal ID"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
            />
            <div className="flex gap-2">
              <input
                className="input flex-1"
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
              <Button type="submit" disabled={sendMessage.isPending} size="icon">
                {sendMessage.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------------------- FileViewer Component --------------------------- */
function FileViewer() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('core');

  const fileCategories: Record<Category, Array<{ path: string; language: string; description: string }>> = {
    core: [
      { path: 'src/App.tsx', language: 'typescript', description: 'Main app component with routing' },
      { path: 'src/hooks/useQueries.ts', language: 'typescript', description: 'Custom hooks for backend queries' },
    ],
    pages: [
      { path: 'src/pages/LoginScreen.tsx', language: 'typescript', description: 'Login screen with authentication' },
      { path: 'src/pages/DriverDashboard.tsx', language: 'typescript', description: 'Driver dashboard page' },
    ],
    components: [
      { path: 'src/components/driver/DriverChat.tsx', language: 'typescript', description: 'Driver chat component' },
    ],
    styles: [
      { path: 'src/index.css', language: 'css', description: 'Global styles with OKLCH color system' },
    ],
  };

  const categoryIcons: Record<Category, React.ReactNode> = {
    core: <FileCode className="mr-2 h-4 w-4" />,
    pages: <FileText className="mr-2 h-4 w-4" />,
    components: <FileCode className="mr-2 h-4 w-4" />,
    styles: <Palette className="mr-2 h-4 w-4" />,
  };

  const renderFileContent = (filePath: string) => (
    <SyntaxHighlighter language="typescript" style={okaidia} className="rounded-md p-4">
      {`// Mock file content for ${filePath}\n\nconsole.log("This would be the real file content");`}
    </SyntaxHighlighter>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode className="h-5 w-5" /> Frontend File Viewer
          </CardTitle>
          <CardDescription>View frontend files with syntax highlighting</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as Category)} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              {(Object.keys(fileCategories) as Category[]).map((category) => (
                <TabsTrigger key={category} value={category}>
                  {categoryIcons[category]}
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            {(Object.entries(fileCategories) as [Category, typeof fileCategories[Category]][]).map(
              ([category, files]) =>
                category === selectedCategory && (
                  <TabsContent key={category} value={category} className="space-y-4">
                    <div className="rounded-lg border bg-muted/30 p-4">
                      <p className="text-sm text-muted-foreground">{files.length} files in this category</p>
                    </div>
                    {files.map((file) => (
                      <Card key={file.path}>
                        <CardHeader className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-base font-mono">{file.path}</CardTitle>
                            <CardDescription>{file.description}</CardDescription>
                          </div>
                          <Badge variant="secondary">{file.language}</Badge>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-[300px] max-h-[60vh] w-full rounded-md border p-4">
                            {renderFileContent(file.path)}
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                )
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

