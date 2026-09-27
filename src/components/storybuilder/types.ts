export interface StoryColor {
  id: string;
  name: string;
  class: string;
  text: string;
  cardText?: string;  // text inside the white cards (defaults to `text`)
  chip?: string;      // coupon row background (defaults to `class`)
  ink: string;        // hex: outlines, "sticker" shadows, the title and the HAPPY BIRTHDAY strip
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
// (`${x}px ${y}px ${blur}px ${spread}px rgba(0,0,0,${alpha})`). Drawn by <SoftShadow>.
// `color` replaces the black (used for the solid candy-pop "sticker" shadows).
export interface ShadowLayer {
  x?: number;
  color?: string;
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