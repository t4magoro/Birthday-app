import React, { useState, useRef, useLayoutEffect } from 'react';
import { toJpeg } from 'html-to-image';
import { CONFIG } from '../../config';
import { STORY_COLORS, THEMES } from './constants';
import { StickerData, LoveDustItem } from './types';
import { StoryCanvas } from './StoryCanvas';
import { DesignTools } from './DesignTools';

interface StoryBuilderProps {
  redeemedIds: number[];
  wishes: string[];
}

// 🔥 NEW: Algorithm to generate perfectly balanced left/right randomized dust
const generateBalancedDust = (): LoveDustItem[] => {
  const newDust: LoveDustItem[] = [];
  
  // Helper to spawn dust within a specific X range (creates boundaries)
  const spawnZone = (minX: number, maxX: number) => {
    // 2 Giant Hearts per side
    for(let i=0; i<2; i++) newDust.push({ x: minX + Math.random() * (maxX - minX), y: Math.random() * 100, size: 100 + Math.random() * 80, rot: -30 + Math.random() * 60, type: 'heart', opacity: 0.4 + Math.random() * 0.02 });
    // 3 Medium Hearts per side
    for(let i=0; i<3; i++) newDust.push({ x: minX + Math.random() * (maxX - minX), y: Math.random() * 100, size: 15 + Math.random() * 15, rot: -30 + Math.random() * 60, type: 'heart', opacity: 0.2 + Math.random() * 0.1 });
    // 4 Tiny Dots per side
    for(let i=0; i<4; i++) newDust.push({ x: minX + Math.random() * (maxX - minX), y: Math.random() * 100, size: 3 + Math.random() * 4, rot: 0, type: 'dot', opacity: 0.5 + Math.random() * 0.15 });
  };

  // Spawn Left Side (X: 5% to 45%)
  spawnZone(5, 45);
  // Spawn Right Side (X: 55% to 95%)
  spawnZone(55, 95);
  
  // 1 Massive Center Heart to tie it together
  newDust.push({ x: 50, y: 50, size: 220 + Math.random() * 40, rot: -10 + Math.random() * 20, type: 'heart', opacity: 0.02 });

  return newDust;
};

// 🔥 SAFARI FIX: waits until an <img> element has a fully decoded bitmap.
// iOS Safari will often mark an image "loaded" before it's actually usable
// by canvas-based export tools like html-to-image — exporting before decode
// finishes is what produced a blank photo on the first Safari download.
const waitForImageReady = (img: HTMLImageElement): Promise<void> => {
  if (img.complete && img.naturalWidth > 0) {
    return img.decode().catch(() => undefined);
  }
  return new Promise<void>((resolve) => {
    const finish = () => resolve();
    img.addEventListener('load', () => img.decode().then(finish, finish), { once: true });
    img.addEventListener('error', finish, { once: true });
    // Safety net so one stuck image can never block the export forever.
    setTimeout(finish, 4000);
  });
};

