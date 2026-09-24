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