// lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    submitted: 'bg-blue-100 text-blue-800',
    draft_generated: 'bg-purple-100 text-purple-800',
    panel_reviewed: 'bg-indigo-100 text-indigo-800',
    admin_approved: 'bg-cyan-100 text-cyan-800',
    awaiting_client: 'bg-yellow-100 text-yellow-800',
    client_feedback: 'bg-orange-100 text-orange-800',
    client_approved: 'bg-lime-100 text-lime-800',
    final_pending: 'bg-amber-100 text-amber-800',
    final_approved: 'bg-emerald-100 text-emerald-800',
    quality_review: 'bg-teal-100 text-teal-800',
    quality_approved: 'bg-green-100 text-green-800',
    published: 'bg-green-100 text-green-800',
    needs_revision: 'bg-red-100 text-red-800',
    rejected: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    submitted: 'Submitted',
    draft_generated: 'Draft Generated',
    panel_reviewed: 'Panel Reviewed',
    admin_approved: 'Admin Approved',
    awaiting_client: 'Awaiting Client',
    client_feedback: 'Client Feedback',
    client_approved: 'Client Approved',
    final_pending: 'Final Pending',
    final_approved: 'Final Approved',
    quality_review: 'Quality Review',
    quality_approved: 'Quality Approved',
    published: 'Published',
    needs_revision: 'Needs Revision',
    rejected: 'Rejected',
  };
  return labels[status] || status;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}
