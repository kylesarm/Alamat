

import { GameSection, MunicipalityData, QuestData, MarketData, GameEvent, MapLayoutData, CraftingRecipe, Item, DialogueNode, NPC } from './types';

// --- AUDIO CONFIGURATION ---
export const MUSIC_TRACKS = {
  menu: { title: 'Requiem for the Lost', src: '/audio/music/menu_theme.mp3' },
  calm: { title: 'The Silent Void', src: '/audio/music/town_calm.mp3' },
  adventure: { title: 'Walking the Abyss', src: '/audio/music/exploration.mp3' },
  combat: { title: 'Blood and Iron', src: '/audio/music/combat_drums.mp3' },
  danger: { title: 'The Eldritch Howl', src: '/audio/music/storm_tension.mp3' },
  gameover: { title: 'Eternal Slumber', src: '/audio/music/death.mp3' }
};

export const AMBIENCE_TRACKS = {
  ocean: { title: 'Whispering Tides', src: '/audio/sfx/ocean_breeze.mp3' },
  rain: { title: 'Acid Rain', src: '/audio/sfx/heavy_rain.mp3' },
  storm: { title: 'Screaming Winds', src: '/audio/sfx/storm_gale.mp3' },
  none: { title: 'The Void', src: '' }
};
// ---------------------------

export const ITEMS: Record<string, Item> = {
  // --- RAW MATERIALS (Buyable in Markets) ---
  sack_of_rice: {
    id: 'sack_of_rice',
    name: 'Sack of Rice',
    type: 'consumable',
    description: 'A heavy sack of grain. Essential for long journeys. (+5 Supplies)',
    value: 20, // Base value
    onConsume: (s) => ({ supplies: s.supplies + 5 })
  },
  wood_plank: {
    id: 'wood_plank',
    name: 'Hardwood Plank',
    type: 'material',
    description: 'Sturdy timber. Plentiful in Bato.',
    value: 15
  },
  abaca_fiber: {
    id: 'abaca_fiber',
    name: 'Abaca Fiber',
    type: 'material',
    description: 'Tough fibers from Viga. Used for weaving armor.',
    value: 15
  },
  raw_salt: {
    id: 'raw_salt',
    name: 'Raw Sea Salt',
    type: 'material',
    description: 'Coarse salt harvested from San Andres. Needs blessing to be effective against monsters.',
    value: 10
  },
  coconut_sap: {
    id: 'coconut_sap',
    name: 'Coconut Sap',
    type: 'material',
    description: 'Sweet sap harvested in Gigmoto. Base for oil and wine.',
    value: 12
  },
  empty_vial: {
    id: 'empty_vial',
    name: 'Empty Glass Vial',
    type: 'material',
    description: ' scavenged glass container. Needed for alchemy.',
    value: 25
  },
  scrap_metal: {
    id: 'scrap_metal',
    name: 'Scrap Metal',
    type: 'material',
    description: 'Rusted bits of old vehicles. Valuable for weapons.',
    value: 20
  },
  dried_herbs: {
    id: 'dried_herbs',
    name: 'Jungle Herbs',
    type: 'material',
    description: 'Common medicinal roots found in Gigmoto.',
    value: 10
  },
  tobacco_leaf: {
    id: 'tobacco_leaf',
    name: 'Dried Tobacco',
    type: 'trade',
    description: 'A bundle of pungent leaves. Highly prized by Kapres.',
    value: 40
  },
  old_currency: {
    id: 'old_currency',
    name: 'Old Peso Notes',
    type: 'trade',
    description: 'Worthless to the world, but valuable to collectors in Virac.',
    value: 50
  },
  alcohol: {
    id: 'alcohol',
    name: 'Rubbing Alcohol',
    type: 'material',
    description: 'Industrial grade. Base for medicine.',
    value: 30
  },

  // --- CRAFTED CONSUMABLES (Must be Crafted) ---
  healing_salve: {
    id: 'healing_salve',
    name: 'Blood Vial',
    type: 'consumable',
    description: 'A crimson liquid that knits flesh back together. (+40 HP)',
    value: 100,
    onConsume: (s) => ({ health: Math.min(s.maxHealth, s.health + 40) })
  },
  tuba_wine: {
    id: 'tuba_wine',
    name: 'Tuba (Coconut Wine)',
    type: 'consumable',
    description: 'Fermented coconut sap. Restores Stamina but hurts Health.',
    value: 60,
    onConsume: (s) => ({ stamina: Math.min(s.maxStamina, s.stamina + 30), health: Math.max(0, s.health - 5) })
  },
  salt_packet: {
    id: 'salt_packet',
    name: 'Blessed Salt',
    type: 'consumable',
    description: 'Purified salt mixed with ash. Burns the Manananggal.',
    value: 50,
    stats: { attack: 50 },
    onConsume: (s) => ({ supplies: s.supplies }) // No stat effect, used in events
  },
  coconut_oil: {
    id: 'coconut_oil',
    name: 'Lana (Holy Oil)',
    type: 'consumable',
    description: 'Boiled herbal oil. Reveals Aswangs and burns their skin.',
    value: 80
  },
  antidote: {
    id: 'antidote',
    name: 'Kapre’s Ash',
    type: 'consumable',
    description: 'Ash from a Kapre’s cigar. Cures fungal toxins.',
    value: 120,
    onConsume: (s) => ({ health: Math.min(s.maxHealth, s.health + 15) })
  },
  stamina_leaf: {
    id: 'stamina_leaf',
    name: 'Shadow Root',
    type: 'consumable',
    description: 'A bitter tuber that numbs pain and restores will. (+50 Stamina)',
    value: 40,
    onConsume: (s) => ({ stamina: Math.min(s.maxStamina, s.stamina + 50) })
  },

  // --- RARE LOOT ---
  healing_potion: {
    id: 'healing_potion',
    name: 'Miracle Elixir',
    type: 'consumable',
    description: 'A glowing golden liquid. Rare drop. Fully restores Health.',
    value: 500,
    onConsume: (s) => ({ health: s.maxHealth })
  },
  holy_water: {
    id: 'holy_water',
    name: 'Holy Water',
    type: 'consumable',
    description: 'Consecrated water from the Vatican. Rare drop. Fully restores Will (Stamina).',
    value: 500,
    onConsume: (s) => ({ stamina: s.maxStamina })
  },

  // --- WEAPONS & GEAR (Crafted or Found) ---
  divine_sword: {
    id: 'divine_sword',
    name: 'Bathala’s Fang',
    type: 'weapon',
    description: 'A blade forged from meteorite iron. It glows with a terrifying heat. Kills the strongest entities.',
    value: 2000,
    stats: { attack: 80 }
  },
  iron_sword: {
    id: 'iron_sword',
    name: 'Executioner’s Blade',
    type: 'weapon',
    description: 'A heavy, jagged sword. Required to slay butchers.',
    value: 200,
    stats: { attack: 25 }
  },
  iron_machete: {
    id: 'iron_machete',
    name: 'Rusty Cleaver',
    type: 'weapon',
    description: 'A tool for butchery, repurposed for war.',
    value: 100,
    stats: { attack: 15 }
  },
  bamboo_spear: {
    id: 'bamboo_spear',
    name: 'Runed Bamboo Spear',
    type: 'weapon',
    description: 'Sharpened bamboo inscribed with protection prayers.',
    value: 60,
    stats: { attack: 10 }
  },
  woven_armor: {
    id: 'woven_armor',
    name: 'Shroud Wrappings',
    type: 'armor',
    description: 'Layers of thick cloth blessed by priests.',
    value: 150,
    stats: { defense: 15, healthBonus: 10 }
  },
  tikbalang_hide: {
    id: 'tikbalang_hide',
    name: 'Mane of the Trickster',
    type: 'armor',
    description: 'A cloak made from the thick mane of a Tikbalang.',
    value: 500,
    stats: { defense: 25, staminaBonus: 40 }
  },

  // --- ARTIFACTS ---
  buntot_pagi: {
    id: 'buntot_pagi',
    name: 'Buntot Pagi',
    type: 'weapon',
    description: 'A dried stingray tail whip. The bane of the Aswang.',
    value: 400,
    stats: { attack: 35 }
  },
  travelers_pack: {
    id: 'travelers_pack',
    name: 'Grave Robber’s Bag',
    type: 'accessory',
    description: 'Leather satchel scavenged from a corpse.',
    value: 200,
    stats: { staminaBonus: 20 }
  },
  agimat_stone: {
    id: 'agimat_stone',
    name: 'Black Agimat',
    type: 'accessory',
    description: 'A smooth river stone that feels heavy with protection.',
    value: 800,
    stats: { healthBonus: 40, defense: 10 }
  },
  
  // --- QUEST ITEMS ---
  travel_writ: { id: 'travel_writ', name: 'Blood Writ', type: 'quest', description: 'Grants passage out of Virac.', value: 0 },
  obsidian_rosary: { id: 'obsidian_rosary', name: 'Obsidian Rosary', type: 'quest', description: 'Humming with the screams of Luyang.', value: 1000 },
  sunken_chalice: { id: 'sunken_chalice', name: 'Sunken Chalice', type: 'quest', description: 'A golden cup for the River God.', value: 500 },
  dabids_rebreather: { id: 'dabids_rebreather', name: 'Rusty Rebreather', type: 'quest', description: 'Dabid needs this to breathe underwater.', value: 0 },
  viscera_heart: { id: 'viscera_heart', name: 'Petrified Viscera', type: 'material', description: 'The calcified heart of a Manananggal.', value: 300 },
  sirena_pearl: { id: 'sirena_pearl', name: 'Siren\'s Eye', type: 'material', description: 'A black pearl.', value: 500 }
};

