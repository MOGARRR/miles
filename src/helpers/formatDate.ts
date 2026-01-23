/**
 * Formats a YYYY-MM-DD date string into a human-readable date.
 * Example: "2026-02-08" → "February 8, 2026"
 * Refactor: if date is empty return "N/A" instead of "December 31, 1969"
 */
export const formatDate = (date: string) => {
  const dateString = new Date(date).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return dateString === "December 31, 1969" ? "N/A" : dateString;
};
