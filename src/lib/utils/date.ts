import { format, formatDistanceToNow } from "date-fns";

export function formatDate(value: string | Date | null, pattern = "PP") {
  if (!value) return "—";
  return format(new Date(value), pattern);
}

export function relativeTime(value: string | Date | null) {
  if (!value) return "No due date";
  return formatDistanceToNow(new Date(value), { addSuffix: true });
}