export const CRAFTING_RECIPES: CraftingRecipe[] = [
  {
    id: 'r_sword',
    resultItemId: 'iron_sword',
    name: 'Executioner’s Blade',
    description: 'Forge a heavy blade from scrap.',
    ingredients: { scrap_metal: 4, wood_plank: 2 },
  },
  {
    id: 'r_machete',
    resultItemId: 'iron_machete',
    name: 'Rusty Cleaver',
    description: 'Sharpen scrap metal into a weapon.',
    ingredients: { scrap_metal: 2, wood_plank: 1 },
  },
  {
    id: 'r_spear',
    resultItemId: 'bamboo_spear',
    name: 'Runed Spear',
    description: 'Lightweight weapon for keeping enemies at bay.',
    ingredients: { wood_plank: 1, abaca_fiber: 2 },
  },
  {
    id: 'r_salt',
    resultItemId: 'salt_packet',
    name: 'Blessed Salt',
    description: 'Mix raw salt with herbs and ash.',
    ingredients: { raw_salt: 2, dried_herbs: 1 },
  },
  {
    id: 'r_oil',
    resultItemId: 'coconut_oil',
    name: 'Lana (Holy Oil)',
    description: 'Boil coconut sap with protective herbs.',
    ingredients: { coconut_sap: 2, dried_herbs: 1 },
  },
  {
    id: 'r_tuba',
    resultItemId: 'tuba_wine',
    name: 'Tuba Wine',
    description: 'Ferment coconut sap.',
    ingredients: { coconut_sap: 3 },
  },
  {
    id: 'r_salve',
    resultItemId: 'healing_salve',
    name: 'Blood Vial',
    description: 'Mix medical alcohol with healing herbs.',
    ingredients: { alcohol: 1, dried_herbs: 2, empty_vial: 1 },
  },
  {
    id: 'r_armor',
    resultItemId: 'woven_armor',
    name: 'Shroud Wrappings',
    description: 'Weave protective layers from Abaca.',
    ingredients: { abaca_fiber: 6 },
  }
];

export const MARKETS: Record<string, MarketData> = {
  virac: {
    items: [
      { itemId: 'sack_of_rice', buyPrice: 25, sellPrice: 10 }, // Expensive in city
      { itemId: 'empty_vial', buyPrice: 30, sellPrice: 5 }, // Manufactured
      { itemId: 'alcohol', buyPrice: 40, sellPrice: 10 }, // Medical
      { itemId: 'scrap_metal', buyPrice: 50, sellPrice: 20 }, // High demand
    ]
  },
  viga: {
    items: [
      { itemId: 'sack_of_rice', buyPrice: 10, sellPrice: 5 }, // Source: Very Cheap
      { itemId: 'abaca_fiber', buyPrice: 15, sellPrice: 5 }, // Source
      { itemId: 'wood_plank', buyPrice: 25, sellPrice: 5 },
    ]
  },
  san_andres: {
    items: [
      { itemId: 'raw_salt', buyPrice: 10, sellPrice: 3 }, // Source
      { itemId: 'sack_of_rice', buyPrice: 20, sellPrice: 8 },
      { itemId: 'tuba_wine', buyPrice: 50, sellPrice: 20 }, // Local brew
      { itemId: 'dried_herbs', buyPrice: 15, sellPrice: 5 }, 
    ]
  },
  gigmoto: {
    items: [
      { itemId: 'dried_herbs', buyPrice: 10, sellPrice: 2 }, // Source
      { itemId: 'coconut_sap', buyPrice: 12, sellPrice: 3 }, // Source
      { itemId: 'tobacco_leaf', buyPrice: 30, sellPrice: 10 }, // Source
      { itemId: 'sack_of_rice', buyPrice: 35, sellPrice: 5 }, // Expensive here
    ]
  },
  bato: {
    items: [
      { itemId: 'wood_plank', buyPrice: 15, sellPrice: 5 }, // Driftwood
      { itemId: 'sack_of_rice', buyPrice: 22, sellPrice: 5 },
      { itemId: 'alcohol', buyPrice: 60, sellPrice: 15 }, // Scarcity
    ]
  },
  san_miguel: {
    items: [
      { itemId: 'scrap_metal', buyPrice: 25, sellPrice: 10 }, // Scavenged
      { itemId: 'sack_of_rice', buyPrice: 30, sellPrice: 5 },
      { itemId: 'old_currency', buyPrice: 20, sellPrice: 50 }, // Will buy money cheap, sell high? No, sells cheap.
    ]
  },
  baras: {
    items: [
      { itemId: 'raw_salt', buyPrice: 15, sellPrice: 5 },
      { itemId: 'wood_plank', buyPrice: 20, sellPrice: 5 },
    ]
  },
  // Generic Fallbacks
  panganiban: { items: [{ itemId: 'sack_of_rice', buyPrice: 45, sellPrice: 5 }] },
  bagamanoc: { items: [{ itemId: 'sack_of_rice', buyPrice: 50, sellPrice: 5 }] },
  caramoran: { items: [{ itemId: 'sack_of_rice', buyPrice: 60, sellPrice: 5 }] },
  pandan: { items: [{ itemId: 'sack_of_rice', buyPrice: 100, sellPrice: 5 }] },
};

