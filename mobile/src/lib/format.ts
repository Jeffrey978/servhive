import type { PriceType } from '@/lib/types';

/** ₦12,500 — same output as the website's formatNaira. */
export function naira(amount: number | null | undefined) {
  if (amount == null) return '—';
  return `₦${Math.round(amount).toLocaleString('en-NG')}`;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** 25 Nov 2026 */
export function date(iso: string | null | undefined) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "just now", "5m", "3h", "2d", or a date. */
export function ago(iso: string | null | undefined) {
  if (!iso) return '';
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 7 * 86400) return `${Math.floor(s / 86400)}d ago`;
  return date(iso);
}

/** "2026-11-25" in Lagos time, for the date fields the website validates. */
export function lagosToday(offsetDays = 0) {
  const d = new Date(Date.now() + offsetDays * 86_400_000 + 3_600_000); // UTC+1
  return d.toISOString().slice(0, 10);
}

export function priceLabel(s: { price: number; priceType: PriceType; unitLabel: string | null }) {
  const n = naira(s.price);
  switch (s.priceType) {
    case 'STARTING_FROM':
      return `From ${n}`;
    case 'PER_UNIT':
      return `${n} per ${s.unitLabel || 'unit'}`;
    case 'MILESTONE':
      return `${n} per milestone`;
    default:
      return n;
  }
}

export type Tone = 'neutral' | 'accent' | 'info' | 'success' | 'danger' | 'outline';

/** The website's status badges (src/components/ui/badge.tsx), word for word. */
export const STATUS: Record<string, [string, Tone]> = {
  DRAFT: ['Draft', 'outline'],
  UNDER_REVIEW: ['Under review', 'info'],
  APPROVED: ['Verified', 'success'],
  REJECTED: ['Rejected', 'danger'],
  SUSPENDED: ['Suspended', 'danger'],
  NOT_UPLOADED: ['Not uploaded', 'outline'],
  SUBMITTED: ['Submitted', 'info'],
  PENDING: ['Awaiting quote', 'accent'],
  QUOTED: ['Quote sent', 'info'],
  ACCEPTED: ['Accepted', 'success'],
  DECLINED: ['Declined', 'outline'],
  CANCELLED: ['Cancelled', 'outline'],
  FUNDED: ['In escrow', 'accent'],
  AWAITING_RELEASE: ['Awaiting release', 'info'],
  RELEASED: ['Paid out', 'success'],
  DISPUTED: ['Disputed', 'danger'],
  REFUNDED: ['Refunded', 'neutral'],
  OPEN: ['Open', 'danger'],
  ARTISAN_RESPONDED: ['Artisan responded', 'info'],
  RESOLVED: ['Resolved', 'success'],
  DISMISSED: ['Dismissed', 'outline'],
};

export function firstName(name: string) {
  return name.split(/\s+/)[0] ?? name;
}

export function greeting() {
  const h = (new Date().getUTCHours() + 1) % 24; // Lagos is UTC+1, no DST
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}
