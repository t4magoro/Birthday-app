import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, XCircle, Gift } from 'lucide-react';
import { CONFIG } from '../config';

// This interface allows the Quiz to send a signal back to App.tsx
interface QuizProps {
  onUnlock: () => void;
}

const TOTAL = CONFIG.QUIZ_QUESTIONS.length;

// A wrong answer shakes, gets crossed out, and she simply tries again on the same
// question, so she always reaches the prizes (no more "redo all 5 at the end").
export const Quiz = ({ onUnlock }: QuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [wrongPicks, setWrongPicks] = useState<number[]>([]); // wrong options tried on this question
  const [solved, setSolved] = useState(false);                // found the right option on this question
  const [mistakes, setMistakes] = useState(0);                // wrong tries over the whole quiz
  const [isFinished, setIsFinished] = useState(false);

  const question = CONFIG.QUIZ_QUESTIONS[currentQuestionIndex];
  const isLast = currentQuestionIndex === TOTAL - 1;

  const handleAnswerClick = (index: number) => {
    if (solved || wrongPicks.includes(index)) return;
    if (index === question.correctIndex) {
      setSolved(true);
    } else {
      setWrongPicks([...wrongPicks, index]);
      setMistakes(mistakes + 1);
    }
  };

  const handleNext = () => {
    if (isLast) {
      setIsFinished(true);
      window.dispatchEvent(new Event('confetti')); // ConfettiButton listens for this
      return;
    }
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setWrongPicks([]);
    setSolved(false);
  };

  const getOptionStyle = (index: number) => {
    if (solved && index === question.correctIndex) return 'btn-pop bg-pink-500 text-white';
    if (wrongPicks.includes(index)) return 'animate-shake border-2 border-rose-200 bg-rose-50 text-rose-400 line-through';
    if (solved) return 'border-2 border-ink/20 bg-white text-ink/40';
    return 'border-2 border-ink bg-white text-ink hover:bg-pink-50 active:bg-pink-100';
  };

  return (
    <section className="reveal max-w-xl mx-auto px-6 py-16">
      <div className="relative bg-white p-6 pt-10 md:p-10 shadow-xl rotate-[0.5deg]">
        <span className="tape" />

        <div className="text-center mb-8">
          <h2 className="font-hand text-5xl text-ink squiggle inline-block px-2 mb-3">
            Quiz Ultahnya {CONFIG.HER_NAME} 🧩
          </h2>
          {!isFinished && (
            // progress dots: filled for answered questions, wide pill for the current one
            <div className="flex justify-center gap-2" aria-label={`Question ${currentQuestionIndex + 1} of ${TOTAL}`}>
              {CONFIG.QUIZ_QUESTIONS.map((_, i) => (
                <span
                  key={i}
                  className={`h-2.5 rounded-full border-2 border-ink transition-all duration-300 ${
                    i === currentQuestionIndex ? 'w-8 bg-pink-400' : i < currentQuestionIndex ? 'w-2.5 bg-pink-500' : 'w-2.5 bg-white'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {!isFinished ? (
          <div className="flex flex-col gap-4">
            <h3 key={currentQuestionIndex} className="animate-rise font-pop font-semibold text-xl text-ink text-center mb-2">
              {question.question}
            </h3>

            <div className="flex flex-col gap-3">
              {question.options.map((opt, idx) => (
                <button
                  key={`${currentQuestionIndex}-${idx}`}
                  onClick={() => handleAnswerClick(idx)}
                  className={`w-full px-4 py-3.5 rounded-2xl font-pop font-medium text-left flex items-center justify-between transition-colors duration-200 ${getOptionStyle(idx)}`}
                >
                  <span>{opt}</span>
                  {solved && idx === question.correctIndex && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                  {wrongPicks.includes(idx) && <XCircle className="w-5 h-5 shrink-0" />}
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 min-h-12">
              <p className="font-hand text-2xl leading-none text-pink-500">
                {solved ? 'Yeay bener! ✓' : wrongPicks.length > 0 ? 'Salah 😝 coba lagi!' : ''}
              </p>
              {solved && (
                <button
                  onClick={handleNext}
                  className="btn-pop animate-in zoom-in flex items-center gap-2 bg-pink-500 text-white px-5 py-3 rounded-full font-pop font-semibold shrink-0"
                >
                  {isLast ? 'See Results' : 'Next'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* RESULTS SCREEN: she always gets here, the number of wrong tries just changes the message */
          <div className="text-center animate-in fade-in zoom-in">
            <div className="text-6xl mb-4">{mistakes === 0 ? '🏆' : '🎉'}</div>
            <h3 className="font-pop font-semibold text-2xl text-ink mb-2">
              {mistakes === 0 ? 'Perfect Score!' : 'Akhirnya bener semua!'}
            </h3>
            <p className="font-hand text-2xl text-ink/80 mb-8">
              {mistakes === 0
                ? 'WIhhhh mantapp mangga di pilih kupon hadiahnya wkwkkw 🎁'
                : `Salah ${mistakes}x sih, tapi gapapa 😹 mangga di pilih kupon hadiahnya 🎁`}
            </p>
            <button
              onClick={onUnlock}
              className="btn-pop inline-flex items-center gap-2 bg-pink-500 text-white px-8 py-4 rounded-full font-pop font-semibold text-lg"
            >
              <Gift className="w-6 h-6" /> Reveal My Prizes!
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
