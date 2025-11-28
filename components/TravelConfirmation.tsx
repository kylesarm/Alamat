
import React from 'react';
import { MunicipalityData, WeatherCondition, PlayerStats } from '../types';
import { MapPin, Zap, Package, AlertTriangle, Skull, Info, ArrowRight, X } from 'lucide-react';

interface TravelConfirmationProps {
  target: MunicipalityData;
  type: 'travel' | 'fast_travel';
  cost: number;
  playerStats: PlayerStats;
  weather: WeatherCondition;
  onConfirm: () => void;
  onCancel: () => void;
}

const TravelConfirmation: React.FC<TravelConfirmationProps> = ({
  target,
  type,
  cost,
  playerStats,
  weather,
  onConfirm,
  onCancel
}) => {
  const isFastTravel = type === 'fast_travel';
  const costMet = isFastTravel 
    ? playerStats.supplies >= cost 
    : playerStats.stamina >= cost;

  const getDifficultyColor = (level: number) => {
    if (level <= 1) return 'text-emerald-400';
    if (level === 2) return 'text-blue-400';
    if (level === 3) return 'text-yellow-400';
    if (level === 4) return 'text-orange-400';
    return 'text-red-500';
  };

  return (
    <div className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 relative">
          <div className="flex items-center gap-3 mb-1">
            <MapPin className={isFastTravel ? 'text-amber-400' : 'text-emerald-400'} size={24} />
            <h2 className="text-2xl font-display text-white tracking-wide">
              {isFastTravel ? 'Fast Travel' : 'Travel Plan'}
            </h2>
          </div>
          <button 
            onClick={onCancel}
            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Destination Info */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Destination</h3>
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xl font-display font-bold text-white">{target.name}</span>
                <div className="flex gap-1">
                  {Array.from({ length: target.difficulty }).map((_, i) => (
                    <Skull key={i} size={14} className={getDifficultyColor(target.difficulty)} />
                  ))}
                </div>
              </div>
              <p className="text-slate-400 text-sm italic mb-3">{target.title}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                   <Info size={16} className="text-slate-500 shrink-0" />
                   <span className="text-slate-300">{target.environment}</span>
                </div>
                <div className="flex gap-2">
                   <AlertTriangle size={16} className="text-slate-500 shrink-0" />
                   <span className="text-slate-300">Expect: {target.resources}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Calculation */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Travel Cost</h3>
            <div className={`p-4 rounded-lg border flex items-center justify-between ${costMet ? 'bg-slate-800 border-slate-700' : 'bg-red-900/20 border-red-800'}`}>
              <div className="flex items-center gap-3">
                {isFastTravel ? (
                  <Package className={costMet ? 'text-amber-400' : 'text-red-400'} size={24} />
                ) : (
                  <Zap className={costMet ? 'text-yellow-400' : 'text-red-400'} size={24} />
                )}
                <div>
                  <div className="font-bold text-slate-200">
                    {isFastTravel ? 'Supplies Required' : 'Stamina Cost'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {isFastTravel ? 'Safe route tax' : 
                     cost === 0 ? 'Previously explored route' :
                     weather === 'storm' ? 'Increased by Storm (+20)' : 
                     weather === 'rain' ? 'Increased by Rain (+10)' : 'Standard exertion'}
                  </div>
                </div>
              </div>
              <div className={`text-2xl font-bold font-display ${costMet ? 'text-white' : 'text-red-400'} ${cost === 0 ? 'text-emerald-400' : ''}`}>
                {cost === 0 ? 'SAFE' : cost}
              </div>
            </div>
            {!costMet && (
              <p className="text-red-400 text-xs mt-2 text-center">You do not have enough {isFastTravel ? 'supplies' : 'stamina'} for this journey.</p>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex gap-3">
          <button 
            onClick={onCancel}
            className="flex-1 py-3 rounded-lg text-slate-400 hover:bg-slate-900 hover:text-white font-bold text-sm transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            disabled={!costMet}
            className="flex-[2] py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
          >
            {isFastTravel ? 'Depart Now' : 'Begin Journey'} <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default TravelConfirmation;
