import React, { useState, useEffect } from 'react';
import { GameSession, Question, GameState } from '../types';
import { IconHeart, IconArrowRight, IconFlame } from './Icons';

interface GameProps {
  session: GameSession;
  onAnswer: (isCorrect: boolean, points: number) => void;
  onGameOver: () => void;
  onNextQuestion: () => void;
  isLoadingNext: boolean;
}

const Game: React.FC<GameProps> = ({ session, onAnswer, onGameOver, onNextQuestion, isLoadingNext }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = session.questions[session.currentQuestionIndex];

  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
  }, [currentQuestion]);

  if (!currentQuestion) {
      return <div className="text-white text-center p-10">Loading question...</div>;
  }

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;

    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuestion.correctAnswerIndex;
    const points = isCorrect ? 10 + (session.streak * 2) : 0;
    
    onAnswer(isCorrect, points);
  };

  const getOptionClass = (index: number) => {
    const baseClass = "w-full p-4 rounded-lg text-left transition-all duration-200 border-2 flex items-center ";
    
    if (!isAnswered) {
      return baseClass + "bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-amber-500/50 text-slate-200";
    }

    if (index === currentQuestion.correctAnswerIndex) {
      return baseClass + "bg-green-900/30 border-green-500 text-green-400";
    }

    if (index === selectedOption && index !== currentQuestion.correctAnswerIndex) {
      return baseClass + "bg-red-900/30 border-red-500 text-red-400 opacity-70";
    }

    return baseClass + "bg-slate-800 border-slate-800 text-slate-500 opacity-50";
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 min-h-screen flex flex-col">
      
      {/* Header Status Bar */}
      <div className="flex justify-between items-center mb-8 bg-slate-800/50 backdrop-blur p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase tracking-wider">分数</span>
            <span className="text-2xl font-bold text-amber-400">{session.score}</span>
          </div>
          <div className="h-8 w-px bg-slate-700"></div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase tracking-wider">连击</span>
            <span className="text-lg font-semibold text-orange-400">x{session.streak}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {[...Array(3)].map((_, i) => (
            <IconHeart 
              key={i} 
              className={`w-6 h-6 ${i < session.lives ? 'text-red-500 fill-current' : 'text-slate-700'}`} 
            />
          ))}
        </div>
      </div>

      {/* Question Card */}
      <div className="flex-grow flex flex-col justify-center">
        <div className="mb-8 animate-slide-up">
          <span className="inline-block px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-medium mb-4 border border-slate-700">
             第 {session.currentQuestionIndex + 1} 题
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-100 leading-snug">
            {currentQuestion.text}
          </h2>
        </div>

        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(index)}
              disabled={isAnswered}
              className={getOptionClass(index)}
            >
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-900/50 mr-4 text-sm font-bold">
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </button>
          ))}
        </div>

        {/* Feedback Section */}
        {isAnswered && (
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 animate-fade-in mb-24">
            <div className="flex items-start gap-3 mb-2">
               {selectedOption === currentQuestion.correctAnswerIndex ? (
                   <div className="text-green-400 font-bold text-lg">回答正确!</div>
               ) : (
                   <div className="text-red-400 font-bold text-lg">回答错误</div>
               )}
            </div>
            
            <p className="text-slate-300 mb-4">
              {currentQuestion.explanation}
            </p>
            <div className="flex justify-between items-center border-t border-slate-700 pt-4">
               <span className="text-xs font-mono text-amber-500 bg-amber-900/20 px-2 py-1 rounded">
                 📖 {currentQuestion.bibleReference}
               </span>
               
               <button
                 onClick={onNextQuestion}
                 disabled={isLoadingNext}
                 className="flex items-center bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
               >
                 {isLoadingNext ? '生成中...' : '下一题'}
                 {!isLoadingNext && <IconArrowRight className="ml-2 w-4 h-4" />}
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;