export const StoryBuilder = ({ redeemedIds, wishes }: StoryBuilderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  
  const [scale, setScale] = useState(1);
  const [activeColor, setActiveColor] = useState(STORY_COLORS[0]);
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);
  const [uploadedImg, setUploadedImg] = useState<string | null>(null);
  const [stickers, setStickers] = useState<StickerData[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  
  // 🔥 NEW: State to hold the current dust pattern
  const [loveDust, setLoveDust] = useState<LoveDustItem[]>([]);
  
  const claimedCoupons = CONFIG.INITIAL_COUPONS.filter(c => redeemedIds.includes(c.id));

  useLayoutEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setScale(rect.width / 360);
      }
    };
    updateScale();
    
    // Generate initial dust pattern on first load
    setLoveDust(generateBalancedDust());
    
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
   const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // 🔥 FIX FOR iOS: Shrink massive iPhone photos so Safari doesn't crash!
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 1080; // Safe limit for High-Res IG Story quality
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while keeping aspect ratio
        if (width > height && width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Save as an optimized JPEG base64 string (much smaller memory footprint)
        setUploadedImg(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const addSticker = (emoji: string) => {
    /// 🔥 FIXED: Reordered the zones to alternate opposites (Top-Left, Bottom-Right, Top-Right...)
    const safeZones = [
      { minX: 5, maxX: 20, minY: 8, maxY: 25 },   // 1. Top Left
      { minX: 80, maxX: 95, minY: 75, maxY: 92 }, // 2. Bottom Right
      { minX: 80, maxX: 95, minY: 8, maxY: 25 },  // 3. Top Right
      { minX: 5, maxX: 20, minY: 75, maxY: 92 },  // 4. Bottom Left
      { minX: 3, maxX: 15, minY: 40, maxY: 60 },  // 5. Middle Left
      { minX: 85, maxX: 97, minY: 40, maxY: 60 }, // 6. Middle Right
    ];

    setStickers(prev => {
      // Determines the next zone sequentially based on how many stickers already exist
      const zoneIndex = prev.length % safeZones.length;
      const zone = safeZones[zoneIndex];

      return [...prev, {
        id: Date.now(),
        emoji,
        // Keeps the exact position within that specific zone slightly organic/random
        x: zone.minX + Math.random() * (zone.maxX - zone.minX), 
        y: zone.minY + Math.random() * (zone.maxY - zone.minY), 
        rot: Math.random() * 40 - 20 
      }];
    });
  };

  const clearStickers = () => setStickers([]);
  
  // Triggered by the new button to reroll the background
  const shuffleDust = () => setLoveDust(generateBalancedDust());

  const exportStory = async () => {
    if (!storyRef.current || isExporting) return;
    const node = storyRef.current;
    setIsExporting(true);
    
    try {
      // 0. WAIT FOR THE CARD TO ACTUALLY BE READY
      // Make sure the photo (and any other <img>s) has fully decoded, and
      // that web fonts are loaded, before we try to snapshot anything. This
      // is what let Safari export a half-loaded photo (or fall back to
      // default font metrics) if Download was pressed too soon.
      const imgs = Array.from(node.querySelectorAll('img'));
      await Promise.all([
        Promise.all(imgs.map(waitForImageReady)),
        document.fonts?.ready ?? Promise.resolve(),
      ]);

      // 1. THE INVISIBLE FIRST CLICK
      // We force Safari to render a tiny, low-quality version in the background. 
      // We don't save this one; we just use it to force Safari to load the photo into memory.
      await toJpeg(node, {
        quality: 0.1,
        pixelRatio: 0.1,
        width: 360,
        height: 640,
        style: { transform: 'scale(1)', transformOrigin: 'top left' }
      });

      // 🔥 SAFARI FIX: give WebKit real wall-clock time to finish rasterizing
      // that first pass. This is a documented WebKit/html-to-image bug
      // (bugs.webkit.org/show_bug.cgi?id=219770) — without an actual pause
      // here, the two passes fire back-to-back and Safari hasn't caught up,
      // which is exactly why a *second full click* of Download used to be
      // needed to make the photo appear.
      await new Promise((resolve) => setTimeout(resolve, 400));

      // 2. THE REAL EXPORT (The "Second" Click)
      // Now that Safari's cache is primed, we take the real, high-res shot.
      const dataUrl = await toJpeg(node, {
        quality: 0.95,
        pixelRatio: 3, // High resolution for IG Story
        width: 360,
        height: 640,
        style: { transform: 'scale(1)', transformOrigin: 'top left' }
      });
      
      // 3. Download the perfect image
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Birthday_Story_${CONFIG.HER_NAME || 'Design'}.jpg`;
      link.click();
      
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl mx-auto items-center md:items-stretch px-5 md:px-8 pb-12">
      <StoryCanvas 
        containerRef={containerRef}
        storyRef={storyRef}
        scale={scale}
        activeColor={activeColor}
        activeTheme={activeTheme}
        uploadedImg={uploadedImg}
        stickers={stickers}
        wishes={wishes}
        claimedCoupons={claimedCoupons}
        loveDust={loveDust} // Pass state to canvas
      />
      <DesignTools 
        activeColor={activeColor}
        setActiveColor={setActiveColor}
        activeTheme={activeTheme}
        setActiveTheme={setActiveTheme}
        uploadedImg={uploadedImg}
        handleImageUpload={handleImageUpload}
        stickers={stickers}
        addSticker={addSticker}
        clearStickers={clearStickers}
        exportStory={exportStory}
        isExporting={isExporting}
        shuffleDust={shuffleDust} // Pass function to tools
      />
    </div>
  );
};