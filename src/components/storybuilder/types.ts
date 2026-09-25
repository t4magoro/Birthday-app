export interface StoryColor {
  id: string;
  name: string;
  class: string;
  text: string;
}

declare module 'twemoji';

export interface StoryTheme {
  id: string;
  name: string;
  frameClass: string;
}

export interface StickerData {
  id: number;
  emoji: string;
  x: number;
  y: number;
  rot: number;
}

export interface LoveDustItem {
  x: number;
  y: number;
  size: number;
  rot: number;
  type: 'heart' | 'dot';
  opacity: number;
}

// One layer of a soft shadow, in the same terms as a CSS box-shadow
// (`0 ${y}px ${blur}px ${spread}px rgba(0,0,0,${alpha})`). Drawn by <SoftShadow>.
export interface ShadowLayer {
  y: number;
  blur: number;
  spread: number;
  alpha: number;
}

export interface StoryTheme {
  id: string;
  name: string;
  frameClass: string;
  shadow: ShadowLayer[];
  radius: number; // px, must match the rounded-* class in frameClass
}