// --- NPC DIALOGUES (Existing dialogues preserved below) ---
export const DIALOGUES: Record<string, DialogueNode> = {
  
  // --- INTRO SEQUENCE ---
  'intro_sequence': {
    id: 'intro_sequence',
    text: "The ocean is not water here. It is liquid shadow, cold enough to burn your skin. You cough up black silt as the violent waves heave you onto the shore of Virac. The sand beneath your fingers is coarse, dark, and smells of old fires and dried blood.\n\nAbove you, the sky is a bruised purple, choked by swirling clouds that never break—the 'Shroud'. You remember the stories of Catanduanes, the Isle of Howling Winds, but this is no natural storm. This is a graveyard of the world.\n\nYou possess nothing but the sodden rags on your back and a gnawing hunger that feels like a physical weight. To the south, the spires of the Virac Cathedral pierce the gloom like bone needles, offering the only sign of 'civilization' in this nightmare.\n\nYou are alive. For now. But in the shadows of the tree line, you see movement. Things that walk on too many legs. You must move.",
    speaker: 'Narrator',
    options: [
      { label: "[Stoic] Rise and check surroundings.", nextId: 'intro_stand' },
      { label: "[Fearful] Crawl towards the light.", nextId: 'intro_stand' }
    ]
  },
  'intro_stand': {
    id: 'intro_stand',
    text: "You stumble to your feet. The town of Virac lies ahead. It is barricaded, the windows boarded up with driftwood and scrap metal. Smoke rises from a few chimneys, smelling of incense and roasting meat—though you dare not guess what kind.\n\nYour pockets are empty save for a few coins you managed to cling to during the wreck. You need a weapon. You need answers. You need to survive the night.",
    speaker: 'Narrator',
    options: [
      { label: "Enter Virac.", nextId: undefined, outcomeLog: "{player} entered the Citadel of Ash." }
    ]
  },

  // --- GENERIC PLACEHOLDER ---
  'generic_npc': {
    id: 'generic_npc',
    text: "The figure stares at you with hollow eyes, saying nothing. The Shroud has taken their voice, or perhaps they simply have nothing left to say.",
    speaker: 'Survivor',
    options: [
      { label: "Leave them be.", nextId: undefined }
    ]
  },

  // --- LOCATION ARRIVALS ---
  'virac_arrival': {
    id: 'virac_arrival',
    text: "The Citadel of Ash. Virac stands defiant against the darkness, though it is rotting from within. The Cathedral bells toll, not for time, but for the dead.",
    speaker: 'Narrator',
    options: [{ label: "Enter the streets.", nextId: undefined }]
  },

  'san_andres_arrival': {
    id: 'san_andres_arrival',
    text: "You arrive in San Andres. The fog here is thick, tasting of brine and sulfur. To the west, the ocean crashes against jagged cliffs with a rhythm that sounds like a heartbeat.\n\nYour internal voice whispers: 'This place is old. Older than the Shroud. The locals walk with their heads down, as if afraid to look at the horizon.'\n\nYou need to find out why the spirits wail so loudly here. Perhaps there is something hidden in the cliffs.",
    speaker: 'Internal Monologue',
    options: [
      { label: "Look for survivors.", nextId: undefined, outcomeLog: "Arrived in San Andres. The air is heavy with sorrow." }
    ]
  },

  'bato_arrival': {
    id: 'bato_arrival',
    text: "The stench of Bato hits you before the sight does—a cloying mix of stagnant water, decaying wood, and incense that smells uncomfortably like singed hair. The river here has swollen, swallowing the lower districts in a black, oily embrace.\n\nMakeshift bridges of rotting planks connect the upper floors of submerged colonial houses, swaying precariously as hooded figures shuffle across them. Below, the water churns sluggishly. You spot ripples that don't match the current—shapes moving just beneath the surface. The chanting from the cultists echoes off the damp walls: 'Deep is the hunger, deep is the tithe.'",
    speaker: 'Narrator',
    options: [
      { label: "Walk the planks.", nextId: undefined, outcomeLog: "Arrived in Bato. The river watches you." }
    ]
  },

  // Warden Dencio
  'dencio_start': {
    id: 'dencio_start',
    text: "Warden Dencio leans against the barricade of the main bridge. He wears a necklace of river stones and smells of cheap rum.\n\n'Hold it, traveler. The River God is hungry today. The water is rising. If you want to cross into the Cult's territory, you gotta pay the toll.'",
    speaker: 'Warden Dencio',
    options: [
      { label: "[Bribe] Pay 20 Gold.", nextId: 'dencio_pay', reqStat: {stat: 'gold', value: 20} },
      { label: "Who is the River God?", nextId: 'dencio_lore' },
      { label: "Move or I throw you in.", nextId: 'dencio_threat' }
    ]
  },
  'dencio_lore': {
    id: 'dencio_lore',
    text: "Dencio shudders. 'A beast from the before times. Or maybe a demon. Yuri speaks to it. I just feed it. Now pay up or get lost.'",
    speaker: 'Warden Dencio',
    options: [
      { label: "Fine. Here is 20 Gold.", nextId: 'dencio_pay', reqStat: {stat: 'gold', value: 20} }
    ]
  },
  'dencio_pay': {
    id: 'dencio_pay',
    text: "Dencio snatches the coins. 'Wise choice. Go talk to Yuri if you want work. Or Dabid if you want to dig in the trash.'",
    speaker: 'Warden Dencio',
    options: [
      { label: "Cross the bridge.", nextId: undefined, effect: (s) => ({ gold: s.gold - 20, reputation: s.reputation + 5 }) }
    ]
  },
  'dencio_broke': {
    id: 'dencio_broke',
    text: "'No gold?' Dencio spits into the water. 'Then you are meat. The river will take you one way or another. Get lost until you have something shiny.'",
    speaker: 'Warden Dencio',
    options: [
      { label: "Leave.", nextId: undefined }
    ]
  },
  'dencio_threat': {
    id: 'dencio_threat',
    text: "Dencio laughs, pulling a rusted club from his belt. 'You think you're the first tough guy to come here? The mud at the bottom is full of bones like yours.'",
    speaker: 'Warden Dencio',
    options: [
      { label: "Fight him.", nextId: 'dencio_fight' },
      { label: "Back down.", nextId: undefined }
    ]
  },
  'dencio_fight': {
    id: 'dencio_fight',
    text: "He swings the club heavily. He is slow, drunk on rum and power.",
    speaker: 'Narrator',
    options: [
      { 
        label: "[Combat] Kick him into the river", 
        nextId: 'dencio_win', 
        reqStat: {stat: 'stamina', value: 20},
        effect: (s) => ({ stamina: s.stamina - 15, health: s.health - 10 })
      },
      {
        label: "Run Away",
        nextId: undefined,
        effect: (s) => ({ health: s.health - 20 }),
        outcomeLog: "You ran, taking a blow to the shoulder."
      }
    ]
  },
  'dencio_win': {
    id: 'dencio_win',
    text: "You dodge his swing and kick him square in the chest. He tumbles backward over the railing with a splash. \n\nThe water churns violently for a moment, then goes still. Bubbles of red surface. The River God has accepted the offering.",
    speaker: 'Narrator',
    options: [
      { label: "Grim.", nextId: undefined, effect: (s) => ({ xp: s.xp + 300, reputation: s.reputation - 10, gold: s.gold + 40 }), outcomeLog: "You fed the Warden to the river. Found 40 Gold in his stash." }
    ]
  },

  // Yuri (The Zealot)
  'yuri_start': {
    id: 'yuri_start',
    text: "Yuri stands at the edge of the submerged plaza, reading from a waterlogged scroll. His skin is pale, almost translucent. \n\n'The water rises,' he intones, not looking at you. 'Because our faith is dry. The Drowned One demands a relic of the old world. A Golden Chalice, sunk in the church nave.'\n\nHe turns his dead eyes to you. 'Retrieve it, and the Cult will grant you safe passage.'",
    speaker: 'Zealot Yuri',
    options: [
      { label: "I will find this Chalice.", nextId: 'yuri_quest_accept', effect: (s) => ({ currentObjective: "Ask Dabid the Diver about the sunken church." }) },
      { label: "I don't serve monsters.", nextId: 'yuri_refuse' },
      { label: "Here is the Chalice. (Give Item)", nextId: 'yuri_complete', reqItem: 'sunken_chalice' }
    ]
  },
  'yuri_quest_accept': {
    id: 'yuri_quest_accept',
    text: "'Good. Dabid the Diver knows the spot. But do not trust him. He lacks faith. Bring the Chalice to me, and you shall be blessed.'",
    speaker: 'Zealot Yuri',
    options: [{ label: "I'll go find Dabid.", nextId: undefined }]
  },
  'yuri_refuse': {
    id: 'yuri_refuse',
    text: "Yuri smiles thinly. 'Then you shall be part of the foundation.' Guards step forward.",
    speaker: 'Zealot Yuri',
    options: [{ label: "Leave quickly.", nextId: undefined }]
  },
  'yuri_complete': {
    id: 'yuri_complete',
    text: "Yuri takes the barnacle-encrusted cup with trembling hands. 'Yes... the metal of the old gods.'\n\nHe pours a vial of blood into it and tips it into the river. The water seems to recede slightly. 'The Drowned One is pleased. Take this as your reward.'",
    speaker: 'Zealot Yuri',
    options: [
      { 
        label: "Accept Reward", 
        nextId: undefined, 
        effect: (s) => {
           const idx = s.inventory.indexOf('sunken_chalice');
           const newInv = [...s.inventory];
           if(idx > -1) newInv.splice(idx, 1);
           return {
             inventory: [...newInv, 'iron_machete', 'dried_herbs'],
             xp: s.xp + 800,
             gold: s.gold + 200,
             reputation: s.reputation + 20,
             currentObjective: "Quest Complete. The River God is appeased."
           }
        },
        outcomeLog: "Quest Complete: The Drowned God's Tithe."
      }
    ]
  },

  // Dabid (The Diver)
  'dabid_start': {
    id: 'dabid_start',
    text: "Dabid sits on a floating platform, wringing out a wet cloth. He looks tired. \n\n'Another pilgrim for Yuri?' he scoffs. 'Let me guess. He wants the Chalice. The man is obsessed with shiny trash.'",
    speaker: 'Dabid the Diver',
    options: [
      { label: "Can you help me find it?", nextId: 'dabid_quest_intro' },
      { label: "Why don't you get it?", nextId: 'dabid_cynic' },
      { label: "Here is your Rebreather.", nextId: 'dabid_return_item', reqItem: 'dabids_rebreather' },
      { label: "Leave.", nextId: undefined }
    ]
  },
  'dabid_cynic': {
    id: 'dabid_cynic',
    text: "'Because the church is full of Syokoy (mermen) and I can't hold my breath that long anymore. Not since the cannibals stole my gear.'",
    speaker: 'Dabid the Diver',
    options: [{ label: "Tell me about your gear.", nextId: 'dabid_quest_intro' }]
  },
  'dabid_quest_intro': {
    id: 'dabid_quest_intro',
    text: "Dabid spits into the water. 'I need my Rebreather. It's a mask with an air bladder. I was scavenging near San Miguel when Gartz—that damned Butcher—jumped me. He took it.\n\nDon't bother offering him coin. Gartz doesn't negotiate. He just chops. If you want it back... you'll have to kill him. I hope you have a heavy blade.'",
    speaker: 'Dabid the Diver',
    options: [
      { label: "I'll go to San Miguel.", nextId: 'dabid_accept_quest', effect: (s) => ({ currentObjective: "Travel to San Miguel. Kill Gartz the Butcher." }) },
      { label: "Sounds too dangerous.", nextId: undefined }
    ]
  },
  'dabid_accept_quest': {
    id: 'dabid_accept_quest',
    text: "'Watch your back in San Miguel. Gartz wears human skin for an apron. Don't let him get close.'",
    speaker: 'Dabid the Diver',
    options: [{ label: "I'll be back.", nextId: undefined }]
  },
  'dabid_return_item': {
    id: 'dabid_return_item',
    text: "Dabid's eyes widen as you produce the blood-stained mask. 'You... you killed him? Gartz? I never thought I'd see the day.'\n\nHe grabs the mask and checks the seals. 'Hah! Still works. Alright, a deal is a deal.'",
    speaker: 'Dabid the Diver',
    options: [
      { 
        label: "Go get the Chalice.", 
        nextId: 'dabid_dive',
        effect: (s) => {
          const idx = s.inventory.indexOf('dabids_rebreather');
          const newInv = [...s.inventory];
          if(idx > -1) newInv.splice(idx, 1);
          return { inventory: newInv };
        }
      }
    ]
  },
  'dabid_dive': {
    id: 'dabid_dive',
    text: "Dabid straps on the mask. 'Keep watch. If I tug the rope twice, pull me up.'\n\n[TIME SKIP]\n\nYou fend off curious river lurkers while Dabid disappears into the murky depths. Minutes feel like hours. Finally, he surfaces, gasping, clutching a golden cup.\n\n'Got it. Here, take the damn thing. And take this too—found it stuck in the mud.'",
    speaker: 'Narrator',
    options: [
      { 
        label: "Take Chalice & Reward", 
        nextId: undefined, 
        effect: (s) => ({ inventory: [...s.inventory, 'sunken_chalice', 'scrap_metal', 'scrap_metal'], xp: s.xp + 400, currentObjective: "Return the Chalice to Yuri in Bato." }),
        outcomeLog: "Received Sunken Chalice and 2 Scrap Metal from Dabid."
      }
    ]
  },

  // GARTZ THE BUTCHER (San Miguel) - REPLACED KAEL
  'gartz_start': {
    id: 'gartz_start',
    text: "The air in San Miguel is thick with the copper stench of blood. Gartz the Butcher stands behind a block of stained wood, hacking at a limb that looks disturbingly human. He wears the Rebreather around his neck like a trophy.\n\nHe stops chopping and turns to you. His face is hidden behind a mask of stitched skin. 'More meat for the grinder?'",
    speaker: 'Gartz the Butcher',
    options: [
      { label: "I need that mask.", nextId: 'gartz_mask' },
      { label: "Just passing through.", nextId: undefined }
    ]
  },
  'gartz_mask': {
    id: 'gartz_mask',
    text: "Gartz laughs, a wet, guttural sound that rattles his chest. 'This? It keeps the smell out. You want it? Come take it. I need a new skull for my broth anyway.'\n\nHe raises a massive, rusted cleaver. There is no reasoning with this monster.",
    speaker: 'Gartz the Butcher',
    options: [
      { label: "[Fight] Draw your Weapon.", nextId: 'gartz_fight' },
      { label: "Run!", nextId: undefined, effect: (s) => ({ health: s.health - 10 }), outcomeLog: "You ran from Gartz, taking a grazing hit." }
    ]
  },
  'gartz_fight': {
    id: 'gartz_fight',
    text: "Gartz charges, swinging his cleaver with terrifying speed for a man his size. He is relentless. A simple knife won't stop him. You need to sever his arm to win this.",
    speaker: 'Narrator',
    options: [
      { 
        label: "[Executioner's Blade] Decapitate Him", 
        nextId: 'gartz_win',
        reqItem: 'iron_sword',
        effect: (s) => ({ health: s.health - 25, stamina: s.stamina - 40 }),
        outcomeLog: "Your heavy blade met his cleaver and shattered it. Gartz is dead."
      },
      { 
        label: "[Machete] Hack and Slash (High Risk)", 
        nextId: 'gartz_win',
        reqItem: 'iron_machete',
        effect: (s) => ({ health: s.health - 80, stamina: s.stamina - 80 }),
        outcomeLog: "You barely survived. You are bleeding out, but Gartz is down."
      },
      {
         label: "[Unarmed] You will die.",
         nextId: undefined,
         effect: (s) => ({ health: 0 }),
         outcomeLog: "Gartz chopped you into pieces."
      }
    ]
  },
  'gartz_win': {
    id: 'gartz_win',
    text: "The Butcher falls. The silence that follows is heavy. You step over his massive corpse and unclip the Rebreather from his neck. It is covered in grime, but functional.\n\nSan Miguel is a little safer now.",
    speaker: 'Narrator',
    options: [
      { 
        label: "Take Rebreather", 
        nextId: undefined, 
        effect: (s) => ({ 
            inventory: [...s.inventory, 'dabids_rebreather'], 
            xp: s.xp + 800,
            currentObjective: "Return the Rebreather to Dabid in Bato."
        }),
        outcomeLog: "You killed Gartz and retrieved the Rebreather."
      }
    ]
  },


  // Oboy (The Smuggler)
  'oboy_start': {
    id: 'oboy_start',
    text: "A nervous man hides under a tarp behind the old fish market. He jumps when he sees you.\n\n'Shh! Not so loud! Yuri's spies are everywhere.' He wipes grease from his hands. 'I'm Oboy. I have a boat. A fast boat. But it's missing a rudder pin. If I can fix it, I can get out of this cursed town.'",
    speaker: 'Oboy the Boatman',
    options: [
      { label: "I have Scrap Metal. Can you use that?", nextId: 'oboy_fix', reqItem: 'scrap_metal' },
      { label: "Why are you hiding?", nextId: 'oboy_story' },
      { label: "Good luck.", nextId: undefined }
    ]
  },
  'oboy_story': {
    id: 'oboy_story',
    text: "'Yuri... he sacrifices people. To the river. He says it keeps the floods down, but he just likes the power. I'm next on his list because I know the way to San Miguel.'",
    speaker: 'Oboy the Boatman',
    options: [
      { label: "I can help you fix the boat.", nextId: 'oboy_start' }
    ]
  },
  'oboy_fix': {
    id: 'oboy_fix',
    text: "Oboy's eyes widen. 'Yes! This will work!' He hammers the metal into shape. The engine sputters to life.\n\n'Thank you! Listen, if you need to go to San Miguel, I can take you for free now. Or... if you find that crazy zealot Yuri, tell him Oboy is gone!'",
    speaker: 'Oboy the Boatman',
    options: [
      { 
        label: "Unlock San Miguel Route", 
        nextId: undefined, 
        effect: (s) => ({ xp: s.xp + 400, reputation: s.reputation + 10 }),
        outcomeLog: "Oboy fixed his boat. He marked a safe route to San Miguel on your map."
      }
    ]
  },


  // --- VIRAC: BECK (THE BLACKSMITH) ---
  'beck_start': {
    id: 'beck_start',
    text: "Beck hammers away at a glowing piece of meteorite iron. The heat from his forge is intense, burning away the fog of the Gray Market. He looks up, his one good eye analyzing your potential.\n\n'Scavenging is for rats,' he grunts. 'I forge destiny now. The Kapres, the Titans... they laugh at your rusty machetes. But they fear my steel.'",
    speaker: 'Beck the Blacksmith',
    options: [
      { label: "Tell me about this steel.", nextId: 'beck_offer' },
      { label: "[Exit] Browse Market", nextId: undefined, outcomeLog: "Access the 'Market' tab to trade." }
    ]
  },
  'beck_offer': {
    id: 'beck_offer',
    text: "'Bathala's Fang,' Beck whispers reverently. 'A sword capable of slicing through a Kapre's thick hide like wet paper. I can make one for you. But the materials... they are not cheap.'\n\nHe holds up two fingers. 'I need Gold. 200 of it. And I need a heart for the blade—an Agimat Stone. Bring me these, and you shall be a god-killer.'",
    speaker: 'Beck the Blacksmith',
    options: [
      { 
        label: "Forge Bathala's Fang (200G + Agimat)", 
        nextId: 'beck_forge', 
        reqItem: 'agimat_stone',
        reqStat: { stat: 'gold', value: 200 }
      },
      { label: "I will return when I have it.", nextId: undefined }
    ]
  },
  'beck_forge': {
    id: 'beck_forge',
    text: "Beck takes the Agimat and the gold. He tosses the stone into the crucible. It screams as it melts. He pours the liquid magic into the mold and quenches it in oil.\n\nWhen he pulls it out, the blade pulses with a faint, heartbeat-like rhythm. 'Done. Do not let it go to waste.'",
    speaker: 'Beck the Blacksmith',
    options: [
      { 
        label: "Take Divine Sword", 
        nextId: undefined,
        effect: (s) => {
            const idx = s.inventory.indexOf('agimat_stone');
            const newInv = [...s.inventory];
            if(idx > -1) newInv.splice(idx, 1);
            return { 
                gold: s.gold - 200, 
                inventory: [...newInv, 'divine_sword'],
                xp: s.xp + 1000
            };
        },
        outcomeLog: "You obtained Bathala's Fang. The strongest entity awaits."
      }
    ]
  },

  // --- VIRAC: ARATNACLA (THE PROVISIONER) ---
  'aratnacla_start': {
    id: 'aratnacla_start',
    text: "Aratnacla sits atop a crate of military-grade rations, weighing a bag of gold dust on a delicate scale. He smiles—a merchant's smile, practiced and sharp.\n\n'Gold is heavy, friend,' he says smoothly. 'You cannot eat gold. You cannot burn it for warmth. But my rations? They keep the hunger at bay. I can lighten your purse and fill your belly. A fair trade, no?'",
    speaker: 'Aratnacla',
    options: [
      { label: "I need food.", nextId: 'aratnacla_trade' },
      { label: "Not today.", nextId: undefined }
    ]
  },
  'aratnacla_trade': {
    id: 'aratnacla_trade',
    text: "'Excellent. The exchange rate is fixed. The Shroud does not bargain.'\n\nHe opens a crate, revealing vacuum-sealed rice and dried meat.",
    speaker: 'Aratnacla',
    options: [
      { 
        label: "[Small] 25 Gold -> 5 Supplies", 
        nextId: 'aratnacla_trade',
        reqStat: { stat: 'gold', value: 25 },
        effect: (s) => ({ gold: s.gold - 25, supplies: s.supplies + 5 }),
        outcomeLog: "Traded 25 Gold for 5 Supplies."
      },
      { 
        label: "[Bulk] 100 Gold -> 25 Supplies", 
        nextId: 'aratnacla_trade',
        reqStat: { stat: 'gold', value: 100 },
        effect: (s) => ({ gold: s.gold - 100, supplies: s.supplies + 25 }),
        outcomeLog: "Traded 100 Gold for 25 Supplies."
      },
      { label: "I have enough.", nextId: undefined }
    ]
  },

  // --- VIRAC: INQUISITOR AZANZA ---
  'gov_start': {
    id: 'gov_start',
    text: "Inquisitor Azanza looks bored on his bone throne. 'State your business, wretch. My patience is shorter than a candle wick.'",
    speaker: 'Inquisitor Azanza',
    options: [
      { label: "I seek passage beyond the walls.", nextId: 'gov_writ' },
      { label: "I bring a relic from Luyang. (Show Rosary)", nextId: 'gov_rosary', reqItem: 'obsidian_rosary' },
      { label: "Just passing through.", nextId: 'gov_leave' }
    ]
  },
  'gov_writ': {
    id: 'gov_writ',
    text: "'Passage? Into the dark? Hah!' Azanza gestures to a hulking, armored figure in the shadows. 'Only the strong survive the Shroud. Prove you are not meat. Fight Roldan.'",
    speaker: 'Inquisitor Azanza',
    options: [
      { label: "Draw weapon.", nextId: 'gov_fight' },
      { label: "I am not ready.", nextId: 'gov_leave' }
    ]
  },
  'gov_fight': {
    id: 'gov_fight',
    text: "Roldan steps into the light. He is a corpse in rusted plate armor, dragging a hammer that reeks of dried brain matter. He groans, a sound like grinding stones.",
    speaker: 'Narrator',
    options: [
      { 
        label: "[Weapon] Sever the tendons", 
        nextId: 'gov_win_clean',
        reqItem: 'iron_sword',
        effect: (s) => ({ stamina: s.stamina - 20, xp: s.xp + 350 }),
        outcomeLog: 'You dismantled the undead thrall with precision.'
      },
      { 
        label: "[Strength] Crush him (75 HP)", 
        nextId: 'gov_win_messy',
        reqStat: { stat: 'health', value: 75 },
        effect: (s) => ({ health: s.health - 65, stamina: s.stamina - 40, xp: s.xp + 300 }),
        outcomeLog: 'You took a brutal hit but shattered Roldan.'
      },
      {
        label: "Flee the Cathedral!",
        nextId: 'gov_leave',
        effect: (s) => ({ reputation: s.reputation - 15, health: s.health - 10 }),
        outcomeLog: 'You fled, taking a glancing blow to the back.'
      }
    ]
  },
  'gov_win_clean': {
    id: 'gov_win_clean',
    text: "Roldan collapses, his limbs severed. Azanza looks almost disappointed. 'Efficient. You might last a day. Take the Writ. Go die in the wild.'",
    speaker: 'Inquisitor Azanza',
    options: [{ label: "Take Writ.", nextId: 'gov_grant_writ' }]
  },
  'gov_win_messy': {
    id: 'gov_win_messy',
    text: "Roldan falls, but you are bleeding heavily from the impact. Azanza laughs, a dry, rasping sound. 'Messy. But effective. You have the will to live, at least.'",
    speaker: 'Inquisitor Azanza',
    options: [{ label: "Take Writ.", nextId: 'gov_grant_writ' }]
  },
  'gov_grant_writ': {
    id: 'gov_grant_writ',
    text: "You have the Blood Writ. The gates will open. 'Beware the Manananggal,' Azanza whispers as you leave. 'She loves the taste of travelers.'",
    speaker: 'Inquisitor Azanza',
    options: [
      { 
        label: "Leave.", 
        nextId: undefined, 
        effect: (s) => ({ inventory: [...s.inventory, 'travelers_pack', 'travel_writ'], gold: s.gold + 50, currentObjective: "Use the Map to travel to San Andres or Bato." }),
        outcomeLog: 'Received Blood Writ. New Routes Unlocked.'
      }
    ]
  },
  'gov_rosary': {
    id: 'gov_rosary',
    text: "Azanza stands up slowly. He walks down the steps, his eyes fixed on the black beads. 'The Tears of Luyang... We thought these lost to the Void.'\n\nHe takes it gently. 'You have done a holy service, scav. The suffering stored in this glass... it will power our wards for a month.'",
    speaker: 'Inquisitor Azanza',
    options: [
      { 
        label: "Accept Reward (Accessory + Gold)", 
        nextId: undefined,
        effect: (s) => {
            const idx = s.inventory.indexOf('obsidian_rosary');
            const newInv = [...s.inventory];
            if(idx > -1) newInv.splice(idx, 1);
            return { 
                gold: s.gold + 500, 
                inventory: [...newInv, 'agimat_stone'],
                xp: s.xp + 1000,
                reputation: s.reputation + 50
            };
        },
        outcomeLog: "Azanza gifted you the Black Agimat and Gold. The Church favors you." 
      }
    ]
  },
  'gov_leave': {
    id: 'gov_leave',
    text: "'Get out of my sight before I change my mind,' Azanza snarls.",
    speaker: 'Inquisitor Azanza',
    options: [{ label: "Retreat", nextId: undefined }]
  },

  // --- VIRAC: OTHER NPCS ---
  'gio_start': {
    id: 'gio_start',
    text: "Kapitan Gio cleans his rifle. 'The Resistance needs metal. Bring me Scrap Metal and I will make it worth your while.'",
    speaker: 'Kapitan Gio',
    options: [
      { label: "I have Scrap Metal (Give 3)", nextId: 'gio_complete', reqItem: 'scrap_metal' }, // Simplified check
      { label: "I'll keep looking.", nextId: undefined }
    ]
  },
  'gio_complete': {
    id: 'gio_complete',
    text: "Gio nods. 'Good work. Here.' He hands you payment.",
    speaker: 'Kapitan Gio',
    options: [{ label: "Take Reward", nextId: undefined, effect: (s) => ({ gold: s.gold + 100, xp: s.xp + 200 }) }]
  },
  'nathaniel_start': {
    id: 'nathaniel_start',
    text: "'Blessings,' Father Nathaniel smiles thinly. 'Donations to the Church ensure your soul remains... attached.'",
    speaker: 'Father Nathaniel',
    options: [
      { label: "Heal my Wounds (50 Gold)", nextId: 'nathaniel_heal', reqStat: {stat: 'gold', value: 50} },
      { label: "Restore my Will (30 Gold)", nextId: 'nathaniel_will', reqStat: {stat: 'gold', value: 30} },
      { label: "Leave", nextId: undefined }
    ]
  },
  'nathaniel_heal': {
    id: 'nathaniel_heal',
    text: "He chants. Your wounds close.",
    speaker: 'Father Nathaniel',
    options: [{ label: "Leave", nextId: undefined, effect: (s) => ({ gold: s.gold - 50, health: s.maxHealth }) }]
  },
  'nathaniel_will': {
    id: 'nathaniel_will',
    text: "He blesses you with ash. You feel bolder.",
    speaker: 'Father Nathaniel',
    options: [{ label: "Leave", nextId: undefined, effect: (s) => ({ gold: s.gold - 30, stamina: s.maxStamina }) }]
  },
  'scribe_start': {
    id: 'scribe_start',
    text: "The Scribe is drawing maps on the floor. 'The lines shift! The roads move when we sleep!'",
    speaker: 'The Scribe',
    options: [{ label: "You're mad.", nextId: undefined }]
  },

  // --- SAN ANDRES: LOLA BASHANG ---
  'lola_start': {
    id: 'lola_start',
    text: "An old woman sits by a dying fire, her eyes clouded white with cataracts. She clutches a necklace of shark teeth.\n\n'I hear your footsteps,' she rasps. 'You walk heavy, like one burdened by the future. I am Lola Bashang. I see what the sighted miss.'\n\nShe points a crooked finger towards the cliffs. 'The Luyang Cave... it calls to you. The spirits there do not rest. They died choking on smoke, hiding from pirates. Now they are just shadows and rage. But... there is a relic there. An Obsidian Rosary. It holds their pain. If you can retrieve it, you might find power in Virac.'",
    speaker: 'Lola Bashang',
    options: [
      { label: "Where is this cave?", nextId: 'lola_cave' },
      { label: "Tell me the history.", nextId: 'lola_lore' },
      { label: "I have no time for ghosts.", nextId: undefined }
    ]
  },
  'lola_cave': {
    id: 'lola_cave',
    text: "'Follow the cliff path north. But beware... Tanod Karlo guards the entrance. He is a greedy man, but a thirsty one. He will not let you pass for free.'\n\nShe chuckles. 'Bring him Tuba. Or gold. He loves both more than his duty.'",
    speaker: 'Lola Bashang',
    options: [
      { 
        label: "I will find the cave.", 
        nextId: undefined, 
        effect: (s) => ({ currentObjective: "Confront Tanod Karlo at the Cliffs." }) 
      }
    ]
  },
  'lola_lore': {
    id: 'lola_lore',
    text: "'Centuries ago, the Moro pirates came. The townspeople hid in the Luyang Cave. The pirates could not find them... until a woman went out to wash diapers in the river. They followed her back.'\n\nHer voice drops to a whisper. 'They piled wood at the mouth of the cave and lit it. They smoked them out like rats. Hundreds died screaming in the dark. That scream... it never left the stone.'",
    speaker: 'Lola Bashang',
    options: [
      { label: "A dark history.", nextId: 'lola_start' }
    ]
  },

  // --- SAN ANDRES: TANOD KARLO (GATEKEEPER) ---
  'karlo_start': {
    id: 'karlo_start',
    text: "A large man with a rusty bolo blocks the narrow path leading up the cliffs. He looks tired. \n\n'Halt! Restricted area. Governor's orders. No one goes to Luyang Cave. Too many ghosts, too many accidents.'\n\nHe eyes your gear. 'Dangerous place. Unless... you have something to help a guard relax on a long shift?'",
    speaker: 'Tanod Karlo',
    options: [
      { label: "[Bribe] Here is 50 Gold.", nextId: 'karlo_pass', reqStat: {stat: 'gold', value: 50}, effect: (s) => ({ gold: s.gold - 50 }) },
      { label: "[Gift] I have Tuba Wine.", nextId: 'karlo_pass', reqItem: 'tuba_wine', effect: (s) => {
          const idx = s.inventory.indexOf('tuba_wine');
          const newInv = [...s.inventory];
          if(idx > -1) newInv.splice(idx, 1);
          return { inventory: newInv };
      }},
      { label: "[Force] Move aside.", nextId: 'karlo_fight' },
      { label: "I'll come back later.", nextId: undefined }
    ]
  },
  'karlo_pass': {
    id: 'karlo_pass',
    text: "Karlo grins, taking your offering. 'Well, I suppose the ghosts are sleeping today. Go on. If you die, don't haunt me.'",
    speaker: 'Tanod Karlo',
    options: [
      { label: "Enter Luyang Cave.", nextId: 'luyang_cave_enter' }
    ]
  },
  'karlo_fight': {
    id: 'karlo_fight',
    text: "Karlo draws his bolo. 'Stupid choice.'\n\nHe swings wildly. You manage to knock him out, but not before taking a nasty gash to the arm.",
    speaker: 'Narrator',
    options: [
      { 
        label: "Press on (-25 Health)", 
        nextId: 'luyang_cave_enter', 
        effect: (s) => ({ health: s.health - 25, reputation: s.reputation - 10 }) 
      }
    ]
  },

  // --- LUYANG CAVE DUNGEON ---
  'luyang_cave_enter': {
    id: 'luyang_cave_enter',
    text: "The cave mouth is like a gaping maw. Inside, the air is cold and smells of ash and sulfur. You can hear faint weeping echoing from the walls.\n\nAs you step deeper, shadows detach themselves from the stalagmites. They form vaguely human shapes, their faces twisted in agony. The Weeping Shadows blockade the path to the inner sanctum.",
    speaker: 'The Cave',
    options: [
      { label: "Fight the Shadows!", nextId: 'luyang_combat' },
      { label: "Retreat!", nextId: undefined, outcomeLog: "You ran from the darkness of Luyang." }
    ]
  },
  'luyang_combat': {
    id: 'luyang_combat',
    text: "The shadows scream—a sound that pierces your skull. They rush you, cold hands grasping for your warmth.",
    speaker: 'Narrator',
    options: [
      { 
        label: "[Weapon] Carve a path", 
        nextId: 'luyang_victory', 
        reqItem: 'iron_sword', 
        effect: (s) => ({ health: s.health - 15, stamina: s.stamina - 15, xp: s.xp + 350 }) 
      },
      { 
        label: "[Salt] Burn them!", 
        nextId: 'luyang_victory', 
        reqItem: 'salt_packet', 
        effect: (s) => {
             const idx = s.inventory.indexOf('salt_packet');
             const newInv = [...s.inventory];
             if(idx > -1) newInv.splice(idx, 1);
             return { inventory: newInv, xp: s.xp + 400 };
        }
      }
    ]
  },
  'luyang_victory': {
    id: 'luyang_victory',
    text: "The shadows dissipate, wailing as they retreat into the rock. At the center of the chamber, resting on a stone altar covered in wax, is a rosary made of black obsidian.\n\nIt feels freezing to the touch. You have claimed the relic.",
    speaker: 'Narrator',
    options: [
      { 
        label: "Take Obsidian Rosary", 
        nextId: undefined, 
        effect: (s) => ({ 
            inventory: [...s.inventory, 'obsidian_rosary'], 
            xp: s.xp + 500,
            currentObjective: "Return the Rosary to Virac (Azanza or Beck)."
        }),
        outcomeLog: "You survived Luyang Cave and obtained the Obsidian Rosary."
      }
    ]
  }
};


