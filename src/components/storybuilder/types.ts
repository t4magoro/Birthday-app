export interface StoryColor {
  id: string;
  name: string;
  class: string;
  text: string;
}

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