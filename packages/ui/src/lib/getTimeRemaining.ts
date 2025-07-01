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

  console.log("full", full);

  let short = full
    .replace("less than a minute", "<1 min")
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
    .replace("about ", "")
    .replace("over ", "")
    .replace("almost ", "")
    .replace("in ", "")
    .replace("in", "")
    .replace(" ago", "")
    .replace("ago", "");

  // Manejo de "ago" y "in"
  if (full.includes("ago")) {
    short = short + " ago";
  } else if (full.startsWith("in ")) {
    short = short + " in";
  }

  console.log("short", short);

  return short;
}
