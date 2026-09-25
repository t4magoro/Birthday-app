import React from 'react';
import { Download, ImagePlus, Palette, Sparkles, Trash2, Settings2, RefreshCcw } from 'lucide-react';
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
  shuffleDust: () => void; // 🔥 NEW Prop
}

export const DesignTools = ({
  activeColor, setActiveColor, activeTheme, setActiveTheme,
  uploadedImg, handleImageUpload, stickers, addSticker,
  clearStickers, exportStory, isExporting, shuffleDust
}: DesignToolsProps) => {
  return (
    <div className="flex-1 w-full bg-white/30 backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem] shadow-2xl border border-white/50 flex flex-col relative z-10 h-full">
      
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/40 pb-4 mb-6 shrink-0">
        <div className="bg-white/60 p-2 rounded-xl text-pink-500 shadow-sm">
          <Settings2 className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold font-serif text-gray-800 leading-tight">Design Story</h2>
          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-widest">Customize Keepsake</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6 mb-6">
        
        {/* COLUMN 1: Background & Style */}
        <div className="flex flex-col gap-6">
          <div>
            {/* 🔥 FIXED: Added Shuffle Button inside the Background header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Palette className="w-4 h-4"/> Background
              </h3>
              <button onClick={shuffleDust} className="text-[11px] font-bold text-pink-500 hover:text-pink-600 flex items-center gap-1 transition-colors active:scale-95">
                <RefreshCcw className="w-3 h-3"/> Shuffle Pattern
              </button>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {STORY_COLORS.map(color => (
                <button
                  key={color.id}
                  onClick={() => setActiveColor(color)}
                  className={`w-11 h-11 rounded-full border-2 transition-transform ${color.class} ${activeColor.id === color.id ? 'border-pink-700 scale-110 shadow-md' : 'border-pink-400 hover:scale-105 shadow-sm'}`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Photo Style</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2.5">
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => setActiveTheme(theme)}
                  className={`px-3 py-3 rounded-2xl text-sm font-bold transition-all ${activeTheme.id === theme.id ? 'bg-pink-500 text-white shadow-md' : 'bg-white/60 text-gray-600 hover:bg-white/80 hover:text-pink-600 shadow-sm border border-white/50'}`}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 2: Upload & Stickers */}
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><ImagePlus className="w-4 h-4"/> Your Photo</h3>
            <label className="block w-full border-2 border-dashed border-pink-300 bg-white/40 hover:bg-white/60 text-pink-600 transition-colors rounded-2xl p-4 text-center cursor-pointer font-bold text-sm shadow-sm">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              {uploadedImg ? 'Swap Custom Photo' : 'Upload Custom Photo'}
            </label>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><Sparkles className="w-4 h-4"/> Stickers</h3>
              {stickers.length > 0 && (
                <button onClick={clearStickers} className="text-[11px] font-bold text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors">
                  <Trash2 className="w-3 h-3"/> Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_STICKERS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => addSticker(emoji)}
                  className="w-11 h-11 bg-white/60 hover:bg-white/90 rounded-2xl text-xl transition-transform hover:scale-110 active:scale-95 border border-white/50 flex items-center justify-center shadow-sm"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      <div className="mt-auto pt-6 border-t border-white/40 shrink-0">
        <button
          onClick={exportStory}
          disabled={isExporting}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 border border-pink-400"
        >
          <Download className="w-5 h-5" />
          {isExporting ? 'Saving Image...' : 'Download for Instagram'}
        </button>
      </div>
    </div>
  );
};