/** Local calendar date as YYYY-MM-DD (for <input type="date">). */
export function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDaysToDateInput(dateInput: string, days: number): string {
  const [year, month, day] = dateInput.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return toDateInputValue(date);
}

export function getDefaultEventDates() {
  const startDate = toDateInputValue(new Date());
  return {
    startDate,
    endDate: addDaysToDateInput(startDate, 1),
  };
}

/** Formats HTML time value "14:30" → "2:30 PM". */
export function formatTimeLabel(time24: string): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time24.trim());
  if (!match) return time24;

  let hour = Number(match[1]);
  const minute = match[2];
  const period = hour >= 12 ? "PM" : "AM";

  hour = hour % 12;
  if (hour === 0) hour = 12;

  return `${hour}:${minute} ${period}`;
}

/** Builds stored hours string from two <input type="time"> values. */
export function formatHoursRange(startTime: string, endTime: string): string {
  if (!startTime && !endTime) return "";
  if (!endTime) return formatTimeLabel(startTime);
  if (!startTime) return formatTimeLabel(endTime);
  return `${formatTimeLabel(startTime)} – ${formatTimeLabel(endTime)}`;
}

/**
 * Best-effort parse of stored hours back into 24h time inputs.
 * Accepts "10:00 AM – 6:00 PM", "10:00-18:00", etc.
 */
export function parseHoursRange(hours: string): {
  startTime: string;
  endTime: string;
} {
  const empty = { startTime: "", endTime: "" };
  if (!hours?.trim()) return empty;

  const parts = hours.split(/\s*[–—-]\s*/);
  if (parts.length === 1) {
    const startTime = toTimeInputValue(parts[0]);
    return startTime ? { startTime, endTime: "" } : empty;
  }

  const startTime = toTimeInputValue(parts[0]);
  const endTime = toTimeInputValue(parts[1]);
  if (!startTime && !endTime) return empty;
  return { startTime: startTime ?? "", endTime: endTime ?? "" };
}

function toTimeInputValue(label: string): string | null {
  const trimmed = label.trim();
  const match24 = /^(\d{1,2}):(\d{2})$/.exec(trimmed);
  if (match24) {
    const hour = Number(match24[1]);
    const minute = Number(match24[2]);
    if (hour > 23 || minute > 59) return null;
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  }

  const match12 = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(trimmed);
  if (!match12) return null;

  let hour = Number(match12[1]);
  const minute = Number(match12[2]);
  const period = match12[3].toUpperCase();

  if (hour < 1 || hour > 12 || minute > 59) return null;
  if (period === "AM") {
    if (hour === 12) hour = 0;
  } else if (hour !== 12) {
    hour += 12;
  }

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}
