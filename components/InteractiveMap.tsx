
import React from 'react';
import { MUNICIPALITIES, MAP_LAYOUT, QUESTS } from '../constants';
import { WeatherCondition } from '../types';

interface InteractiveMapProps {
  selectedMunicipality: string | null;
  onSelectMunicipality: (id: string) => void;
  weather?: WeatherCondition;
  currentLocation?: string;
  isGameMode?: boolean;
  unlockedRegions?: string[];
  completedQuests?: string[];
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  selectedMunicipality, 
  onSelectMunicipality, 
  weather = 'sunny',
  currentLocation,
  isGameMode = false,
  unlockedRegions = [],
  completedQuests = []
}) => {
  
  const isConnected = (targetId: string) => {
    if (!isGameMode || !currentLocation) return true;
    if (targetId === currentLocation) return true;
    return MAP_LAYOUT[currentLocation].neighbors.includes(targetId);
  };

  const isUnlocked = (id: string) => {
    if (!isGameMode) return true;
    return unlockedRegions.includes(id);
  };

  const isSecured = (id: string) => {
    if (!isGameMode) return false;
    const questId = QUESTS[id]?.id;
    return questId && completedQuests.includes(questId);
  };

  const canFastTravel = (id: string) => {
    if (!isGameMode || !currentLocation) return false;
    if (id === currentLocation) return false;
    return isUnlocked(id) && isSecured(id) && !isConnected(id); 
  };

  // Helper to get region color based on Difficulty (Dark Fantasy Palette)
  const getRegionFill = (id: string, unlocked: boolean) => {
    if (!unlocked) return '#020617'; // Void black/slate (Fog of war)

    const difficulty = MUNICIPALITIES[id]?.difficulty || 1;

    // Dark Fantasy Palette: Desaturated, Grim, Metallic, Blood
    switch (difficulty) {
        case 1: return '#475569'; // Slate 600 (Virac - "The Ash Citadel") - User liked this
        case 2: return '#334155'; // Slate 700 (Darker Grey - "The Fog")
        case 3: return '#3f2e2e'; // Desaturated Red-Brown (Rust/Decay)
        case 4: return '#450a0a'; // Deep Red (Blood)
        case 5: return '#1a0505'; // Abyssal Black-Red
        default: return '#1e293b';
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-[#020617] relative overflow-hidden rounded-xl shadow-2xl border border-slate-900 group/map">
      
      {/* Void Texture Background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" 
           style={{ 
             backgroundImage: 'radial-gradient(circle at center, #1e1b4b 0%, #000000 100%)' 
           }} 
      />

      {/* Weather Overlay */}
      <div className={`absolute inset-0 z-20 pointer-events-none transition-colors duration-1000 mix-blend-overlay ${
        weather === 'rain' ? 'bg-slate-900/60' : 
        weather === 'storm' ? 'bg-purple-900/40' : 
        'bg-red-900/5'
      }`} />
      
      {weather !== 'sunny' && (
        <div className="absolute inset-0 pointer-events-none z-20 opacity-40" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23a8a29e' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='${weather === 'storm' ? 1.5 : 1}'/%3E%3C/g%3E%3C/svg%3E")`,
            animation: weather === 'storm' ? 'rainfall 0.2s linear infinite' : 'rainfall 1s linear infinite'
        }}>
          <style>{`
            @keyframes rainfall { from { background-position: 0 0; } to { background-position: -10px 20px; } }
          `}</style>
        </div>
      )}

      <svg viewBox="0 0 450 550" className="w-full h-full max-w-2xl relative z-10 select-none p-4">
        <defs>
          {/* 1. Organic Coastline Filter */}
          <filter id="roughCoastline">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" />
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.8"/>
          </filter>

          {/* 2. Grim Texture Filter */}
          <filter id="grimGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" result="noise"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.15 0"/>
          </filter>

          {/* 3. Glow for Active Elements */}
          <filter id="magicGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Map Pattern Grid */}
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(148, 163, 184, 0.05)" strokeWidth="0.5"/>
          </pattern>
        </defs>

        {/* Cartography Grid */}
        <rect width="100%" height="100%" fill="url(#grid)" className="pointer-events-none" />

        {/* ROUTES (Blood Lines) */}
        {isGameMode && currentLocation && (
          <g className="pointer-events-none" filter="url(#roughCoastline)">
            {MAP_LAYOUT[currentLocation].neighbors.map(neighborId => {
               const start = MAP_LAYOUT[currentLocation];
               const end = MAP_LAYOUT[neighborId];
               const neighborUnlocked = isUnlocked(neighborId);

               if (!neighborUnlocked) return null;

               return (
                 <path 
                   key={neighborId}
                   d={`M ${start.x},${start.y} Q ${(start.x+end.x)/2 + 10},${(start.y+end.y)/2 - 10} ${end.x},${end.y}`}
                   stroke={weather === 'storm' ? '#ef4444' : '#7f1d1d'}
                   strokeWidth="2"
                   strokeDasharray="4 2"
                   fill="none"
                   className="opacity-50"
                 >
                   <animate attributeName="stroke-dashoffset" from="12" to="0" dur="4s" repeatCount="indefinite" />
                 </path>
               )
            })}
          </g>
        )}

        {/* LANDMASSES */}
        <g filter="url(#roughCoastline)">
        {Object.values(MAP_LAYOUT).map((region) => {
          const isSelected = selectedMunicipality === region.id;
          const reachable = isConnected(region.id);
          const unlocked = isUnlocked(region.id);
          const fastTravelAvailable = canFastTravel(region.id);
          const isCurrent = currentLocation === region.id;
          
          const isClickable = (isGameMode && (reachable || fastTravelAvailable)) || (!isGameMode);

          // Dynamic Fill Styling based on Difficulty
          const fillColor = getRegionFill(region.id, unlocked);
          
          return (
            <g 
              key={region.id} 
              onClick={() => isClickable && onSelectMunicipality(region.id)} 
              className={`transition-all duration-300 ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            >
              <path
                d={region.path}
                fill={fillColor}
                // Highlight border if selected or current
                stroke={isSelected || isCurrent ? '#fca5a5' : '#334155'}
                strokeWidth={isSelected || isCurrent ? 2 : 1}
                className={`transition-all duration-300
                  ${unlocked ? 'opacity-100 hover:brightness-110' : 'opacity-30 hover:opacity-40'}
                `}
              />
              
              {/* Texture Overlay on Land */}
              {unlocked && (
                <path d={region.path} fill="url(#grid)" opacity="0.2" className="pointer-events-none" />
              )}
            </g>
          );
        })}
        </g>

        {/* LABELS & ICONS LAYER (No Distortion) */}
        {Object.values(MAP_LAYOUT).map((region) => {
          const isSelected = selectedMunicipality === region.id;
          const unlocked = isUnlocked(region.id);
          const fastTravelAvailable = canFastTravel(region.id);
          const difficulty = MUNICIPALITIES[region.id]?.difficulty || 1;
          const isCurrent = currentLocation === region.id;

          if (!unlocked && isGameMode) {
             // Locked Icon
             return (
                <g key={`lock-${region.id}`} transform={`translate(${region.x - 10}, ${region.y - 10})`} className="pointer-events-none opacity-20">
                   <path d="M6 10V8a6 6 0 0 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h1zm2 0h8V8a4 4 0 0 0-8 0v2z" fill="#64748b" />
                </g>
             );
          }

          return (
            <g key={`ui-${region.id}`} className="pointer-events-none">
              
              {/* Region Name */}
              <text 
                x={region.x} 
                y={region.y}
                textAnchor="middle" 
                style={{ fontFamily: 'Cinzel, serif' }}
                className={`
                  text-[10px] font-bold uppercase tracking-widest fill-slate-300 transition-all duration-300
                  ${isSelected || isCurrent ? 'opacity-100 font-extrabold text-[12px] fill-white drop-shadow-md' : 'opacity-50 text-[9px]'}
                  ${!unlocked ? 'fill-slate-700' : ''}
                `}
              >
                {MUNICIPALITIES[region.id]?.name}
              </text>

              {/* Difficulty Skulls */}
              {isGameMode && unlocked && !isCurrent && (
                 <g transform={`translate(${region.x - (difficulty * 3)}, ${region.y + 12})`}>
                    {Array.from({length: difficulty}).map((_, i) => (
                        <circle key={i} cx={i*6} cy={0} r={1.5} fill={difficulty >= 4 ? '#7f1d1d' : '#9ca3af'} />
                    ))}
                 </g>
              )}

              {/* Fast Travel Marker */}
              {fastTravelAvailable && (
                 <g transform={`translate(${region.x}, ${region.y - 25})`}>
                    <circle r="4" className="fill-violet-500 animate-ping opacity-75" />
                    <circle r="2.5" className="fill-violet-400" />
                 </g>
              )}
            </g>
          );
        })}

        {/* PLAYER MARKER */}
        {Object.values(MAP_LAYOUT).map((region) => {
          if (currentLocation !== region.id) return null;
          return (
            <g key="player-token" transform={`translate(${region.x}, ${region.y - 20})`} className="pointer-events-none" filter="url(#magicGlow)">
               {/* Token Shadow */}
               <ellipse cx="0" cy="18" rx="8" ry="3" fill="black" opacity="0.8" />
               
               {/* Token Body - A crimson shard */}
               <path d="M -6,0 L 0,-12 L 6,0 L 0,4 Z" fill="#b91c1c" stroke="#991b1b" strokeWidth="1">
                 <animate attributeName="d" values="M -6,0 L 0,-12 L 6,0 L 0,4 Z; M -6,-3 L 0,-15 L 6,-3 L 0,1 Z; M -6,0 L 0,-12 L 6,0 L 0,4 Z" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
               </path>
               {/* Inner glow */}
               <circle cx="0" cy="-5" r="1.5" fill="#fca5a5" className="animate-pulse" />
            </g>
          );
        })}

      </svg>

      {/* Legend */}
      {isGameMode && (
        <div className="absolute top-4 right-4 flex flex-col gap-2 text-xs font-display text-slate-500 pointer-events-none bg-black/70 p-3 rounded border border-slate-800 backdrop-blur-sm">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#475569] rounded-sm border border-slate-600"></div>
                <span>Safe</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#334155] rounded-sm border border-slate-600"></div>
                <span>Moderate</span>
            </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#3f2e2e] rounded-sm border border-red-900/30"></div>
                <span>Hazardous</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#450a0a] rounded-sm border border-red-900"></div>
                <span>Deadly</span>
            </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
