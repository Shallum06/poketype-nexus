
import { toast } from '@/components/ui/use-toast';

export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  species: {
    url: string;
  };
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  height: number;
  weight: number;
}

export interface PokemonSpecies {
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
    };
    version: {
      name: string;
    };
  }[];
  genera: {
    genus: string;
    language: {
      name: string;
    };
  }[];
}

export interface TypeData {
  name: string;
  damage_relations: {
    double_damage_from: { name: string }[];
    half_damage_from: { name: string }[];
    no_damage_from: { name: string }[];
    double_damage_to: { name: string }[];
    half_damage_to: { name: string }[];
    no_damage_to: { name: string }[];
  };
}

const API_BASE_URL = 'https://pokeapi.co/api/v2';

// Fetch a Pokemon by name
export const fetchPokemon = async (name: string): Promise<Pokemon> => {
  try {
    const response = await fetch(`${API_BASE_URL}/pokemon/${name.toLowerCase()}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Pokémon "${name}" not found. Please check the spelling.`);
      }
      throw new Error('Failed to fetch Pokémon data');
    }
    
    return await response.json();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    toast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive',
    });
    throw error;
  }
};

// Fetch Pokemon species data for description
export const fetchPokemonSpecies = async (url: string): Promise<PokemonSpecies> => {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch Pokémon species data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Pokémon species:', error);
    throw error;
  }
};

// Fetch type data for a specific type
export const fetchTypeData = async (url: string): Promise<TypeData> => {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch type data`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching type data:', error);
    throw error;
  }
};
