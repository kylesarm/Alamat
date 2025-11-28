

export interface SubLocation {
  id: string;
  name: string;
  description: string;
  type: 'landmark' | 'building' | 'danger_zone' | 'hub' | 'store';
}

export interface MunicipalityData {
  id: string;
  name: string;
  title: string;
  description: string;
  environment: string;
  poi: string[];
  quests: string;
  resources: string;
  faction: string;
  difficulty: number; // 1 (Easy) to 5 (Hell)
  subLocations: SubLocation[]; // NEW: List of visitable places
  npcs: NPC[];
}

export interface GameSection {
  id: string;
  title: string;
  content: string;
}

export type WeatherCondition = 'sunny' | 'rain' | 'storm';

export type MusicMood = 'menu' | 'calm' | 'adventure' | 'combat' | 'danger' | 'gameover';
export type AmbienceType = 'none' | 'ocean' | 'rain' | 'storm';

export type CraftingMaterial = 'abaca' | 'wood' | 'metal' | 'shard';

export type ItemType = 'weapon' | 'armor' | 'consumable' | 'material' | 'quest' | 'trade' | 'accessory';

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  description: string;
  effectDescription?: string;
  value: number;
  stats?: {
    attack?: number;
    defense?: number;
    healthBonus?: number;
    staminaBonus?: number;
  };
  onConsume?: (stats: PlayerStats) => Partial<PlayerStats>;
}

export interface CraftingRecipe {
  id: string;
  resultItemId: string;
  name: string;
  description: string;
  ingredients: Record<string, number>; // Item ID -> Count
}

export interface PlayerStats {
  name: string; // Added player name
  health: number;
  stamina: number;
  supplies: number;
  gold: number;
  reputation: number; // -100 to 100
  maxHealth: number;
  maxStamina: number;
  xp: number;
  level: number;
  currentObjective: string; // NEW: Tracks the active main quest step
  resources: Record<CraftingMaterial, number>; // Deprecated but kept for type safety in old code
  inventory: string[]; // List of Item IDs
  equipped: {
    weapon?: string;
    armor?: string;
    accessory?: string;
  };
}

export interface QuestData {
  id: string;
  title: string;
  description: string;
  story: string;
  actionLabel: string;
  costType: 'stamina' | 'supplies' | 'health' | 'gold' | 'none';
  costAmount: number;
  reqItem?: string; 
  consumeItem?: boolean; 
  reqLevel?: number; 
  rewardXP: number;
  rewardGold: number;
  rewardSupplies: number;
  successMessage: string;
}

export interface MarketItem {
  itemId: string;
  buyPrice: number;
  sellPrice: number;
}

export interface MarketData {
  items: MarketItem[];
}

export interface GameEventOption {
  label: string;
  description?: string;
  reqStamina?: number;
  reqGold?: number;
  reqItem?: string;
  effect: (currentStats: PlayerStats) => Partial<PlayerStats>;
  outcomeLog: string;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  imageIcon?: any;
  options: GameEventOption[];
  minDifficulty?: number; 
}

export interface MapLayoutData {
  id: string;
  path: string;
  color: string;
  x: number; 
  y: number; 
  neighbors: string[];
}

// --- VN / DIALOGUE TYPES ---

export interface DialogueOption {
  label: string;
  nextId?: string; // if undefined, ends dialogue
  reqItem?: string;
  reqStat?: { stat: keyof PlayerStats; value: number };
  effect?: (stats: PlayerStats) => Partial<PlayerStats>;
  outcomeLog?: string;
}

export interface DialogueNode {
  id: string;
  text: string;
  speaker: string; // 'Player' | NPC Name | 'Narrator'
  options: DialogueOption[];
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  description: string;
  avatarEmoji: string;
  dialogueStartId: string;
  subLocationId: string; // NEW: Determines where the NPC stands
}