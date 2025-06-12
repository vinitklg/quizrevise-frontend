import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn() {
    var inputs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        inputs[_i] = arguments[_i];
    }
    return twMerge(clsx(inputs));
}
export function formatDate(date) {
    var d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}
export function calculateProgress(completedQuizzes, totalQuizzes) {
    if (totalQuizzes === 0)
        return 0;
    return Math.round((completedQuizzes / totalQuizzes) * 100);
}
export function getSubscriptionColor(tier) {
    switch (tier.toLowerCase()) {
        case 'premium':
            return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
        case 'standard':
            return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
        default:
            return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800';
    }
}
export function getRetentionStage(daysPassed) {
    var stages = [0, 1, 5, 15, 30, 60, 120, 180];
    for (var i = 0; i < stages.length; i++) {
        if (daysPassed <= stages[i])
            return i;
    }
    return stages.length - 1;
}
export function formatPrice(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
}
export function truncateText(text, maxLength) {
    if (text.length <= maxLength)
        return text;
    return text.substring(0, maxLength) + '...';
}
export function calculateTimeRemaining(targetDate) {
    var target = typeof targetDate === "string" ? new Date(targetDate) : targetDate;
    var now = new Date();
    var diffInMilliseconds = target.getTime() - now.getTime();
    if (diffInMilliseconds <= 0) {
        return "Now";
    }
    var diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    var diffInMinutes = Math.floor((diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    if (diffInHours > 24) {
        var diffInDays = Math.floor(diffInHours / 24);
        return "".concat(diffInDays, " day").concat(diffInDays !== 1 ? 's' : '');
    }
    if (diffInHours > 0) {
        return "".concat(diffInHours, " hour").concat(diffInHours !== 1 ? 's' : '');
    }
    return "".concat(diffInMinutes, " minute").concat(diffInMinutes !== 1 ? 's' : '');
}
