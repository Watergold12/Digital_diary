import { format, parseISO, isToday, isYesterday } from 'date-fns';

export function formatDate(dateString: string): string {
  const date = parseISO(dateString);
  if (isToday(date)) {
    return 'Today, ' + format(date, 'MMM d');
  }
  if (isYesterday(date)) {
    return 'Yesterday, ' + format(date, 'MMM d');
  }
  return format(date, 'EEEE, MMMM d, yyyy');
}

export function formatShortDate(dateString: string): string {
  return format(parseISO(dateString), 'MMM d, yyyy');
}
