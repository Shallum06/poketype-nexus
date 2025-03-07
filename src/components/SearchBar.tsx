import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { fetchPokemonList, filterPokemonByName, PokemonListItem } from '@/utils/pokemonAPI';
import { Search } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';

const SearchBar: React.FC = () => {
  const [pokemonName, setPokemonName] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<PokemonListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();

  // Fetch Pokemon list on component mount
  useEffect(() => {
    const loadPokemonList = async () => {
      try {
        const list = await fetchPokemonList();
        setPokemonList(list);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load Pokemon list:', error);
        setIsLoading(false);
      }
    };

    loadPokemonList();
  }, []);

  // Update dropdown position when it's shown
  useEffect(() => {
    if (showDropdown && formRef.current) {
      const rect = formRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [showDropdown]);

  // Filter Pokemon list when input changes
  useEffect(() => {
    if (pokemonName.trim() && pokemonList.length > 0) {
      const filtered = filterPokemonByName(pokemonList, pokemonName);
      setFilteredPokemon(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setFilteredPokemon([]);
      setShowDropdown(false);
    }
  }, [pokemonName, pokemonList]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        formRef.current && 
        !formRef.current.contains(target) &&
        !document.getElementById('pokemon-dropdown-portal')?.contains(target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pokemonName.trim()) {
      toast({
        title: "Please enter a Pokémon name",
        variant: "destructive"
      });
      return;
    }

    // Convert to lowercase and trim for consistent API calls
    const formattedName = pokemonName.toLowerCase().trim();
    navigate(`/pokemon/${formattedName}`);
  };

  const clearInput = () => {
    setPokemonName('');
    setShowDropdown(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handlePokemonSelect = (name: string) => {
    setPokemonName(name);
    setShowDropdown(false);
    
    // Navigate to the Pokemon's detail page
    const formattedName = name.toLowerCase().trim();
    navigate(`/pokemon/${formattedName}`);
  };

  // Render dropdown with portal
  const renderDropdown = () => {
    if (!showDropdown) return null;
    
    return ReactDOM.createPortal(
      <div 
        id="pokemon-dropdown-portal"
        style={{
          position: 'absolute',
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          width: `${dropdownPosition.width}px`,
          zIndex: 9999,
        }}
        className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-input overflow-hidden"
      >
        {isLoading ? (
          <div className="p-3 text-center text-muted-foreground">Loading...</div>
        ) : (
          <ul className="max-h-60 overflow-auto">
            {filteredPokemon.map((pokemon) => (
              <li 
                key={pokemon.name}
                className="px-4 py-2 hover:bg-muted cursor-pointer transition-colors duration-150 capitalize"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handlePokemonSelect(pokemon.name);
                }}
              >
                {pokemon.name.replace(/-/g, ' ')}
              </li>
            ))}
          </ul>
        )}
      </div>,
      document.body
    );
  };

  return (
    <form 
      ref={formRef}
      onSubmit={handleSubmit} 
      className={`relative w-full max-w-md mx-auto transition-all duration-300 ${isInputFocused ? 'scale-105' : 'scale-100'}`}
    >
      <div className="relative">
        <input 
          ref={inputRef} 
          type="text" 
          value={pokemonName} 
          onChange={e => setPokemonName(e.target.value)} 
          onFocus={() => {
            setIsInputFocused(true);
            if (pokemonName.trim() && filteredPokemon.length > 0) {
              setShowDropdown(true);
            }
          }} 
          onBlur={() => setIsInputFocused(false)} 
          placeholder="Search for a Pokémon..." 
          className="w-full h-14 px-12 rounded-full border border-input bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-foreground shadow-sm transition-all duration-300 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground/80" 
          autoComplete="off" 
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      </div>
      
      <Button 
        type="submit" 
        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-12 px-5 rounded-full font-medium"
      >
        Search
      </Button>

      {renderDropdown()}
    </form>
  );
};

export default SearchBar;