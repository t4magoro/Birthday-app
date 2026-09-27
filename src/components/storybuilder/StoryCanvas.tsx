import { CONFIG } from '../../config';
import React, { useState, useEffect, useLayoutEffect,useRef } from 'react';
import { StoryColor, StoryTheme, StickerData, LoveDustItem } from './types';
import { SHADOW, STICKER_DROP_SHADOW, MAX_STORY_WISHES, popShadow } from './constants';
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
  const ink = activeColor.ink;
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
    // 520 = the card's 640px minus the top padding and the HAPPY BIRTHDAY strip at the bottom
    const fit = () => setFitScale(Math.min(1, 520 / el.offsetHeight)); // offsetHeight ignores the scale itself
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

  // Candy-pop photo frame: outline + solid sticker shadow in this colour's ink
  const isPop = activeTheme.id === 'modern';
  const frameShadow = isPop ? popShadow(ink, 5, 2.5) : activeTheme.shadow;
  const frameTilt = activeTheme.id === 'classic' ? 'rotate(-3deg)' : isPop ? 'rotate(2deg)' : undefined;

  return (
    // On phones the preview is smaller (half the screen tall) and sticks to the top while she
    // scrolls through the tools, so every colour/sticker tap shows up straight away.
    <div className="sticky top-0 z-30 self-stretch -mx-5 py-2 flex justify-center shrink-0 bg-[#fff0f5]/90 backdrop-blur-md shadow-[0_12px_16px_-14px_rgb(107_29_69/0.45)] md:static md:mx-0 md:py-0 md:w-[380px] md:bg-transparent md:backdrop-blur-none md:shadow-none">
      <div className="w-fit md:w-full p-2 md:p-3 rounded-[2rem] border-[3px] border-dashed border-pink-300 bg-white/40 flex justify-center items-center">
        <div ref={containerRef} className="relative w-[28svh] md:w-full max-w-[360px] aspect-[9/16] rounded-2xl shadow-lg overflow-hidden">
          <div
            ref={storyRef}
            style={{
              width: '360px', height: '640px', transform: `scale(${scale})`, transformOrigin: 'top left',
              // dotted scrapbook paper, dots in this colour's ink
              backgroundImage: `radial-gradient(${ink}2e 1.2px, transparent 1.4px)`,
              backgroundSize: '16px 16px',
            }}
            className={`absolute top-0 left-0 flex flex-col justify-center items-center px-5 pt-10 pb-20 ${activeColor.class}`}
          >
            {/* Dynamic Background Dust: small hearts are hand-drawn outlines, big ones faint fills.
                Only position/size animate on Shuffle; colours switch instantly, so a quick
                Download never captures a half-faded colour. */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className={`absolute inset-0 ${activeColor.text}`}>
                {loveDust.map((item, idx) => {
                  if (item.type === 'heart') {
                    const doodle = item.size < 60;
                    return (
                      <svg key={idx} viewBox="0 0 24 24" className="absolute transition-[left,top,width,height,transform,opacity] duration-700 ease-in-out"
                        fill={doodle ? 'none' : 'currentColor'} stroke={doodle ? 'currentColor' : 'none'} strokeWidth={2} strokeLinejoin="round"
                        style={{ left: `${item.x}%`, top: `${item.y}%`, width: `${item.size}px`, height: `${item.size}px`, transform: `translate(-50%, -50%) rotate(${item.rot}deg)`, opacity: item.opacity }}
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    );
                  }
                  return (
                    <div key={idx} className="absolute rounded-full bg-current transition-[left,top,width,height,opacity] duration-700 ease-in-out"
                      style={{ left: `${item.x}%`, top: `${item.y}%`, width: `${item.size}px`, height: `${item.size}px`, transform: 'translate(-50%, -50%)', opacity: item.opacity }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Scrapbook corner decorations: postmark + stamp */}
            <div
              className="absolute top-4 left-4 w-[54px] h-[54px] rounded-full border-2 flex items-center justify-center text-center text-[8px] font-extrabold tracking-[0.14em] leading-tight"
              style={{ borderColor: `${ink}59`, color: `${ink}8c`, transform: 'rotate(-12deg)' }}
            >
              WITH<br />LOVE
            </div>
            <div className={`absolute top-4 right-4 ${activeColor.text}`} style={{ transform: 'rotate(6deg)' }}>
              <div className="w-[46px] h-[54px] bg-current border-[4px] border-dotted border-white outline-2 outline-current flex items-center justify-center text-center">
                <span className="font-hand font-bold text-white text-[15px] leading-none">for<br />you ♥</span>
              </div>
            </div>

             {/* Everything except the background & stickers, shrunk as a whole when it's taller than the card */}
            <div
              ref={contentRef}
              className="relative z-10 w-full shrink-0 flex flex-col items-center"
              style={fitScale < 1 ? { transform: `scale(${fitScale})` } : undefined}
            >

            {/* Header: handwritten, like the site.
                (Labels below use Nunito extra-bold, not Fredoka: Chrome's download spaced Fredoka's letters wrongly) */}
            <div className="text-center z-10 shrink-0 mb-4">
              <p className="font-hand font-bold text-[34px] leading-none" style={{ color: ink }}>Happy Birthday,</p>
              <p className={`font-hand font-bold text-[62px] leading-[0.95] ${activeColor.text}`}>{CONFIG.HER_NAME}!</p>
              <svg className={`mx-auto ${activeColor.text}`} width="120" height="11" viewBox="0 0 150 14" aria-hidden>
                <path d="M3 9 C 30 2, 50 13, 75 7 S 120 3, 147 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>

            {/* Photo Area */}
            <div className="relative z-10 w-[176px] shrink-0 mb-7" style={{ transform: frameTilt }}>
              <div className={`${activeTheme.frameClass} relative flex flex-col`} style={isPop ? { borderColor: ink } : undefined}>
                <SoftShadow layers={frameShadow} radius={activeTheme.radius} />
                {activeTheme.id === 'classic' && <span className="tape" style={{ width: 70, height: 20, top: -10 }} />}

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
                    className={`w-full aspect-[4/5] bg-pink-200 object-cover ${isPop ? 'rounded-xl' : 'rounded-sm'}`}
                  />
                ) : (
                  // same size & colour as the photo, shown for the moment before it's ready
                  <div className={`w-full aspect-[4/5] bg-pink-200 ${isPop ? 'rounded-xl' : 'rounded-sm'}`} />
                )}

                {activeTheme.id === 'classic' && (
                  <p className="absolute bottom-2 left-0 right-0 text-center font-hand text-[18px] leading-none text-gray-700">
                    a moment to remember ♡
                  </p>
                )}
              </div>

              {/* candy-pop sticker on the photo's corner */}
              <div
                className={`absolute -top-3 -right-10 bg-white font-extrabold text-[11px] leading-none px-2.5 py-1.5 rounded-full border-2 whitespace-nowrap ${cardText}`}
                style={{ borderColor: ink, transform: 'rotate(12deg)' }}
              >
                <SoftShadow layers={popShadow(ink, 2, 2)} radius={10} />
                it's your day!
              </div>
            </div>

            {/* Dynamic Stack (Wishes & Coupons) */}
            <div className="shrink-0 flex flex-col gap-4 z-10 w-full max-w-[290px]">
              {wishes.length > 0 && (
                // a paper note taped on (no backdrop-blur: it glitches Safari's export)
                <div className="relative bg-white rounded-sm px-4 pt-4 pb-3 w-full" style={{ transform: 'rotate(-1deg)' }}>
                  <SoftShadow layers={SHADOW.lg} radius={2} />
                  <span className="tape" style={{ width: 64, height: 18, top: -9 }} />
                  <p className={`font-extrabold text-[9px] uppercase tracking-[0.2em] mb-1 text-center ${cardText}`}>Your Birthday Wish ✨</p>
                  <div className="flex flex-col gap-0.5">
                    {shownWishes.map((wish, idx) => (
                      <p key={idx} className="text-[18px] font-hand text-gray-800 text-center leading-[1.1] line-clamp-2 [overflow-wrap:anywhere]">"{wish}"</p>
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
                // a candy-pop ticket: ink outline + solid sticker shadow
                <div className="relative bg-white rounded-2xl border-2 px-3 pt-2.5 pb-3 w-full" style={{ borderColor: ink, transform: 'rotate(1deg)' }}>
                  <SoftShadow layers={popShadow(ink, 4, 2)} radius={14} />
                  <p className={`font-extrabold text-[9px] uppercase tracking-[0.2em] mb-1.5 text-center ${cardText}`}>Claimed Coupons</p>
                  <div className="flex flex-col gap-1.5">
                    {claimedCoupons.map(coupon => {
                      const Icon = coupon.icon;
                      return (
                        <div key={coupon.id} className={`flex items-center gap-2 ${chipBg} pl-1.5 pr-2 py-1.5 rounded-lg border border-dashed`} style={{ borderColor: `${ink}4d` }}>
                          <div className="bg-pink-500 text-white p-1 rounded-full shrink-0">
                            <Icon className="w-3 h-3" />
                          </div>
                          {/* flex-1 + wrapping (not "…"): the download keeps each element's on-screen width,
                              and Chrome draws small text a little wider there than on screen */}
                          <span className="flex-1 font-extrabold text-[12px] leading-tight min-w-0 [overflow-wrap:anywhere]" style={{ color: ink }}>{coupon.title}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            </div>

            {/* Candy-pop "HAPPY BIRTHDAY" strip along the bottom, like the site's header */}
            <div
              className="absolute bottom-7 -left-5 -right-5 z-[5] py-1.5 overflow-hidden whitespace-nowrap text-center font-extrabold text-[13px] tracking-wide text-white"
              style={{ background: ink, transform: 'rotate(-3deg)' }}
            >
              {`HAPPY BIRTHDAY ${CONFIG.HER_NAME.toUpperCase()} ♥ `.repeat(4)}
            </div>

            {/* Stickers (z-20: on top of the wish/coupon cards, which used to hide some of them) */}
            {stickers.map(sticker => (
              <div
                key={sticker.id}
                className="absolute text-4xl drop-shadow-md pointer-events-none select-none z-20"
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
