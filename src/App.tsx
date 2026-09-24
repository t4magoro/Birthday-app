import React, { useState } from 'react';
import { Sparkles,Printer,X } from 'lucide-react';
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
import { StoryBuilder } from './components/StoryBuilder';

export default function App() {
  const [prizesUnlocked, setPrizesUnlocked] = useState(false);
  
  // Centralized State
  const [wishes, setWishes] = useState<string[]>([]);
  const [redeemedIds, setRedeemedIds] = useState<number[]>([]);
  const [showStoryModal, setShowStoryModal] = useState(false);

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
        
        {/* Floating Action Button (Exact placement of the old PDF button) */}
      <button 
        onClick={() => setShowStoryModal(true)}
        className="fixed bottom-6 right-6 bg-pink-500 text-white px-6 py-4 rounded-full shadow-2xl hover:bg-pink-600 hover:scale-105 transition-all z-50 flex items-center gap-2 font-bold font-serif active:scale-95 border-2 border-pink-400"
      >
      <Sparkles className="w-5 h-5 animate-pulse" /> Design IG Story
      </button>

      {/* Popup Modal Overlay */}
      {showStoryModal && (
        // 1. Removed backdrop-blur-md and removed the conflicting overflow-y-auto
        // Changed to a solid bg-black/80 to keep the focus on the modal without frying the GPU
        <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-300">
          
          {/* 2. Added flex-col and max-h-[95vh] so the modal itself acts as a rigid boundary */}
          <div className="relative bg-[#FFF0F5] w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden border-2 border-pink-200 animate-in zoom-in-95 duration-300">
            
            {/* Close Button (Now has a solid background so it doesn't glitch over scrolled content) */}
            <div className="absolute top-4 right-4 z-50">
              <button 
                onClick={() => setShowStoryModal(false)}
                className="bg-white text-gray-600 hover:text-pink-500 p-3 rounded-full shadow-lg transition-all flex items-center justify-center cursor-pointer border border-pink-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 3. The true scroll container! 
                Added overscroll-contain (stops background from scrolling) 
                Added WebkitOverflowScrolling for buttery-smooth mobile momentum scrolling */}
            <div 
              className="overflow-y-auto p-4 md:p-8 overscroll-contain"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <StoryBuilder 
                redeemedIds={redeemedIds} 
                wishes={wishes} 
              />
            </div>

          </div>
        </div>
      )}

      </div>
    </>
  );
}