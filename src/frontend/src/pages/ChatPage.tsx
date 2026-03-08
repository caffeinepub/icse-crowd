import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Principal } from "@dfinity/principal";
import { MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useGetAllUsers, useSendMessage } from "../hooks/useQueries";

export default function ChatPage() {
  const sendMessage = useSendMessage();
  const { data: allUsers } = useGetAllUsers();
  const [selectedUser, setSelectedUser] = useState<Principal | null>(null);
  const [messageContent, setMessageContent] = useState("");

  const handleSendMessage = async () => {
    if (!selectedUser || !messageContent.trim()) {
      toast.error("Please select a user and enter a message");
      return;
    }

    try {
      await sendMessage.mutateAsync({
        to: selectedUser,
        content: messageContent,
      });
      setMessageContent("");
      toast.success("Message sent!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">
          Chat with your friends and classmates
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {allUsers && allUsers.length > 0 ? (
                  allUsers.map((user) => (
                    <button
                      type="button"
                      key={user.principal.toString()}
                      onClick={() => setSelectedUser(user.principal)}
                      className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent ${
                        selectedUser?.toString() === user.principal.toString()
                          ? "bg-accent"
                          : ""
                      }`}
                    >
                      <Avatar>
                        <AvatarFallback>
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate font-medium">{user.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No contacts yet
                  </p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedUser
                ? `Chat with ${allUsers?.find((u) => u.principal.toString() === selectedUser.toString())?.name}`
                : "Select a contact"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedUser ? (
              <div className="space-y-4">
                <ScrollArea className="h-[400px] rounded-lg border p-4">
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <MessageCircle className="mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Start a conversation by sending a message
                    </p>
                  </div>
                </ScrollArea>

                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={sendMessage.isPending}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex h-[500px] items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Select a contact to start chatting
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
