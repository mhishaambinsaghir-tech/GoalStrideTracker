/** Shared date / misc helper utilities */

export function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export function formatDateShort(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  });
}

export function daysAgo(iso) {
  if (!iso) return '';
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return `${diff} days ago`;
}

export function minutesToHours(min) {
  if (!min) return '0m';
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

export function statusClass(status) {
  const map = {
    active: 'badge-active',
    completed: 'badge-completed',
    paused: 'badge-paused',
  };
  return map[status] || 'badge-active';
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}
