/**
 * Utility to extract readable error messages from IC canister errors.
 * Handles common patterns like Runtime.trap messages and agent errors.
 */
export function normalizeICError(error: unknown): string {
  if (!error) {
    return "An unknown error occurred";
  }

  // If it's already a string, return it
  if (typeof error === "string") {
    return error;
  }

  // If it's an Error object
  if (error instanceof Error) {
    // Check for IC agent error patterns
    if (error.message) {
      // Extract trap message from IC error format
      // Pattern: "Call was rejected: ... Reject text: <message>"
      const rejectMatch = error.message.match(/Reject text:\s*(.+?)(?:\n|$)/i);
      if (rejectMatch?.[1]) {
        return rejectMatch[1].trim();
      }

      // Pattern: "Canister trapped: <message>"
      const trapMatch = error.message.match(/trapped:\s*(.+?)(?:\n|$)/i);
      if (trapMatch?.[1]) {
        return trapMatch[1].trim();
      }

      // Return the full message if no pattern matched
      return error.message;
    }
  }

  // If it's an object with a message property
  if (typeof error === "object" && error !== null && "message" in error) {
    const msg = (error as { message: unknown }).message;
    if (typeof msg === "string") {
      return msg;
    }
  }

  // Fallback
  return "An unexpected error occurred";
}
