import { CONFIG } from '../../config';
import React, { useState, useEffect, useLayoutEffect,useRef } from 'react';
import { StoryColor, StoryTheme, StickerData, LoveDustItem } from './types';
import { SHADOW, STICKER_DROP_SHADOW, MAX_STORY_WISHES } from './constants'; // add this import
import { Emoji } from './Emoji';
import { SoftShadow } from './SoftShadow';


interface StoryCanvasProps {
  containerRef: React.Ref<HTMLDivElement>;
  storyRef: React.Ref<HTMLDivElement>;
  scale: number;
  activeColor: StoryColor;
  activeTheme: StoryTheme;
  uploadedImg: string | null;
  stickers: StickerData[];
  wishes: string[];
  claimedCoupons: typeof CONFIG.INITIAL_COUPONS;
  loveDust: LoveDustItem[];
}

export const StoryCanvas = ({
  containerRef, storyRef, scale, activeColor, activeTheme, 
  uploadedImg, stickers, wishes, claimedCoupons, loveDust
}: StoryCanvasProps) => {

  const cardText = activeColor.cardText ?? activeColor.text;
  const chipBg = activeColor.chip ?? activeColor.class;
  const shownWishes = wishes.slice(0, MAX_STORY_WISHES);
  const hiddenWishes = wishes.length - shownWishes.length;
  // 🔥 iOS FIX 1: Store the perfectly cropped image as a pure Base64 text string
  const [processedBase64, setProcessedBase64] = useState<string>('');
  const currentImg = uploadedImg || CONFIG.PHOTOS[0]?.url || '';

  const contentRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);
  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const fit = () => setFitScale(Math.min(1, 600 / el.offsetHeight)); // offsetHeight ignores the scale itself
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!currentImg) return;
    
    const img = new Image();
    // Only use crossOrigin for external web links, not local uploads
    if (!currentImg.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }
    
    img.onload = () => {
      // Create an INVISIBLE canvas just to do the math and cropping
      const canvas = document.createElement('canvas');
      // 🔥 SAFARI FIX: 700x875 (still comfortably more than the ~570px this
      // photo ever needs at full export resolution) instead of 800x1000.
      // Safari's SVG/foreignObject export step is known to silently drop
      // very large embedded data-URI images (bugs.webkit.org/show_bug.cgi?id=219770);
      // a smaller payload makes that far less likely without any visible
      // quality loss in the final download.
      canvas.width = 700;
      canvas.height = 875;
      const ctx = canvas.getContext('2d');
      
      const coverScale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const drawWidth = img.width * coverScale;
      const drawHeight = img.height * coverScale;
      const offsetX = (canvas.width - drawWidth) / 2;
      const offsetY = (canvas.height - drawHeight) / 2;
      
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      ctx?.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      
      // Convert the perfectly cropped image into a raw string that Safari cannot block!
      setProcessedBase64(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.onerror = () => {
      console.error('StoryCanvas: failed to load source image for processing', currentImg.slice(0, 40));
    };
    img.src = currentImg;
  }, [currentImg]);

  return (
    <div className="w-full flex justify-center shrink-0 md:w-[380px] z-10">
      <div className="w-full p-2 md:p-3 rounded-[2rem] border-[3px] border-dashed border-gray-300 bg-white/40 flex justify-center items-center">
        <div ref={containerRef} className="relative w-full max-w-[360px] aspect-[9/16] rounded-2xl shadow-lg overflow-hidden">
          <div 
            ref={storyRef}
            style={{ width: '360px', height: '640px', transform: `scale(${scale})`, transformOrigin: 'top left' }}
            className={`absolute top-0 left-0 flex flex-col justify-center items-center p-5 transition-colors duration-300 ${activeColor.class}`}
          >
            {/* Dynamic Background Dust */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
              <div className={`absolute inset-0 transition-colors duration-300 ${activeColor.text}`}>
                {loveDust.map((item, idx) => {
                  if (item.type === 'heart') {
                    return (
                      <svg key={idx} viewBox="0 0 24 24" fill="currentColor" className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out"
                        style={{ left: `${item.x}%`, top: `${item.y}%`, width: `${item.size}px`, height: `${item.size}px`, transform: `translate(-50%, -50%) rotate(${item.rot}deg)`, opacity: item.opacity }}
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    );
                  }
                  return (
                    <div key={idx} className="absolute rounded-full bg-current -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out"
                      style={{ left: `${item.x}%`, top: `${item.y}%`, width: `${item.size}px`, height: `${item.size}px`, opacity: item.opacity }}
                    />
                  );
                })}
              </div>
            </div>
             {/* Everything except the background & stickers, shrunk as a whole when it's taller than the card */}
            <div
              ref={contentRef}
              className="relative z-10 w-full shrink-0 flex flex-col items-center"
              style={fitScale < 1 ? { transform: `scale(${fitScale})` } : undefined}
            >
            
            {/* Header */}
            <div className="text-center z-10 shrink-0 mb-5">
              <h1 className={`text-[32px] font-bold font-serif leading-none tracking-tight mb-1 ${activeColor.text}`}>Happy Birthday</h1>
              <p className={`font-medium text-sm opacity-80 ${activeColor.text}`}>{CONFIG.HER_NAME} <Emoji emoji="❤️" className="inline-block align-[-2px] w-4 h-4"/></p>
            </div>

            {/* Photo Area */}
            <div className="flex flex-col items-center justify-center z-10 w-full shrink-0 mb-5">
              <div className={`p-1.5 rounded-3xl border-2 border-dashed border-current ${activeColor.text} transition-colors duration-300`}>
                <div className={`${activeTheme.frameClass} relative w-[190px] flex flex-col shrink-0`}>
                  <SoftShadow layers={activeTheme.shadow} radius={activeTheme.radius} />

                  {/* 🔥 Reverted to standard <img> tag, but feeding it the safe Base64 string */}
                  {/* width/height + decoding="sync" help Safari's SVG-based export
                      lay this out and rasterize it correctly; object-cover is a
                      safety net in case the source isn't an exact 4:5 crop. */}
                {processedBase64 ? (
                  <img 
                    src={processedBase64}
                    alt="Memory"
                    width={700}
                    height={875}
                    decoding="sync"
                    className="w-full aspect-[4/5] rounded bg-pink-200 object-cover"
                  />
                  ) : (
                    // same size & colour as the photo, shown for the moment before it's ready
                    <div className="w-full aspect-[4/5] rounded bg-pink-200" />
                  )}

                  {activeTheme.id === 'classic' && (
                    <p className="text-center font-serif text-gray-700 italic mt-2 px-1 text-[10px] leading-tight line-clamp-1">
                      {"A moment to remember"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Dynamic Stack (Wishes & Coupons) */}
            <div className="shrink-0 flex flex-col gap-3 z-10 w-full max-w-[300px]">
              {wishes.length > 0 && (
                // 🔥 iOS FIX 2: Replaced backdrop-blur-md with bg-white/95 to prevent Safari shadow glitches
                <div className="relative bg-white/95 rounded-2xl p-3 border border-white/50 w-full">
                  <SoftShadow layers={SHADOW.sm} radius={16} />
                  <p className={`text-[9px] font-bold uppercase tracking-widest mb-1.5 text-center ${activeColor.text}`}>Your Birthday Wish ✨</p>
                  <div className="flex flex-col gap-1">
                    {shownWishes.map((wish, idx) => (
                      <p key={idx} className="text-[11px] font-serif text-gray-800 text-center italic leading-tight line-clamp-2 [overflow-wrap:anywhere]">"{wish}"</p>
                    ))}
                  </div>
                  {hiddenWishes > 0 && (
                    <p className="text-[9px] font-medium text-gray-500 text-center mt-1">
                      +{hiddenWishes} more {hiddenWishes === 1 ? 'wish' : 'wishes'}
                    </p>
                  )}
                </div>
              )}

              {claimedCoupons.length > 0 && (
                // 🔥 iOS FIX 2: Replaced backdrop-blur-md with bg-white/95 to prevent Safari shadow glitches
                <div className="relative bg-white/95 rounded-2xl p-3 border border-white/50 w-full">
                  <SoftShadow layers={SHADOW.sm} radius={16} />
                  <p className={`text-[9px] font-bold uppercase tracking-widest mb-1.5 text-center ${activeColor.text}`}>CLAIMED COUPONS</p>
                  <div className="flex flex-col gap-1.5">
                    {claimedCoupons.map(coupon => {
                      const Icon = coupon.icon;
                      return (
                        <div key={coupon.id} className={`relative flex items-center gap-2 ${activeColor.class} px-2 py-1.5 rounded-lg`}>
                          <SoftShadow layers={SHADOW.sm} radius={8} />
                          <div className="bg-pink-50 p-1 rounded-md text-pink-500 shrink-0">
                            <Icon className="w-3 h-3" />
                          </div>
                          <span className={`font-bold ${activeColor.text} text-[10px] truncate leading-none pt-0.5`}>{coupon.title}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            </div>

            {/* Stickers */}
            {stickers.map(sticker => (
              <div 
                key={sticker.id}
                className="absolute text-4xl drop-shadow-md pointer-events-none select-none z-[5]"
                style={{ 
                  left: `${sticker.x}%`, 
                  top: `${sticker.y}%`, 
                  transform: `translate(-50%, -50%) rotate(${sticker.rot}deg)`,
                  filter: STICKER_DROP_SHADOW,
                }}
              >
                <Emoji emoji={sticker.emoji} className="inline-block w-9 h-9" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};