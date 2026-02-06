/**
 * Utility functions for displaying user information in the UI.
 */

/**
 * Derives initials from a username for avatar fallbacks.
 * Takes the first letter of the first two words, or first two letters if single word.
 */
export function getUserInitials(username: string): string {
  if (!username || username.trim().length === 0) {
    return 'U';
  }

  const trimmed = username.trim();
  const words = trimmed.split(/\s+/);

  if (words.length >= 2) {
    // Take first letter of first two words
    return (words[0][0] + words[1][0]).toUpperCase();
  } else {
    // Take first two letters of single word
    return trimmed.slice(0, 2).toUpperCase();
  }
}

/**
 * Returns a consistent fallback label for unknown or missing users.
 */
export function getUnknownUserLabel(): string {
  return 'Unknown user';
}
