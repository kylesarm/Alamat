

import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import InteractiveMap from './components/InteractiveMap';
import InfoPanel from './components/InfoPanel';
import GameInterface from './components/GameInterface';
import GameHUD from './components/GameHUD';
import AudioController from './components/AudioController';
import TravelConfirmation from './components/TravelConfirmation';
import { GAME_SECTIONS, QUESTS, MUNICIPALITIES, EXPLORATION_EVENTS, MARKETS, MAP_LAYOUT, CRAFTING_RECIPES, DIALOGUES, ITEMS } from './constants';
import { PlayerStats, GameEvent, WeatherCondition, MusicMood, AmbienceType, DialogueNode } from './types';
import { Skull, RotateCcw, User, ArrowRight } from 'lucide-react';

const INITIAL_STATS: PlayerStats = {
  name: '',
  health: 100, // BUFFED: Was 75
  stamina: 100, // BUFFED: Was 75
  supplies: 5,  // BUFFED: Was 2
  gold: 50,     // BUFFED: Was 10
  reputation: 0,
  maxHealth: 100,
  maxStamina: 100,
  xp: 0,
  level: 1,
  currentObjective: "Speak to the survivors in Virac to find a path through the Shroud.",
  resources: {
    abaca: 0,
    wood: 0,
    metal: 0,
    shard: 0
  },
  inventory: [],
  equipped: {}
};

const COMMON_LOOT_TABLE = [
  'scrap_metal', 'scrap_metal', 'scrap_metal', 
  'dried_herbs', 'dried_herbs', 
  'old_currency', 'old_currency',
  'sack_of_rice',
  'alcohol' // Rubbing alcohol/antiseptic
];

