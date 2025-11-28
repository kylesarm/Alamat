
import React, { useState, useEffect } from 'react';
import { MunicipalityData, QuestData, PlayerStats, GameEvent, MarketData, CraftingRecipe, DialogueNode, Item, SubLocation } from '../types';
import { MUNICIPALITIES, QUESTS, MARKETS, CRAFTING_RECIPES, ITEMS } from '../constants';
import { Swords, Compass, BatteryCharging, MapPin, Store, ArrowRight, AlertTriangle, Hammer, Backpack, MessageCircle, ChevronRight, Shield, Zap, Heart, MousePointer, Skull, Moon, Coins, LogOut, Building, Landplot, Landmark, Image as ImageIcon } from 'lucide-react';

interface GameInterfaceProps {
  currentLocationId: string;
  currentSubLocationId: string | null;
  playerStats: PlayerStats;
  completedQuests: string[];
  logs: string[];
  activeEvent: GameEvent | null;
  activeDialogue: DialogueNode | null;
  onEnterSubLocation: (id: string | null) => void;
  onAction: (action: 'explore' | 'quest' | 'rest') => void;
  onResolveEvent: (effects: Partial<PlayerStats>, log: string) => void;
  onCraft?: (recipeId: string) => void;
  onConsume?: (itemId: string) => void;
  onStartDialogue: (id: string) => void;
  onDialogueOption: (nextId?: string, effect?: (s: PlayerStats) => Partial<PlayerStats>, log?: string) => void;
  onTrade: (itemId: string, isBuying: boolean, price: number) => void;
}

// Fallback image to ensure no blank screens
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=800&auto=format&fit=crop";

