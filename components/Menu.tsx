import React from 'react';
import { Difficulty, GameState } from '../types';
import { IconBookOpen } from './Icons';

interface MenuProps {
  onStart: (difficulty: Difficulty) => void;
}

const Menu: React.FC<MenuProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-slate-900 to-transparent"></div>
      </div>

      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center justify-center p-4 bg-amber-500/10 rounded-full mb-6 border border-amber-500/30">
          <IconBookOpen className="w-12 h-12 text-amber-500" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-600 mb-4 tracking-tight">
          出埃及记
        </h1>
        <h2 className="text-2xl md:text-3xl text-slate-300 font-light tracking-widest">
          旷野试炼
        </h2>
        <p className="mt-4 text-slate-400 max-w-md mx-auto">
          探索从埃及为奴之家到西奈山的旅程（第1-20章）。你准备好接受挑战了吗？
        </p>
      </div>

      <div className="grid gap-4 w-full max-w-md animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <p className="text-center text-sm text-slate-500 mb-2 uppercase tracking-wider">选择难度</p>
        
        <button
          onClick={() => onStart(Difficulty.EASY)}
          className="group relative p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-green-500 rounded-xl transition-all duration-300 flex items-center justify-between"
        >
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-3 group-hover:shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
            <span className="font-semibold text-slate-200 group-hover:text-white">简单模式</span>
          </div>
          <span className="text-xs text-slate-500 group-hover:text-green-400">基础常识</span>
        </button>

        <button
          onClick={() => onStart(Difficulty.MEDIUM)}
          className="group relative p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-500 rounded-xl transition-all duration-300 flex items-center justify-between"
        >
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-amber-500 mr-3 group-hover:shadow-[0_0_10px_rgba(245,158,11,0.6)]"></div>
            <span className="font-semibold text-slate-200 group-hover:text-white">中等模式</span>
          </div>
          <span className="text-xs text-slate-500 group-hover:text-amber-400">进阶细节</span>
        </button>

        <button
          onClick={() => onStart(Difficulty.HARD)}
          className="group relative p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-red-500 rounded-xl transition-all duration-300 flex items-center justify-between"
        >
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-red-500 mr-3 group-hover:shadow-[0_0_10px_rgba(239,68,68,0.6)]"></div>
            <span className="font-semibold text-slate-200 group-hover:text-white">困难模式</span>
          </div>
          <span className="text-xs text-slate-500 group-hover:text-red-400">圣经学者</span>
        </button>
      </div>

      <footer className="absolute bottom-4 text-xs text-slate-600">
        Powered by Gemini 2.5 Flash
      </footer>
    </div>
  );
};

export default Menu;