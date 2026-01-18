import { useState } from 'react';
import { useGetMessages, useSendMessage } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

export default function DriverChat() {
  const { data: messages = [], isLoading } = useGetMessages();
  const sendMessage = useSendMessage();
  const { identity } = useInternetIdentity();
  const [receiverId, setReceiverId] = useState('');
  const [messageText, setMessageText] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!receiverId || !messageText.trim()) {
      toast.error('Please enter receiver ID and message');
      return;
    }

    try {
      await sendMessage.mutateAsync({
        receiver: receiverId,
        text: messageText.trim(),
      });
      setMessageText('');
      toast.success('Message sent!');
    } catch (error) {
      console.error('Send message error:', error);
      toast.error('Failed to send message');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Messages
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
            <Input
              placeholder="Parent Principal ID"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
            />
            <div className="flex gap-2">
              <Input
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
