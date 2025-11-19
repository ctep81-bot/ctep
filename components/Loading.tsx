import React from 'react';
import { IconFlame } from './Icons';

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-slate-900">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-orange-500 blur-2xl opacity-20 animate-pulse"></div>
        <IconFlame className="w-20 h-20 text-orange-500 animate-bounce" />
      </div>
      <h2 className="text-2xl font-bold text-amber-400 mb-2 animate-pulse">
        正在查考经文...
      </h2>
      <p className="text-slate-400 italic">
        "我要在荆棘火焰中向你显现..."
      </p>
    </div>
  );
};

export default Loading;