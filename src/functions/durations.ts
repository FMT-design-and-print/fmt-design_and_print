export function getFormattedDurationFromNow(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} secs ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? "1 min ago" : `${diffInMinutes} mins ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return diffInHours === 1 ? "1 hr ago" : `${diffInHours} hrs ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return diffInWeeks === 1 ? "1 week ago" : `${diffInWeeks} weeks ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30); // Approximate value
  if (diffInMonths < 12) {
    return diffInMonths === 1 ? "1 month ago" : `${diffInMonths} months ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365); // Approximate value
  return diffInYears === 1 ? "1 year ago" : `${diffInYears} years ago`;
}

export function getFormattedDurationToFuture(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} secs`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? "1 min" : `${diffInMinutes} mins`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return diffInHours === 1 ? "1 hr" : `${diffInHours} hrs`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return diffInDays === 1 ? "1 day" : `${diffInDays} days`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return diffInWeeks === 1 ? "1 week" : `${diffInWeeks} weeks`;
  }

  const diffInMonths = Math.floor(diffInDays / 30); // Approximate value
  if (diffInMonths < 12) {
    return diffInMonths === 1 ? "1 month" : `${diffInMonths} months`;
  }

  const diffInYears = Math.floor(diffInDays / 365); // Approximate value
  return diffInYears === 1 ? "1 year" : `${diffInYears} years`;
}

export function getFormattedDaysToFuture(date: Date): string {
  const now = new Date();
  const diffInMilliseconds = date.getTime() - now.getTime();
  const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return "today";
  }

  if (diffInDays === 1) {
    return "1 day";
  }

  return `${diffInDays} days`;
}
