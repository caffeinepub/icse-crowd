# Specification

## Summary
**Goal:** Add automatic content moderation to prevent study groups with inappropriate descriptions from being created.

**Planned changes:**
- Define a predefined list of banned keywords (profanity, hate speech, spam terms, non-academic content) in the backend
- Implement automatic validation in createStudyGroup that scans descriptions for banned keywords and rejects creation if detected
- Update the frontend Study Groups page to display clear error messages when group creation fails due to content moderation

**User-visible outcome:** Users attempting to create study groups with inappropriate content in the description will receive an immediate error message, preventing the group from being created. The dialog remains open so they can edit and retry.
