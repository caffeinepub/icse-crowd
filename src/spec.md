# Specification

## Summary
**Goal:** Allow authenticated users to view the feed, create posts, and add comments even if they have not created a user profile, and show missing-profile authors as “Guest”.

**Planned changes:**
- Backend: remove the profile-existence requirement when calling `createPost(...)` and `addComment(postId, content)` while keeping existing authorization checks intact.
- Backend: allow `getFeed()` to succeed for authenticated users who do not have a profile.
- Frontend: remove post composer UI gating/disable logic tied to `useGetCallerUserProfile()` returning null; allow submit and show existing success/error toasts from the backend call.
- Frontend: remove comment input/submit gating when no profile exists; keep existing mutation + query invalidation behavior.
- Frontend: when author profile lookup returns null for posts/comments, display author name as “Guest” and ensure avatar fallbacks don’t error.

**User-visible outcome:** Signed-in users without profiles can browse the feed, post, and comment normally, and their (and others’) posts/comments display the author as “Guest” when no profile is available.
