
import { Pokemon, TypeData } from './pokemonAPI';

export interface TypeEffectiveness {
  weaknesses: { type: string; multiplier: number }[];
  resistances: { type: string; multiplier: number }[];
  immunities: string[];
}

// Calculate effectiveness multipliers for a Pokemon's type combination
export const calculateTypeEffectiveness = (typeDataArray: TypeData[]): TypeEffectiveness => {
  // Initialize effectiveness object with all types at 1x
  const typeEffectiveness: Record<string, number> = {
    normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1,
    fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1,
    rock: 1, ghost: 1, dragon: 1, dark: 1, steel: 1, fairy: 1
  };

  // Process each type's damage relations
  typeDataArray.forEach(typeData => {
    // Double damage from (weaknesses)
    typeData.damage_relations.double_damage_from.forEach(relation => {
      typeEffectiveness[relation.name] *= 2;
    });

    // Half damage from (resistances)
    typeData.damage_relations.half_damage_from.forEach(relation => {
      typeEffectiveness[relation.name] *= 0.5;
    });

    // No damage from (immunities)
    typeData.damage_relations.no_damage_from.forEach(relation => {
      typeEffectiveness[relation.name] = 0;
    });
  });

  // Organize results into weaknesses, resistances, and immunities
  const weaknesses: { type: string; multiplier: number }[] = [];
  const resistances: { type: string; multiplier: number }[] = [];
  const immunities: string[] = [];

  Object.entries(typeEffectiveness).forEach(([type, value]) => {
    if (value > 1) {
      weaknesses.push({ type, multiplier: value });
    } else if (value > 0 && value < 1) {
      resistances.push({ type, multiplier: value });
    } else if (value === 0) {
      immunities.push(type);
    }
  });

  return { weaknesses, resistances, immunities };
};

// Get a clean description from species data
export const getCleanDescription = (
  flavorTextEntries: {
    flavor_text: string;
    language: { name: string };
    version: { name: string };
  }[]
): string => {
  // Filter for English entries from newer games first
  const englishEntries = flavorTextEntries.filter(
    entry => entry.language.name === 'en'
  );

  // Prefer newer games (could be adjusted based on preference)
  const preferredVersions = [
    'sword', 'shield', 'scarlet', 'violet',
    'brilliant-diamond', 'shining-pearl',
    'legends-arceus', 'sun', 'moon',
    'ultra-sun', 'ultra-moon', 'x', 'y'
  ];

  // Try to find an entry from a preferred version
  for (const version of preferredVersions) {
    const entry = englishEntries.find(e => e.version.name === version);
    if (entry) {
      return cleanFlavorText(entry.flavor_text);
    }
  }

  // If no preferred version found, just use any English entry
  if (englishEntries.length > 0) {
    return cleanFlavorText(englishEntries[0].flavor_text);
  }

  return "No description available.";
};

// Clean up the flavor text (replace newlines, fix spacing)
const cleanFlavorText = (text: string): string => {
  return text
    .replace(/\\f/g, ' ')
    .replace(/\\n/g, ' ')
    .replace(/\u000c/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\f/g, ' ')
    .replace(/\u00ad/g, '') // Soft hyphen
    .replace(/\s+/g, ' ')
    .trim();
};