// Fixed Scene Images for instant loading - Dark Fantasy Aesthetic
// KEYS MUST MATCH 'constants.ts' IDs EXACTLY
const SCENE_IMAGES: Record<string, string> = {
  // --- MUNICIPALITIES ---
  virac: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=800&auto=format&fit=crop", 
  san_andres: "https://images.unsplash.com/photo-1476673132029-46a5a79455dd?q=80&w=800&auto=format&fit=crop",
  bato: "https://images.unsplash.com/photo-1504333638930-c8787321eee0?q=80&w=800&auto=format&fit=crop",
  san_miguel: "https://images.unsplash.com/photo-1613946059635-38dc8b183dd7?q=80&w=800&auto=format&fit=crop",
  baras: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
  viga: "https://images.unsplash.com/photo-1520638023360-6b22b7244929?q=80&w=800&auto=format&fit=crop",
  gigmoto: "https://images.unsplash.com/photo-1448375240586-dfd8d395ea6c?q=80&w=800&auto=format&fit=crop",
  panganiban: "https://images.unsplash.com/photo-1621356073108-56e2978d3879?q=80&w=800&auto=format&fit=crop",
  bagamanoc: "https://images.unsplash.com/photo-1566373859873-196d44439c82?q=80&w=800&auto=format&fit=crop",
  caramoran: "https://images.unsplash.com/photo-1516481265257-97e5f4bc50d5?q=80&w=800&auto=format&fit=crop",
  pandan: "https://images.unsplash.com/photo-1534796636938-806178431714?q=80&w=800&auto=format&fit=crop",

  // --- VIRAC SUB-LOCATIONS ---
  virac_cathedral: "https://images.unsplash.com/photo-1548625361-e88c60eb83a4?q=80&w=800&auto=format&fit=crop",
  virac_plaza: "https://images.unsplash.com/photo-1550100136-e074f03d8673?q=80&w=800&auto=format&fit=crop",
  virac_sewers: "https://images.unsplash.com/photo-1610444565258-006277b282fa?q=80&w=800&auto=format&fit=crop",

  // --- SAN ANDRES SUB-LOCATIONS ---
  san_andres_cliffs: "https://images.unsplash.com/photo-1500320821405-8fc1732209ca?q=80&w=800&auto=format&fit=crop",
  luyang_cave: "https://i.imgur.com/w24fbk1.png",

  // --- BATO SUB-LOCATIONS ---
  bato_bridge: "https://images.unsplash.com/photo-1437435863486-0683a4c520a0?q=80&w=800&auto=format&fit=crop",
  bato_church: "https://images.unsplash.com/photo-1572915447228-56d1538a8e3d?q=80&w=800&auto=format&fit=crop",
  bato_docks: "https://images.unsplash.com/photo-1506459392231-643f87a3240e?q=80&w=800&auto=format&fit=crop",

  // --- SAN MIGUEL SUB-LOCATIONS ---
  san_miguel_market: "https://images.unsplash.com/photo-1603986705330-22c6b4545d97?q=80&w=800&auto=format&fit=crop",
  san_miguel_river: "https://images.unsplash.com/photo-1466034177242-2b63483984be?q=80&w=800&auto=format&fit=crop",

  // --- BARAS SUB-LOCATIONS ---
  baras_cliffs: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=800&auto=format&fit=crop",

  // --- VIGA SUB-LOCATIONS ---
  viga_fields: "https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=800&auto=format&fit=crop",

  // --- GIGMOTO SUB-LOCATIONS ---
  gigmoto_tree: "https://images.unsplash.com/photo-1438786657426-3d23f3801046?q=80&w=800&auto=format&fit=crop",

  // --- PANGANIBAN SUB-LOCATIONS ---
  panganiban_delta: "https://images.unsplash.com/photo-1470723136979-d1ddce99f1fa?q=80&w=800&auto=format&fit=crop",

  // --- BAGAMANOC SUB-LOCATIONS ---
  bagamanoc_lighthouse: "https://images.unsplash.com/photo-1496556813204-c5a89461f008?q=80&w=800&auto=format&fit=crop",

  // --- CARAMORAN SUB-LOCATIONS ---
  caramoran_jungle: "https://images.unsplash.com/photo-1518182170546-0766ce6fec56?q=80&w=800&auto=format&fit=crop",

  // --- PANDAN SUB-LOCATIONS ---
  pandan_void: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=800&auto=format&fit=crop",

  // --- SPECIFIC NPC INTERACTIONS ---
  npc_gov: "https://i.imgur.com/nzOVhKS.png",
  npc_lola: "https://i.imgur.com/pFB7uRC.png",
  npc_nathaniel: "https://i.imgur.com/Y0Bh3X1.png",
  npc_aratnacla: "https://i.imgur.com/R1rA067.png",
  npc_karlo: "https://i.imgur.com/ilhkeqA.png",
  npc_beck: "https://i.imgur.com/ZHxoMAs.png",
  
  gov_fight: "https://i.imgur.com/brze132.png",
  gov_win_clean: "https://i.imgur.com/JgGY4WA.png",
  gov_win_messy: "https://i.imgur.com/JgGY4WA.png",
  gov_grant_writ: "https://i.imgur.com/JgGY4WA.png",
  gov_rosary: "https://i.imgur.com/ia3vDCK.png",
  karlo_fight: "https://i.imgur.com/ywoHNL3.png",
  luyang_victory: "https://i.imgur.com/3sb5NpY.png",

  // --- ARRIVAL SEQUENCES ---
  san_andres_arrival: "https://i.imgur.com/c6w0QyB.png",
  bato_arrival: "https://i.imgur.com/ofL01vM.png"
};

