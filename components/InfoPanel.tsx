import React from 'react';
import { MUNICIPALITIES, GAME_SECTIONS } from '../constants';
import ReactMarkdown from 'react-markdown'; // Assuming standard markdown rendering is okay, but I'll implement a simple parser to avoid deps if needed. 
// Actually, for this task, I will interpret the text directly.

interface InfoPanelProps {
  viewMode: 'map' | 'lore';
  selectedMunicipality: string | null;
  activeSection: string;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ viewMode, selectedMunicipality, activeSection }) => {
  
  if (viewMode === 'map') {
    if (!selectedMunicipality) {
      return (
        <div className="flex items-center justify-center h-full text-slate-500 italic p-8 text-center">
          <div>
            <h3 className="text-xl font-display text-slate-300 mb-2">Explore the Island</h3>
            <p>Select a municipality on the map to view its environment, resources, and quests.</p>
          </div>
        </div>
      );
    }

    const data = MUNICIPALITIES[selectedMunicipality];

    return (
      <div className="h-full overflow-y-auto p-8 bg-slate-900/50 backdrop-blur-sm">
        <div className="mb-6 border-b border-emerald-500/30 pb-4">
          <h2 className="text-4xl font-display text-emerald-400 mb-1">{data.name}</h2>
          <h3 className="text-lg text-slate-400 font-light italic">{data.title}</h3>
        </div>

        <div className="space-y-6">
          <section>
            <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-2">Environment</h4>
            <p className="text-slate-300 leading-relaxed">{data.description}</p>
            <p className="text-slate-400 text-sm mt-2 italic">{data.environment}</p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Points of Interest</h4>
              <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                {data.poi.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </section>

            <section className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">Economy & Resources</h4>
              <p className="text-slate-300 text-sm">{data.resources}</p>
            </section>
          </div>

          <section className="bg-emerald-900/20 p-4 rounded-lg border border-emerald-800/50">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Local Faction</h4>
            <p className="text-emerald-100 text-sm">{data.faction}</p>
          </section>
          
           <section className="bg-purple-900/20 p-4 rounded-lg border border-purple-800/50">
            <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">Active Quest</h4>
            <p className="text-purple-100 text-sm font-medium">"{data.quests}"</p>
          </section>
        </div>
      </div>
    );
  }

  // Lore Mode
  const sectionData = GAME_SECTIONS.find(s => s.id === activeSection);
  
  if (!sectionData) return null;

  return (
    <div className="h-full overflow-y-auto p-8 md:p-12 max-w-4xl mx-auto">
      <h2 className="text-3xl md:text-5xl font-display text-white mb-8 border-b border-slate-700 pb-6">
        {sectionData.title}
      </h2>
      <div className="prose prose-invert prose-lg max-w-none text-slate-300">
         {/* Simple Text Rendering replacing Markdown component for simplicity */}
         {sectionData.content.split('\n').map((line, i) => {
            const trimmed = line.trim();
            if (trimmed.startsWith('**')) {
              // Header mimic
              return <h3 key={i} className="text-xl font-bold text-emerald-400 mt-6 mb-2">{trimmed.replace(/\*\*/g, '')}</h3>;
            } else if (trimmed.startsWith('*')) {
              // List item mimic
              return <li key={i} className="ml-4 text-slate-300 list-disc marker:text-emerald-500">{trimmed.replace(/\*/g, '')}</li>;
            } else {
              return <p key={i} className="mb-4 leading-relaxed">{trimmed}</p>;
            }
         })}
      </div>
    </div>
  );
};

export default InfoPanel;