export const MUNICIPALITIES: Record<string, MunicipalityData> = {
  virac: {
    id: 'virac',
    name: 'Virac',
    title: 'The Citadel of Ash',
    description: 'The last bastion of "order" on the island. The streets are knee-deep in gray ash from the constant burning of bodies.',
    environment: 'Ash-covered streets, gothic stone spires, barricaded windows, heavy fog.',
    poi: ['Cathedral of the Damned', 'Inquisitor’s Palace', 'The Sewers', 'Ruined Library'],
    quests: 'Obtain the Blood Writ to leave the city.',
    resources: 'Scrap Iron, Salt, Old Currency.',
    faction: 'The Inquisition',
    difficulty: 1,
    subLocations: [
      { id: 'virac_cathedral', name: 'Cathedral of the Damned', description: 'A fortress of stone where the Inquisition rules.', type: 'landmark' },
      { id: 'virac_plaza', name: 'The Gray Market', description: 'Scavengers trade under the watchful eyes of guards.', type: 'store' },
      { id: 'virac_sewers', name: 'The Under-City', description: 'Rebels hide in the filth beneath the streets.', type: 'danger_zone' }
    ],
    npcs: [
      { id: 'gov', name: 'Inquisitor Azanza', role: 'Tyrant', description: 'Rules with fear.', avatarEmoji: '👑', dialogueStartId: 'gov_start', subLocationId: 'virac_cathedral' },
      { id: 'nathaniel', name: 'Fr. Nathaniel', role: 'Corrupt Priest', description: 'Heals for a price.', avatarEmoji: '✝️', dialogueStartId: 'nathaniel_start', subLocationId: 'virac_cathedral' },
      { id: 'beck', name: 'Beck', role: 'Blacksmith', description: 'Forges the Divine Sword.', avatarEmoji: '⚒️', dialogueStartId: 'beck_start', subLocationId: 'virac_plaza' },
      { id: 'aratnacla', name: 'Aratnacla', role: 'Provisioner', description: 'Exchanges Gold for Rations.', avatarEmoji: '⚖️', dialogueStartId: 'aratnacla_start', subLocationId: 'virac_plaza' },
      { id: 'scribe', name: 'The Scribe', role: 'Lore Keeper', description: 'Records the madness.', avatarEmoji: '📜', dialogueStartId: 'scribe_start', subLocationId: 'virac_plaza' },
      { id: 'gio', name: 'Kapitan Gio', role: 'Rebel Leader', description: 'Hides in the sewers.', avatarEmoji: '🔦', dialogueStartId: 'gio_start', subLocationId: 'virac_sewers' }
    ]
  },
  san_andres: {
    id: 'san_andres',
    name: 'San Andres',
    title: 'The Wailing Coast',
    description: 'A fog-choked coastline where the caves echo with the cries of lost children.',
    environment: 'Perpetual fog, ancient burial caves, jagged cliffs.',
    poi: ['Cave of Sorrows', 'The Ghost Docks', 'Luyang Cave Entrance'],
    quests: 'Silence the wailing spirits.',
    resources: 'Ectoplasm, Bone Dust, Tuba.',
    faction: 'The Blind Oracles',
    difficulty: 2,
    subLocations: [
      { id: 'san_andres_cliffs', name: 'The Wailing Cliffs', description: 'The wind sounds like screaming here.', type: 'landmark' },
      { id: 'luyang_cave', name: 'Luyang Cave Entrance', description: 'A massive dark maw in the rock.', type: 'danger_zone' }
    ],
    npcs: [
      { id: 'lola', name: 'Lola Bashang', role: 'Blind Oracle', description: 'Communes with the dead.', avatarEmoji: '🔮', dialogueStartId: 'lola_start', subLocationId: 'san_andres_cliffs' },
      { id: 'karlo', name: 'Tanod Karlo', role: 'Corrupt Guard', description: 'Guards the Luyang Cave.', avatarEmoji: '🛡️', dialogueStartId: 'karlo_start', subLocationId: 'luyang_cave' }
    ]
  },
  bato: {
    id: 'bato',
    name: 'Bato',
    title: 'The Drowned Parish',
    description: 'Half the town has sunk into the river. The "Drowned God" drags victims under if they cannot pay the toll.',
    environment: 'Flooded ruins, dark water, rotting wood bridges.',
    poi: ['The Sunken Church', 'River of Souls', 'Oboy’s Hideout'],
    quests: 'Appease the River God or help the rebels escape.',
    resources: 'River Clay, Drowned Gold, Driftwood.',
    faction: 'The River Cult',
    difficulty: 2,
    subLocations: [
      { id: 'bato_bridge', name: 'The Toll Bridge', description: 'The only dry crossing over the black river.', type: 'hub' },
      { id: 'bato_church', name: 'Batalay Shrine', description: 'A partially submerged church where the cult gathers.', type: 'landmark' },
      { id: 'bato_docks', name: 'Rotting Docks', description: 'Debris and old boats float here.', type: 'building' }
    ],
    npcs: [
      { id: 'guard_bato', name: 'Warden Dencio', role: 'Cult Guard', description: 'Guards the bridge.', avatarEmoji: '🛡️', dialogueStartId: 'dencio_start', subLocationId: 'bato_bridge' },
      { id: 'yuri', name: 'Zealot Yuri', role: 'Cult Leader', description: 'Speaks for the River God.', avatarEmoji: '🔮', dialogueStartId: 'yuri_start', subLocationId: 'bato_church' },
      { id: 'dabid', name: 'Dabid', role: 'The Diver', description: 'Braves the deep ruins.', avatarEmoji: '🤿', dialogueStartId: 'dabid_start', subLocationId: 'bato_docks' },
      { id: 'oboy', name: 'Oboy', role: 'The Smuggler', description: 'Has a hidden boat.', avatarEmoji: '🛶', dialogueStartId: 'oboy_start', subLocationId: 'bato_docks' }
    ]
  },
  san_miguel: {
    id: 'san_miguel',
    name: 'San Miguel',
    title: 'The Lawless Depths',
    description: 'A chaotic region where mortals eat mortals to survive the famine.',
    environment: 'Twisted mangroves, hanging cages, butcher blocks.',
    poi: ['The Butcher’s Fork', 'Waterfall of Blood'],
    quests: 'Survive the Cannibal Feast.',
    resources: 'Stolen Loot, Human Trophies.',
    faction: 'The Cannibals',
    difficulty: 3,
    subLocations: [
      { id: 'san_miguel_market', name: 'The Butcher Block', description: 'Smells of copper and roast meat.', type: 'store' },
      { id: 'san_miguel_river', name: 'The Red River', description: 'Bodies float downstream.', type: 'danger_zone' }
    ],
    npcs: [
      { id: 'butcher', name: 'Gartz the Butcher', role: 'Cannibal Warlord', description: 'Non-negotiable.', avatarEmoji: '🔪', dialogueStartId: 'gartz_start', subLocationId: 'san_miguel_market' }
    ]
  },
  baras: {
    id: 'baras',
    name: 'Baras',
    title: 'The Shattered Coast',
    description: 'Sirena (merfolk) sing from the jagged rocks to break minds and lure sailors to their death.',
    environment: 'Jagged cliffs, roaring black surf.',
    poi: ['The Devil’s Surf', 'Cliff of Despair'],
    quests: 'Survive the Siren Song.',
    resources: 'Driftwood, Storm Essence.',
    faction: 'The Stormborn',
    difficulty: 3,
    subLocations: [
       { id: 'baras_cliffs', name: 'The Singing Rocks', description: 'The melody is deafening here.', type: 'danger_zone' }
    ],
    npcs: [
      { id: 'siren', name: 'Sirena Marikit', role: 'Siren', description: 'Beautiful and deadly.', avatarEmoji: '🧜‍♀️', dialogueStartId: 'generic_npc', subLocationId: 'baras_cliffs' }
    ]
  },
  viga: {
    id: 'viga',
    name: 'Viga',
    title: 'The Blighted Fields',
    description: 'Hunting ground for the Sigbin. The crops are withered and black.',
    environment: 'Brown withered fields, clouds of insects.',
    poi: ['The Hollow Barn', 'Summit of Bones'],
    quests: 'Burn the Locust Mother.',
    resources: 'Rotten Grain, Insect Chitin.',
    faction: 'The Starved',
    difficulty: 3,
    subLocations: [
      { id: 'viga_fields', name: 'The Dead Fields', description: 'Nothing grows here but misery.', type: 'landmark' }
    ],
    npcs: [
      { id: 'farmer', name: 'Ka Gorio', role: 'Rebel Leader', description: 'Starving but proud.', avatarEmoji: '🌾', dialogueStartId: 'generic_npc', subLocationId: 'viga_fields' }
    ]
  },
  gigmoto: {
    id: 'gigmoto',
    name: 'Gigmoto',
    title: 'The Kapre’s Garden',
    description: 'A jungle so overgrown it blots out the sun. The trees are alive.',
    environment: 'Bioluminescent fungi, toxic spores.',
    poi: ['Venom Falls', 'The Spore Pit'],
    quests: 'Find the antidote.',
    resources: 'Toxic Spores, Rare Poisons.',
    faction: 'The Spore-Touched',
    difficulty: 4,
    subLocations: [
      { id: 'gigmoto_tree', name: 'The Elder Balete', description: 'Smoke pours from its branches.', type: 'danger_zone' }
    ],
    npcs: [
      { id: 'herb', name: 'Herbalist Maya', role: 'Alchemist', description: 'Sells poisons.', avatarEmoji: '🌿', dialogueStartId: 'generic_npc', subLocationId: 'gigmoto_tree' }
    ]
  },
  panganiban: {
    id: 'panganiban',
    name: 'Panganiban',
    title: 'The Mire of Madness',
    description: 'A labyrinth of mangroves where geometry makes no sense.',
    environment: 'Shifting mud flats, infinite roots.',
    poi: ['The Endless Delta', 'Crab Lord’s Nest'],
    quests: 'Hunt the Titan Crab.',
    resources: 'Titan Shells, Ancient Mud.',
    faction: 'The Lost',
    difficulty: 4,
    subLocations: [
      { id: 'panganiban_delta', name: 'The Shifting Delta', description: 'The roots seem to move when you blink.', type: 'danger_zone' }
    ],
    npcs: [
      { id: 'madman', name: 'The Mad Cartographer', role: 'Lost Soul', description: 'Draws maps of things that dont exist.', avatarEmoji: '🗺️', dialogueStartId: 'generic_npc', subLocationId: 'panganiban_delta' }
    ]
  },
  bagamanoc: {
    id: 'bagamanoc',
    name: 'Bagamanoc',
    title: 'The Dragon’s Grave',
    description: 'Sharp volcanic rocks. A Bakunawa sleeps here, dreaming of the moon.',
    environment: 'Obsidian spires, dark lighthouse.',
    poi: ['The Black Beacon', 'Dragon’s Tooth'],
    quests: 'Relight the Black Beacon.',
    resources: 'Obsidian, Dragon Scales.',
    faction: 'The Keepers',
    difficulty: 4,
    subLocations: [
      { id: 'bagamanoc_lighthouse', name: 'The Black Beacon', description: 'A lighthouse with no light.', type: 'landmark' }
    ],
    npcs: [
      { id: 'keeper', name: 'Keeper Sol', role: 'Flame Guardian', description: 'Watches the fire.', avatarEmoji: '🔥', dialogueStartId: 'generic_npc', subLocationId: 'bagamanoc_lighthouse' }
    ]
  },
  caramoran: {
    id: 'caramoran',
    name: 'Caramoran',
    title: 'The Rotting Jungle',
    description: 'A Nuno sa Punso cursed this land. The shadows bite.',
    environment: 'Impenetrable darkness, blood-sap trees.',
    poi: ['Lake of Shadows', 'The Beast’s Den'],
    quests: 'Kill the Alpha Shadow Stalker.',
    resources: 'Shadow Pelts, Blood Sap.',
    faction: 'The Beast Hunters',
    difficulty: 5,
    subLocations: [
      { id: 'caramoran_jungle', name: 'Deep Jungle', description: 'Eyes watch from the leaves.', type: 'danger_zone' }
    ],
    npcs: [
      { id: 'hunter', name: 'Hunter X', role: 'Mute Slayer', description: 'Communicates in signs.', avatarEmoji: '🏹', dialogueStartId: 'generic_npc', subLocationId: 'caramoran_jungle' }
    ]
  },
  pandan: {
    id: 'pandan',
    name: 'Pandan',
    title: 'The Void’s Edge',
    description: 'The barrier between worlds is thin. You can see the other side.',
    environment: 'Barren windswept hills, cosmic horror.',
    poi: ['The Screaming Highlands', 'Lagoon of the Void'],
    quests: 'Stare into the Abyss.',
    resources: 'Void Essence.',
    faction: 'The Nihilists',
    difficulty: 5,
    subLocations: [
      { id: 'pandan_void', name: 'The Edge', description: 'Where reality ends.', type: 'danger_zone' }
    ],
    npcs: [
      { id: 'void', name: 'The Void Walker', role: 'Entity', description: 'Not human.', avatarEmoji: '🌌', dialogueStartId: 'generic_npc', subLocationId: 'pandan_void' }
    ]
  }
};

