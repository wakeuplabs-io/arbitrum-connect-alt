import { formatDistanceToNow, differenceInMinutes, addMinutes } from "date-fns";

export default function getTimeRemaining(date: Date, minutes: number = 15) {
  const now = new Date();
  const targetDate = addMinutes(date, minutes);
  const distance = formatShortDistanceToNow(targetDate);
  const minutesDiff = differenceInMinutes(now, targetDate);

  if (minutesDiff <= 0) {
    return {
      remaining: true,
      formatted: `${distance} remaining`,
    };
  } else {
    return {
      remaining: false,
      formatted: `${minutes}-min grace period ended ${distance}`,
    };
  }
}

function formatShortDistanceToNow(date: Date) {
  const full = formatDistanceToNow(date, { addSuffix: true });

  let short = full
    .replace("minutes", "min")
    .replace("minute", "min")
    .replace("hours", "h")
    .replace("hour", "h")
    .replace("seconds", "s")
    .replace("second", "s")
    .replace("days", "d")
    .replace("day", "d")
    .replace("months", "mo")
    .replace("month", "mo")
    .replace("years", "y")
    .replace("year", "y")
    .replace("less than a minute", "<1 min")
    .replace("about ", "")
    .replace("over ", "")
    .replace("almost ", "")
    .replace("in ", "");

  // Manejo de "ago" y "in"
  if (short.includes("ago")) {
    short = short.replace(" ago", "") + " ago";
  } else if (short.startsWith("in ")) {
    short = short.replace("in ", "in ");
  }

  return short;
}
