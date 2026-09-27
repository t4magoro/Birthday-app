import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { MainPage } from './pages/MainPage';
import { StoryBuilder } from './components/storybuilder';
import { BackgroundDust} from './components/BackgroundDust';
import { BackgroundHeart } from './components/BackgroundHeart';
import {MusicButton} from './components/MusicButton'
import { GiftIntro } from './components/GiftIntro';



export default function App() {
  // --- SHARED GLOBAL DATA ---
  const [wishes, setWishes] = useState<string[]>([]);
  const [redeemedIds, setRedeemedIds] = useState<number[]>([]);
  const [prizesUnlocked, setPrizesUnlocked] = useState(false);
  // false until she taps "open" on the gift screen (kept here so it only shows once per visit)
  const [giftOpened, setGiftOpened] = useState(false);

  // --- ROUTING & ANIMATION STATES ---
  const [activeView, setActiveView] = useState<'main' | 'builder'>('main');
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  const handleViewSwitch = (targetView: 'main' | 'builder') => {
    setFadeState('out');

    setTimeout(() => {
      window.scrollTo(0, 0);
      setActiveView(targetView);
      setFadeState('in');
    }, 300);
  };

  return (
    // overflow-x-clip (not overflow-x-hidden): "hidden" silently breaks `sticky`, which the story preview needs
    <div className="print:hidden min-h-screen font-sans overflow-x-clip selection:bg-pink-200 text-gray-800 relative z-0">
      {!giftOpened && <GiftIntro onOpen={() => setGiftOpened(true)} />}

      <div className={`transition-opacity duration-300 ease-in-out ${fadeState === 'out' ? 'opacity-0' : 'opacity-100'}`}>

        {activeView === 'main' ? (
          // ==========================================
          // VIEW 1: THE MAIN EXPERIENCE
          // ==========================================
          <MainPage
            wishes={wishes}
            setWishes={setWishes}
            redeemedIds={redeemedIds}
            setRedeemedIds={setRedeemedIds}
            prizesUnlocked={prizesUnlocked}
            setPrizesUnlocked={setPrizesUnlocked}
            giftOpened={giftOpened}
            onDesignClick={() => handleViewSwitch('builder')}
          />
        ) : (
          // ==========================================
          // VIEW 2: THE STORY BUILDER
          // ==========================================
          <div className="py-6 md:py-12">

            {/* Navigation Bar */}
            <div className="max-w-5xl mx-auto px-5 md:px-8 mb-6 relative z-20">
              <button
                onClick={() => handleViewSwitch('main')}
                className="btn-pop flex items-center gap-2 bg-white text-ink font-pop font-semibold px-5 py-2.5 rounded-full w-fit"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Main Page
              </button>
            </div>

            <BackgroundDust/>
            <BackgroundHeart/>

            <StoryBuilder
              redeemedIds={redeemedIds}
              wishes={wishes}
            />
          </div>
        )}

      </div>
      <MusicButton aboveConfetti={activeView === 'main'} />
    </div>
  );
}