export const QUESTS: Record<string, QuestData> = {
  bato: {
    id: 'q_bato',
    title: 'The Drowned God’s Tithe',
    description: 'Help the Cultist Yuri or the Smuggler Oboy.',
    story: 'The river demands tribute.',
    actionLabel: 'Serve the Cult',
    costType: 'health',
    costAmount: 20,
    rewardXP: 800,
    rewardGold: 200,
    rewardSupplies: 10,
    successMessage: 'The river accepts your sacrifice.'
  },
  san_miguel: {
    id: 'q_san_miguel',
    title: 'Feast of the Damned',
    description: 'Slay "Buwaya", the Cannibal Lord who wears human skin.',
    story: 'Buwaya is hunting you.',
    actionLabel: 'Butcher Him',
    costType: 'health',
    costAmount: 60,
    rewardXP: 600,
    rewardGold: 500,
    rewardSupplies: 15,
    successMessage: 'Buwaya screamed as he died. Delicious.'
  },
  baras: {
    id: 'q_baras',
    title: 'The Drowning Ritual',
    description: 'Survive the crushing black waves. Avoid the Sirena pulling you down.',
    story: 'The Cult demands a test of endurance.',
    actionLabel: 'Enter the Surf',
    costType: 'health',
    costAmount: 50,
    rewardXP: 550,
    rewardGold: 200,
    rewardSupplies: 0,
    successMessage: 'The ocean rejected you. You live.'
  },
  gigmoto: {
    id: 'q_gigmoto',
    title: 'The Spore Heart',
    description: 'Steal the Spore Heart from the tree guarded by a Kapre.',
    story: 'The air itself is poison here.',
    actionLabel: 'Descend',
    costType: 'stamina',
    costAmount: 90,
    rewardXP: 700,
    rewardGold: 350,
    rewardSupplies: 20,
    successMessage: 'You avoided the giant cigar ash. You have the Heart.'
  },
  viga: {
    id: 'q_viga',
    title: 'The Swarm Mother',
    description: 'Incinerate the Locust Queen nest.',
    story: 'The buzzing is deafening.',
    actionLabel: 'Ignite Nest',
    costType: 'supplies',
    costAmount: 25,
    rewardXP: 800,
    rewardGold: 450,
    rewardSupplies: 30,
    successMessage: 'The fields burn. The buzzing stops.'
  },
  panganiban: {
    id: 'q_panganiban',
    title: 'Shell of the Titan',
    description: 'Crack the shell of the Titan Crab.',
    story: 'It uses old boats as its shell.',
    actionLabel: 'Shatter Shell',
    costType: 'stamina',
    costAmount: 95,
    rewardXP: 900,
    rewardGold: 700,
    rewardSupplies: 25,
    successMessage: 'The Titan collapses into the mire.'
  },
  bagamanoc: {
    id: 'q_bagamanoc',
    title: 'The Black Beacon',
    description: 'Restore the dark fire to the lighthouse.',
    story: 'The flame has gone cold.',
    actionLabel: 'Ignite Flame',
    costType: 'gold',
    costAmount: 500,
    rewardXP: 800,
    rewardGold: 0,
    rewardSupplies: 15,
    successMessage: 'A purple beam cuts through the dark.'
  },
  caramoran: {
    id: 'q_caramoran',
    title: 'The Elder Sigbin',
    description: 'Hunt the Alpha Sigbin that walks backwards through time.',
    story: 'You are the prey.',
    actionLabel: 'Hunt',
    costType: 'health',
    costAmount: 85,
    rewardXP: 1200,
    rewardGold: 900,
    rewardSupplies: 30,
    successMessage: 'Its shadow blood stains your hands.'
  },
  pandan: {
    id: 'q_pandan',
    title: 'Gaze of the Void',
    description: 'Sacrifice your worldly possessions to see the Truth.',
    story: 'The wind whispers your death.',
    actionLabel: 'Sacrifice Gold',
    costType: 'gold',
    costAmount: 2000,
    rewardXP: 66666,
    rewardGold: 0,
    rewardSupplies: 0,
    successMessage: 'You have seen what lies beyond. You are broken.'
  }
};

