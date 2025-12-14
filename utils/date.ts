// Formats a YYYY-MM-DD string into a readable date
// Example: "2026-01-24" → "Jan 24, 2026"

export function formatDate(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}