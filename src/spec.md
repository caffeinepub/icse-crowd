# Specification

## Summary
**Goal:** Add a final Home page section that displays an inquiries/advertising contact callout with a clickable email link and copy-to-clipboard action.

**Planned changes:**
- Add a new last section at the bottom of `frontend/src/pages/HomePage.tsx`, rendered after the current final section, matching the callout content shown in the provided image.
- Display the text label "FOR INQUIRIES & ADVERTISING:" and the exact email `aryananilshinde6122009@gmail.com`.
- Render the email as a `mailto:aryananilshinde6122009@gmail.com` link and add a copy-to-clipboard affordance.
- Use the app’s existing toast/feedback pattern to communicate copy success/failure.

**User-visible outcome:** Users can see an inquiries/advertising contact area at the bottom of the Home page, click the email to open their mail client, or copy the email address with feedback.
