import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateForumPost } from "../hooks/useQueries";

export default function ForumPage() {
  const createForumPost = useCreateForumPost();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await createForumPost.mutateAsync({ subject, content });
      toast.success("Forum post created successfully!");
      setSubject("");
      setContent("");
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to create forum post");
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Q&A Forum</h1>
          <p className="text-muted-foreground">
            Ask questions and share knowledge with the community
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ask Question
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Forum Post</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What's your question about?"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Question Details</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Provide more details about your question..."
                  rows={5}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={createForumPost.isPending}
              >
                {createForumPost.isPending ? "Posting..." : "Post Question"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold">No Questions Yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Be the first to ask a question and start a discussion
            </p>
            <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Ask Question
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Example: How to solve quadratic equations?</CardTitle>
            <CardDescription>Posted 2 hours ago by Student123</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              I'm having trouble understanding the quadratic formula. Can
              someone explain the steps?
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
