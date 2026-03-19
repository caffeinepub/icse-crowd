import { P as Principal, r as reactExports, f as useGetPostComments, j as jsxRuntimeExports, B as Button, H as Heart, L as LoaderCircle, g as useGetUserProfile, A as Avatar, h as AvatarFallback, i as useGetFeed, k as useLikePost, l as useAddComment, b as useInternetIdentity, a as ue } from "./index-DNXQSw_4.js";
import { C as Card, a as CardHeader, c as CardContent, e as CardFooter } from "./card-OOTnljHx.js";
import { I as Input } from "./input-Cb2tBxB6.js";
import { n as normalizeICError } from "./icErrors-CWzto3lk.js";
import { h as hasValidImage, g as getImageURL, a as hasValidVideo, b as getVideoURL, c as hasValidDocument, d as getDocumentURL, P as PostComposer } from "./PostComposer-BFGRTPe3.js";
import { g as getUserInitials, a as getUnknownUserLabel } from "./userDisplay-CqG9piT-.js";
import { f as formatDistanceToNow } from "./formatDistanceToNow-BnIgSvnz.js";
import { F as FileText } from "./file-text-TYf6-9fn.js";
import { M as MessageCircle, S as Send } from "./send-BdeaRk0K.js";
import "./textarea-DASlJyYV.js";
import "./x-p_ZduJxi.js";
function safePrincipalFromText(principalText) {
  if (!principalText || typeof principalText !== "string") {
    return null;
  }
  try {
    return Principal.fromText(principalText);
  } catch (error) {
    console.error("Failed to convert principal text:", principalText, error);
    return null;
  }
}
const AuthorDisplay = reactExports.memo(function AuthorDisplay2({
  authorPrincipal
}) {
  const principal = safePrincipalFromText(authorPrincipal);
  const { data: profile, isLoading } = useGetUserProfile(principal);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Loading..." });
  }
  const displayName = (profile == null ? void 0 : profile.name) || getUnknownUserLabel();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: displayName });
});
const CommentAuthorDisplay = reactExports.memo(function CommentAuthorDisplay2({
  authorPrincipal
}) {
  const principal = safePrincipalFromText(authorPrincipal);
  const { data: profile, isLoading } = useGetUserProfile(principal);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Loading..." });
  }
  const displayName = (profile == null ? void 0 : profile.name) || getUnknownUserLabel();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: displayName });
});
const AuthorAvatar = reactExports.memo(function AuthorAvatar2({
  authorPrincipal
}) {
  const principal = safePrincipalFromText(authorPrincipal);
  const { data: profile } = useGetUserProfile(principal);
  const initials = (profile == null ? void 0 : profile.name) ? getUserInitials(profile.name) : "G";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { children: initials }) });
});
const CommentAuthorAvatar = reactExports.memo(function CommentAuthorAvatar2({
  authorPrincipal
}) {
  const principal = safePrincipalFromText(authorPrincipal);
  const { data: profile } = useGetUserProfile(principal);
  const initials = (profile == null ? void 0 : profile.name) ? getUserInitials(profile.name) : "G";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-8 w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-xs", children: initials }) });
});
const FeedPostCard = reactExports.memo(function FeedPostCard2({
  post,
  isLiked,
  onLike,
  onComment,
  isLiking,
  isCommenting
}) {
  const [commentInput, setCommentInput] = reactExports.useState("");
  const [showComments, setShowComments] = reactExports.useState(false);
  const {
    data: comments = [],
    isLoading: commentsLoading,
    error: commentsError
  } = useGetPostComments(post.id, { enabled: showComments });
  const imageUrl = hasValidImage(post) ? getImageURL(post) : null;
  const videoUrl = hasValidVideo(post) ? getVideoURL(post) : null;
  const documentUrl = hasValidDocument(post) ? getDocumentURL(post) : null;
  const handleLikeClick = reactExports.useCallback(() => {
    onLike(post.id);
  }, [onLike, post.id]);
  const handleCommentClick = reactExports.useCallback(() => {
    setShowComments((prev) => !prev);
  }, []);
  const handleCommentSubmit = reactExports.useCallback(() => {
    if (commentInput.trim()) {
      onComment(post.id, commentInput);
      setCommentInput("");
    }
  }, [onComment, post.id, commentInput]);
  const handleCommentInputChange = reactExports.useCallback(
    (e) => {
      setCommentInput(e.target.value);
    },
    []
  );
  const handleKeyDown = reactExports.useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleCommentSubmit();
      }
    },
    [handleCommentSubmit]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AuthorAvatar, { authorPrincipal: post.author.toString() }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AuthorDisplay, { authorPrincipal: post.author.toString() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatDistanceToNow(new Date(Number(post.timestamp) / 1e6), {
          addSuffix: true
        }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
      post.content && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "whitespace-pre-wrap", children: post.content }),
      imageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: imageUrl,
          alt: "Post",
          className: "max-h-96 w-full rounded-lg object-cover",
          loading: "lazy",
          decoding: "async"
        }
      ),
      videoUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "video",
        {
          src: videoUrl,
          controls: true,
          className: "max-h-96 w-full rounded-lg",
          preload: "none",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("track", { kind: "captions" }),
            "Your browser does not support the video tag."
          ]
        }
      ),
      documentUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: documentUrl,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-6 w-6 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "Document Attachment" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Click to view or download" })
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardFooter, { className: "flex-col items-stretch gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: isLiked ? "default" : "ghost",
            size: "sm",
            onClick: handleLikeClick,
            disabled: isLiking,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Heart,
                {
                  className: `mr-2 h-4 w-4 ${isLiked ? "fill-current" : ""}`
                }
              ),
              post.likes.length
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: handleCommentClick, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "mr-2 h-4 w-4" }),
          "Comment"
        ] })
      ] }),
      showComments && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 border-t pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Write a comment...",
              value: commentInput,
              onChange: handleCommentInputChange,
              onKeyDown: handleKeyDown
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "icon",
              onClick: handleCommentSubmit,
              disabled: isCommenting,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" })
            }
          )
        ] }),
        commentsLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center py-4 text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
          "Loading comments..."
        ] }),
        commentsError && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive", children: normalizeICError(commentsError) }),
        !commentsLoading && !commentsError && comments.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-4 text-center text-sm text-muted-foreground", children: "No comments yet. Be the first to comment!" }),
        !commentsLoading && !commentsError && comments.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: comments.map((comment) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex gap-3 rounded-lg bg-muted/50 p-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                CommentAuthorAvatar,
                {
                  authorPrincipal: comment.author.toString()
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CommentAuthorDisplay,
                    {
                      authorPrincipal: comment.author.toString()
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatDistanceToNow(
                    new Date(Number(comment.timestamp) / 1e6),
                    { addSuffix: true }
                  ) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: comment.content })
              ] })
            ]
          },
          comment.id.toString()
        )) })
      ] })
    ] })
  ] });
});
function FeedPage() {
  const { data: posts, isLoading } = useGetFeed();
  const likePost = useLikePost();
  const addComment = useAddComment();
  const { identity } = useInternetIdentity();
  const currentUserPrincipal = identity == null ? void 0 : identity.getPrincipal().toString();
  const sortedPosts = reactExports.useMemo(() => {
    if (!posts) return [];
    return [...posts].sort((a, b) => Number(b.timestamp - a.timestamp));
  }, [posts]);
  const handleLike = reactExports.useCallback(
    async (postId) => {
      try {
        await likePost.mutateAsync(postId);
      } catch (error) {
        const errorMessage = normalizeICError(error);
        ue.error(errorMessage);
      }
    },
    [likePost]
  );
  const handleComment = reactExports.useCallback(
    async (postId, content) => {
      if (!(content == null ? void 0 : content.trim())) {
        ue.error("Please enter a comment");
        return;
      }
      try {
        await addComment.mutateAsync({ postId, content });
        ue.success("Comment added!");
      } catch (error) {
        const errorMessage = normalizeICError(error);
        ue.error(errorMessage);
      }
    },
    [addComment]
  );
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PostComposer, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: sortedPosts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "py-12 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No posts yet. Be the first to share something!" }) }) }) : sortedPosts.map((post) => {
      const isLiked = post.likes.some(
        (p) => p.toString() === currentUserPrincipal
      );
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        FeedPostCard,
        {
          post,
          isLiked,
          currentUserPrincipal,
          onLike: handleLike,
          onComment: handleComment,
          isLiking: likePost.isPending,
          isCommenting: addComment.isPending
        },
        post.id.toString()
      );
    }) })
  ] }) });
}
export {
  FeedPage as default
};
