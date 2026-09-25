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
    if (file) {
      // 🔥 FIX FOR iOS: Convert the image to a Base64 string instead of a Blob URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
    setIsExporting(true);
    try {
      const dataUrl = await toJpeg(storyRef.current, {
        quality: 0.95,
        pixelRatio: 3, 
        width: 360,
        height: 640,
        style: { transform: 'scale(1)', transformOrigin: 'top left' }
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