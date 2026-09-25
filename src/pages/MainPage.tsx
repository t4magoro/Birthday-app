import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Hero } from '../components/Hero';
import { Message } from '../components/Message';
import { PhotoFrame } from '../components/PhotoFrame';
import { Quiz } from '../components/Quiz';
import { LoveCoupons } from '../components/LoveCoupons';
import { Wishes } from '../components/Wishes';
import { BackgroundHeart } from '../components/BackgroundHeart';
import { BackgroundDust } from '../components/BackgroundDust';
import { ConfettiButton } from '../components/ConfettiButton';
import { FallingHeartsStyle } from '../styles/FallingHeartsStyle';

interface MainPageProps {
  wishes: string[];
  setWishes: React.Dispatch<React.SetStateAction<string[]>>;
  redeemedIds: number[];
  setRedeemedIds: React.Dispatch<React.SetStateAction<number[]>>;
  onDesignClick: () => void;
}

export const MainPage = ({ wishes, setWishes, redeemedIds, setRedeemedIds, onDesignClick }: MainPageProps) => {
  const [prizesUnlocked, setPrizesUnlocked] = useState(false);

  const handleUnlockPrizes = () => {
    setPrizesUnlocked(true);
    setTimeout(() => {
      document.getElementById('coupons-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div>
      <FallingHeartsStyle />
      <BackgroundDust />
      <BackgroundHeart />
      
      <Hero />
      <Message />
      <PhotoFrame />
      
      {!prizesUnlocked && (
        <Quiz onUnlock={handleUnlockPrizes} />
      )}

      {prizesUnlocked && (
        <div id="coupons-section" className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <LoveCoupons redeemedIds={redeemedIds} setRedeemedIds={setRedeemedIds} />
        </div>
      )}
      
      <Wishes wishes={wishes} setWishes={setWishes} />
      
      <footer className="text-center py-12 mt-8 text-pink-400 font-medium">
        <p>Made with ❤️ just for you.</p>
        <p className="text-sm mt-2 opacity-75">Happy Birthday!</p>
      </footer>

      <ConfettiButton /> 
      
      {/* Floating Action Button */}
      {redeemedIds.length >= 1 && (
        <button 
          onClick={onDesignClick}
          className="fixed bottom-6 right-6 bg-pink-500 text-white px-6 py-4 rounded-full shadow-2xl hover:bg-pink-600 hover:scale-105 transition-all z-50 flex items-center gap-2 font-bold font-serif active:scale-95 border-2 border-pink-400 animate-pop-in"
        >
          <Sparkles className="w-5 h-5 animate-pulse" /> Design Birthday Story
        </button>
      )}
    </div>
  );
};