function getUserInitials(username) {
  if (!username || username.trim().length === 0) {
    return "G";
  }
  const trimmed = username.trim();
  const words = trimmed.split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
}
function getUnknownUserLabel() {
  return "Guest";
}
export {
  getUnknownUserLabel as a,
  getUserInitials as g
};
