
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import PokemonCard from '@/components/PokemonCard';
import TypeEffectiveness from '@/components/TypeEffectiveness';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  fetchPokemon, 
  fetchPokemonSpecies, 
  fetchTypeData,
  Pokemon,
  TypeData
} from '@/utils/pokemonAPI';
import { 
  calculateTypeEffectiveness,
  getCleanDescription
} from '@/utils/typeUtils';

const PokemonDetail = () => {
  const { name } = useParams<{ name: string }>();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  // Check user's preferred color scheme on initial load
  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      ((!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches))
    ) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle between light and dark modes
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
      }
      
      return newMode;
    });
  };

  // Fetch Pokemon data
  const { 
    data: pokemon,
    isLoading: isPokemonLoading,
    error: pokemonError
  } = useQuery({
    queryKey: ['pokemon', name],
    queryFn: () => fetchPokemon(name || ''),
    enabled: !!name,
    retry: 1,
  });

  // Fetch Pokemon species data (for description)
  const { 
    data: species,
    isLoading: isSpeciesLoading 
  } = useQuery({
    queryKey: ['species', pokemon?.species.url],
    queryFn: () => fetchPokemonSpecies(pokemon?.species.url || ''),
    enabled: !!pokemon?.species.url,
  });

  // Fetch type data for all of Pokemon's types
  const { 
    data: typeDataArray,
    isLoading: isTypeDataLoading 
  } = useQuery({
    queryKey: ['typeData', pokemon?.types.map(t => t.type.url).join(',')],
    queryFn: async () => {
      if (!pokemon) return [];
      const typePromises = pokemon.types.map(t => fetchTypeData(t.type.url));
      return await Promise.all(typePromises);
    },
    enabled: !!pokemon,
  });

  // Calculate effectiveness once we have all the type data
  const typeEffectiveness = typeDataArray ? calculateTypeEffectiveness(typeDataArray) : null;

  // Clean up description text from species data
  const description = species ? 
    getCleanDescription(species.flavor_text_entries) : 
    "Loading description...";

  // Handle error state
  useEffect(() => {
    if (pokemonError) {
      const errorMessage = pokemonError instanceof Error ? 
        pokemonError.message : 
        'Failed to load Pokémon data';
        
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [pokemonError]);

  // Loading state
  if (isPokemonLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center px-4 sm:px-6">
        <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <div className="flex-1 flex flex-col items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
        <div className="fixed bottom-1 right-2 text-[10px] text-gray-400">SL ♥ LN</div>
      </div>
    );
  }

  // Error state
  if (pokemonError || !pokemon) {
    return (
      <div className="min-h-screen flex flex-col items-center px-4 sm:px-6">
        <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className="glass rounded-2xl p-8 w-full">
            <h2 className="text-2xl font-bold mb-4">Pokémon Not Found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find that Pokémon. Please check the spelling and try again.
            </p>
            <Link 
              to="/" 
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Search
            </Link>
          </div>
        </div>
        <div className="fixed bottom-1 right-2 text-[10px] text-gray-400">SL ♥ LN</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-4 sm:px-6">
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      
      <div className="w-full max-w-6xl mx-auto mb-4">
        <Link 
          to="/" 
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Search</span>
        </Link>
      </div>
      
      <main className="flex-1 w-full max-w-6xl mx-auto py-6 mb-20">
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <PokemonCard pokemon={pokemon} />
            </div>
            
            <div className="space-y-6">
              <div className="glass rounded-2xl p-6 animate-fade-in">
                <h3 className="text-lg font-semibold mb-3">About</h3>
                <p className="text-balance">
                  {isSpeciesLoading ? "Loading description..." : description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Height</p>
                    <p className="font-medium">{(pokemon.height / 10).toFixed(1)}m</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="font-medium">{(pokemon.weight / 10).toFixed(1)}kg</p>
                  </div>
                </div>
              </div>
              
              {isTypeDataLoading ? (
                <div className="h-full flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              ) : typeEffectiveness ? (
                <TypeEffectiveness 
                  weaknesses={typeEffectiveness.weaknesses}
                  resistances={typeEffectiveness.resistances}
                  immunities={typeEffectiveness.immunities}
                />
              ) : (
                <div className="glass rounded-2xl p-6">
                  <p className="text-muted-foreground">
                    Unable to load type effectiveness data.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="w-full max-w-6xl mx-auto py-6 text-center text-sm text-muted-foreground mt-auto fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm">
        <p>Made with PokeAPI • Designed for Pokémon trainers</p>
      </footer>
      
      <div className="fixed bottom-1 right-2 text-[10px] text-gray-400">SL ♥ LN</div>
    </div>
  );
};

export default PokemonDetail;