const GameInterface: React.FC<GameInterfaceProps> = ({ 
  currentLocationId, 
  currentSubLocationId,
  playerStats, 
  completedQuests, 
  logs,
  activeEvent,
  activeDialogue,
  onEnterSubLocation,
  onAction,
  onResolveEvent,
  onCraft,
  onConsume,
  onStartDialogue,
  onDialogueOption,
  onTrade
}) => {
  
  const [activeTab, setActiveTab] = useState<'location' | 'inventory' | 'market' | 'craft'>('location');
  const [displayedText, setDisplayedText] = useState('');
  const [isTextComplete, setIsTextComplete] = useState(false);
  const [fullText, setFullText] = useState('');

  const locationData: MunicipalityData = MUNICIPALITIES[currentLocationId];
  const marketData: MarketData = MARKETS[currentLocationId];
  const currentSubLocation: SubLocation | undefined = locationData.subLocations.find(s => s.id === currentSubLocationId);

  // Determine which image to show with robust fallback
  const getSceneImage = () => {
    // 1. Specific Dialogue Scene (Overrides everything)
    if (activeDialogue && SCENE_IMAGES[activeDialogue.id]) {
      return SCENE_IMAGES[activeDialogue.id];
    }

    // 2. NPC Override based on Active Dialogue Prefix
    if (activeDialogue) {
        // Inquisitor Azanza (starts with gov_)
        if (activeDialogue.id.startsWith('gov_')) return SCENE_IMAGES['npc_gov'];
        // Lola Bashang (starts with lola_)
        if (activeDialogue.id.startsWith('lola_')) return SCENE_IMAGES['npc_lola'];
        // Father Nathaniel (starts with nathaniel_)
        if (activeDialogue.id.startsWith('nathaniel_')) return SCENE_IMAGES['npc_nathaniel'];
        // Aratnacla (starts with aratnacla_)
        if (activeDialogue.id.startsWith('aratnacla_')) return SCENE_IMAGES['npc_aratnacla'];
        // Tanod Karlo (starts with karlo_)
        if (activeDialogue.id.startsWith('karlo_')) return SCENE_IMAGES['npc_karlo'];
        // Beck (starts with beck_)
        if (activeDialogue.id.startsWith('beck_')) return SCENE_IMAGES['npc_beck'];
    }

    // 3. Try Sub-Location ID
    if (currentSubLocationId && SCENE_IMAGES[currentSubLocationId]) {
      return SCENE_IMAGES[currentSubLocationId];
    }
    // 4. Try Location ID
    if (SCENE_IMAGES[currentLocationId]) {
      return SCENE_IMAGES[currentLocationId];
    }
    // 5. Fallback to Virac (Default)
    return DEFAULT_IMAGE;
  };

  const currentSceneImage = getSceneImage();

  // Filter NPCs based on where the player is Standing
  const visibleNPCs = locationData.npcs.filter(npc => {
    if (!currentSubLocationId) return false; // Don't show NPCs in the Hub
    return npc.subLocationId === currentSubLocationId;
  });

  // Inventory Helper: Group Items by ID
  const groupedInventory = playerStats.inventory.reduce((acc, itemId) => {
    acc[itemId] = (acc[itemId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Typewriter Effect
  useEffect(() => {
    if (activeDialogue) {
      setDisplayedText('');
      setIsTextComplete(false);
      
      const processedText = activeDialogue.text.replace(/{player}/g, playerStats.name);
      setFullText(processedText);

      let index = 0;
      const speed = 15; // Faster speed for better UX

      const interval = setInterval(() => {
        index++;
        setDisplayedText(processedText.substring(0, index));
        if (index >= processedText.length) {
          clearInterval(interval);
          setIsTextComplete(true);
        }
      }, speed);

      return () => clearInterval(interval);
    }
  }, [activeDialogue, playerStats.name]);

  const handleDialogueClick = () => {
    if (activeDialogue && !isTextComplete) {
      // Skip Typing
      setDisplayedText(fullText);
      setIsTextComplete(true);
    }
  };

  const getSubLocationIcon = (type: string) => {
    switch (type) {
        case 'store': return <Store className="text-amber-500" />;
        case 'danger_zone': return <Skull className="text-red-500" />;
        case 'landmark': return <Landmark className="text-violet-500" />;
        case 'building': return <Building className="text-slate-400" />;
        default: return <MapPin className="text-emerald-500" />;
    }
  };
  
  // Render Active Event Modal
  if (activeEvent) {
    return (
      <div className="h-full flex flex-col bg-[#020617] relative overflow-hidden p-6 items-center justify-center z-50">
        <div className="absolute inset-0 bg-red-950/30 backdrop-blur-md z-0" />
        <div className="relative z-10 w-full max-w-lg bg-slate-950 border border-red-900 rounded shadow-[0_0_50px_rgba(127,29,29,0.3)] overflow-hidden">
          <div className="bg-red-950/30 p-6 border-b border-red-900/50">
            <div className="flex items-center gap-3 text-red-500 mb-2">
              <Skull size={24} />
              <span className="uppercase tracking-widest font-bold text-sm">Horror Encounter</span>
            </div>
            <h2 className="text-2xl font-display text-slate-100">{activeEvent.title}</h2>
          </div>
          <div className="p-6 text-slate-300 text-lg leading-relaxed border-b border-slate-900 font-serif italic">
            {activeEvent.description}
          </div>
          <div className="p-4 bg-black space-y-3">
             {activeEvent.options.map((opt, idx) => {
                const canAfford = 
                  (!opt.reqStamina || playerStats.stamina >= opt.reqStamina) &&
                  (!opt.reqGold || playerStats.gold >= opt.reqGold) &&
                  (!opt.reqItem || playerStats.inventory.includes(opt.reqItem));

                return (
                  <button
                    key={idx}
                    disabled={!canAfford}
                    onClick={() => onResolveEvent(opt.effect(playerStats), opt.outcomeLog)}
                    className={`w-full text-left p-4 rounded border transition-all flex justify-between items-center group ${
                      canAfford 
                        ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 hover:border-red-900' 
                        : 'bg-black opacity-50 cursor-not-allowed border-slate-900'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-300 group-hover:text-red-400 transition-colors">{opt.label}</div>
                      {opt.description && <div className="text-xs text-slate-600 mt-1">{opt.description}</div>}
                    </div>
                    <ArrowRight size={16} className="text-slate-700 group-hover:text-red-500 transition-colors" />
                  </button>
                )
             })}
          </div>
        </div>
      </div>
    );
  }

  // Render Visual Novel Dialogue Overlay
  if (activeDialogue) {
    const allBlocked = activeDialogue.options.every(opt => {
        if (opt.reqStat && (playerStats as any)[opt.reqStat.stat] < opt.reqStat.value) return true;
        if (opt.reqItem && !playerStats.inventory.includes(opt.reqItem)) return true;
        return false;
    });

    return (
      <div className="h-full flex flex-col bg-black relative overflow-hidden select-none" onClick={handleDialogueClick}>
        {/* Visual Scene Background */}
        <div className="flex-1 relative cursor-pointer group bg-slate-950 overflow-hidden">
             
             {/* Fixed Scene Image */}
             <div className="absolute inset-0 animate-in fade-in duration-1000">
                <img 
                    src={currentSceneImage} 
                    alt="Scene Visualization" 
                    className="w-full h-full object-cover opacity-80" 
                />
                {/* Vignette & Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-transparent opacity-60" />
             </div>
             
             {!isTextComplete && (
               <div className="absolute bottom-10 right-10 z-20 text-slate-500 text-xs animate-bounce bg-black/50 px-2 py-1 rounded">
                 Click to skip
               </div>
             )}
        </div>

        {/* Dialogue Box */}
        <div className="min-h-[45%] bg-black border-t border-slate-900 p-6 flex flex-col z-20 shadow-2xl relative">
            <div className="mb-4 flex justify-between items-center">
                <span className="text-red-500 font-bold uppercase tracking-widest text-sm bg-slate-950 px-3 py-1 rounded border border-slate-900 shadow-lg flex items-center gap-2">
                    {activeDialogue.speaker !== 'Narrator' && <MessageCircle size={14}/>}
                    {activeDialogue.speaker}
                </span>
            </div>
            
            <div className="flex-1 relative mb-6">
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-medium font-serif whitespace-pre-wrap">
                  {displayedText}<span className={`inline-block w-2 h-5 bg-red-900 ml-1 align-middle ${isTextComplete ? 'hidden' : 'animate-pulse'}`}></span>
              </p>
            </div>

            <div className={`grid grid-cols-1 gap-3 transition-opacity duration-500 ${isTextComplete ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {activeDialogue.options.map((opt, idx) => {
                    let blocked = false;
                    let reason = '';

                    if (opt.reqStat) {
                        if ((playerStats as any)[opt.reqStat.stat] < opt.reqStat.value) {
                            blocked = true;
                            reason = `Req: ${opt.reqStat.value} ${opt.reqStat.stat}`;
                        }
                    }
                    if (opt.reqItem) {
                        if (!playerStats.inventory.includes(opt.reqItem)) {
                            blocked = true;
                            reason = `Req: ${ITEMS[opt.reqItem]?.name || opt.reqItem}`;
                        }
                    }

                    return (
                        <button
                            key={idx}
                            disabled={blocked}
                            onClick={(e) => {
                              e.stopPropagation();
                              onDialogueOption(opt.nextId, opt.effect, opt.outcomeLog);
                            }}
                            className={`w-full text-left p-4 rounded border transition-all flex justify-between items-center ${
                                blocked 
                                ? 'bg-black border-slate-900 text-slate-700 cursor-not-allowed' 
                                : 'bg-slate-950 border-slate-900 hover:bg-slate-900 hover:border-red-800 text-slate-300 hover:text-red-100'
                            }`}
                        >
                            <span className="font-bold">
                                {opt.label}
                                {reason && <span className="ml-2 text-xs text-red-700">({reason})</span>}
                            </span>
                            {!blocked && <ChevronRight size={18} className="text-red-900" />}
                        </button>
                    )
                })}

                {/* SAFETY NET */}
                {allBlocked && (
                   <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDialogueOption(undefined, undefined, "You found no opening and retreated.");
                        }}
                        className="w-full text-left p-4 rounded border border-red-900 bg-red-950/20 text-red-200 hover:bg-red-900/40 mt-2 animate-pulse flex justify-between items-center shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                    >
                        <span className="font-bold">Flee (No options available)</span>
                        <span className="text-xs">ESCAPING SOFT-LOCK</span>
                    </button>
                )}
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-black relative overflow-hidden text-slate-300">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md z-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
           <MapPin className="text-red-700" size={20} />
           <div>
             <h2 className="text-xl font-display text-slate-200 leading-none flex items-center gap-2">
                {locationData.name} 
                {currentSubLocation && <span className="text-slate-500 font-sans text-sm">/ {currentSubLocation.name}</span>}
             </h2>
             <span className="text-xs text-slate-600">{currentSubLocation ? currentSubLocation.description : locationData.title}</span>
           </div>
        </div>
        
        <div className="flex bg-black rounded p-1 border border-slate-900">
          <button 
            onClick={() => setActiveTab('location')} 
            className={`px-3 py-2 rounded text-xs font-bold transition-colors ${activeTab === 'location' ? 'bg-slate-900 text-slate-200' : 'text-slate-600 hover:text-slate-400'}`}
          >
            Location
          </button>
          <button 
            onClick={() => setActiveTab('inventory')} 
            className={`px-3 py-2 rounded text-xs font-bold flex items-center gap-2 transition-colors ${activeTab === 'inventory' ? 'bg-slate-900 text-slate-200' : 'text-slate-600 hover:text-slate-400'}`}
          >
             Inv <span className="text-slate-500">({playerStats.inventory.length})</span>
          </button>
          <button 
            onClick={() => setActiveTab('market')} 
            className={`px-3 py-2 rounded text-xs font-bold flex items-center gap-2 transition-colors ${activeTab === 'market' ? 'bg-amber-950/40 text-amber-500' : 'text-slate-600 hover:text-amber-700'}`}
          >
            <Store size={14} /> Market
          </button>
          <button 
            onClick={() => setActiveTab('craft')} 
            className={`px-3 py-2 rounded text-xs font-bold flex items-center gap-2 transition-colors ${activeTab === 'craft' ? 'bg-violet-950/40 text-violet-400' : 'text-slate-600 hover:text-violet-700'}`}
          >
            <Hammer size={14} /> Craft
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#020617]">
        
        {activeTab === 'location' && (
            <div className="p-6 space-y-8">
                
                {/* 1. HUB VIEW: Show Grid of Sub Locations */}
                {!currentSubLocationId && (
                    <>
                        <div className="bg-slate-950 p-4 rounded border border-slate-900 shadow-inner">
                             <p className="text-slate-400 italic text-sm leading-relaxed font-serif">"{locationData.description}"</p>
                             <div className="mt-4 flex gap-4 text-xs text-slate-500">
                                <div className="flex items-center gap-1"><AlertTriangle size={12}/> Threat Lvl: {locationData.difficulty}</div>
                                <div className="flex items-center gap-1"><Shield size={12}/> Faction: {locationData.faction}</div>
                             </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Compass size={14} /> Places to Visit
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {locationData.subLocations.map(loc => (
                                    <button 
                                        key={loc.id}
                                        onClick={() => onEnterSubLocation(loc.id)}
                                        className="p-5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 rounded-lg text-left group transition-all flex flex-col gap-2"
                                    >
                                        <div className="flex justify-between items-center w-full">
                                            <div className="flex items-center gap-2 font-bold text-slate-200 group-hover:text-white">
                                                {getSubLocationIcon(loc.type)}
                                                {loc.name}
                                            </div>
                                            <ChevronRight className="text-slate-700 group-hover:text-emerald-500 transition-colors" size={16} />
                                        </div>
                                        <p className="text-xs text-slate-500 group-hover:text-slate-400">{loc.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* General Actions (Rest is always available in Hub) */}
                         <button 
                            onClick={() => onAction('rest')}
                            className="w-full p-4 bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 rounded text-left group transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <Moon className="text-blue-900 group-hover:text-blue-400" size={20} />
                                <div>
                                    <div className="font-bold text-slate-400 group-hover:text-blue-300">Find Shelter & Rest</div>
                                    <div className="text-xs text-slate-600 mt-1">Recover Health & Stamina (-5 Ration)</div>
                                </div>
                            </div>
                        </button>
                    </>
                )}

                {/* 2. SUB-LOCATION VIEW: Specific Area */}
                {currentSubLocationId && currentSubLocation && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <button 
                             onClick={() => onEnterSubLocation(null)}
                             className="mb-4 text-xs font-bold text-slate-500 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                        >
                            <LogOut size={12} className="rotate-180" /> Return to {locationData.name}
                        </button>

                        <div className="mb-8 border-l-2 border-emerald-900 pl-4">
                            <h2 className="text-2xl font-display text-white mb-1">{currentSubLocation.name}</h2>
                            <p className="text-slate-400 italic text-sm">{currentSubLocation.description}</p>
                        </div>

                        {/* NPCs */}
                        <div className="mb-8">
                            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <MessageCircle size={14} /> Souls Here
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                {visibleNPCs.length > 0 ? visibleNPCs.map(npc => (
                                    <button 
                                        key={npc.id}
                                        onClick={() => onStartDialogue(npc.dialogueStartId)}
                                        className="flex items-center gap-4 p-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-red-900 rounded transition-all group text-left"
                                    >
                                        <div className="text-3xl bg-black p-2 rounded-full grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all">{npc.avatarEmoji}</div>
                                        <div className="flex-1">
                                            <div className="font-bold text-slate-300 group-hover:text-red-400">{npc.name}</div>
                                            <div className="text-xs text-slate-600">{npc.role}</div>
                                        </div>
                                        <MessageCircle className="text-slate-700 group-hover:text-slate-400" size={18} />
                                    </button>
                                )) : (
                                    <div className="text-slate-700 text-sm italic p-4 text-center border border-slate-900 border-dashed rounded">
                                        You are alone here.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Local Actions */}
                        <div>
                             <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Compass size={14} /> Local Actions
                            </h3>
                            <button 
                                onClick={() => onAction('explore')}
                                className="w-full p-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-left group"
                            >
                                <div className="font-bold text-slate-300 group-hover:text-violet-400">Scavenge Area</div>
                                <div className="text-xs text-slate-600 mt-1">
                                    <span className="text-emerald-500">Search for loot</span> • Risk sanity (-5 Stamina)
                                </div>
                            </button>
                        </div>
                    </div>
                )}
                
                {/* Log (Mini) */}
                {logs.length > 0 && (
                    <div className="mt-8 pt-4 border-t border-slate-900">
                        <h3 className="text-xs font-bold text-slate-700 uppercase mb-2">Journal of Woe</h3>
                        <div className="text-xs font-mono text-slate-500 space-y-1">
                            {logs.slice(-3).map((l, i) => <div key={i}>{l}</div>)}
                        </div>
                    </div>
                )}
            </div>
        )}

        {activeTab === 'inventory' && (
            <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Backpack className="text-slate-500" />
                    <h3 className="text-lg font-bold text-slate-200">Inventory</h3>
                </div>
                
                {Object.keys(groupedInventory).length === 0 ? (
                    <div className="text-slate-700 italic text-center py-12">You possess nothing but your life.</div>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {Object.entries(groupedInventory).map(([itemId, count], idx) => {
                            const item = ITEMS[itemId];
                            if (!item) return null;
                            return (
                                <div key={idx + itemId} className="bg-slate-900 p-4 rounded border border-slate-800 flex items-start justify-between group hover:border-slate-700 transition-colors">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <div className="font-bold text-slate-300 text-sm">{item.name}</div>
                                            <div className="bg-slate-800 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-bold">x{count}</div>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1 max-w-xs">{item.description}</div>
                                        <div className="flex gap-2 mt-2">
                                            {item.stats && (
                                                <div className="flex gap-2 text-[10px] font-bold uppercase">
                                                    {item.stats.attack && <span className="text-red-800 flex items-center gap-1"><Swords size={10}/> DMG {item.stats.attack}</span>}
                                                    {item.stats.defense && <span className="text-blue-900 flex items-center gap-1"><Shield size={10}/> DEF {item.stats.defense}</span>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {item.type === 'consumable' && (
                                        <button 
                                            onClick={() => onConsume && onConsume(itemId)}
                                            className="px-3 py-1 bg-red-950 hover:bg-red-900 text-red-200 text-xs font-bold rounded border border-red-900"
                                        >
                                            Consume
                                        </button>
                                    )}
                                    {item.type !== 'consumable' && (
                                        <span className="text-[10px] text-slate-700 uppercase font-bold bg-black px-2 py-1 rounded border border-slate-900">{item.type}</span>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        )}

        {activeTab === 'market' && (
            <div className="p-6 flex flex-col items-center">
                 <div className="w-full max-w-lg">
                    <div className="mb-4 flex items-center justify-between">
                         <h3 className="text-amber-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                            <Store size={14}/> Local Goods
                         </h3>
                         <div className="flex items-center gap-1 bg-black px-3 py-1 rounded border border-amber-900/50">
                            <Coins size={12} className="text-amber-500"/>
                            <span className="text-amber-500 font-bold text-sm">{playerStats.gold} G</span>
                         </div>
                    </div>

                    <div className="space-y-3">
                         {marketData?.items && marketData.items.length > 0 ? (
                             marketData.items.map((marketItem, idx) => {
                                 const item = ITEMS[marketItem.itemId];
                                 if (!item) return null;
                                 
                                 const canAfford = playerStats.gold >= marketItem.buyPrice;
                                 const haveItem = (groupedInventory[marketItem.itemId] || 0) > 0;

                                 return (
                                     <div key={idx} className="bg-slate-950 p-4 rounded border border-slate-900 flex flex-col md:flex-row gap-4 items-center justify-between">
                                         <div className="flex-1">
                                             <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-200">{item.name}</span>
                                                {haveItem && <span className="text-[10px] bg-slate-800 px-1.5 rounded text-slate-500">Owned: {groupedInventory[marketItem.itemId]}</span>}
                                             </div>
                                             <div className="text-xs text-slate-600 mt-1">{item.description}</div>
                                         </div>
                                         
                                         <div className="flex gap-2">
                                             <button
                                                onClick={() => onTrade(marketItem.itemId, true, marketItem.buyPrice)}
                                                disabled={!canAfford}
                                                className="flex flex-col items-center justify-center px-4 py-2 bg-slate-900 hover:bg-emerald-900/30 border border-slate-800 hover:border-emerald-700 rounded disabled:opacity-30 disabled:hover:bg-slate-900 transition-colors"
                                             >
                                                <span className="text-[10px] text-slate-500 uppercase font-bold">Buy</span>
                                                <span className={`font-bold text-sm ${canAfford ? 'text-emerald-400' : 'text-red-500'}`}>{marketItem.buyPrice} G</span>
                                             </button>

                                             <button
                                                onClick={() => onTrade(marketItem.itemId, false, marketItem.sellPrice)}
                                                disabled={!haveItem}
                                                className="flex flex-col items-center justify-center px-4 py-2 bg-slate-900 hover:bg-amber-900/30 border border-slate-800 hover:border-amber-700 rounded disabled:opacity-30 disabled:hover:bg-slate-900 transition-colors"
                                             >
                                                <span className="text-[10px] text-slate-500 uppercase font-bold">Sell</span>
                                                <span className="font-bold text-sm text-amber-400">{marketItem.sellPrice} G</span>
                                             </button>
                                         </div>
                                     </div>
                                 )
                             })
                         ) : (
                             <div className="text-center text-slate-600 italic py-8 border border-dashed border-slate-800 rounded">
                                 There is no market here. Only ghosts trade in whispers.
                             </div>
                         )}
                    </div>
                    
                    <div className="text-center text-xs text-slate-700 mt-6 italic font-serif">
                        "Prices fluctuate like the tides. Buy low in the villages, sell high in the capital."
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'craft' && (
             <div className="p-6">
                 <div className="grid grid-cols-1 gap-4">
                    {CRAFTING_RECIPES.map(recipe => {
                      const hasIngredients = Object.entries(recipe.ingredients).every(([id, reqCount]) => {
                          return (groupedInventory[id] || 0) >= reqCount;
                      });

                      return (
                        <div key={recipe.id} className="p-4 rounded border bg-slate-950 border-slate-900 flex justify-between items-center">
                          <div>
                             <h3 className="font-bold text-slate-300 text-sm">{recipe.name}</h3>
                             <div className="flex flex-wrap gap-2 mt-1 text-xs text-slate-600">
                                {Object.entries(recipe.ingredients).map(([id, val]) => {
                                    const itemName = ITEMS[id]?.name || id;
                                    const haveCount = groupedInventory[id] || 0;
                                    const isEnough = haveCount >= val;
                                    return (
                                        <span key={id} className={isEnough ? 'text-slate-500' : 'text-red-500'}>
                                            {itemName}: {haveCount}/{val}
                                        </span>
                                    );
                                })}
                             </div>
                          </div>
                          <button 
                             onClick={() => onCraft && onCraft(recipe.id)}
                             disabled={!hasIngredients}
                             className="px-3 py-1 rounded font-bold text-xs bg-violet-900 hover:bg-violet-800 text-violet-200 disabled:bg-black disabled:text-slate-800 disabled:cursor-not-allowed border border-violet-950 disabled:border-slate-900"
                          >
                             Craft
                          </button>
                        </div>
                      )
                    })}
                 </div>
             </div>
        )}
      </div>
    </div>
  );
};

export default GameInterface;