const App: React.FC = () => {
  // Navigation State
  const [activeSection, setActiveSection] = useState<string>('concept');
  const [selectedMunicipality, setSelectedMunicipality] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'lore' | 'game'>('lore');

  // Game State
  const [playerStats, setPlayerStats] = useState<PlayerStats>(INITIAL_STATS);
  const [currentLocation, setCurrentLocation] = useState<string>('virac');
  const [currentSubLocation, setCurrentSubLocation] = useState<string | null>(null);
  const [unlockedRegions, setUnlockedRegions] = useState<string[]>(['virac']);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [visitedLocations, setVisitedLocations] = useState<Set<string>>(new Set(['virac']));
  const [gameLogs, setGameLogs] = useState<string[]>([]);
  const [weather, setWeather] = useState<WeatherCondition>('sunny');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  
  // Interaction State
  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
  const [activeDialogue, setActiveDialogue] = useState<DialogueNode | null>(null);
  
  // Travel State
  const [travelIntent, setTravelIntent] = useState<{
    id: string;
    type: 'travel' | 'fast_travel';
    cost: number;
  } | null>(null);

  // Name Entry State
  const [nameInput, setNameInput] = useState('');

  // Start with Intro
  useEffect(() => {
    if (viewMode === 'game' && playerStats.name && gameLogs.length === 0 && !activeDialogue) {
       setActiveDialogue(DIALOGUES['intro_sequence']);
    }
  }, [viewMode, playerStats.name]);

  // Handle Location-Specific Narrative Intros
  useEffect(() => {
    if (viewMode === 'game' && !activeDialogue && !activeEvent) {
      // Dynamic Arrival Logic: Checks for {locationId}_arrival in DIALOGUES
      const arrivalDialogueId = `${currentLocation}_arrival`;
      
      if (!visitedLocations.has(currentLocation) && DIALOGUES[arrivalDialogueId]) {
         setActiveDialogue(DIALOGUES[arrivalDialogueId]);
         setVisitedLocations(prev => new Set(prev).add(currentLocation));
      } else if (!visitedLocations.has(currentLocation)) {
         // Mark visited even if no dialogue exists to prevent repeated checks
         setVisitedLocations(prev => new Set(prev).add(currentLocation));
      }
    }
  }, [currentLocation, viewMode, activeDialogue, activeEvent, visitedLocations]);


  // --- AUDIO STATE CALCULATION ---
  const getMusicMood = (): MusicMood => {
    if (isGameOver) return 'gameover';
    if (viewMode !== 'game') return 'menu';
    if (!playerStats.name) return 'menu';
    if (activeEvent) return 'combat';
    if (activeDialogue && activeDialogue.id.includes('combat')) return 'combat';
    if (activeDialogue) return 'calm';
    if (weather === 'storm') return 'danger';
    return 'calm';
  };

  const getAmbience = (): AmbienceType => {
    if (viewMode !== 'game') return 'none';
    if (!playerStats.name) return 'ocean';
    if (weather === 'rain') return 'rain';
    if (weather === 'storm') return 'storm';
    return 'ocean';
  };
  // -------------------------------

  useEffect(() => {
    if (viewMode === 'game') {
      const el = document.getElementById('log-end');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [gameLogs, viewMode]);

  useEffect(() => {
    if (playerStats.health <= 0 && !isGameOver) {
      setIsGameOver(true);
      setGameLogs(prev => [...prev, "FATAL: You have died. Game Over."]);
    }
  }, [playerStats.health]);

  const restartGame = () => {
    setPlayerStats(INITIAL_STATS);
    setCurrentLocation('virac');
    setCurrentSubLocation(null);
    setUnlockedRegions(['virac']);
    setCompletedQuests([]);
    setVisitedLocations(new Set(['virac']));
    setGameLogs(["Welcome back. Try not to die this time."]);
    setIsGameOver(false);
    setWeather('sunny');
    setActiveEvent(null);
    setActiveDialogue(null); // Fix: Clear dialogue to prevent story overlap
    setTravelIntent(null);
    setNameInput('');
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim().length > 0) {
      setPlayerStats(prev => ({ ...prev, name: nameInput.trim() }));
    }
  };

  const addLog = (text: string) => {
    const processedText = text.replace(/{player}/g, playerStats.name);
    setGameLogs(prev => [...prev, processedText]);
  };

  const changeWeather = () => {
    const rand = Math.random();
    let newWeather: WeatherCondition = 'sunny';
    if (rand > 0.6) newWeather = 'rain';
    if (rand > 0.9) newWeather = 'storm';
    setWeather(newWeather);
    if (newWeather !== weather) {
      addLog(`Weather Update: The sky turns to ${newWeather.toUpperCase()}.`);
    }
  };

  const handleSelectMunicipality = (id: string) => {
    if (viewMode === 'game') {
      if (isGameOver) return;
      if (!playerStats.name) return;
      if (activeDialogue) return;
      if (id === currentLocation) return;
      
      const currentLayout = MAP_LAYOUT[currentLocation];
      const isNeighbor = currentLayout.neighbors.includes(id);
      
      const isUnlocked = unlockedRegions.includes(id);
      const isVisited = visitedLocations.has(id);

      // Fix: Strict lock check. Neighbors require unlocking via story/writ.
      if (!isUnlocked) {
        addLog(`LOCKED: The path to ${MUNICIPALITIES[id].name} is blocked or unknown.`);
        return;
      }
      
      if (isNeighbor) {
        // DIFFICULTY REDUCTION: Backtracking to visited locations is FREE
        if (isVisited) {
            setTravelIntent({ id, type: 'travel', cost: 0 });
        } else {
            const targetDifficulty = MUNICIPALITIES[id].difficulty;
            let travelCost = 15 * targetDifficulty;
            if (weather === 'rain') travelCost += 15;
            if (weather === 'storm') travelCost += 30;

            setTravelIntent({ id, type: 'travel', cost: travelCost });
        }
      } else if (isUnlocked) {
        const fastTravelCost = 3;
        setTravelIntent({ id, type: 'fast_travel', cost: fastTravelCost });
      }
    } else {
      setSelectedMunicipality(id);
      setViewMode('map');
    }
  };

  const confirmTravel = () => {
    if (!travelIntent) return;
    const { id, type, cost } = travelIntent;

    if (type === 'travel') {
        if (playerStats.stamina >= cost) {
           const targetDifficulty = MUNICIPALITIES[id].difficulty;
           const baseChance = 0.4;
           const weatherMod = weather === 'storm' ? 0.4 : 0;
           const difficultyMod = targetDifficulty * 0.1;
           const encounterChance = baseChance + weatherMod + difficultyMod;
           const rolled = Math.random();
           
           setPlayerStats(prev => ({ ...prev, stamina: prev.stamina - cost }));
           setCurrentLocation(id);
           setCurrentSubLocation(null); // Reset sub location on travel
           setSelectedMunicipality(id);
           setGameLogs([]); 
           
           if (cost === 0) {
             addLog(`Traveled to ${MUNICIPALITIES[id].name} via safe route. (No Stamina Cost)`);
           } else {
             addLog(`Traveled to ${MUNICIPALITIES[id].name}. Stamina -${cost}.`);
             if (rolled < encounterChance) {
                triggerRandomEvent(targetDifficulty);
             }
           }
           
           changeWeather();
         }
    } else {
         if (playerStats.supplies >= cost) {
            setPlayerStats(prev => ({ ...prev, supplies: prev.supplies - cost }));
            setCurrentLocation(id);
            setCurrentSubLocation(null); // Reset sub location on fast travel
            setSelectedMunicipality(id);
            setGameLogs([]);
            addLog(`FAST TRAVEL: Arrived in ${MUNICIPALITIES[id].name}. (-${cost} Supplies)`);
            changeWeather();
         }
    }
    setTravelIntent(null);
  };

  const triggerRandomEvent = (difficultyLevel: number) => {
    const eligibleEvents = EXPLORATION_EVENTS.filter(e => {
      if (e.minDifficulty && e.minDifficulty > difficultyLevel) return false;
      return true;
    });

    if (eligibleEvents.length > 0) {
       const randomEvent = eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)];
       setActiveEvent(randomEvent);
    }
  };

  // NEW: Generate loot based on creature slaughter/event success
  const generateCombatLoot = (difficulty: number) => {
    const loot: { gold: number, items: string[] } = { gold: 0, items: [] };
    
    // 1. Gold (Random amount scaled by difficulty)
    // Base 5-15 + (Difficulty * 5-15)
    const baseGold = Math.floor(Math.random() * 10) + 5;
    const difficultyBonus = (Math.floor(Math.random() * 10) + 5) * difficulty;
    loot.gold = baseGold + difficultyBonus;

    // 2. Rare Drops (Potion/Holy Water)
    // Chance increases slightly with difficulty, but stays rare.
    // Base 2% + (Difficulty * 2%)
    const rareChance = 0.02 + (difficulty * 0.02); 
    
    if (Math.random() < rareChance) {
        if (Math.random() > 0.5) {
            loot.items.push('healing_potion');
        } else {
            loot.items.push('holy_water');
        }
    }

    return loot;
  };

  const resolveEvent = (updatedStats: Partial<PlayerStats>, log: string) => {
    let finalStats = { ...updatedStats };
    let finalLog = log;

    // Check if the event resolution indicates a kill/success (usually via XP gain)
    const xpGained = (updatedStats.xp || 0) - playerStats.xp;
    
    if (xpGained > 0) {
        const difficulty = MUNICIPALITIES[currentLocation].difficulty;
        const loot = generateCombatLoot(difficulty);
        
        if (loot.gold > 0 || loot.items.length > 0) {
            finalStats.gold = (finalStats.gold || playerStats.gold) + loot.gold;
            finalStats.inventory = [...(finalStats.inventory || playerStats.inventory), ...loot.items];
            
            let lootStr = ` Looted: ${loot.gold} Gold`;
            if (loot.items.length > 0) {
                const itemNames = loot.items.map(id => ITEMS[id].name).join(', ');
                lootStr += ` and ${itemNames}`;
            }
            finalLog += lootStr + ".";
        }
    }

    setPlayerStats(prev => ({
      ...prev,
      ...finalStats,
      health: Math.min(prev.maxHealth, Math.max(0, finalStats.health ?? prev.health)),
      stamina: Math.min(prev.maxStamina, Math.max(0, finalStats.stamina ?? prev.stamina)),
      supplies: Math.max(0, finalStats.supplies ?? prev.supplies),
      gold: Math.max(0, finalStats.gold ?? prev.gold),
      reputation: Math.max(-100, Math.min(100, finalStats.reputation ?? prev.reputation)),
      inventory: finalStats.inventory ? finalStats.inventory : prev.inventory,
      currentObjective: finalStats.currentObjective ? finalStats.currentObjective : prev.currentObjective
    }));
    addLog(finalLog);
    setActiveEvent(null);
  };

  const handleCraftAction = (recipeId: string) => {
    const recipe = CRAFTING_RECIPES.find(r => r.id === recipeId);
    if (!recipe) return;

    setPlayerStats(prev => {
      const newInventory = [...prev.inventory];
      let canCraft = true;

      // Check and remove ingredients
      for (const [itemId, reqCount] of Object.entries(recipe.ingredients)) {
          let count = 0;
          for (let i = newInventory.length - 1; i >= 0; i--) {
              if (newInventory[i] === itemId) {
                  count++;
                  if (count <= reqCount) {
                      newInventory.splice(i, 1);
                  }
              }
          }
          if (count < reqCount) canCraft = false; // Should be handled by UI check too
      }

      if (!canCraft) return prev;

      return {
        ...prev,
        inventory: [...newInventory, recipe.resultItemId]
      };
    });
    addLog(`Crafted ${recipe.name}.`);
  };

  const handleTrade = (itemId: string, isBuying: boolean, price: number) => {
      setPlayerStats(prev => {
          if (isBuying) {
              if (prev.gold >= price) {
                  addLog(`Bought ${ITEMS[itemId].name} for ${price} G.`);
                  return {
                      ...prev,
                      gold: prev.gold - price,
                      inventory: [...prev.inventory, itemId]
                  }
              }
          } else {
              const idx = prev.inventory.indexOf(itemId);
              if (idx > -1) {
                  const newInv = [...prev.inventory];
                  newInv.splice(idx, 1);
                  addLog(`Sold ${ITEMS[itemId].name} for ${price} G.`);
                  return {
                      ...prev,
                      gold: prev.gold + price,
                      inventory: newInv
                  }
              }
          }
          return prev;
      });
  };

  const handleConsumeItem = (itemId: string) => {
      const item = ITEMS[itemId];
      if (item && item.onConsume) {
          setPlayerStats(prev => {
              const newStats = item.onConsume!(prev);
              const idx = prev.inventory.indexOf(itemId);
              const newInv = [...prev.inventory];
              if (idx > -1) newInv.splice(idx, 1);
              
              return {
                  ...prev,
                  ...newStats,
                  inventory: newInv,
                  health: Math.min(prev.maxHealth, newStats.health ?? prev.health),
                  stamina: Math.min(prev.maxStamina, newStats.stamina ?? prev.stamina)
              }
          });
          addLog(`Used ${item.name}.`);
      }
  };

  const startDialogue = (dialogueId: string) => {
    if (DIALOGUES[dialogueId]) {
      setActiveDialogue(DIALOGUES[dialogueId]);
    } else {
      addLog(`Error: Dialogue ${dialogueId} not found.`);
    }
  };

  const handleDialogueOption = (nextId?: string, effect?: (s: PlayerStats) => Partial<PlayerStats>, log?: string) => {
    if (effect) {
        setPlayerStats(prev => {
            const newStats = effect(prev);
            return {
                ...prev,
                ...newStats,
                health: Math.min(prev.maxHealth, Math.max(0, newStats.health ?? prev.health)),
                inventory: newStats.inventory ? newStats.inventory : prev.inventory,
                currentObjective: newStats.currentObjective ? newStats.currentObjective : prev.currentObjective,
                gold: newStats.gold ?? prev.gold,
                xp: newStats.xp ?? prev.xp,
                reputation: newStats.reputation ?? prev.reputation
            }
        });
    }
    if (log) addLog(log);

    if (nextId && DIALOGUES[nextId]) {
        setActiveDialogue(DIALOGUES[nextId]);
    } else {
        setActiveDialogue(null);
        if (log && log.includes("Writ")) {
             setUnlockedRegions(prev => Array.from(new Set([...prev, ...MAP_LAYOUT[currentLocation].neighbors])));
             addLog("Routes unlocked via Travel Writ.");
        }
        if (log && log.includes("Quest Complete")) {
             setUnlockedRegions(prev => Array.from(new Set([...prev, ...MAP_LAYOUT[currentLocation].neighbors])));
             addLog("New paths revealed.");
        }
    }
  };

  const handleGameAction = (action: 'explore' | 'quest' | 'rest') => {
    if (isGameOver) return;
    if (activeEvent || activeDialogue) return;

    if (action === 'rest') {
      // CHANGED: Resting now costs 5 supplies
      if (playerStats.supplies >= 5) {
        setPlayerStats(prev => ({
          ...prev,
          stamina: Math.min(prev.maxStamina, prev.stamina + 100), // Full rest
          health: Math.min(prev.maxHealth, prev.health + 50),
          supplies: prev.supplies - 5
        }));
        addLog("You used 5 rations to rest safely. (+Health, +Stamina)");
      } else {
        setPlayerStats(prev => ({
          ...prev,
          stamina: Math.min(prev.maxStamina, prev.stamina + 20),
          health: Math.max(0, prev.health - 20)
        }));
        addLog("Not enough rations (Need 5). You slept hungry on the street. (-20 Health)");
      }
      changeWeather(); 
      return;
    }

    if (action === 'explore') {
      if (playerStats.stamina < 5) {
        addLog("Too tired to explore. Rest first.");
        return;
      }

      setPlayerStats(prev => ({ ...prev, stamina: prev.stamina - 5 }));
      
      const roll = Math.random();
      
      // 50% Chance for LOOT (Needed for crafting/quests)
      if (roll < 0.50) {
        const lootItem = COMMON_LOOT_TABLE[Math.floor(Math.random() * COMMON_LOOT_TABLE.length)];
        const itemName = ITEMS[lootItem]?.name || lootItem;
        
        setPlayerStats(prev => ({
          ...prev,
          inventory: [...prev.inventory, lootItem]
        }));
        
        const flavorTexts = [
          "You scavenged through the ruins.",
          "You found something hidden in the ash.",
          "A corpse held something useful.",
          "Buried in the mud, you found a prize."
        ];
        addLog(`${flavorTexts[Math.floor(Math.random() * flavorTexts.length)]} Found: ${itemName}.`);
      } 
      // 30% Chance for EVENT (Danger/Story)
      else if (roll < 0.80) {
        triggerRandomEvent(MUNICIPALITIES[currentLocation].difficulty);
      } 
      // 20% Flavor Text (Atmosphere)
      else {
        const atmosphere = [
          "The wind howls like a dying animal.",
          "You see shadows moving in the distance, but they vanish when you look.",
          "The smell of burning wood and ozone fills the air.",
          "You found nothing but dust and despair."
        ];
        addLog(atmosphere[Math.floor(Math.random() * atmosphere.length)]);
      }
      return;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      
      <AudioController musicMood={getMusicMood()} ambience={getAmbience()} />

      {/* Travel Confirmation Modal */}
      {travelIntent && (
        <TravelConfirmation 
          target={MUNICIPALITIES[travelIntent.id]}
          type={travelIntent.type}
          cost={travelIntent.cost}
          playerStats={playerStats}
          weather={weather}
          onConfirm={confirmTravel}
          onCancel={() => setTravelIntent(null)}
        />
      )}

      {/* Game Over Modal */}
      {isGameOver && (
        <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-6">
          <Skull size={64} className="text-red-600 mb-4" />
          <h1 className="text-5xl font-display text-red-500 mb-2">YOU DIED</h1>
          <button 
            onClick={restartGame}
            className="flex items-center gap-2 px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-bold rounded-lg transition-all"
          >
            <RotateCcw /> Restart Journey
          </button>
        </div>
      )}

      {/* Name Input Modal */}
      {viewMode === 'game' && !playerStats.name && !isGameOver && (
        <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-sm flex flex-col items-center justify-center p-6">
           <div className="max-w-md w-full bg-slate-900 border border-emerald-500/30 p-8 rounded-2xl shadow-2xl">
              <h2 className="text-3xl font-display text-emerald-400 mb-4 text-center">Identity</h2>
              <p className="text-slate-400 mb-6 text-center">Before you wash ashore, tell us... who are you?</p>
              <form onSubmit={handleNameSubmit} className="space-y-4">
                 <div className="relative">
                    <User className="absolute left-3 top-3.5 text-slate-500" size={20} />
                    <input 
                      type="text" 
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="Enter your name..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-emerald-500 focus:outline-none transition-colors"
                      maxLength={15}
                      autoFocus
                    />
                 </div>
                 <button 
                   type="submit"
                   disabled={nameInput.trim().length === 0}
                   className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                 >
                   Begin Journey <ArrowRight size={18} />
                 </button>
              </form>
           </div>
        </div>
      )}

      <Navigation 
        sections={GAME_SECTIONS}
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <main className="flex-1 flex flex-col relative">
        {viewMode === 'game' && <GameHUD stats={playerStats} weather={weather} />}

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          <div className={`
            transition-all duration-500 ease-in-out relative z-10 bg-slate-900 border-r border-slate-800
            ${viewMode === 'map' || viewMode === 'game' ? 'flex-1 h-[40vh] md:h-full opacity-100' : 'h-0 md:h-full md:w-1/2 opacity-0 md:opacity-100 overflow-hidden'}
          `}>
             <div className="absolute top-4 left-4 z-20 pointer-events-none">
                <h2 className="text-white/20 font-display text-4xl font-bold tracking-widest">
                  {viewMode === 'game' ? 'NAVIGATE' : 'ISLA'}
                </h2>
             </div>
             <InteractiveMap 
               selectedMunicipality={viewMode === 'game' ? currentLocation : selectedMunicipality}
               onSelectMunicipality={handleSelectMunicipality}
               weather={weather}
               currentLocation={currentLocation}
               isGameMode={viewMode === 'game'}
               unlockedRegions={unlockedRegions}
               completedQuests={completedQuests}
             />
          </div>

          <div className={`
            bg-slate-950 flex-1 h-full overflow-hidden relative
            ${viewMode === 'lore' ? 'w-full' : 'flex-1'}
          `}>
            {viewMode === 'game' ? (
              <GameInterface 
                currentLocationId={currentLocation}
                currentSubLocationId={currentSubLocation}
                onEnterSubLocation={setCurrentSubLocation}
                playerStats={playerStats}
                completedQuests={completedQuests}
                logs={gameLogs}
                activeEvent={activeEvent}
                activeDialogue={activeDialogue}
                onAction={handleGameAction}
                onResolveEvent={resolveEvent}
                onCraft={handleCraftAction}
                onConsume={handleConsumeItem}
                onStartDialogue={startDialogue}
                onDialogueOption={handleDialogueOption}
                onTrade={handleTrade}
              />
            ) : (
              <InfoPanel 
                viewMode={viewMode}
                selectedMunicipality={selectedMunicipality}
                activeSection={activeSection}
              />
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;