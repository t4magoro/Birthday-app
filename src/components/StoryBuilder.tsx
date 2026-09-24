import React, { useState, useRef, useEffect } from 'react';
import { toJpeg } from 'html-to-image';
import { Download, ImagePlus, Palette, Sparkles, Trash2 } from 'lucide-react';
import { CONFIG } from '../config';

// ============================================================================
// 1. SCALABLE DESIGN CONFIGURATIONS
// ============================================================================
const STORY_COLORS = [
  { id: 'pink', name: 'Pastel Pink', class: 'bg-[#FFF0F5]', text: 'text-pink-600' },
  { id: 'rose', name: 'Vintage Rose', class: 'bg-rose-100', text: 'text-rose-700' },
  { id: 'lavender', name: 'Lavender', class: 'bg-purple-100', text: 'text-purple-700' },
  { id: 'cream', name: 'Warm Cream', class: 'bg-amber-50', text: 'text-amber-700' },
  { id: 'dark', name: 'Midnight', class: 'bg-slate-900', text: 'text-pink-300' }
];

const THEMES = [
  { id: 'classic', name: 'Classic Polaroid', frameClass: 'bg-white p-3 pb-8 rounded-sm shadow-xl' },
  { id: 'modern', name: 'Modern Minimal', frameClass: 'bg-white p-2 rounded-2xl shadow-lg' },
  { id: 'dreamy', name: 'Dreamy Glow', frameClass: 'bg-white/40 backdrop-blur-md p-3 rounded-2xl border border-white/50 shadow-lg' }
];

const AVAILABLE_STICKERS = ['✨', '💖', '🎉', '🎂', '🧸', '🌸', '🎀', '💌', '🍀', '🦋'];

// Pre-calculated static coordinates so the love dust doesn't jump/flicker on every render!
const LOVE_DUST = [
  { x: 12, y: 15, size: 24, rot: -15, type: 'heart', opacity: 0.15 },
  { x: 82, y: 8, size: 16, rot: 20, type: 'heart', opacity: 0.2 },
  { x: 85, y: 85, size: 30, rot: -10, type: 'heart', opacity: 0.15 },
  { x: 15, y: 80, size: 20, rot: 25, type: 'heart', opacity: 0.2 },
  // Added extra giant background hearts ✨
  { x: 20, y: 25, size: 140, rot: -12, type: 'heart', opacity: 0.04 },
  { x: 80, y: 70, size: 160, rot: 15, type: 'heart', opacity: 0.04 },
  { x: 50, y: 50, size: 200, rot: 0, type: 'heart', opacity: 0.03 }, 
  { x: 10, y: 90, size: 120, rot: 30, type: 'heart', opacity: 0.04 },
  { x: 90, y: 20, size: 130, rot: -25, type: 'heart', opacity: 0.04 },
  // Small dust dots
  { x: 20, y: 35, size: 5, type: 'dot', opacity: 0.3 },
  { x: 85, y: 40, size: 4, type: 'dot', opacity: 0.2 },
  { x: 10, y: 60, size: 6, type: 'dot', opacity: 0.25 },
  { x: 75, y: 65, size: 4, type: 'dot', opacity: 0.3 },
  { x: 45, y: 12, size: 5, type: 'dot', opacity: 0.2 },
  { x: 60, y: 92, size: 4, type: 'dot', opacity: 0.25 },
];

// ============================================================================
// 2. THE STORY BUILDER COMPONENT
// ============================================================================
interface StoryBuilderProps {
  redeemedIds: number[];
  wishes: string[];
}

