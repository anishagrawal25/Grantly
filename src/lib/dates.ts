import { differenceInCalendarDays, format, parseISO } from 'date-fns';

/**
 * Calculates remaining days from today until deadline.
 */
export function getDaysRemaining(deadlineIso: string, today: Date = new Date()): number {
  try {
    const deadlineDate = parseISO(deadlineIso);
    return differenceInCalendarDays(deadlineDate, today);
  } catch {
    return 0;
  }
}

/**
 * Formats ISO date to friendly string (e.g., '15 Dec 2026')
 */
export function formatDeadlineDate(deadlineIso: string): string {
  try {
    const date = parseISO(deadlineIso);
    return format(date, 'd MMM yyyy');
  } catch {
    return deadlineIso;
  }
}

/**
 * Determines deadline urgency for styling
 * green/safe: > 30 days
 * amber/warning: 8–30 days
 * red/urgent: <= 7 days
 */
export function getDeadlineUrgency(daysRemaining: number): 'safe' | 'warning' | 'urgent' {
  if (daysRemaining <= 7) return 'urgent';
  if (daysRemaining <= 30) return 'warning';
  return 'safe';
}

