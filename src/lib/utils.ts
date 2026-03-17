import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const d = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3600000) return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
  return `${Math.floor(ms / 3600000)}h ${Math.floor((ms % 3600000) / 60000)}m`;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'idle': return 'text-neon-green';
    case 'busy': return 'text-neon-yellow';
    case 'error': return 'text-neon-red';
    case 'offline': return 'text-midnight-400';
    default: return 'text-midnight-300';
  }
}

export function getStatusDotClass(status: string): string {
  switch (status) {
    case 'idle': return 'status-idle';
    case 'busy': return 'status-busy';
    case 'error': return 'status-error';
    default: return 'status-offline';
  }
}
