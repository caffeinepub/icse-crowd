function normalizeICError(error) {
  if (!error) {
    return "An unknown error occurred";
  }
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    if (error.message) {
      const rejectMatch = error.message.match(/Reject text:\s*(.+?)(?:\n|$)/i);
      if (rejectMatch == null ? void 0 : rejectMatch[1]) {
        return rejectMatch[1].trim();
      }
      const trapMatch = error.message.match(/trapped:\s*(.+?)(?:\n|$)/i);
      if (trapMatch == null ? void 0 : trapMatch[1]) {
        return trapMatch[1].trim();
      }
      return error.message;
    }
  }
  if (typeof error === "object" && error !== null && "message" in error) {
    const msg = error.message;
    if (typeof msg === "string") {
      return msg;
    }
  }
  return "An unexpected error occurred";
}
export {
  normalizeICError as n
};
