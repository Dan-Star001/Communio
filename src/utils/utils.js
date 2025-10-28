// Utility functions for the app
export const formatNumber = (num) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
};

// export const formatDate = (date) => {
//     const now = new Date();
//     const diff = now.getTime() - date.getTime();
//     const seconds = Math.floor(diff / 1000);
//     const minutes = Math.floor(seconds / 60);
//     const hours = Math.floor(minutes / 60);
//     const days = Math.floor(hours / 24);

//     if (days > 7) {
//         return date.toLocaleDateString();
//     }
//     if (days > 0) {
//         return `${days}d ago`;
//     }
//     if (hours > 0) {
//         return `${hours}h ago`;
//     }
//     if (minutes > 0) {
//         return `${minutes}m ago`;
//     }
//     return 'Just now';
// };

// utils.js
export function formatDate(date) {
  if (!(date instanceof Date) || isNaN(date)) {
    console.error('Invalid date provided to formatDate:', date);
    return 'Invalid Date';
  }
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
}
