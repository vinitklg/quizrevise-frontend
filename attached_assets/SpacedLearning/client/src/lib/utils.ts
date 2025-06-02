import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function calculateProgress(completedQuizzes: number, totalQuizzes: number): number {
  if (totalQuizzes === 0) return 0;
  return Math.round((completedQuizzes / totalQuizzes) * 100);
}

export function getSubscriptionColor(tier: string): string {
  switch (tier.toLowerCase()) {
    case 'premium':
      return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
    case 'standard':
      return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
    default:
      return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800';
  }
}

export function getRetentionStage(daysPassed: number): number {
  const stages = [0, 1, 5, 15, 30, 60, 120, 180];
  for (let i = 0; i < stages.length; i++) {
    if (daysPassed <= stages[i]) return i;
  }
  return stages.length - 1;
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function calculateTimeRemaining(targetDate: Date | string): string {
  const target = typeof targetDate === "string" ? new Date(targetDate) : targetDate;
  const now = new Date();
  const diffInMilliseconds = target.getTime() - now.getTime();
  
  if (diffInMilliseconds <= 0) {
    return "Now";
  }
  
  const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  const diffInMinutes = Math.floor((diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffInHours > 24) {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''}`;
  }
  
  if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''}`;
  }
  
  return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''}`;
}
