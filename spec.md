# ICSE Crowd

## Current State
- Full-stack social media platform for ICSE students
- Backend: Motoko with posts, comments, study groups, chat, reports, user profiles
- Frontend: React with pages for Home, Feed, Study Groups, Forum, Chat, Moderation
- Study groups have banned-word filtering on description at creation time
- Admin functions exist (deletePost, deleteComment, getAllUsers, getReports) but no dedicated admin UI page
- No dynamic banned-word management (list is hardcoded in backend)
- No chat group (study group) auto-deletion for existing groups with banned words
- No user suspension/banning capability in backend

## Requested Changes (Diff)

### Add
- Backend: `bannedWords` map to store dynamic banned words (admin-managed)
- Backend: `suspendedUsers` set to track suspended/banned user accounts
- Backend: `addBannedWord(word: Text)` - admin only
- Backend: `removeBannedWord(word: Text)` - admin only
- Backend: `getBannedWords()` - admin only, returns current list
- Backend: `scanAndDeleteOffendingGroups()` - admin only, scans all existing study groups and deletes those with banned words in name or description
- Backend: `suspendUser(user: Principal)` - admin only, marks user as suspended
- Backend: `unsuspendUser(user: Principal)` - admin only
- Backend: `getSuspendedUsers()` - admin only
- Backend: `getPlatformStats()` - admin only, returns counts of users, posts, groups, comments
- Backend: `deleteStudyGroup(groupId: Nat)` - admin only
- Frontend: `/admin` route (AdminPage) accessible only to app owner/admin role
- Frontend: Admin panel sections: Banned Words Manager, Content Moderation (posts/comments/groups), Reports, User Management (suspend/ban), Platform Stats

### Modify
- Backend: `containsBannedWord()` to check both hardcoded defaults AND dynamic `bannedWords` map
- Backend: `createStudyGroup()` to also check group name for banned words (not just description)
- Backend: All write actions (createPost, addComment, sendStudyGroupMessage) to check if caller is suspended and reject if so
- Frontend: App.tsx to add 'admin' to PageView type and render AdminPage
- Frontend: Header to show Admin link only for users with admin role

### Remove
- Nothing removed

## Implementation Plan
1. Add `bannedWords` dynamic map and `suspendedUsers` set to backend state
2. Add admin-only CRUD methods for banned words management
3. Add `suspendUser`, `unsuspendUser`, `getSuspendedUsers` methods
4. Add `deleteStudyGroup` admin method
5. Add `scanAndDeleteOffendingGroups` that deletes existing groups with banned words
6. Add `getPlatformStats` returning user/post/group/comment counts
7. Update `containsBannedWord` to also check dynamic list
8. Update group creation to check both name and description
9. Add suspension check to write operations (createPost, addComment, sendStudyGroupMessage, createStudyGroup)
10. Frontend: Create AdminPage with tabs: Stats, Banned Words, Content (posts/comments/groups), Users, Reports
11. Frontend: Wire admin APIs to the AdminPage UI
12. Frontend: Update App.tsx to add 'admin' page route
13. Frontend: Update Header to show Admin nav item only for admin role users