export const EXPLORATION_EVENTS: GameEvent[] = [
  // --- MANANANGGAL EVENT ---
  {
    id: 'event_manananggal',
    title: 'The Severed One',
    description: 'A flapping sound above, wet and heavy. You look up to see a woman’s torso, entrails dangling like grotesque streamers, flying against the bruised moon. A Manananggal! It screams, spotting your warmth.',
    minDifficulty: 1,
    options: [
      {
        label: 'Throw Salt',
        description: 'Requires: Blessed Salt',
        reqItem: 'salt_packet',
        effect: (s) => {
             const idx = s.inventory.indexOf('salt_packet');
             const newInv = [...s.inventory];
             if(idx > -1) newInv.splice(idx, 1);
             return { 
                 inventory: newInv, 
                 xp: s.xp + 400,
                 reputation: s.reputation + 10
             };
        },
        outcomeLog: 'The salt burned its exposed flesh! It shrieked in unholy agony and fled into the dark clouds.'
      },
      {
        label: 'Strike the Heart',
        description: 'Requires: Buntot Pagi',
        reqItem: 'buntot_pagi',
        effect: (s) => ({ xp: s.xp + 600, reputation: s.reputation + 20 }),
        outcomeLog: 'The stingray tail whip cracked like lightning. You struck its heart. It fell from the sky, a broken thing.'
      },
      {
        label: 'Hide in Mud',
        description: '-40 Stamina (Panic)',
        effect: (s) => ({ stamina: s.stamina - 40 }),
        outcomeLog: 'You buried yourself in a ditch covered in pig mire. You heard it hovering above, sniffing, before it moved on.'
      }
    ]
  },
  {
    id: 'event_tikbalang',
    title: 'The Trickster',
    description: 'The path ahead looks familiar. You have walked this mile three times. Laughter rumbles from the trees. A tall figure with the head of a horse and knees that bend backwards steps out. A Tikbalang.',
    minDifficulty: 2,
    options: [
      {
        label: 'Invert your clothes',
        description: 'Wear shirt inside out',
        effect: (s) => ({ stamina: s.stamina - 15, xp: s.xp + 100 }),
        outcomeLog: 'You turned your shirt inside out. The world spun. When you looked up, the monster was gone, and the true path lay ahead.'
      },
      {
        label: 'Wrestle it',
        description: 'Requires 90 Health',
        effect: (s) => ({ health: s.health - 50, xp: s.xp + 600, inventory: [...s.inventory, 'tikbalang_hide'] }),
        outcomeLog: 'You lunged at the beast. It was like fighting a hurricane, but you managed to grab its mane! It submitted, gifting you its hide.'
      }
    ]
  },
  {
    id: 'event_tiyanak',
    title: 'The Crying Infant',
    description: 'You hear a baby crying in the tall cogon grass. It sounds helpless, desperate. The sound tugs at your humanity.',
    minDifficulty: 2,
    options: [
      {
        label: 'Investigate',
        description: 'It might be a survivor...',
        effect: (s) => ({ health: s.health - 60, stamina: s.stamina - 20 }),
        outcomeLog: 'IT WAS A TRAP! The baby’s skin turned red and leathery. It leaped at your leg, teeth sinking deep into your muscle.'
      },
      {
        label: 'Run Away',
        description: 'Ignore the cries',
        effect: (s) => ({ stamina: s.stamina - 15 }),
        outcomeLog: 'You sprinted away. The crying morphed into a deep, guttural laughter that echoed behind you.'
      }
    ]
  },
  {
    id: 'event_kapre',
    title: 'The Tree Giant',
    description: 'Thick, pungent smoke fills the air, choking you. You look up to see a massive Kapre sitting atop an ancient Balete tree, its eyes glowing like embers. It holds a cigar the size of a log.',
    minDifficulty: 3,
    options: [
      {
        label: 'Offer Tobacco',
        description: 'Requires: Dried Tobacco',
        reqItem: 'tobacco_leaf',
        effect: (s) => {
             const idx = s.inventory.indexOf('tobacco_leaf');
             const newInv = [...s.inventory];
             if(idx > -1) newInv.splice(idx, 1);
             return { 
                 inventory: newInv, 
                 xp: s.xp + 200, 
                 gold: s.gold + 100 
             };
        },
        outcomeLog: 'The Kapre accepted your offering with a nod. It tossed you a pouch of old Spanish coins from a previous victim.'
      },
      {
        label: 'Attack',
        description: 'Suicide?',
        effect: (s) => ({ health: s.health - 95 }),
        outcomeLog: 'You tried to fight a giant. It swatted you like a fly. Every bone in your body feels fractured.'
      },
      {
        label: 'Slay the Titan',
        description: 'Requires: Bathala’s Fang',
        reqItem: 'divine_sword',
        effect: (s) => ({ xp: s.xp + 2000, reputation: s.reputation + 50 }),
        outcomeLog: 'With the Divine Sword, you cut the Balete tree in half. The Kapre howled as it turned to ash. You are a legend.'
      }
    ]
  },
  {
    id: 'event_aswang',
    title: 'The Black Dog',
    description: 'A large black dog with burning red eyes blocks your path. Its shadow is wrong—it casts the shadow of a man. An Aswang in disguise.',
    minDifficulty: 3,
    options: [
      {
        label: 'Use Buntot Pagi',
        description: 'Whip it',
        reqItem: 'buntot_pagi',
        effect: (s) => ({ xp: s.xp + 700, reputation: s.reputation + 30 }),
        outcomeLog: 'The whip cracked, and the dog shape melted into a screaming woman who fled into the dark, her skin smoking.'
      },
      {
        label: 'Fight with Steel',
        description: 'Requires Weapon',
        reqItem: 'iron_sword',
        effect: (s) => ({ health: s.health - 60, stamina: s.stamina - 30 }),
        outcomeLog: 'Steel hurts it, but not enough. It clawed your chest deep, leaving cursed wounds, before retreating.'
      },
      {
        label: 'Use Holy Oil',
        description: 'Throw Lana',
        reqItem: 'coconut_oil',
        effect: (s) => ({ xp: s.xp + 300, supplies: s.supplies }), // consumes oil conceptually
        outcomeLog: 'The oil burned its skin! The Aswang howled in human speech and vanished.'
      }
    ]
  },
  {
    id: 'event_sigbin',
    title: 'The Shadow Walker',
    description: 'You feel a cold breath on your ankles. A Sigbin—a creature resembling a kangaroo and a goat—is stalking you, walking backwards with its head between its legs.',
    minDifficulty: 4,
    options: [
      {
        label: 'Stomp on its shadow',
        description: 'Requires 90 Stamina',
        effect: (s) => ({ stamina: s.stamina - 40, health: s.health - 15, xp: s.xp + 500 }),
        outcomeLog: 'You anticipated its movement and stomped on its shadow! It yelped and dissolved into noxious mist.'
      },
      {
        label: 'Flee',
        description: 'Run!',
        effect: (s) => ({ health: s.health - 35, stamina: s.stamina - 35 }),
        outcomeLog: 'It bit your ankle as you ran, draining your vitality. The wound turned black immediately.'
      }
    ]
  }
];

