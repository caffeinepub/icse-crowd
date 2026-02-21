import { useState } from 'react';
import { useCreateStudyGroup, useGetAllStudyGroups, useJoinStudyGroup } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Users, BookOpen, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { normalizeICError } from '../utils/icErrors';
import StudyGroupChatDialog from '../components/StudyGroupChatDialog';
import type { StudyGroup } from '../backend';

export default function StudyGroupsPage() {
  const { identity } = useInternetIdentity();
  const createStudyGroup = useCreateStudyGroup();
  const joinStudyGroup = useJoinStudyGroup();
  const { data: studyGroups = [], isLoading: groupsLoading } = useGetAllStudyGroups();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const isAuthenticated = !!identity;
  const currentPrincipal = identity?.getPrincipal().toString();

  const handleOpenDialog = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to create a study group');
      return;
    }
    setIsDialogOpen(true);
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please log in to create a study group');
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
      
      // Check if this is a content moderation error
      if (errorMessage.toLowerCase().includes('illegal') || 
          errorMessage.toLowerCase().includes('inappropriate') ||
          errorMessage.toLowerCase().includes('banned')) {
        toast.error('Description contains inappropriate content. Please revise and try again.');
      } else {
        toast.error(errorMessage);
      }
      
      // Keep dialog open so user can edit and retry
      // Do not close the dialog or reset form fields
    }
  };

  const handleJoinGroup = async (groupId: bigint) => {
    if (!isAuthenticated) {
      toast.error('Please log in to join a study group');
      return;
    }

    try {
      await joinStudyGroup.mutateAsync(groupId);
      toast.success('Successfully joined the study group!');
    } catch (error: unknown) {
      const errorMessage = normalizeICError(error);
      toast.error(errorMessage);
    }
  };

  const handleOpenChat = (group: StudyGroup) => {
    setSelectedGroup(group);
    setIsChatOpen(true);
  };

  const isMember = (group: StudyGroup): boolean => {
    if (!currentPrincipal) return false;
    return group.members.some(member => member.toString() === currentPrincipal);
  };

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Study Groups</h1>
          <p className="text-muted-foreground">Collaborate with classmates and share knowledge</p>
        </div>
        <Button onClick={handleOpenDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Create Group
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
            <Button type="submit" className="w-full" disabled={createStudyGroup.isPending}>
              {createStudyGroup.isPending ? 'Creating...' : 'Create Group'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {selectedGroup && (
        <StudyGroupChatDialog
          group={selectedGroup}
          open={isChatOpen}
          onOpenChange={setIsChatOpen}
        />
      )}

      {groupsLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading study groups...</p>
        </div>
      ) : studyGroups.length === 0 ? (
        <div className="grid gap-6">
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">No Groups Yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Create your first study group to start collaborating
              </p>
              <Button variant="outline" onClick={handleOpenDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Create Group
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {studyGroups.map((group) => {
            const memberStatus = isMember(group);
            return (
              <Card key={group.id.toString()}>
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{group.name}</CardTitle>
                  <CardDescription>{group.description || 'No description provided'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{group.members.length} {group.members.length === 1 ? 'member' : 'members'}</span>
                  </div>
                  {isAuthenticated && (
                    <div className="flex gap-2">
                      {memberStatus ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            disabled
                          >
                            Joined
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleOpenChat(group)}
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full"
                          onClick={() => handleJoinGroup(group.id)}
                          disabled={joinStudyGroup.isPending}
                        >
                          {joinStudyGroup.isPending ? 'Joining...' : 'Join Group'}
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
