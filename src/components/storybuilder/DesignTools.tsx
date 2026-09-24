import React from 'react';
import { Download, ImagePlus, Palette, Sparkles, Trash2 } from 'lucide-react';
import { STORY_COLORS, THEMES, AVAILABLE_STICKERS } from './constants';
import { StoryColor, StoryTheme, StickerData } from './types';

interface DesignToolsProps {
  activeColor: StoryColor;
  setActiveColor: (color: StoryColor) => void;
  activeTheme: StoryTheme;
  setActiveTheme: (theme: StoryTheme) => void;
  uploadedImg: string | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  stickers: StickerData[];
  addSticker: (emoji: string) => void;
  clearStickers: () => void;
  exportStory: () => void;
  isExporting: boolean;
}

export const DesignTools = ({
  activeColor, setActiveColor, activeTheme, setActiveTheme,
  uploadedImg, handleImageUpload, stickers, addSticker,
  clearStickers, exportStory, isExporting
}: DesignToolsProps) => {
  return (
    <div className="flex-1 flex flex-col gap-5 w-full">
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Palette className="w-4 h-4"/> Background</h3>
        <div className="flex flex-wrap gap-2">
          {STORY_COLORS.map(color => (
            <button
              key={color.id}
              onClick={() => setActiveColor(color)}
              className={`w-10 h-10 rounded-full border-2 transition-transform ${color.class} ${activeColor.id === color.id ? 'border-pink-500 scale-110 shadow-sm' : 'border-transparent hover:scale-105'}`}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Photo Style</h3>
        <div className="grid grid-cols-2 gap-2">
          {THEMES.map(theme => (
            <button
              key={theme.id}
              onClick={() => setActiveTheme(theme)}
              className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${activeTheme.id === theme.id ? 'bg-pink-500 text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              {theme.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><ImagePlus className="w-4 h-4"/> Your Photo</h3>
        <label className="block w-full border-2 border-dashed border-pink-300 bg-pink-50 text-pink-500 hover:bg-pink-100 transition-colors rounded-xl p-3 text-center cursor-pointer font-bold text-sm">
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          {uploadedImg ? 'Swap Photo' : 'Upload Custom Photo'}
        </label>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Sparkles className="w-4 h-4"/> Stickers</h3>
          {stickers.length > 0 && (
            <button onClick={clearStickers} className="text-xs font-bold text-red-400 hover:text-red-600 flex items-center gap-1">
              <Trash2 className="w-3 h-3"/> Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_STICKERS.map(emoji => (
            <button
              key={emoji}
              onClick={() => addSticker(emoji)}
              className="w-10 h-10 bg-gray-50 hover:bg-pink-50 rounded-lg text-xl transition-transform hover:scale-110 active:scale-95 border border-gray-100 flex items-center justify-center shadow-sm"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={exportStory}
          disabled={isExporting}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          {isExporting ? 'Saving Image...' : 'Download for Instagram'}
        </button>
      </div>
    </div>
  );
};