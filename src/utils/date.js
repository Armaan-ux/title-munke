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