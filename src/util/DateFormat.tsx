import { DateTime } from 'luxon';


// 🗓️ Date formatter for display
const formatDateManually = (date: string | Date | number[] | null | undefined): string => {
  if (!date) return "";

  let parsedDate: Date;

  if (Array.isArray(date)) {
    // Assuming format: [year, month, day, hour, minute, second, millisecond]
    const [year, month, day, hour = 0, minute = 0, second = 0, ms = 0] = date;
    parsedDate = new Date(year, month - 1, day, hour, minute, second, ms); // month is 0-based
  } else if (typeof date === "string") {
    parsedDate = new Date(date);
  } else if (date instanceof Date) {
    parsedDate = date;
  } else {
    return "";
  }

  if (isNaN(parsedDate.getTime())) return "";

  const dayNum = parsedDate.getDate();
  const monthName = parsedDate.toLocaleString('en-GB', { month: 'long' });
  const yearNum = parsedDate.getFullYear();

  return `${dayNum} ${monthName} ${yearNum}`;
};



 const formatDateApp = (date: string | Date | null | undefined): string => {
  if (!date) return "Invalid date"; // handle null/undefined

  let isoString: string;

  if (typeof date === "string") {
    isoString = date;
  } else if (date instanceof Date && !isNaN(date.getTime())) {
    isoString = date.toISOString();
  } else {
    return "Invalid date"; // not a valid date object
  }

  const dt = DateTime.fromISO(isoString, { zone: 'utc' }).setZone('Asia/Kolkata');

  return dt.isValid ? dt.toFormat("EEEE, MMMM d, yyyy 'at' h.mm a") : "Invalid date";
};


/**
 * 📅 Formats date for app display (no time shown)
 * Example: "Monday, November 10, 2025"
 */

export const formatDateAppShort = (date: string | Date | number[] | number | null | undefined): string => {
  if (!date) return "Invalid date";

  // Java LocalDate array format: [2025, 10, 15]
  if (Array.isArray(date)) {
    const [year, month, day] = date;
    const dt = DateTime.fromObject({ year, month, day }).setZone("Asia/Kolkata");
    return dt.isValid ? dt.toFormat("EEEE, MMMM d, yyyy") : "Invalid date";
  }

  // Epoch seconds or milliseconds
  if (typeof date === "number") {
    const ms = date < 1e12 ? date * 1000 : date; // convert seconds → ms
    const dt = DateTime.fromMillis(ms).setZone("Asia/Kolkata");
    return dt.isValid ? dt.toFormat("EEEE, MMMM d, yyyy") : "Invalid date";
  }

  // ISO string or Date object
  let isoString: string;

  if (typeof date === "string") {
    isoString = date;
  } else if (date instanceof Date && !isNaN(date.getTime())) {
    isoString = date.toISOString();
  } else {
    return "Invalid date";
  }

  const dt = DateTime.fromISO(isoString, { zone: "utc" }).setZone("Asia/Kolkata");
  return dt.isValid ? dt.toFormat("EEEE, MMMM d, yyyy") : "Invalid date";
};


/**
 * 📌 Format date as DD/MM/YYYY  → Example: 14/02/2026
 */
export const formatDateDDMMYYYY = (
  date: string | Date | number[] | number | null | undefined
): string => {
  if (!date) return "Invalid date";

  let dt: DateTime;

  // Java LocalDate array: [year, month, day]
  if (Array.isArray(date)) {
    const [year, month, day] = date;
    dt = DateTime.fromObject({ year, month, day }).setZone("Asia/Kolkata");
    return dt.isValid ? dt.toFormat("dd/MM/yyyy") : "Invalid date";
  }

  // Epoch number (seconds or milliseconds)
  if (typeof date === "number") {
    const ms = date < 1e12 ? date * 1000 : date; // convert seconds → ms
    dt = DateTime.fromMillis(ms).setZone("Asia/Kolkata");
    return dt.isValid ? dt.toFormat("dd/MM/yyyy") : "Invalid date";
  }

  // String or Date
  let iso: string;
  if (typeof date === "string") {
    iso = date;
  } else if (date instanceof Date && !isNaN(date.getTime())) {
    iso = date.toISOString();
  } else {
    return "Invalid date";
  }

  dt = DateTime.fromISO(iso, { zone: "utc" }).setZone("Asia/Kolkata");
  return dt.isValid ? dt.toFormat("dd/MM/yyyy") : "Invalid date";
};


export {formatDateManually,formatDateApp};
  