export const MAP_LAYOUT: Record<string, MapLayoutData> = {
  pandan: {
    id: 'pandan',
    path: 'M 150,40 L 220,50 L 240,100 L 180,150 L 120,120 L 120,80 Z',
    color: 'fill-emerald-200',
    x: 180, y: 90,
    neighbors: ['caramoran', 'bagamanoc', 'viga']
  },
  caramoran: {
    id: 'caramoran',
    path: 'M 120,120 L 180,150 L 180,250 L 150,300 L 100,280 L 100,180 Z',
    color: 'fill-emerald-600',
    x: 145, y: 210,
    neighbors: ['pandan', 'viga', 'san_miguel', 'san_andres']
  },
  bagamanoc: {
    id: 'bagamanoc',
    path: 'M 220,50 L 260,60 L 280,110 L 240,120 L 240,100 Z',
    color: 'fill-amber-200',
    x: 245, y: 85,
    neighbors: ['pandan', 'panganiban']
  },
  panganiban: {
    id: 'panganiban',
    path: 'M 240,120 L 280,110 L 300,150 L 250,180 L 180,150 Z',
    color: 'fill-teal-300',
    x: 260, y: 140,
    neighbors: ['bagamanoc', 'viga']
  },
  viga: {
    id: 'viga',
    path: 'M 250,180 L 300,150 L 340,200 L 280,250 L 180,200 Z',
    color: 'fill-yellow-100',
    x: 260, y: 210,
    neighbors: ['pandan', 'panganiban', 'gigmoto', 'san_miguel', 'caramoran']
  },
  gigmoto: {
    id: 'gigmoto',
    path: 'M 280,250 L 340,200 L 350,300 L 300,320 L 250,280 Z',
    color: 'fill-green-400',
    x: 310, y: 280,
    neighbors: ['viga', 'baras', 'san_miguel']
  },
  san_miguel: {
    id: 'san_miguel',
    path: 'M 180,250 L 250,280 L 260,350 L 200,360 L 150,300 Z',
    color: 'fill-blue-200',
    x: 210, y: 310,
    neighbors: ['caramoran', 'viga', 'gigmoto', 'baras', 'bato', 'virac', 'san_andres']
  },
  baras: {
    id: 'baras',
    path: 'M 300,320 L 350,300 L 340,380 L 280,400 L 260,350 Z',
    color: 'fill-orange-200',
    x: 310, y: 360,
    neighbors: ['gigmoto', 'bato', 'san_miguel']
  },
  bato: {
    id: 'bato',
    path: 'M 260,350 L 280,400 L 260,440 L 220,420 L 200,360 Z',
    color: 'fill-stone-300',
    x: 245, y: 400,
    neighbors: ['baras', 'virac', 'san_miguel']
  },
  san_andres: {
    id: 'san_andres',
    path: 'M 100,280 L 150,300 L 160,380 L 120,440 L 60,380 Z',
    color: 'fill-red-200',
    x: 115, y: 360,
    neighbors: ['caramoran', 'virac', 'san_miguel']
  },
  virac: {
    id: 'virac',
    path: 'M 160,380 L 200,360 L 220,420 L 200,480 L 140,460 L 120,440 Z',
    color: 'fill-yellow-200',
    x: 170, y: 430,
    neighbors: ['san_andres', 'san_miguel', 'bato']
  }
};

