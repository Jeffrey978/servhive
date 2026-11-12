import {
  BadgeCheck,
  Box,
  Brush,
  Calendar,
  Cpu,
  Droplet,
  Heart,
  House,
  LayoutGrid,
  Scissors,
  Shield,
  Sparkles,
  Sun,
  Wind,
  Wrench,
  Zap,
  type LucideProps,
} from "lucide-react";

const ICONS = {
  "badge-check": BadgeCheck,
  box: Box,
  brush: Brush,
  calendar: Calendar,
  cpu: Cpu,
  droplet: Droplet,
  heart: Heart,
  house: House,
  "layout-grid": LayoutGrid,
  scissors: Scissors,
  shield: Shield,
  sparkles: Sparkles,
  sun: Sun,
  wind: Wind,
  wrench: Wrench,
  zap: Zap,
} as const;

/** Renders Category.icon (a lucide name stored in the DB). Unknown names fall back to a wrench. */
export function CategoryIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = ICONS[name as keyof typeof ICONS] ?? Wrench;
  return <Icon strokeWidth={1.6} {...props} />;
}
