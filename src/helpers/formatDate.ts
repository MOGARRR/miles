/**
 * Formats a YYYY-MM-DD date string into a human-readable date.
 * Example: "2026-02-08" → "February 8, 2026"
 */
export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