export const StoryBuilder = ({ redeemedIds, wishes }: StoryBuilderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  
  const [activeColor, setActiveColor] = useState(STORY_COLORS[0]);
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);
  const [uploadedImg, setUploadedImg] = useState<string | null>(null);
  const [stickers, setStickers] = useState<{ id: number; emoji: string; x: number; y: number; rot: number }[]>([]);
  
  const [isExporting, setIsExporting] = useState(false);
  const claimedCoupons = CONFIG.INITIAL_COUPONS.filter(c => redeemedIds.includes(c.id));

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setScale(rect.width / 360);
      }
    };
    
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImg(url);
    }
  };

  const addSticker = (emoji: string) => {
    setStickers(prev => [...prev, {
      id: Date.now(),
      emoji,
      x: 15 + Math.random() * 70, 
      y: 15 + Math.random() * 70, 
      rot: Math.random() * 40 - 20 
    }]);
  };

  const clearStickers = () => setStickers([]);

  const exportStory = async () => {
    if (!storyRef.current || isExporting) return;
    setIsExporting(true);
    
    try {
      const dataUrl = await toJpeg(storyRef.current, {
        quality: 0.95,
        pixelRatio: 3, 
        width: 360,
        height: 640,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        }
      });
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Birthday_Story_${CONFIG.HER_NAME}.jpg`;
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl mx-auto items-center md:items-start">
      
      {/* ========================================== */}
      {/* 9:16 PREVIEW CONTAINER */}
      {/* ========================================== */}
      <div className="w-full flex justify-center shrink-0 md:w-[380px]">
        
        {/* NEW: Dotted Outer Frame (Purely for aesthetics, won't be exported!) */}
        <div className="w-full p-2 md:p-3 rounded-[2rem] border-[3px] border-dashed border-gray-300 bg-white/40 flex justify-center items-center">
          
          <div 
            ref={containerRef}
            className="relative w-full max-w-[360px] aspect-[9/16] rounded-2xl shadow-lg overflow-hidden bg-gray-100"
          >
            {/* The Actual Exportable Canvas */}
            <div 
              ref={storyRef}
              style={{
                width: '360px',
                height: '640px',
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
              className={`absolute top-0 left-0 flex flex-col p-5 transition-colors duration-300 ${activeColor.class}`}
            >
              
              {/* --- DYNAMIC LOVE DUST BACKGROUND --- */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                
                {/* Loops through the static dust array and dynamically matches the activeColor template */}
                <div className={`absolute inset-0 transition-colors duration-300 ${activeColor.text}`}>
                  {LOVE_DUST.map((item, idx) => {
                    if (item.type === 'heart') {
                      return (
                        <svg key={idx} viewBox="0 0 24 24" fill="currentColor" className="absolute -translate-x-1/2 -translate-y-1/2"
                          style={{ left: `${item.x}%`, top: `${item.y}%`, width: `${item.size}px`, height: `${item.size}px`, transform: `translate(-50%, -50%) rotate(${item.rot}deg)`, opacity: item.opacity }}
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      );
                    }
                    return (
                      <div key={idx} className="absolute rounded-full bg-current -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${item.x}%`, top: `${item.y}%`, width: `${item.size}px`, height: `${item.size}px`, opacity: item.opacity }}
                      />
                    );
                  })}
                </div>
              </div>
              {/* -------------------------------------- */}

              {/* Header */}
              <div className="text-center z-10 shrink-0 mt-2">
                <h1 className={`text-[32px] font-bold font-serif leading-none tracking-tight mb-1 ${activeColor.text}`}>Happy Birthday</h1>
                <p className={`font-medium text-sm opacity-80 ${activeColor.text}`}>{CONFIG.HER_NAME} ❤️</p>
              </div>

              {/* Photo Area */}
              <div className="flex-1 flex flex-col items-center justify-center z-10 w-full min-h-0">
                <div className={`${activeTheme.frameClass} w-[190px] flex flex-col shrink-0 shadow-lg`}>
                  <div 
                    className="w-full aspect-[4/5] bg-cover bg-center rounded bg-pink-200"
                    style={{ backgroundImage: `url(${uploadedImg || CONFIG.PHOTOS[0]?.url || ''})` }}
                  />
                  {activeTheme.id === 'classic' && (
                    <p className="text-center font-serif text-gray-700 italic mt-2 px-1 text-[10px] leading-tight line-clamp-1">
                      {"Birthday girl"}
                    </p>
                  )}
                </div>
              </div>

              {/* Dynamic Stack (Wishes & Coupons) */}
              <div className="shrink-0 flex flex-col gap-2.5 z-10 mb-2 px-2">
                
                {wishes.length > 0 && (
                  <div className="bg-white/70 backdrop-blur-md rounded-2xl p-2.5 border border-white/50 shadow-sm">
                    <p className={`text-[9px] font-bold uppercase tracking-widest mb-1.5 text-center ${activeColor.text}`}>Make a Wish ✨</p>
                    <div className="flex flex-col gap-1">
                      {wishes.map((wish, idx) => (
                        <p key={idx} className="text-[11px] font-serif text-gray-800 text-center italic leading-tight line-clamp-2">
                          "{wish}"
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {claimedCoupons.length > 0 && (
                  <div className="bg-white/70 backdrop-blur-md rounded-2xl p-2.5 border border-white/50 shadow-sm">
                    <p className={`text-[9px] font-bold uppercase tracking-widest mb-1.5 text-center ${activeColor.text}`}>Gifts Claimed</p>
                    <div className="flex flex-col gap-1.5">
                      {claimedCoupons.map(coupon => {
                        const Icon = coupon.icon;
                        return (
                          <div key={coupon.id} className="flex items-center gap-2 bg-white px-2 py-1.5 rounded-lg shadow-sm">
                            <div className="bg-pink-50 p-1 rounded-md text-pink-500 shrink-0">
                              <Icon className="w-3 h-3" />
                            </div>
                            <span className="font-bold text-gray-700 text-[10px] truncate leading-none pt-0.5">{coupon.title}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Stickers Overlays */}
              {stickers.map(sticker => (
                <div 
                  key={sticker.id}
                  className="absolute text-4xl drop-shadow-md pointer-events-none select-none z-20"
                  style={{
                    left: `${sticker.x}%`,
                    top: `${sticker.y}%`,
                    transform: `translate(-50%, -50%) rotate(${sticker.rot}deg)`
                  }}
                >
                  {sticker.emoji}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* TOOLS SIDEBAR */}
      {/* ========================================== */}
      <div className="flex-1 flex flex-col gap-5 w-full">
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Palette className="w-4 h-4"/> Background</h3>
          <div className="flex flex-wrap gap-2">
            {STORY_COLORS.map(color => (
              <button
                key={color.id}
                onClick={() => setActiveColor(color)}
                className={`w-10 h-10 rounded-full border-2 transition-transform ${color.class} ${activeColor.id === color.id ? 'border-pink-500 scale-110 shadow-sm' : 'border-transparent hover:scale-105'}`}
                title={color.name}
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
    </div>
  );
};