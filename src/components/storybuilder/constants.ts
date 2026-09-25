import { StoryColor, StoryTheme, ShadowLayer } from './types';

// Same values as Tailwind's shadow-sm / shadow-lg / shadow-xl, but drawn by
// <SoftShadow> instead of CSS box-shadow (see SoftShadow.tsx for why).
export const SHADOW: Record<'sm' | 'lg' | 'xl', ShadowLayer[]> = {
  sm: [{ y: 1, blur: 2, spread: 0, alpha: 0.05 }],
  lg: [{ y: 10, blur: 15, spread: -3, alpha: 0.1 }, { y: 4, blur: 6, spread: -4, alpha: 0.1 }],
  xl: [{ y: 20, blur: 25, spread: -5, alpha: 0.1 }, { y: 8, blur: 10, spread: -6, alpha: 0.1 }],
};

export const STICKER_DROP_SHADOW =
  'drop-shadow(0 4px 3px rgba(0,0,0,0.07)) drop-shadow(0 2px 2px rgba(0,0,0,0.06))';

export const STORY_COLORS: StoryColor[] = [
  { id: 'pink', name: 'Pastel Pink', class: 'bg-[#FFF0F5]', text: 'text-pink-600' },
  { id: 'rose', name: 'Vintage Rose', class: 'bg-rose-100', text: 'text-rose-700' },
  { id: 'lavender', name: 'Lavender', class: 'bg-purple-100', text: 'text-purple-700' },
  { id: 'cream', name: 'Warm Cream', class: 'bg-amber-50', text: 'text-amber-700' },
  { id: 'dark', name: 'Midnight', class: 'bg-slate-900', text: 'text-pink-400', cardText: 'text-pink-700', chip: 'bg-pink-50' },
  { id: 'matcha', name: 'Matcha Green', class: 'bg-emerald-50', text: 'text-emerald-700' },
  { id: 'ocean', name: 'Ocean Breeze', class: 'bg-cyan-50', text: 'text-cyan-700' }
];

export const THEMES: StoryTheme[] = [
  { id: 'classic', name: 'Classic Polaroid', frameClass: 'bg-white p-3 pb-8 rounded-sm', shadow: SHADOW.xl, radius: 2 },
  { id: 'modern', name: 'Modern Minimal', frameClass: 'bg-white p-2 rounded-2xl', shadow: SHADOW.lg, radius: 16 },
  { id: 'dreamy', name: 'Dreamy Glow', frameClass: 'bg-white/70  p-3 rounded-2xl border border-white/50', shadow: SHADOW.lg, radius: 16 }
];

export const MAX_STORY_WISHES = 3;
export const AVAILABLE_STICKERS = ['✨', '💖', '🎉', '🎂', '🧸', '🌸', '🎀', '💌', '🍀', '🦋'];

export const LOVE_DUST = [
  { x: 12, y: 15, size: 24, rot: -15, type: 'heart', opacity: 0.15 },
  { x: 82, y: 8, size: 16, rot: 20, type: 'heart', opacity: 0.2 },
  { x: 85, y: 85, size: 30, rot: -10, type: 'heart', opacity: 0.15 },
  { x: 15, y: 80, size: 20, rot: 25, type: 'heart', opacity: 0.2 },
  { x: 20, y: 25, size: 140, rot: -12, type: 'heart', opacity: 0.04 },
  { x: 80, y: 70, size: 160, rot: 15, type: 'heart', opacity: 0.04 },
  { x: 50, y: 50, size: 200, rot: 0, type: 'heart', opacity: 0.03 }, 
  { x: 10, y: 90, size: 120, rot: 30, type: 'heart', opacity: 0.04 },
  { x: 90, y: 20, size: 130, rot: -25, type: 'heart', opacity: 0.04 },
  { x: 20, y: 35, size: 5, type: 'dot', opacity: 0.3 },
  { x: 85, y: 40, size: 4, type: 'dot', opacity: 0.2 },
  { x: 10, y: 60, size: 6, type: 'dot', opacity: 0.25 },
  { x: 75, y: 65, size: 4, type: 'dot', opacity: 0.3 },
  { x: 45, y: 12, size: 5, type: 'dot', opacity: 0.2 },
  { x: 60, y: 92, size: 4, type: 'dot', opacity: 0.25 },
];