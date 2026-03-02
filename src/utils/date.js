import { format } from "date-fns-tz";

/**
 * Calculates the start of the current month and the start of the next month.
 * @returns {{currentMonthStart: Date, nextMonthStart: Date}}
 */
export function getCurrentMonthDateRange() {
  const currentMonthStart = new Date();
  currentMonthStart.setDate(1);
  currentMonthStart.setHours(0, 0, 0, 0);

  const nextMonthStart = new Date(currentMonthStart);
  nextMonthStart.setMonth(nextMonthStart.getMonth() + 1);

  return { currentMonthStart, nextMonthStart };
}

export const formatUSPhone = (value = "") => {
  const digits = value.replace(/\D/g, "").slice(0, 10);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6)
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export const formatDateSafe = (dateValue, fallback = "-") => {
  if (!dateValue) return fallback;

  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return fallback;

  return format(date, "MMM dd, yyyy");
};