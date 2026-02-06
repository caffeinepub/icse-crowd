import { useMemo, useCallback } from 'react';
import { useGetFeed, useLikePost, useAddComment } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import PostComposer from '../components/PostComposer';
import FeedPostCard from '../components/FeedPostCard';
import { normalizeICError } from '../utils/icErrors';

export default function FeedPage() {
  const { data: posts, isLoading } = useGetFeed();
  const likePost = useLikePost();
  const addComment = useAddComment();
  const { identity } = useInternetIdentity();

  const currentUserPrincipal = identity?.getPrincipal().toString();

  // Memoize sorted posts to avoid recomputing on every render
  const sortedPosts = useMemo(() => {
    if (!posts) return [];
    return [...posts].sort((a, b) => Number(b.timestamp - a.timestamp));
  }, [posts]);

  // Stable callback for liking posts
  const handleLike = useCallback(async (postId: bigint) => {
    try {
      await likePost.mutateAsync(postId);
    } catch (error: any) {
      const errorMessage = normalizeICError(error);
      toast.error(errorMessage);
    }
  }, [likePost]);

  // Stable callback for adding comments
  const handleComment = useCallback(async (postId: bigint, content: string) => {
    if (!content?.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      await addComment.mutateAsync({ postId, content });
      toast.success('Comment added!');
    } catch (error: any) {
      const errorMessage = normalizeICError(error);
      toast.error(errorMessage);
    }
  }, [addComment]);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <PostComposer />

        <div className="space-y-4">
          {sortedPosts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
              </CardContent>
            </Card>
          ) : (
            sortedPosts.map((post) => {
              const isLiked = post.likes.some((p) => p.toString() === currentUserPrincipal);

              return (
                <FeedPostCard
                  key={post.id.toString()}
                  post={post}
                  isLiked={isLiked}
                  currentUserPrincipal={currentUserPrincipal}
                  onLike={handleLike}
                  onComment={handleComment}
                  isLiking={likePost.isPending}
                  isCommenting={addComment.isPending}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
