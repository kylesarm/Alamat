

import React from 'react';
import { PlayerStats, WeatherCondition } from '../types';
import { Heart, Zap, Package, Trophy, Coins, UserPlus, Sun, CloudRain, CloudLightning, Moon, CheckSquare } from 'lucide-react';

interface GameHUDProps {
  stats: PlayerStats;
  weather: WeatherCondition;
}

const GameHUD: React.FC<GameHUDProps> = ({ stats, weather }) => {
  const getWeatherIcon = () => {
    switch(weather) {
      case 'sunny': return <Moon className="text-slate-400" size={16} />; // No sun in dark fantasy
      case 'rain': return <CloudRain className="text-slate-500" size={16} />;
      case 'storm': return <CloudLightning className="text-red-500 animate-pulse" size={16} />;
    }
  };

  const getWeatherLabel = () => {
     switch(weather) {
      case 'sunny': return 'The Gray';
      case 'rain': return 'Acid Rain';
      case 'storm': return 'The Shroud';
    }
  };

  return (
    <div className="w-full bg-black border-b border-slate-900 z-30 relative shadow-2xl flex flex-col">
      {/* Objective Bar */}
      <div className="w-full bg-amber-950/20 border-b border-amber-900/30 px-4 py-1 flex items-center justify-center gap-2">
         <CheckSquare size={14} className="text-amber-500" />
         <span className="text-[10px] md:text-xs font-bold text-amber-500 uppercase tracking-widest">Main Objective:</span>
         <span className="text-xs md:text-sm text-slate-300 font-serif italic">{stats.currentObjective}</span>
      </div>

      <div className="p-3 flex flex-wrap gap-4 justify-between items-center overflow-x-auto">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 text-red-800">
            <Heart className="fill-current" size={18} />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-slate-700 leading-none">Blood</span>
              <span className="text-sm md:text-lg font-bold font-display text-red-500 leading-none">{stats.health}/{stats.maxHealth}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-yellow-800">
            <Zap className="fill-current" size={18} />
             <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-slate-700 leading-none">Will</span>
              <span className="text-sm md:text-lg font-bold font-display text-yellow-600 leading-none">{stats.stamina}/{stats.maxStamina}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          
          {/* Weather Widget */}
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-950 rounded border border-slate-900">
            {getWeatherIcon()}
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{getWeatherLabel()}</span>
          </div>

          <div className="flex items-center gap-2 text-amber-700">
            <Coins size={18} />
             <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-slate-700 leading-none">Gold</span>
              <span className="text-sm md:text-lg font-bold font-display text-amber-600 leading-none">{stats.gold}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-stone-500">
            <Package size={18} />
             <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-slate-700 leading-none">Rations</span>
              <span className="text-sm md:text-lg font-bold font-display text-stone-400 leading-none">{stats.supplies}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-violet-800">
            <Trophy size={18} />
             <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-slate-700 leading-none">LVL {stats.level}</span>
              <span className="text-sm md:text-lg font-bold font-display text-violet-500 leading-none">{stats.xp}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default GameHUD;