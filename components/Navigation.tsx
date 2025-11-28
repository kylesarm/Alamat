import React from 'react';
import { GameSection } from '../types';
import { Map, BookOpen, Sword, Feather, Users, Eye, PlayCircle, LogOut, Skull, ShieldAlert } from 'lucide-react';

interface NavigationProps {
  sections: GameSection[];
  activeSection: string;
  onSelectSection: (id: string) => void;
  viewMode: 'map' | 'lore' | 'game';
  setViewMode: (mode: 'map' | 'lore' | 'game') => void;
}

const Navigation: React.FC<NavigationProps> = ({ sections, activeSection, onSelectSection, viewMode, setViewMode }) => {
  
  const getIcon = (id: string) => {
    switch(id) {
      case 'story': return <Feather size={18} />;
      case 'bestiary': return <Skull size={18} />;
      case 'arsenal': return <ShieldAlert size={18} />;
      case 'mechanics': return <Sword size={18} />;
      case 'visuals': return <Eye size={18} />;
      default: return <BookOpen size={18} />;
    }
  };

  const isGameMode = viewMode === 'game';

  return (
    <nav className="w-full md:w-72 bg-black border-r border-slate-900 flex flex-col h-full z-20 shadow-2xl">
      <div className="p-6 border-b border-slate-900 bg-slate-950/50">
        <h1 className="text-2xl font-bold text-red-600 font-display tracking-widest drop-shadow-lg">ALAMAT</h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-[0.2em]">Of Catanduanes</p>
      </div>

      <div className="p-4 border-b border-slate-900">
        <button
          onClick={() => setViewMode(isGameMode ? 'lore' : 'game')}
          className={`w-full py-3 px-4 rounded border font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
            isGameMode 
            ? 'bg-slate-900/50 text-slate-400 border-slate-800 hover:bg-slate-800' 
            : 'bg-red-900/20 text-red-500 border-red-900/50 hover:bg-red-900/40 shadow-[0_0_15px_rgba(153,27,27,0.2)]'
          }`}
        >
          {isGameMode ? <><LogOut size={16}/> Abandon Hope</> : <><PlayCircle size={16}/> Enter the Void</>}
        </button>
      </div>

      <div className={`flex flex-col gap-2 p-4 flex-1 overflow-y-auto transition-opacity duration-500 ${isGameMode ? 'opacity-30 pointer-events-none grayscale' : 'opacity-100'}`}>
        <div className="mb-6">
          <p className="text-[10px] font-bold text-slate-600 uppercase mb-3 px-2 tracking-widest">Interface</p>
          <div className="flex gap-2 bg-slate-950 p-1 rounded border border-slate-900">
            <button 
              onClick={() => setViewMode('map')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-sm transition-colors ${viewMode === 'map' ? 'bg-slate-800 text-slate-200' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Map size={16} /> Map
            </button>
            <button 
              onClick={() => setViewMode('lore')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-sm transition-colors ${viewMode === 'lore' ? 'bg-slate-800 text-slate-200' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <BookOpen size={16} /> Lore
            </button>
          </div>
        </div>

        <p className="text-[10px] font-bold text-slate-600 uppercase mb-1 px-2 tracking-widest">Archives</p>
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => {
              onSelectSection(section.id);
              setViewMode('lore');
            }}
            className={`text-left px-4 py-3 rounded text-sm font-medium flex items-center gap-3 transition-all ${
              activeSection === section.id && viewMode === 'lore'
                ? 'bg-slate-900 text-red-400 border-l-2 border-red-600'
                : 'text-slate-500 hover:bg-slate-900 hover:text-slate-300'
            }`}
          >
            {getIcon(section.id)}
            {section.title}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-slate-900 text-[10px] text-slate-700 text-center bg-black">
        <p className="mb-1">Cursed Topography</p>
        <p className="text-slate-600">Developer: <span className="text-red-900">Kyle Anthony S Sarmiento</span></p>
      </div>
    </nav>
  );
};

export default Navigation;