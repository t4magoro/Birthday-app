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

export interface StoryTheme {
  id: string;
  name: string;
  frameClass: string;
  shadow: string; // literal box-shadow, no CSS vars — safe for Safari export
}