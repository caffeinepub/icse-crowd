# Specification

## Summary
**Goal:** Show real profile usernames for post/comment authors in the feed and require users to have a profile before they can post or comment.

**Planned changes:**
- Update the feed post and comment UI to display the author’s profile `name` (username) instead of truncated principal strings, with an English fallback label when a profile can’t be resolved.
- Add a reusable React Query hook to fetch and cache `getUserProfile(principal)` by principal-based query key, and use it in the feed without causing re-render loops.
- Enforce on the backend that `createPost` and `addComment` only work for callers who already have a profile, returning clear English trap messages otherwise.
- Align frontend behavior with backend enforcement by blocking/disable post/comment submission when the authenticated user has no profile, and show readable English messages/toasts for “profile required” errors.

**User-visible outcome:** The feed shows usernames for who posted and commented, and users who haven’t created a profile are prevented from posting or commenting and are instructed (in English) to create a profile first.
