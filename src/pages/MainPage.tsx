import React from 'react';
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
import { CONFIG } from '../config';

interface MainPageProps {
  wishes: string[];
  setWishes: React.Dispatch<React.SetStateAction<string[]>>;
  redeemedIds: number[];
  setRedeemedIds: React.Dispatch<React.SetStateAction<number[]>>;
  prizesUnlocked: boolean;
  setPrizesUnlocked: React.Dispatch<React.SetStateAction<boolean>>;
  giftOpened: boolean;
  onDesignClick: () => void;
}

export const MainPage = ({ wishes, setWishes, redeemedIds, setRedeemedIds, prizesUnlocked, setPrizesUnlocked, giftOpened, onDesignClick }: MainPageProps) => {

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

      <Hero revealed={giftOpened} />
      <Message />
      <PhotoFrame />

      {!prizesUnlocked && (
        <Quiz onUnlock={handleUnlockPrizes} />
      )}

      {prizesUnlocked && (
        <div id="coupons-section" className="scroll-mt-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <LoveCoupons redeemedIds={redeemedIds} setRedeemedIds={setRedeemedIds} />
        </div>
      )}

      <Wishes wishes={wishes} setWishes={setWishes} />

      {/* pb-32 keeps the text clear of the floating buttons */}
      <footer className="text-center pt-12 pb-32 mt-8 text-pink-500">
        <p className="font-hand text-3xl">Made with ❤️ just for you</p>
        <p className="text-sm mt-1 font-bold text-pink-400">Happy Birthday, {CONFIG.HER_NAME}!</p>
      </footer>

      <ConfettiButton />

      {/* Floating Action Button. The pop-in animation sits on the wrapper so it
          doesn't fight with the button's own press animation. */}
      {redeemedIds.length >= 1 && (
        <div className="fixed bottom-5 right-4 z-50 animate-pop-in">
          <button
            onClick={onDesignClick}
            className="btn-pop bg-pink-500 text-white px-5 py-3 rounded-full flex items-center gap-2 font-pop font-semibold text-lg"
          >
            <Sparkles className="w-5 h-5 animate-pulse" />
            {/* shorter label on small phones so it never runs into the 🎉 button */}
            <span className="sm:hidden">Design Story</span>
            <span className="hidden sm:inline">Design Birthday Story</span>
          </button>
        </div>
      )}
    </div>
  );
};
