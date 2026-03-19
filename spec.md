# ICSE Crowd

## Current State
Backend has `deleteGroupsWithWord` (admin-only) and `scanAndDeleteBannedGroups` (admin-only) for removing groups. No automatic purge of existing groups on deploy.

## Requested Changes (Diff)

### Add
- A `system func postupgrade()` in the backend that automatically scans all existing study groups on canister upgrade and deletes any that contain "epistein" (case-insensitive, partial match) in their name.

### Modify
- `src/backend/main.mo`: add `system func postupgrade()` with the purge logic.

### Remove
- Nothing removed.

## Implementation Plan
1. Add `system func postupgrade()` to `main.mo` that iterates all study groups and removes those whose name contains "epistein" (case-insensitive).
2. Deploy — the postupgrade hook runs automatically, deleting matching groups.
