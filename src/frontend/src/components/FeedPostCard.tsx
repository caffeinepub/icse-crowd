import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import { FileText, Heart, Loader2, MessageCircle, Send } from "lucide-react";
import { memo, useCallback, useState } from "react";
import type { Comment, Post } from "../backend";
import { useGetPostComments, useGetUserProfile } from "../hooks/useQueries";
import { normalizeICError } from "../utils/icErrors";
import {
  getDocumentURL,
  getImageURL,
  getVideoURL,
  hasValidDocument,
  hasValidImage,
  hasValidVideo,
} from "../utils/mediaGuards";
import { safePrincipalFromText } from "../utils/principal";
import { getUnknownUserLabel, getUserInitials } from "../utils/userDisplay";

interface FeedPostCardProps {
  post: Post;
  isLiked: boolean;
  currentUserPrincipal: string | undefined;
  onLike: (postId: bigint) => void;
  onComment: (postId: bigint, content: string) => void;
  isLiking: boolean;
  isCommenting: boolean;
}

interface AuthorDisplayProps {
  authorPrincipal: string;
}

// Separate component to handle author profile fetching per author
const AuthorDisplay = memo(function AuthorDisplay({
  authorPrincipal,
}: AuthorDisplayProps) {
  const principal = safePrincipalFromText(authorPrincipal);
  const { data: profile, isLoading } = useGetUserProfile(principal);

  if (isLoading) {
    return <span className="font-medium">Loading...</span>;
  }

  const displayName = profile?.name || getUnknownUserLabel();
  return <span className="font-medium">{displayName}</span>;
});

interface CommentAuthorDisplayProps {
  authorPrincipal: string;
}

const CommentAuthorDisplay = memo(function CommentAuthorDisplay({
  authorPrincipal,
}: CommentAuthorDisplayProps) {
  const principal = safePrincipalFromText(authorPrincipal);
  const { data: profile, isLoading } = useGetUserProfile(principal);

  if (isLoading) {
    return <span className="text-sm font-medium">Loading...</span>;
  }

  const displayName = profile?.name || getUnknownUserLabel();
  return <span className="text-sm font-medium">{displayName}</span>;
});

interface AuthorAvatarProps {
  authorPrincipal: string;
}

const AuthorAvatar = memo(function AuthorAvatar({
  authorPrincipal,
}: AuthorAvatarProps) {
  const principal = safePrincipalFromText(authorPrincipal);
  const { data: profile } = useGetUserProfile(principal);

  const initials = profile?.name ? getUserInitials(profile.name) : "G";

  return (
    <Avatar>
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
});

interface CommentAuthorAvatarProps {
  authorPrincipal: string;
}

const CommentAuthorAvatar = memo(function CommentAuthorAvatar({
  authorPrincipal,
}: CommentAuthorAvatarProps) {
  const principal = safePrincipalFromText(authorPrincipal);
  const { data: profile } = useGetUserProfile(principal);

  const initials = profile?.name ? getUserInitials(profile.name) : "G";

  return (
    <Avatar className="h-8 w-8">
      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
    </Avatar>
  );
});

const FeedPostCard = memo(function FeedPostCard({
  post,
  isLiked,
  onLike,
  onComment,
  isLiking,
  isCommenting,
}: FeedPostCardProps) {
  const [commentInput, setCommentInput] = useState("");
  const [showComments, setShowComments] = useState(false);

  const {
    data: comments = [],
    isLoading: commentsLoading,
    error: commentsError,
  } = useGetPostComments(post.id, { enabled: showComments });

  const imageUrl = hasValidImage(post) ? getImageURL(post) : null;
  const videoUrl = hasValidVideo(post) ? getVideoURL(post) : null;
  const documentUrl = hasValidDocument(post) ? getDocumentURL(post) : null;

  const handleLikeClick = useCallback(() => {
    onLike(post.id);
  }, [onLike, post.id]);

  const handleCommentClick = useCallback(() => {
    setShowComments((prev) => !prev);
  }, []);

  const handleCommentSubmit = useCallback(() => {
    if (commentInput.trim()) {
      onComment(post.id, commentInput);
      setCommentInput("");
    }
  }, [onComment, post.id, commentInput]);

  const handleCommentInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCommentInput(e.target.value);
    },
    [],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleCommentSubmit();
      }
    },
    [handleCommentSubmit],
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <AuthorAvatar authorPrincipal={post.author.toString()} />
          <div className="flex-1">
            <AuthorDisplay authorPrincipal={post.author.toString()} />
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(Number(post.timestamp) / 1000000), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {post.content && <p className="whitespace-pre-wrap">{post.content}</p>}

        {imageUrl && (
          <img
            src={imageUrl}
            alt="Post"
            className="max-h-96 w-full rounded-lg object-cover"
            loading="lazy"
            decoding="async"
          />
        )}

        {videoUrl && (
          <video
            src={videoUrl}
            controls
            className="max-h-96 w-full rounded-lg"
            preload="none"
          >
            <track kind="captions" />
            Your browser does not support the video tag.
          </video>
        )}

        {documentUrl && (
          <a
            href={documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent"
          >
            <FileText className="h-6 w-6 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-medium">Document Attachment</p>
              <p className="text-sm text-muted-foreground">
                Click to view or download
              </p>
            </div>
          </a>
        )}
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-4">
        <div className="flex gap-4">
          <Button
            variant={isLiked ? "default" : "ghost"}
            size="sm"
            onClick={handleLikeClick}
            disabled={isLiking}
          >
            <Heart
              className={`mr-2 h-4 w-4 ${isLiked ? "fill-current" : ""}`}
            />
            {post.likes.length}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleCommentClick}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Comment
          </Button>
        </div>

        {showComments && (
          <div className="space-y-3 border-t pt-4">
            <div className="flex gap-2">
              <Input
                placeholder="Write a comment..."
                value={commentInput}
                onChange={handleCommentInputChange}
                onKeyDown={handleKeyDown}
              />
              <Button
                size="icon"
                onClick={handleCommentSubmit}
                disabled={isCommenting}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {commentsLoading && (
              <div className="flex items-center justify-center py-4 text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading comments...
              </div>
            )}

            {commentsError && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                {normalizeICError(commentsError)}
              </div>
            )}

            {!commentsLoading && !commentsError && comments.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No comments yet. Be the first to comment!
              </p>
            )}

            {!commentsLoading && !commentsError && comments.length > 0 && (
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div
                    key={comment.id.toString()}
                    className="flex gap-3 rounded-lg bg-muted/50 p-3"
                  >
                    <CommentAuthorAvatar
                      authorPrincipal={comment.author.toString()}
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-baseline gap-2">
                        <CommentAuthorDisplay
                          authorPrincipal={comment.author.toString()}
                        />
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(
                            new Date(Number(comment.timestamp) / 1000000),
                            { addSuffix: true },
                          )}
                        </p>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
});

export default FeedPostCard;
