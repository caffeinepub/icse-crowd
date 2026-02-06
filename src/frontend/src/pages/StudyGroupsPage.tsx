import { useState } from 'react';
import { useCreateStudyGroup } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useActor } from '../hooks/useActor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Users, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { normalizeICError } from '../utils/icErrors';

export default function StudyGroupsPage() {
  const { identity } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const createStudyGroup = useCreateStudyGroup();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');

  const isAuthenticated = !!identity;
  const isActorReady = !!actor && !actorFetching;

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check authentication first
    if (!isAuthenticated) {
      toast.error('Please log in to create a study group');
      return;
    }

    // Check actor readiness
    if (!isActorReady) {
      toast.error('System is initializing, please wait a moment');
      return;
    }

    if (!groupName.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    try {
      await createStudyGroup.mutateAsync({ name: groupName, description: groupDescription });
      toast.success('Study group created successfully!');
      setGroupName('');
      setGroupDescription('');
      setIsDialogOpen(false);
    } catch (error: unknown) {
      const errorMessage = normalizeICError(error);
      
      // Check for authorization-specific errors
      if (errorMessage.toLowerCase().includes('unauthorized')) {
        toast.error('You are not authorized to create study groups. Please ensure you are logged in with a valid account.');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  // Disable the submit button if actor is not ready or user is not authenticated
  const isSubmitDisabled = createStudyGroup.isPending || !isActorReady || !isAuthenticated;

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Study Groups</h1>
          <p className="text-muted-foreground">Collaborate with classmates and share knowledge</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={!isAuthenticated}>
              <Plus className="mr-2 h-4 w-4" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Study Group</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="groupName">Group Name</Label>
                <Input
                  id="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g., Mathematics Grade 10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="groupDescription">Description</Label>
                <Textarea
                  id="groupDescription"
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  placeholder="What is this group about?"
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitDisabled}>
                {!isAuthenticated
                  ? 'Login Required'
                  : !isActorReady
                  ? 'Initializing...'
                  : createStudyGroup.isPending
                  ? 'Creating...'
                  : 'Create Group'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold">No Groups Yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Create your first study group to start collaborating
            </p>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(true)}
              disabled={!isAuthenticated}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Group
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Example: Physics Study Group</CardTitle>
            <CardDescription>Collaborative learning for Physics topics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>5 members</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
