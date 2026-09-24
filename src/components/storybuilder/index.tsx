import React, { useState, useRef, useEffect } from 'react';
import { toJpeg } from 'html-to-image';
import { CONFIG } from '../../config';
import { STORY_COLORS, THEMES } from './constants';
import { StickerData } from './types';
import { StoryCanvas } from './StoryCanvas';
import { DesignTools } from './DesignTools';

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
  const [stickers, setStickers] = useState<StickerData[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  
  const claimedCoupons = CONFIG.INITIAL_COUPONS.filter(c => redeemedIds.includes(c.id));

  // Handles dynamic resizing of the preview canvas
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
      setUploadedImg(URL.createObjectURL(file));
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
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl mx-auto items-center md:items-start">
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
      />
    </div>
  );
};