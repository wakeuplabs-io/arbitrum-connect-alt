import { SECONDS_IN_DAY } from "./types.js";

import { SECONDS_IN_HOUR } from "./types.js";

import { SECONDS_IN_MINUTE } from "./types.js";

export default function formatTimeLeft(timeLeftInSeconds: number): string {
  // Format remaining time
  let formattedTimeLeft = "";
  if (timeLeftInSeconds === 0) {
    formattedTimeLeft = "Ready to claim";
  } else if (timeLeftInSeconds < SECONDS_IN_MINUTE) {
    formattedTimeLeft = `${timeLeftInSeconds} second${timeLeftInSeconds === 1 ? "" : "s"}`;
  } else if (timeLeftInSeconds < SECONDS_IN_HOUR) {
    const minutes = Math.ceil(timeLeftInSeconds / SECONDS_IN_MINUTE);
    formattedTimeLeft = `${minutes} minute${minutes === 1 ? "" : "s"}`;
  } else if (timeLeftInSeconds < SECONDS_IN_DAY) {
    const hours = Math.ceil(timeLeftInSeconds / SECONDS_IN_HOUR);
    formattedTimeLeft = `${hours} hour${hours === 1 ? "" : "s"}`;
  } else {
    const days = Math.ceil(timeLeftInSeconds / SECONDS_IN_DAY);
    formattedTimeLeft = `${days} day${days === 1 ? "" : "s"}`;
  }

  return formattedTimeLeft;
}