export const GAME_SECTIONS: GameSection[] = [
  {
    id: 'story',
    title: 'The Prologue',
    content: `**THE ISLE OF NO RETURN**
    You are a castaway. A forgotten soul washed ashore on Catanduanes, an island now isolated from the world by "The Shroud"—a supernatural typhoon that never ends.
    
    The year is irrelevant. Time flows differently here. The island has reverted to a primal, dark state where Philippine folklore is not myth, but terrifying reality. The towns have fallen into madness, ruled by warlords, cults, and things that wear human skin.
    
    **THE CURSE**
    It began in Pandan, the northernmost tip. A ritual went wrong. The "Void" opened, and the creatures of the dark poured in. Now, the Shroud keeps them in, and keeps you trapped.
    
    **YOUR GOAL**
    Survive. The Shroud drains your will (Stamina) and the beasts hunger for your flesh (Health). You must travel from municipality to municipality, gathering strength, crafting weapons, and uncovering the source of the curse in Pandan.
    
    There is no rescue coming. You must save yourself.`
  },
  {
    id: 'bestiary',
    title: 'The Bestiary',
    content: `**MANANANGGAL**
    *Class: Apex Predator | Status: Active at Night*
    A woman by day, a flying monstrosity by night. She severs her torso to fly, leaving her lower half hidden. She hunts for the unborn and the sleeping.
    *Counter:* **Blessed Salt**. Throwing salt at her burns her flesh. If you find her lower torso, sprinkle salt on it to prevent her from rejoining, killing her at sunrise.
    
    **TIKBALANG**
    *Class: Trickster Spirit | Status: Deep Forests*
    A tall, humanoid creature with the head of a horse and limbs that are too long. They guard the forests and enjoy leading travelers astray until they die of exhaustion.
    *Counter:* **Invert Your Clothing**. Wearing your shirt inside out breaks their illusion magic. Alternatively, if you can pluck a golden hair from their mane, they will serve you.
    
    **KAPRE**
    *Class: Titan | Status: Ancient Trees*
    A dark giant that dwells in Balete trees, smoking a cigar that never goes out. The smoke causes disorientation and illness.
    *Counter:* **Tobacco**. They can be reasoned with if offered tribute. Otherwise, avoid the smoke at all costs.
    
    **ASWANG**
    *Class: Shapeshifter | Status: Everywhere*
    The most feared monster. They can appear as dogs, pigs, or humans. They replace their victims with banana stalk doppelgangers.
    *Counter:* **Buntot Pagi (Stingray Tail)**. The crack of this whip terrifies them. **Lana (Holy Oil)** will boil when an Aswang is near.
    
    **TIYANAK**
    *Class: Ambush Predator | Status: Grasslands*
    Demons mimicking the form of crying infants. They lure compassionate travelers before revealing their sharp fangs and claws.
    *Counter:* **Heartlessness**. Do not follow the crying sounds. Run.
    
    **SIGBIN**
    *Class: Scavenger | Status: Fields*
    A creature that walks backwards with its head between its legs. It sucks the blood of victims through their shadows.
    *Counter:* **Light & Speed**. Do not let it touch your shadow.`
  },
  {
    id: 'arsenal',
    title: 'The Arsenal',
    content: `**BUNTOT PAGI (Stingray Tail Whip)**
    *Type: Weapon*
    A dried and blessed stingray tail. In folklore, this is the ultimate weapon against the Aswang. Its whip-crack breaks their concentration and burns their skin like acid.
    
    **BLESSED SALT**
    *Type: Consumable*
    Salt is a purifier. It creates barriers against spirits and burns the exposed viscera of the Manananggal. Always carry a packet.
    
    **LANA (HOLY OIL)**
    *Type: Consumable/Detector*
    Coconut oil infused with roots and prayers. It bubbles/boils when evil is nearby, acting as an early warning system. It can also be thrown to burn unholy skin.
    
    **IRON MACHETE (ITAK)**
    *Type: Weapon*
    A rusted farming tool. While not magical, cold iron is effective against physical manifestations of these creatures. Keep it sharp.
    
    **AGIMAT (AMULET)**
    *Type: Accessory*
    Stones, seeds, or scraps of paper with Latin prayers. They provide passive protection against spiritual attacks.`
  },
  {
    id: 'mechanics',
    title: 'Survival Guide',
    content: `**WILL (STAMINA)**
    Your mental and physical energy. Traveling drains it. Events drain it. If it hits 0, you cannot move or fight effectively. Restore it by resting or consuming 'Shadow Roots'.
    
    **BLOOD (HEALTH)**
    Your life force. If this reaches 0, you die. Healing is rare and expensive. Avoid combat unless you have the right weapon.
    
    **THE ECONOMY**
    Gold is scarce. Supplies (Rice) are the true currency. You can trade supplies for gold in some towns, or gold for supplies in others. Buy low, sell high.
    
    **CRAFTING**
    Scavenge materials (Abaca, Wood, Scrap Metal) to build your own gear. You cannot defeat the horrors of Pandan with your bare hands.
    
    **TRADING**
    To trade, initiate dialogue with a merchant, then select the "[Exit] Browse Wares" option. This will unlock the Market tab where you can buy/sell items.`
  }
];

