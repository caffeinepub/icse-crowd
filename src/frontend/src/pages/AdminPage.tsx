import {
  AlertTriangle,
  Ban,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  Flag,
  Loader2,
  MessageSquare,
  Plus,
  RefreshCw,
  Scan,
  Settings,
  Shield,
  Trash2,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { Principal } from "@dfinity/principal";
import { Variant_resolved_pending_reviewed } from "../backend";
import type { UserProfile } from "../backend";

import {
  useAddBannedWord,
  useAdminDeleteComment,
  useAdminDeletePost,
  useAdminDeleteStudyGroup,
  useGetAllComments,
  useGetAllPosts,
  useGetAllStudyGroups,
  useGetAllUsers,
  useGetPlatformStats,
  useGetReports,
  useGetSuspendedUsers,
  useListBannedWords,
  useRemoveBannedWord,
  useReviewReport,
  useScanAndDeleteBannedGroups,
  useSuspendUser,
  useUnsuspendUser,
} from "../hooks/useQueries";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function shortPrincipal(p: Principal): string {
  const s = p.toString();
  return `${s.slice(0, 8)}…${s.slice(-4)}`;
}

function formatTimestamp(ts: bigint): string {
  try {
    return new Date(Number(ts) / 1_000_000).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function errMsg(e: unknown, fallback: string): string {
  return (e instanceof Error ? e.message : null) || fallback;
}

// ─── Confirmation Dialog ──────────────────────────────────────────────────────

interface ConfirmDialogProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => Promise<void> | void;
  destructive?: boolean;
  dialogOcid?: string;
  confirmOcid?: string;
  cancelOcid?: string;
}

function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Confirm",
  onConfirm,
  destructive = true,
  dialogOcid,
  confirmOcid,
  cancelOcid,
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent data-ocid={dialogOcid}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
            data-ocid={cancelOcid}
          >
            Cancel
          </Button>
          <Button
            variant={destructive ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={loading}
            data-ocid={confirmOcid}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Stats Tab ────────────────────────────────────────────────────────────────

function StatsTab() {
  const { data: stats, isLoading, isError, refetch } = useGetPlatformStats();

  const statCards = [
    {
      label: "Total Users",
      value: stats?.[0],
      icon: Users,
      color: "text-blue-500",
    },
    {
      label: "Total Posts",
      value: stats?.[1],
      icon: FileText,
      color: "text-emerald-500",
    },
    {
      label: "Total Comments",
      value: stats?.[2],
      icon: MessageSquare,
      color: "text-violet-500",
    },
    {
      label: "Study Groups",
      value: stats?.[3],
      icon: BookOpen,
      color: "text-amber-500",
    },
    {
      label: "Total Reports",
      value: stats?.[4],
      icon: Flag,
      color: "text-rose-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Platform Overview</h2>
          <p className="text-sm text-muted-foreground">
            Live statistics across all platform activity
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {isError && (
        <div
          className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          data-ocid="admin.stats.error_state"
        >
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Failed to load platform stats.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className={`h-5 w-5 ${color}`} />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton
                  className="h-8 w-16"
                  data-ocid="admin.stats.loading_state"
                />
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-3xl font-bold tracking-tight"
                >
                  {value !== undefined ? Number(value).toLocaleString() : "—"}
                </motion.div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Banned Words Tab ─────────────────────────────────────────────────────────

function BannedWordsTab() {
  const [newWord, setNewWord] = useState("");
  const { data: words, isLoading } = useListBannedWords();
  const addWord = useAddBannedWord();
  const removeWord = useRemoveBannedWord();
  const scanAndDelete = useScanAndDeleteBannedGroups();

  const handleAdd = async () => {
    const w = newWord.trim().toLowerCase();
    if (!w) return;
    try {
      await addWord.mutateAsync(w);
      setNewWord("");
      toast.success(`"${w}" added to banned words list`);
    } catch (e: unknown) {
      toast.error(errMsg(e, "Failed to add banned word"));
    }
  };

  const handleRemove = async (word: string) => {
    try {
      await removeWord.mutateAsync(word);
      toast.success(`"${word}" removed from banned words list`);
    } catch (e: unknown) {
      toast.error(errMsg(e, "Failed to remove banned word"));
    }
  };

  const handleScanDelete = async () => {
    try {
      await scanAndDelete.mutateAsync();
      toast.success("Scan complete — offending groups deleted");
    } catch (e: unknown) {
      toast.error(errMsg(e, "Scan failed"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Banned Words</h2>
          <p className="text-sm text-muted-foreground">
            Words that automatically block study group creation
          </p>
        </div>
        <ConfirmDialog
          trigger={
            <Button
              variant="destructive"
              className="gap-2"
              data-ocid="admin.scan_delete.button"
            >
              <Scan className="h-4 w-4" />
              Scan &amp; Delete Offending Groups
            </Button>
          }
          title="Scan & Delete Offending Groups"
          description="This will permanently delete all existing study groups that contain banned words in their description. This action cannot be undone."
          confirmLabel="Yes, delete them"
          onConfirm={handleScanDelete}
          dialogOcid="admin.scan_delete.dialog"
          confirmOcid="admin.scan_delete.confirm_button"
          cancelOcid="admin.scan_delete.cancel_button"
        />
      </div>

      {/* Add word */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Add Banned Word</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter word to ban…"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              data-ocid="admin.add_banned_word.input"
              className="max-w-xs"
            />
            <Button
              onClick={handleAdd}
              disabled={!newWord.trim() || addWord.isPending}
              data-ocid="admin.add_banned_word.submit_button"
            >
              {addWord.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Word list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Current Banned Words
            <Badge variant="secondary" className="ml-2">
              {words?.length ?? 0}
            </Badge>
          </CardTitle>
          <CardDescription>
            Click the trash icon to remove a word from the list
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div
              className="space-y-2"
              data-ocid="admin.banned_words.loading_state"
            >
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))}
            </div>
          ) : !words?.length ? (
            <div
              className="py-8 text-center text-sm text-muted-foreground"
              data-ocid="admin.banned_words.empty_state"
            >
              No banned words added yet.
            </div>
          ) : (
            <ScrollArea className="max-h-96">
              <div className="space-y-1">
                {words.map((word, idx) => (
                  <div
                    key={word}
                    className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-muted/50"
                  >
                    <span className="font-mono text-sm">{word}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleRemove(word)}
                      disabled={removeWord.isPending}
                      data-ocid={`admin.banned_word.delete_button.${idx + 1}`}
                      aria-label={`Remove "${word}"`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Content Tab ──────────────────────────────────────────────────────────────

function ContentTab() {
  const { data: posts, isLoading: postsLoading } = useGetAllPosts();
  const { data: comments, isLoading: commentsLoading } = useGetAllComments();
  const { data: groups, isLoading: groupsLoading } = useGetAllStudyGroups();
  const deletePost = useAdminDeletePost();
  const deleteComment = useAdminDeleteComment();
  const deleteGroup = useAdminDeleteStudyGroup();

  const handleDeletePost = async (postId: bigint) => {
    try {
      await deletePost.mutateAsync(postId);
      toast.success("Post deleted successfully");
    } catch (e: unknown) {
      toast.error(errMsg(e, "Failed to delete post"));
    }
  };

  const handleDeleteComment = async (commentId: bigint) => {
    try {
      await deleteComment.mutateAsync(commentId);
      toast.success("Comment deleted successfully");
    } catch (e: unknown) {
      toast.error(errMsg(e, "Failed to delete comment"));
    }
  };

  const handleDeleteGroup = async (groupId: bigint) => {
    try {
      await deleteGroup.mutateAsync(groupId);
      toast.success("Study group deleted successfully");
    } catch (e: unknown) {
      toast.error(errMsg(e, "Failed to delete group"));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Content Management</h2>
        <p className="text-sm text-muted-foreground">
          Review and remove posts, comments, and study groups
        </p>
      </div>

      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">
            Posts
            <Badge variant="secondary" className="ml-2">
              {posts?.length ?? 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="comments">
            Comments
            <Badge variant="secondary" className="ml-2">
              {comments?.length ?? 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="study-groups">
            Study Groups
            <Badge variant="secondary" className="ml-2">
              {groups?.length ?? 0}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* Posts */}
        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">All Posts</CardTitle>
            </CardHeader>
            <CardContent>
              {postsLoading ? (
                <div
                  className="space-y-3"
                  data-ocid="admin.posts.loading_state"
                >
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : !posts?.length ? (
                <div
                  className="py-8 text-center text-sm text-muted-foreground"
                  data-ocid="admin.posts.empty_state"
                >
                  No posts found.
                </div>
              ) : (
                <ScrollArea className="max-h-[500px]">
                  <div className="space-y-2">
                    {posts.map((post, idx) => (
                      <div
                        key={post.id.toString()}
                        className="flex items-start justify-between gap-3 rounded-md border p-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm">
                            {post.content || "(No text content)"}
                          </p>
                          <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
                            <span>{shortPrincipal(post.author)}</span>
                            <span>{formatTimestamp(post.timestamp)}</span>
                            <span>{post.likes.length} likes</span>
                          </div>
                        </div>
                        <ConfirmDialog
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0 text-destructive hover:bg-destructive/10"
                              data-ocid={`admin.post.delete_button.${idx + 1}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          }
                          title="Delete Post"
                          description="This will permanently delete this post and all its comments. This action cannot be undone."
                          confirmLabel="Delete Post"
                          onConfirm={() => handleDeletePost(post.id)}
                          confirmOcid="admin.post.confirm_button"
                          cancelOcid="admin.post.cancel_button"
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comments */}
        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                All Comments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {commentsLoading ? (
                <div
                  className="space-y-3"
                  data-ocid="admin.comments.loading_state"
                >
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : !comments?.length ? (
                <div
                  className="py-8 text-center text-sm text-muted-foreground"
                  data-ocid="admin.comments.empty_state"
                >
                  No comments found.
                </div>
              ) : (
                <ScrollArea className="max-h-[500px]">
                  <div className="space-y-2">
                    {comments.map((comment, idx) => (
                      <div
                        key={comment.id.toString()}
                        className="flex items-start justify-between gap-3 rounded-md border p-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm">{comment.content}</p>
                          <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
                            <span>{shortPrincipal(comment.author)}</span>
                            <span>{formatTimestamp(comment.timestamp)}</span>
                            <span>Post #{comment.postId.toString()}</span>
                          </div>
                        </div>
                        <ConfirmDialog
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0 text-destructive hover:bg-destructive/10"
                              data-ocid={`admin.comment.delete_button.${idx + 1}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          }
                          title="Delete Comment"
                          description="This will permanently delete this comment. This action cannot be undone."
                          confirmLabel="Delete Comment"
                          onConfirm={() => handleDeleteComment(comment.id)}
                          confirmOcid="admin.comment.confirm_button"
                          cancelOcid="admin.comment.cancel_button"
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Study Groups */}
        <TabsContent value="study-groups">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                All Study Groups
              </CardTitle>
            </CardHeader>
            <CardContent>
              {groupsLoading ? (
                <div
                  className="space-y-3"
                  data-ocid="admin.groups.loading_state"
                >
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : !groups?.length ? (
                <div
                  className="py-8 text-center text-sm text-muted-foreground"
                  data-ocid="admin.groups.empty_state"
                >
                  No study groups found.
                </div>
              ) : (
                <ScrollArea className="max-h-[500px]">
                  <div className="space-y-2">
                    {groups.map((group, idx) => (
                      <div
                        key={group.id.toString()}
                        className="flex items-start justify-between gap-3 rounded-md border p-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-sm">
                            {group.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {group.description}
                          </p>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {group.members.length} member
                            {group.members.length !== 1 ? "s" : ""}
                          </div>
                        </div>
                        <ConfirmDialog
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0 text-destructive hover:bg-destructive/10"
                              data-ocid={`admin.group.delete_button.${idx + 1}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          }
                          title="Delete Study Group"
                          description={`This will permanently delete "${group.name}" and all its messages. This action cannot be undone.`}
                          confirmLabel="Delete Group"
                          onConfirm={() => handleDeleteGroup(group.id)}
                          confirmOcid="admin.group.confirm_button"
                          cancelOcid="admin.group.cancel_button"
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── Users Tab ────────────────────────────────────────────────────────────────

function UsersTab() {
  const { data: users, isLoading: usersLoading } = useGetAllUsers();
  const { data: suspendedUsers, isLoading: suspendedLoading } =
    useGetSuspendedUsers();
  const suspend = useSuspendUser();
  const unsuspend = useUnsuspendUser();

  const suspendedSet = new Set((suspendedUsers ?? []).map((p) => p.toString()));

  const handleSuspend = async (user: UserProfile) => {
    try {
      await suspend.mutateAsync(user.principal as unknown as Principal);
      toast.success("User suspended");
    } catch (e: unknown) {
      toast.error(errMsg(e, "Failed to suspend user"));
    }
  };

  const handleUnsuspend = async (user: UserProfile) => {
    try {
      await unsuspend.mutateAsync(user.principal as unknown as Principal);
      toast.success("User unsuspended");
    } catch (e: unknown) {
      toast.error(errMsg(e, "Failed to unsuspend user"));
    }
  };

  const isLoading = usersLoading || suspendedLoading;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">User Management</h2>
        <p className="text-sm text-muted-foreground">
          View all users, suspend or unsuspend accounts
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            All Users
            <Badge variant="secondary" className="ml-2">
              {users?.length ?? 0}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3" data-ocid="admin.users.loading_state">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !users?.length ? (
            <div
              className="py-8 text-center text-sm text-muted-foreground"
              data-ocid="admin.users.empty_state"
            >
              No users found.
            </div>
          ) : (
            <ScrollArea className="max-h-[600px]">
              <div className="space-y-2">
                {users.map((user, idx) => {
                  const isSuspended = suspendedSet.has(
                    user.principal.toString(),
                  );
                  return (
                    <div
                      key={user.principal.toString()}
                      className="flex items-center justify-between gap-3 rounded-md border p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-medium text-sm">
                            {user.name || "(No name)"}
                          </span>
                          {isSuspended && (
                            <Badge
                              variant="destructive"
                              className="shrink-0 text-xs"
                            >
                              Suspended
                            </Badge>
                          )}
                          <Badge
                            variant="outline"
                            className="shrink-0 text-xs capitalize"
                          >
                            {user.role}
                          </Badge>
                        </div>
                        <div className="mt-0.5 flex gap-3 text-xs text-muted-foreground">
                          <span className="truncate">{user.email || "—"}</span>
                          <span className="shrink-0 font-mono">
                            {shortPrincipal(user.principal)}
                          </span>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        {isSuspended ? (
                          <ConfirmDialog
                            trigger={
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5"
                                data-ocid={`admin.user.unsuspend_button.${idx + 1}`}
                              >
                                <UserCheck className="h-4 w-4" />
                                Unsuspend
                              </Button>
                            }
                            title="Unsuspend User"
                            description={`Restore access for "${user.name || user.principal.toString()}"?`}
                            confirmLabel="Unsuspend"
                            destructive={false}
                            onConfirm={() => handleUnsuspend(user)}
                            confirmOcid="admin.user.unsuspend.confirm_button"
                            cancelOcid="admin.user.unsuspend.cancel_button"
                          />
                        ) : (
                          <ConfirmDialog
                            trigger={
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 text-destructive hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
                                data-ocid={`admin.user.suspend_button.${idx + 1}`}
                              >
                                <UserX className="h-4 w-4" />
                                Suspend
                              </Button>
                            }
                            title="Suspend User"
                            description={`Suspend "${user.name || user.principal.toString()}"? They will no longer be able to access the platform.`}
                            confirmLabel="Suspend User"
                            onConfirm={() => handleSuspend(user)}
                            confirmOcid="admin.user.suspend.confirm_button"
                            cancelOcid="admin.user.suspend.cancel_button"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Reports Tab ──────────────────────────────────────────────────────────────

function ReportsTab() {
  const { data: reports, isLoading } = useGetReports();
  const reviewReport = useReviewReport();

  const handleReview = async (
    reportId: bigint,
    status: Variant_resolved_pending_reviewed,
  ) => {
    try {
      await reviewReport.mutateAsync({ reportId, newStatus: status });
      toast.success(`Report marked as ${status}`);
    } catch (e: unknown) {
      toast.error(errMsg(e, "Failed to update report"));
    }
  };

  type StatusKey = Variant_resolved_pending_reviewed;
  type StatusConfig = {
    label: string;
    className: string;
    Icon: React.ComponentType<{ className?: string }>;
  };

  const statusConfig: Record<StatusKey, StatusConfig> = {
    [Variant_resolved_pending_reviewed.pending]: {
      label: "Pending",
      className:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
      Icon: Clock,
    },
    [Variant_resolved_pending_reviewed.reviewed]: {
      label: "Reviewed",
      className:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      Icon: AlertTriangle,
    },
    [Variant_resolved_pending_reviewed.resolved]: {
      label: "Resolved",
      className:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
      Icon: CheckCircle2,
    },
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Reports</h2>
        <p className="text-sm text-muted-foreground">
          Review and action content and user reports
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            All Reports
            <Badge variant="secondary" className="ml-2">
              {reports?.length ?? 0}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3" data-ocid="admin.reports.loading_state">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : !reports?.length ? (
            <div
              className="py-8 text-center text-sm text-muted-foreground"
              data-ocid="admin.reports.empty_state"
            >
              No reports found.
            </div>
          ) : (
            <ScrollArea className="max-h-[600px]">
              <div className="space-y-3">
                {reports.map((report, idx) => {
                  const cfg = statusConfig[report.status];
                  const { Icon } = cfg;
                  return (
                    <div
                      key={report.id.toString()}
                      className="rounded-lg border p-4"
                      data-ocid={`admin.report.item.${idx + 1}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.className}`}
                            >
                              <Icon className="h-3 w-3" />
                              {cfg.label}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(report.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm font-medium">{report.reason}</p>
                          <div className="space-y-0.5 text-xs text-muted-foreground">
                            <div>
                              Reporter:{" "}
                              <span className="font-mono">
                                {shortPrincipal(report.reporter)}
                              </span>
                            </div>
                            {report.reportedUser && (
                              <div>
                                Reported User:{" "}
                                <span className="font-mono">
                                  {shortPrincipal(report.reportedUser)}
                                </span>
                              </div>
                            )}
                            {report.reportedContent && (
                              <div className="truncate">
                                Content:{" "}
                                <span className="italic">
                                  &ldquo;{report.reportedContent}&rdquo;
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-col gap-2">
                          {report.status !==
                            Variant_resolved_pending_reviewed.reviewed && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1.5 text-xs"
                              onClick={() =>
                                handleReview(
                                  report.id,
                                  Variant_resolved_pending_reviewed.reviewed,
                                )
                              }
                              disabled={reviewReport.isPending}
                            >
                              <AlertTriangle className="h-3.5 w-3.5" />
                              Review
                            </Button>
                          )}
                          {report.status !==
                            Variant_resolved_pending_reviewed.resolved && (
                            <Button
                              size="sm"
                              className="gap-1.5 text-xs"
                              onClick={() =>
                                handleReview(
                                  report.id,
                                  Variant_resolved_pending_reviewed.resolved,
                                )
                              }
                              disabled={reviewReport.isPending}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── AdminPage ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  return (
    <div className="container py-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
            <Settings className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">
              Platform management &amp; moderation — ICSE Crowd
            </p>
          </div>
        </div>
        <Separator className="mt-6" />
      </motion.div>

      {/* Main tabs */}
      <Tabs defaultValue="stats" className="space-y-6">
        <TabsList className="h-auto flex-wrap gap-1 p-1">
          <TabsTrigger
            value="stats"
            className="gap-2"
            data-ocid="admin.stats_tab"
          >
            <BarChart3 className="h-4 w-4" />
            Stats
          </TabsTrigger>
          <TabsTrigger
            value="banned-words"
            className="gap-2"
            data-ocid="admin.banned_words_tab"
          >
            <Ban className="h-4 w-4" />
            Banned Words
          </TabsTrigger>
          <TabsTrigger
            value="content"
            className="gap-2"
            data-ocid="admin.content_tab"
          >
            <FileText className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="gap-2"
            data-ocid="admin.users_tab"
          >
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="gap-2"
            data-ocid="admin.reports_tab"
          >
            <Flag className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <motion.div
          key="tab-content"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <TabsContent value="stats">
            <StatsTab />
          </TabsContent>
          <TabsContent value="banned-words">
            <BannedWordsTab />
          </TabsContent>
          <TabsContent value="content">
            <ContentTab />
          </TabsContent>
          <TabsContent value="users">
            <UsersTab />
          </TabsContent>
          <TabsContent value="reports">
            <ReportsTab />
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
}
