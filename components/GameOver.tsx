import React from 'react';
import { GameSession } from '../types';
import { IconRefresh, IconTrophy } from './Icons';

interface GameOverProps {
  session: GameSession;
  onRestart: () => void;
  onHome: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ session, onRestart, onHome }) => {
  const isHighScore = session.score > 100; // Arbitrary threshold for demo

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-900 text-center">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl animate-slide-up">
        
        <div className="mb-6 flex justify-center">
          <div className={`p-4 rounded-full ${isHighScore ? 'bg-amber-500/20' : 'bg-slate-700/50'}`}>
            <IconTrophy className={`w-16 h-16 ${isHighScore ? 'text-amber-400' : 'text-slate-400'}`} />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-2">
            {session.lives <= 0 ? "旷野试炼结束" : "旅程完成"}
        </h2>
        
        <p className="text-slate-400 mb-8">
            {session.lives <= 0 
                ? "你在旷野中迷失了方向，但恩典依然同在。" 
                : "你成功完成了这次圣经知识的挑战！"}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
            <div className="text-slate-500 text-xs uppercase mb-1">最终得分</div>
            <div className="text-3xl font-bold text-amber-400">{session.score}</div>
          </div>
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
            <div className="text-slate-500 text-xs uppercase mb-1">答题数量</div>
            <div className="text-3xl font-bold text-indigo-400">{session.questions.length}</div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <IconRefresh className="w-5 h-5" />
            再次挑战
          </button>
          
          <button
            onClick={onHome}
            className="w-full py-3 px-4 bg-transparent hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-all"
          >
            返回主菜单
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOver;