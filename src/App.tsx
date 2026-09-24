import React, { useState } from 'react';
import { Printer } from 'lucide-react';
import { FallingHeartsStyle } from './styles/FallingHeartsStyle';
import { Hero } from './components/Hero';
import { Message } from './components/Message';
import { PhotoFrame } from './components/PhotoFrame';
import { Quiz } from './components/Quiz';
import { LoveCoupons } from './components/LoveCoupons';
import { Wishes } from './components/Wishes';
import { KeepsakePDF } from './components/KeepsakePDF';
import { BackgroundHeart } from './components/BackgroundHeart';
import { BackgroundDust } from './components/BackgroundDust';
import { ConfettiButton } from './components/ConfettiButton';

export default function App() {
  const [prizesUnlocked, setPrizesUnlocked] = useState(false);
  
  // Centralized State
  const [wishes, setWishes] = useState<string[]>([]);
  const [redeemedIds, setRedeemedIds] = useState<number[]>([]);

  const handleUnlockPrizes = () => {
    setPrizesUnlocked(true);
    setTimeout(() => {
      document.getElementById('coupons-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Check if she has interacted enough to generate a certificate
  const showPrintButton = wishes.length > 0 || redeemedIds.length > 0;

  return (
    <>
      {/* ========================================================================= */}
      {/* WEB VIEW (Hidden during PDF generation) */}
      {/* ========================================================================= */}
      {/* relative z-0 is kept so the background stays safely behind the content */}
      <div className="print:hidden min-h-screen bg-[#FFF0F5] font-sans overflow-x-hidden selection:bg-pink-200 text-gray-800 relative z-0">
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
        
        {/* Floating Action Button for PDF */}
        {showPrintButton && (
          <button 
            onClick={() => window.print()} 
            className="fixed bottom-6 right-6 bg-pink-500 text-white px-6 py-4 rounded-full shadow-2xl hover:bg-pink-600 hover:scale-105 transition-all z-50 flex items-center gap-2 font-bold font-serif active:scale-95 border-2 border-pink-400"
          >
            <Printer className="w-5 h-5" /> Save Keepsake PDF
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* PDF VIEW (Invisible until you click the print button) */}
      {/* ========================================================================= */}
      <div className="hidden print:block">
        <KeepsakePDF wishes={wishes} redeemedIds={redeemedIds} />
      </div>
    </>
  );
}