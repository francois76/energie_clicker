import type { Energy } from '../types';
import { ENERGY_META } from '../data/gameData';

export function formatNumber(value: number, digits = 1): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(digits)} Md`;
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(digits)} M`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(digits)} k`;
  if (abs >= 100) return value.toFixed(0);
  if (abs >= 10) return value.toFixed(1);
  return value.toFixed(digits);
}

export function formatEnergy(value: number, energy: Energy): string {
  return `${formatNumber(value)} ${ENERGY_META[energy].unit}`;
}

export function formatRate(value: number, energy: Energy): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${formatNumber(value)} ${ENERGY_META[energy].rateUnit}`;
}

export function formatCountdown(seconds: number): string {
  const safe = Math.max(0, Math.ceil(seconds));
  const min = Math.floor(safe / 60);
  const sec = safe % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
