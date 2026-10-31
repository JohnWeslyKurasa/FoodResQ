export function formatDateTime(dateString) {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatTimeOnly(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function getTimeRemaining(endDateString) {
  if (!endDateString) return { text: 'No deadline', isUrgent: false, isExpired: false };
  const diff = new Date(endDateString) - new Date();
  if (diff <= 0) {
    return { text: 'Expired', isUrgent: false, isExpired: true };
  }
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours < 1) {
    return { text: `${minutes}m remaining`, isUrgent: true, isCritical: true, isExpired: false };
  } else if (hours < 3) {
    return { text: `${hours}h ${minutes}m left`, isUrgent: true, isCritical: false, isExpired: false };
  }
  return { text: `${hours}h remaining`, isUrgent: false, isCritical: false, isExpired: false };
}

export function formatDistance(km) {
  if (km === undefined || km === null) return '';
  return `${km.toFixed(1)} km`;
}

export function getCategoryBadgeClass(category) {
  switch (category) {
    case 'Vegetarian':
      return 'badge-veg';
    case 'Non-Vegetarian':
      return 'badge-nonveg';
    case 'Bakery':
      return 'badge-bakery';
    case 'Fruits':
    case 'Vegetables':
      return 'badge-veg';
    default:
      return 'badge-available';
  }
}
