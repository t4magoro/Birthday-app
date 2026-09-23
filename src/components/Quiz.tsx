import React, { useState } from 'react';
import { ArrowRight, RefreshCcw, CheckCircle2, XCircle, Gift } from 'lucide-react';
import { CONFIG } from '../config';

// This interface allows the Quiz to send a signal back to App.tsx
interface QuizProps {
  onUnlock: () => void;
}

export const Quiz = ({ onUnlock }: QuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const question = CONFIG.QUIZ_QUESTIONS[currentQuestionIndex];
  const isAnswered = selectedAnswer !== null;

  const handleAnswerClick = (index: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(index);
    if (index === question.correctIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < CONFIG.QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsFinished(false);
  };

  const getOptionStyle = (index: number) => {
    if (!isAnswered) return "bg-white border-pink-200 hover:bg-pink-50 hover:border-pink-300 text-gray-700";
    if (index === question.correctIndex) return "bg-green-100 border-green-500 text-green-800 shadow-inner";
    if (index === selectedAnswer && index !== question.correctIndex) return "bg-red-100 border-red-400 text-red-800 opacity-80";
    return "bg-gray-50 border-gray-200 text-gray-400 opacity-50"; 
  };

  return (
    <section className="max-w-xl mx-auto px-6 py-16">
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-lg border-2 border-pink-100">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-pink-500 mb-2 font-serif">
            Quiz Ultahnya Hera 🧩
          </h2>
          {!isFinished && (
            <p className="text-sm font-medium text-pink-300 uppercase tracking-widest">
              Question {currentQuestionIndex + 1} of {CONFIG.QUIZ_QUESTIONS.length}
            </p>
          )}
        </div>

        {!isFinished ? (
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">
              {question.question}
            </h3>
            
            <div className="flex flex-col gap-3">
              {question.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerClick(idx)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 font-medium text-left flex items-center justify-between ${getOptionStyle(idx)}`}
                >
                  <span>{opt}</span>
                  {isAnswered && idx === question.correctIndex && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                  {isAnswered && idx === selectedAnswer && idx !== question.correctIndex && <XCircle className="w-5 h-5 text-red-500" />}
                </button>
              ))}
            </div>

            <div className="mt-6 flex justify-end h-12">
              {isAnswered && (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-bold transition-transform hover:scale-105 active:scale-95 shadow-md"
                >
                  {currentQuestionIndex === CONFIG.QUIZ_QUESTIONS.length - 1 ? 'See Results' : 'Next Question'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* MODIFIED RESULTS SCREEN */
          <div className="text-center animate-in fade-in zoom-in duration-500">
            {score === CONFIG.QUIZ_QUESTIONS.length ? (
              <>
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Perfect Score!</h3>
                <p className="text-gray-600 mb-8">
                  WIhhhh mantapp mangga di pilih kupon hadiahnya wkwkkw 🎁
                </p>
                <button
                  onClick={onUnlock}
                  className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-pink-200"
                >
                  <Gift className="w-6 h-6" /> Reveal My Prizes!
                </button>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">😹</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  kamu bener {score} dari {CONFIG.QUIZ_QUESTIONS.length}!
                </h3>
                <p className="text-gray-600 mb-8">
                  Salah ah remedial jelek bgt harus ulangi lagi 😉 <br/><br/>
                  <strong className="text-pink-500">Hint: Harus bener semua biar bisa dapet kupon</strong>
                </p>
                <button
                  onClick={handleRestart}
                  className="inline-flex items-center gap-2 bg-rose-100 hover:bg-rose-200 text-rose-700 px-6 py-3 rounded-full font-bold transition-colors"
                >
                  <RefreshCcw className="w-5 h-5" /> Retake Quiz
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};