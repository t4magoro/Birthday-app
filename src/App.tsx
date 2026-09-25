import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { MainPage } from './pages/MainPage';
import { StoryBuilder } from './components/storybuilder';
import { BackgroundDust} from './components/BackgroundDust';
import { BackgroundHeart } from './components/BackgroundHeart';


export default function App() {
  // --- SHARED GLOBAL DATA ---
  const [wishes, setWishes] = useState<string[]>([]);
  const [redeemedIds, setRedeemedIds] = useState<number[]>([]);
  const [prizesUnlocked, setPrizesUnlocked] = useState(false);

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
    <div className="print:hidden min-h-screen bg-[#FFF0F5] font-sans overflow-x-hidden selection:bg-pink-200 text-gray-800 relative z-0">
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
                className="flex items-center gap-2 text-pink-500 font-bold hover:text-pink-600 transition-colors bg-white/60 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-sm w-fit border border-white/50 active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Main Pages
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
    </div>
  );
}