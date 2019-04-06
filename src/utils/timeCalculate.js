export function getPastTimeDifference(start) {
  const milliSecondTime = Date.now() - start;
  const secondTime = milliSecondTime / 1000;
  const minuteTime = secondTime / 60;
  if (minuteTime < 1) return "less than a minute ago";
  if (minuteTime < 60) {
    if (Math.floor(minuteTime) === 1) return "a minute ago";
    return `${Math.floor(minuteTime)} minutes ago`;
  }
  const hourTime = minuteTime / 60;
  if (hourTime < 24) {
    if (Math.floor(hourTime) === 1) return "an hour ago";
    return `${Math.floor(hourTime)} hours ago`;
  }
  const dayTime = hourTime / 24;
  if (dayTime < 7) {
    if (Math.floor(dayTime) === 1) return "a day ago";
    return `${Math.floor(dayTime)} days ago`;
  }
  const weekTime = dayTime / 7;
  if (weekTime < 4) {
    if (Math.floor(weekTime) === 1) return "a week ago";
    return `${Math.floor(weekTime)} weeks ago`;
  }
  const monthTime = dayTime / 30;
  if (monthTime < 12) {
    if (Math.floor(monthTime) === 1) return "a month ago";
    return `${Math.floor(monthTime)} months ago`;
  }
  const yearTime = dayTime / 365;
  if (Math.floor(yearTime) === 1) return "a year ago";
  return `${Math.floor(yearTime)} years ago`;
}

export function getCloseDate(end) {
  const closeDate = new Date(end).getTime();
  const current = Date.now();
  if (current > closeDate) return "Closed";
  const dateFormat = require("dateformat");
  return dateFormat(closeDate, "mmmm dS, yyyy");
}
