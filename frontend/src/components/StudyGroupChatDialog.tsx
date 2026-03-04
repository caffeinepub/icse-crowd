import { useState, useEffect, useRef } from 'react';
import { useGetStudyGroupMessages, useSendStudyGroupMessage, useGetUserProfile } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { normalizeICError } from '../utils/icErrors';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { getUserInitials } from '../utils/userDisplay';
import type { StudyGroup } from '../backend';

interface StudyGroupChatDialogProps {
  group: StudyGroup;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function StudyGroupChatDialog({ group, open, onOpenChange }: StudyGroupChatDialogProps) {
  const { identity } = useInternetIdentity();
  const [messageContent, setMessageContent] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentPrincipal = identity?.getPrincipal().toString();

  const { data: messages = [], isLoading, isError, error } = useGetStudyGroupMessages(
    group.id,
    { 
      enabled: open,
      refetchInterval: open ? 3000 : undefined, // Poll every 3 seconds when chat is open
    }
  );

  const sendMessage = useSendStudyGroupMessage();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageContent.trim()) {
      return;
    }

    try {
      await sendMessage.mutateAsync({
        groupId: group.id,
        content: messageContent.trim(),
      });
      setMessageContent('');
    } catch (error: unknown) {
      const errorMessage = normalizeICError(error);
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[600px] max-w-2xl flex-col">
        <DialogHeader>
          <DialogTitle>{group.name} - Chat</DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 flex-col overflow-hidden">
          <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-destructive">
                  {normalizeICError(error)}
                </p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No messages yet. Start the conversation!
                </p>
              </div>
            ) : (
              <div className="space-y-4 pb-4">
                {messages.map((message) => {
                  const isOwnMessage = message.sender.toString() === currentPrincipal;
                  return (
                    <MessageItem
                      key={message.id.toString()}
                      message={message}
                      isOwnMessage={isOwnMessage}
                    />
                  );
                })}
              </div>
            )}
          </ScrollArea>

          <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
            <Input
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Type a message..."
              disabled={sendMessage.isPending}
            />
            <Button
              type="submit"
              size="icon"
              disabled={sendMessage.isPending || !messageContent.trim()}
            >
              {sendMessage.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface MessageItemProps {
  message: {
    id: bigint;
    sender: import('@dfinity/principal').Principal;
    content: string;
    timestamp: bigint;
  };
  isOwnMessage: boolean;
}

function MessageItem({ message, isOwnMessage }: MessageItemProps) {
  const { data: senderProfile } = useGetUserProfile(message.sender);
  const senderName = senderProfile?.name || 'Guest';
  const initials = getUserInitials(senderName);

  const timestamp = new Date(Number(message.timestamp) / 1000000);
  const timeString = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
      </Avatar>
      <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-[70%]`}>
        <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium">{senderName}</span>
          <span>{timeString}</span>
        </div>
        <Card className={`px-3 py-2 ${isOwnMessage ? 'bg-primary text-primary-foreground' : ''}`}>
          <p className="text-sm break-words">{message.content}</p>
        </Card>
      </div>
    </div>
  );
}
